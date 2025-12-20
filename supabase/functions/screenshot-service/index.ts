import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScreenshotRequest {
  action: 'capture-single' | 'capture-multiple' | 'capture-all' | 'list-screenshots';
  routes?: string[];
  route?: string;
  baseUrl?: string;
  options?: {
    width?: number;
    height?: number;
    fullPage?: boolean;
    quality?: number;
    format?: 'png' | 'jpeg' | 'webp';
    waitForSelector?: string;
    delay?: number;
  };
}

interface ScreenshotResult {
  screenshots: Array<{
    route: string;
    filename: string;
    url: string;
    size: number;
    capturedAt: string;
  }>;
  summary: string;
}

const DEFAULT_ROUTES = [
  { route: '/setup', filename: 'setup-wizard.png', description: 'Setup Wizard' },
  { route: '/dashboard', filename: 'dashboard.png', description: 'Dashboard' },
  { route: '/spotify', filename: 'spotify-connect.png', description: 'Spotify Integration' },
  { route: '/brand', filename: 'brand-guidelines.png', description: 'Brand Guidelines' },
  { route: '/changelog', filename: 'changelog.png', description: 'Changelog' },
  { route: '/github-dashboard', filename: 'github-dashboard.png', description: 'GitHub Dashboard' },
  { route: '/settings', filename: 'settings.png', description: 'Settings' },
];

// Since Edge Functions can't run Puppeteer directly, we'll use a screenshot API service
// This implementation uses screenshotone.com or similar service
// For local development, it generates placeholder URLs

