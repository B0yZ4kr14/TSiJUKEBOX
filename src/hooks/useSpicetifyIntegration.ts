import { useState, useEffect, useCallback } from 'react';
import { spicetifyClient, SpicetifyStatus, SpicetifyTheme, SpicetifyExtension } from '@/lib/api/spicetify';
import { useToast } from '@/hooks/use-toast';

export function useSpicetifyIntegration() {
  const { toast } = useToast();
  const [status, setStatus] = useState<SpicetifyStatus | null>(null);
  const [themes, setThemes] = useState<SpicetifyTheme[]>([]);
  const [extensions, setExtensions] = useState<SpicetifyExtension[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await spicetifyClient.getStatus();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError('Spicetify não detectado');
      setStatus(null);
    }
  }, []);

  const fetchThemes = useCallback(async () => {
    try {
      const data = await spicetifyClient.listThemes();
      setThemes(data);
    } catch {
      setThemes([]);
    }
  }, []);

  const fetchExtensions = useCallback(async () => {
    try {
      const data = await spicetifyClient.listExtensions();
      setExtensions(data);
    } catch {
      setExtensions([]);
    }
  }, []);

  const applyTheme = useCallback(async (themeName: string) => {
    setIsLoading(true);
    try {
      await spicetifyClient.applyTheme(themeName);
      toast({ title: 'Tema aplicado', description: `Tema "${themeName}" aplicado com sucesso` });
      await fetchStatus();
      await fetchThemes();
    } catch {
      toast({ title: 'Erro', description: 'Falha ao aplicar tema', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast, fetchStatus, fetchThemes]);

  const toggleExtension = useCallback(async (name: string, enabled: boolean) => {
    setIsLoading(true);
    try {
      await spicetifyClient.toggleExtension(name, enabled);
      toast({ 
        title: enabled ? 'Extensão ativada' : 'Extensão desativada',
        description: `"${name}" foi ${enabled ? 'ativada' : 'desativada'}`
      });
      await fetchExtensions();
    } catch {
      toast({ title: 'Erro', description: 'Falha ao alterar extensão', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast, fetchExtensions]);

  const backup = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await spicetifyClient.backup();
      toast({ title: 'Backup criado', description: `Salvo em: ${result.path}` });
    } catch {
      toast({ title: 'Erro', description: 'Falha ao criar backup', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const restore = useCallback(async () => {
    setIsLoading(true);
    try {
      await spicetifyClient.restore();
      toast({ title: 'Restaurado', description: 'Configuração restaurada com sucesso' });
      await fetchStatus();
    } catch {
      toast({ title: 'Erro', description: 'Falha ao restaurar', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast, fetchStatus]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await spicetifyClient.refresh();
      toast({ title: 'Atualizado', description: 'Spicetify atualizado com sucesso' });
      await fetchStatus();
    } catch {
      toast({ title: 'Erro', description: 'Falha ao atualizar', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast, fetchStatus]);

  useEffect(() => {
    fetchStatus();
    fetchThemes();
    fetchExtensions();
  }, [fetchStatus, fetchThemes, fetchExtensions]);

  return {
    status,
    themes,
    extensions,
    isLoading,
    error,
    isInstalled: status?.installed ?? false,
    currentTheme: status?.currentTheme ?? '',
    applyTheme,
    toggleExtension,
    backup,
    restore,
    refresh,
    refetch: fetchStatus,
  };
}
