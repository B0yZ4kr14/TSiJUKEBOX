import { API_BASE_URL, ApiError } from './client';

export interface SpicetifyStatus {
  installed: boolean;
  version: string;
  currentTheme: string;
  configPath: string;
}

export interface SpicetifyTheme {
  name: string;
  author: string;
  preview: string | null;
  isActive: boolean;
}

export interface SpicetifyExtension {
  name: string;
  enabled: boolean;
  description: string;
}

class SpicetifyClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = 5000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}`, 'server', response.status);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 'timeout');
      }
      throw new ApiError('Network error', 'network');
    }
  }

  async getStatus(): Promise<SpicetifyStatus> {
    return this.request<SpicetifyStatus>('/spicetify/status');
  }

  async listThemes(): Promise<SpicetifyTheme[]> {
    return this.request<SpicetifyTheme[]>('/spicetify/themes');
  }

  async applyTheme(name: string): Promise<{ success: boolean }> {
    return this.request('/spicetify/themes/apply', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async listExtensions(): Promise<SpicetifyExtension[]> {
    return this.request<SpicetifyExtension[]>('/spicetify/extensions');
  }

  async toggleExtension(name: string, enabled: boolean): Promise<{ success: boolean }> {
    return this.request('/spicetify/extensions/toggle', {
      method: 'POST',
      body: JSON.stringify({ name, enabled }),
    });
  }

  async backup(): Promise<{ success: boolean; path: string }> {
    return this.request('/spicetify/backup', { method: 'POST' });
  }

  async restore(): Promise<{ success: boolean }> {
    return this.request('/spicetify/restore', { method: 'POST' });
  }

  async refresh(): Promise<{ success: boolean }> {
    return this.request('/spicetify/refresh', { method: 'POST' });
  }
}

export const spicetifyClient = new SpicetifyClient();