async function captureScreenshot(
  route: string,
  filename: string,
  baseUrl: string,
  options: ScreenshotRequest['options'] = {},
  supabase: any
): Promise<{ url: string; size: number }> {
  const {
    width = 1920,
    height = 1080,
    fullPage = false,
    format = 'png',
    delay = 2000,
  } = options;

  const targetUrl = `${baseUrl}${route}`;
  console.log(`Capturing screenshot: ${targetUrl}`);

  // Try using a screenshot API (screenshotone, urlbox, etc.)
  const SCREENSHOT_API_KEY = Deno.env.get('SCREENSHOT_API_KEY');
  
  let imageData: Uint8Array;
  let contentType = `image/${format}`;

  if (SCREENSHOT_API_KEY) {
    // Use screenshot API service
    const apiUrl = new URL('https://api.screenshotone.com/take');
    apiUrl.searchParams.set('access_key', SCREENSHOT_API_KEY);
    apiUrl.searchParams.set('url', targetUrl);
    apiUrl.searchParams.set('viewport_width', width.toString());
    apiUrl.searchParams.set('viewport_height', height.toString());
    apiUrl.searchParams.set('full_page', fullPage.toString());
    apiUrl.searchParams.set('format', format);
    apiUrl.searchParams.set('delay', delay.toString());
    apiUrl.searchParams.set('block_ads', 'true');
    apiUrl.searchParams.set('block_cookie_banners', 'true');

    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
      throw new Error(`Screenshot API error: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    imageData = new Uint8Array(arrayBuffer);
  } else {
    // Generate a placeholder SVG image for development
    const placeholderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#0d0d1a"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <text x="50%" y="45%" text-anchor="middle" fill="#00ff88" font-family="monospace" font-size="48">
    📸 ${filename}
  </text>
  <text x="50%" y="55%" text-anchor="middle" fill="#00d4ff" font-family="monospace" font-size="24">
    ${targetUrl}
  </text>
  <text x="50%" y="65%" text-anchor="middle" fill="#888" font-family="monospace" font-size="16">
    ${width}x${height} • Placeholder
  </text>
  <rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="none" stroke="#00ff88" stroke-width="2" stroke-dasharray="10,5"/>
</svg>`;

    imageData = new TextEncoder().encode(placeholderSvg);
    contentType = 'image/svg+xml';
  }

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('screenshots')
    .upload(filename, imageData, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error(`Failed to upload screenshot: ${uploadError.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('screenshots')
    .getPublicUrl(filename);

  return {
    url: urlData.publicUrl,
    size: imageData.length,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, routes, route, baseUrl, options } = await req.json() as ScreenshotRequest;
    console.log(`[${requestId}] Screenshot service action: ${action}`);

    // Use provided baseUrl or default to the project URL
    const targetBaseUrl = baseUrl || Deno.env.get('PUBLIC_APP_URL') || 'https://preview--tsijukebox.lovable.app';

    switch (action) {
      case 'list-screenshots': {
        const { data, error } = await supabase.storage
          .from('screenshots')
          .list();

        if (error) {
          throw new Error(`Failed to list screenshots: ${error.message}`);
        }

        const screenshots = data?.map(file => ({
          filename: file.name,
          size: file.metadata?.size || 0,
          createdAt: file.created_at,
          url: supabase.storage.from('screenshots').getPublicUrl(file.name).data.publicUrl,
        })) || [];

        return new Response(
          JSON.stringify({ success: true, screenshots }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'capture-single': {
        if (!route) {
          return new Response(
            JSON.stringify({ error: 'route is required for capture-single' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const routeInfo = DEFAULT_ROUTES.find(r => r.route === route) || {
          route,
          filename: `${route.replace(/\//g, '-').slice(1) || 'home'}.png`,
          description: route,
        };

        const result = await captureScreenshot(
          routeInfo.route,
          routeInfo.filename,
          targetBaseUrl,
          options,
          supabase
        );

        return new Response(
          JSON.stringify({
            success: true,
            screenshot: {
              route: routeInfo.route,
              filename: routeInfo.filename,
              url: result.url,
              size: result.size,
              capturedAt: new Date().toISOString(),
            },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'capture-multiple': {
        const targetRoutes = routes?.map(r => {
          const existing = DEFAULT_ROUTES.find(d => d.route === r);
          return existing || {
            route: r,
            filename: `${r.replace(/\//g, '-').slice(1) || 'home'}.png`,
            description: r,
          };
        }) || DEFAULT_ROUTES;

        const screenshots = [];

        for (const routeInfo of targetRoutes) {
          try {
            const result = await captureScreenshot(
              routeInfo.route,
              routeInfo.filename,
              targetBaseUrl,
              options,
              supabase
            );

            screenshots.push({
              route: routeInfo.route,
              filename: routeInfo.filename,
              url: result.url,
              size: result.size,
              capturedAt: new Date().toISOString(),
            });

            console.log(`[${requestId}] Captured: ${routeInfo.route}`);
          } catch (error) {
            console.error(`[${requestId}] Failed to capture ${routeInfo.route}:`, error);
            screenshots.push({
              route: routeInfo.route,
              filename: routeInfo.filename,
              url: '',
              size: 0,
              capturedAt: new Date().toISOString(),
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }

        const duration = Date.now() - startTime;

        await supabase.from('notifications').insert({
          type: 'task_complete',
          severity: 'info',
          title: 'Screenshots Capturados',
          message: `${screenshots.length} screenshots gerados em ${duration}ms`,
          metadata: { requestId, screenshots: screenshots.length, duration },
        });

        return new Response(
          JSON.stringify({
            success: true,
            screenshots,
            summary: `Captured ${screenshots.length} screenshots in ${duration}ms`,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'capture-all': {
        const screenshots = [];

        for (const routeInfo of DEFAULT_ROUTES) {
          try {
            const result = await captureScreenshot(
              routeInfo.route,
              routeInfo.filename,
              targetBaseUrl,
              options,
              supabase
            );

            screenshots.push({
              route: routeInfo.route,
              filename: routeInfo.filename,
              description: routeInfo.description,
              url: result.url,
              size: result.size,
              capturedAt: new Date().toISOString(),
            });

            console.log(`[${requestId}] Captured: ${routeInfo.route} -> ${routeInfo.filename}`);
          } catch (error) {
            console.error(`[${requestId}] Failed to capture ${routeInfo.route}:`, error);
          }
        }

        const duration = Date.now() - startTime;

        await supabase.from('notifications').insert({
          type: 'task_complete',
          severity: 'info',
          title: 'Todos os Screenshots Capturados',
          message: `${screenshots.length}/${DEFAULT_ROUTES.length} páginas capturadas em ${duration}ms`,
          metadata: { 
            requestId, 
            captured: screenshots.length, 
            total: DEFAULT_ROUTES.length,
            duration,
            urls: screenshots.map(s => s.url),
          },
        });

        return new Response(
          JSON.stringify({
            success: true,
            screenshots,
            summary: `Captured ${screenshots.length}/${DEFAULT_ROUTES.length} screenshots in ${duration}ms`,
            duration,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error(`[${requestId}] Error in screenshot-service:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage, requestId }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
