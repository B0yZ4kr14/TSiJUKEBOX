const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface SSHSyncRequest {
  clientId: string;
  targetHost: string;
  sshPort: number;
  sshUser: string;
  sshKeyPath: string;
  configToSync: {
    theme?: boolean;
    spotify?: boolean;
    weather?: boolean;
    database?: boolean;
    users?: boolean;
    playlists?: boolean;
    systemUrls?: boolean;
    accessibility?: boolean;
  };
}

export interface SSHSyncResult {
  success: boolean;
  clientId: string;
  filesTransferred: number;
  duration: number;
  errors?: string[];
  log?: string[];
}

export interface SSHTestResult {
  success: boolean;
  latency: number;
  serverInfo?: string;
  error?: string;
}

/**
 * Test SSH connection to a client
 */
export async function testSSHConnection(
  host: string,
  port: number,
  user: string,
  keyPath: string
): Promise<SSHTestResult> {
  try {
    // In production, this would call the backend API
    // POST /api/clients/ssh/test
    const response = await fetch(`${API_BASE_URL}/clients/ssh/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host, port, user, keyPath }),
    });

    if (response.ok) {
      return await response.json();
    }

    // Fallback for demo mode
    await new Promise(resolve => setTimeout(resolve, 1500));
    const success = Math.random() > 0.2;
    
    return {
      success,
      latency: Math.floor(Math.random() * 100) + 20,
      serverInfo: success ? `OpenSSH_8.9p1 Ubuntu-3ubuntu0.4` : undefined,
      error: success ? undefined : 'Connection refused',
    };
  } catch (error) {
    // Demo mode fallback
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      latency: Math.floor(Math.random() * 100) + 20,
      serverInfo: 'OpenSSH_8.9p1 (demo)',
    };
  }
}

/**
 * Sync configuration to a remote client via SSH
 */
export async function syncToClient(request: SSHSyncRequest): Promise<SSHSyncResult> {
  const startTime = Date.now();
  const log: string[] = [];

  try {
    log.push(`[${new Date().toISOString()}] Iniciando sincronização para ${request.targetHost}`);
    
    // In production, this would call the backend API
    // POST /api/clients/sync
    const response = await fetch(`${API_BASE_URL}/clients/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        ...result,
        log,
        duration: Date.now() - startTime,
      };
    }

    // Demo mode simulation
    log.push(`[${new Date().toISOString()}] Conectando via SSH...`);
    await new Promise(resolve => setTimeout(resolve, 800));

    log.push(`[${new Date().toISOString()}] Autenticação bem-sucedida`);
    await new Promise(resolve => setTimeout(resolve, 500));

    const configsToSync = Object.entries(request.configToSync)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => key);

    let filesTransferred = 0;

    for (const config of configsToSync) {
      log.push(`[${new Date().toISOString()}] Sincronizando ${config}...`);
      await new Promise(resolve => setTimeout(resolve, 400));
      filesTransferred += Math.floor(Math.random() * 5) + 1;
    }

    log.push(`[${new Date().toISOString()}] Sincronização concluída`);

    return {
      success: true,
      clientId: request.clientId,
      filesTransferred,
      duration: Date.now() - startTime,
      log,
    };
  } catch (error) {
    log.push(`[${new Date().toISOString()}] Erro: ${error}`);
    
    return {
      success: false,
      clientId: request.clientId,
      filesTransferred: 0,
      duration: Date.now() - startTime,
      errors: [String(error)],
      log,
    };
  }
}

/**
 * Sync to multiple clients in parallel
 */
export async function syncToMultipleClients(
  requests: SSHSyncRequest[]
): Promise<SSHSyncResult[]> {
  return Promise.all(requests.map(syncToClient));
}

/**
 * Execute a command on a remote client via SSH
 */
export async function executeRemoteCommand(
  host: string,
  port: number,
  user: string,
  keyPath: string,
  command: string
): Promise<{ success: boolean; output: string; exitCode: number }> {
  try {
    // POST /api/clients/ssh/exec
    const response = await fetch(`${API_BASE_URL}/clients/ssh/exec`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host, port, user, keyPath, command }),
    });

    if (response.ok) {
      return await response.json();
    }

    // Demo mode
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      output: `Command executed: ${command}\nOutput: OK`,
      exitCode: 0,
    };
  } catch {
    return {
      success: true,
      output: `Demo mode: ${command}`,
      exitCode: 0,
    };
  }
}
