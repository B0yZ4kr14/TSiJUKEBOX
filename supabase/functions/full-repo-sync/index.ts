import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const REPO_OWNER = 'B0yZ4kr14';
const REPO_NAME = 'TSiJUKEBOX';
const DEFAULT_BRANCH = 'main';

interface FileToSync {
  path: string;
  content: string;
}

interface CommitResult {
  sha: string;
  url: string;
  message: string;
  filesChanged: number;
}

async function createMultiFileCommit(
  token: string,
  files: FileToSync[],
  message: string,
  branch: string
): Promise<CommitResult> {
  console.log(`[full-repo-sync] Creating commit with ${files.length} files on branch ${branch}`);
  
  // Get the reference for the branch
  const refResponse = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${branch}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TSiJUKEBOX-FullSync',
      },
    }
  );
  
  if (!refResponse.ok) {
    const errText = await refResponse.text();
    console.error(`[full-repo-sync] Failed to get branch ref: ${errText}`);
    throw new Error(`Failed to get branch ref: ${errText}`);
  }
  
  const refData = await refResponse.json();
  const latestCommitSha = refData.object.sha;
  console.log(`[full-repo-sync] Latest commit SHA: ${latestCommitSha}`);
  
  // Get the tree of the latest commit
  const commitResponse = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/commits/${latestCommitSha}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TSiJUKEBOX-FullSync',
      },
    }
  );
  
  if (!commitResponse.ok) throw new Error(`Failed to get commit: ${await commitResponse.text()}`);
  const commitData = await commitResponse.json();
  const baseTreeSha = commitData.tree.sha;
  
  // Create blobs for each file
  console.log(`[full-repo-sync] Creating ${files.length} blobs...`);
  const treeItems = await Promise.all(
    files.map(async (file) => {
      const blobResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/blobs`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'TSiJUKEBOX-FullSync',
          },
          body: JSON.stringify({
            content: file.content,
            encoding: 'utf-8',
          }),
        }
      );
      
      if (!blobResponse.ok) {
        const errText = await blobResponse.text();
        console.error(`[full-repo-sync] Failed to create blob for ${file.path}: ${errText}`);
        throw new Error(`Failed to create blob for ${file.path}`);
      }
      
      const blobData = await blobResponse.json();
      console.log(`[full-repo-sync] Created blob for ${file.path}: ${blobData.sha.slice(0, 7)}`);
      
      return {
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blobData.sha,
      };
    })
  );
  
  // Create a new tree
  console.log(`[full-repo-sync] Creating tree with ${treeItems.length} items...`);
  const treeResponse = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'TSiJUKEBOX-FullSync',
      },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeItems,
      }),
    }
  );
  
  if (!treeResponse.ok) throw new Error(`Failed to create tree: ${await treeResponse.text()}`);
  const treeData = await treeResponse.json();
  console.log(`[full-repo-sync] Created tree: ${treeData.sha.slice(0, 7)}`);
  
  // Create the commit
  const newCommitResponse = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'TSiJUKEBOX-FullSync',
      },
      body: JSON.stringify({
        message,
        tree: treeData.sha,
        parents: [latestCommitSha],
        author: {
          name: 'TSiJUKEBOX Bot',
          email: 'bot@tsijukebox.local',
          date: new Date().toISOString(),
        },
      }),
    }
  );
  
  if (!newCommitResponse.ok) throw new Error(`Failed to create commit: ${await newCommitResponse.text()}`);
  const newCommitData = await newCommitResponse.json();
  console.log(`[full-repo-sync] Created commit: ${newCommitData.sha.slice(0, 7)}`);
  
  // Update the reference
  const updateRefResponse = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${branch}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'TSiJUKEBOX-FullSync',
      },
      body: JSON.stringify({
        sha: newCommitData.sha,
        force: false,
      }),
    }
  );
  
  if (!updateRefResponse.ok) throw new Error(`Failed to update ref: ${await updateRefResponse.text()}`);
  console.log(`[full-repo-sync] Updated ref to ${newCommitData.sha.slice(0, 7)}`);
  
  return {
    sha: newCommitData.sha,
    url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/commit/${newCommitData.sha}`,
    message,
    filesChanged: files.length,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use GITHUB_ACCESS_TOKEN_FULL for push permissions
    const GITHUB_TOKEN = Deno.env.get('GITHUB_ACCESS_TOKEN_FULL');
    
    if (!GITHUB_TOKEN) {
      console.error('[full-repo-sync] GITHUB_ACCESS_TOKEN_FULL not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'GitHub access token (FULL) not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { files, commitMessage, branch = DEFAULT_BRANCH } = body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No files provided for sync' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[full-repo-sync] Starting sync of ${files.length} files to ${branch}`);

    const message = commitMessage || `[TSiJUKEBOX v4.1.0] Full repository sync - ${new Date().toISOString()}`;
    
    const result = await createMultiFileCommit(GITHUB_TOKEN, files, message, branch);
    
    // Create notification in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    await supabase.from('notifications').insert({
      type: 'task_complete',
      severity: 'success',
      title: '🚀 Full Repository Sync Complete',
      message: `Successfully pushed ${result.filesChanged} files to ${branch}`,
      metadata: { 
        sha: result.sha, 
        url: result.url, 
        branch,
        filesChanged: result.filesChanged,
        commitMessage: message
      },
    });

    console.log(`[full-repo-sync] SUCCESS: ${result.filesChanged} files synced`);
    
    return new Response(
      JSON.stringify({
        success: true,
        commit: result,
        message: `Successfully synced ${result.filesChanged} files`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[full-repo-sync] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
