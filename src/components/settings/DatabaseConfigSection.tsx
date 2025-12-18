import { useState, useEffect } from 'react';
import { SettingsSection } from './SettingsSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Database, Server, Cloud, HardDrive, Save, CheckCircle2, Sparkles } from 'lucide-react';

type DatabaseType = 'sqlite-local' | 'sqlite-remote' | 'supabase' | 'lovable-cloud';

interface DatabaseConfig {
  type: DatabaseType;
  sqlitePath: string;
  sqliteHost: string;
  sqlitePort: string;
  sqliteUsername: string;
  sqlitePassword: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
}

const defaultConfig: DatabaseConfig = {
  type: 'sqlite-local',
  sqlitePath: '/var/lib/jukebox/jukebox.db',
  sqliteHost: '',
  sqlitePort: '22',
  sqliteUsername: '',
  sqlitePassword: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
  supabaseServiceKey: '',
};

interface DatabaseConfigSectionProps {
  isDemoMode?: boolean;
}

export function DatabaseConfigSection({ isDemoMode = false }: DatabaseConfigSectionProps) {
  const [config, setConfig] = useState<DatabaseConfig>(defaultConfig);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('database_config');
    if (saved) {
      setConfig({ ...defaultConfig, ...JSON.parse(saved) });
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      localStorage.setItem('database_config', JSON.stringify(config));
      toast.success('Configuração salva com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar configuração');
    } finally {
      setIsSaving(false);
    }
  };

  const updateConfig = (key: keyof DatabaseConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const instructions = {
    title: "📚 O que é um Banco de Dados?",
    steps: [
      "O banco de dados é onde todas as suas músicas, playlists e configurações são guardadas de forma segura.",
      "Pense nele como uma 'caixa organizadora digital' que mantém tudo em ordem para você.",
      "SQLite Local: Seus dados ficam salvos no próprio computador do Jukebox - simples e rápido!",
      "SQLite Remoto: Seus dados ficam em outro computador, acessados de forma segura via SSH.",
      "Supabase: Banco de dados profissional na nuvem com painel de administração visual.",
      "Lovable Cloud: Solução gerenciada automaticamente - não precisa configurar nada!"
    ],
    tips: [
      "💡 Para uso caseiro simples, SQLite Local é perfeito!",
      "💡 Para estabelecimentos comerciais, Lovable Cloud oferece backup automático",
      "💡 Supabase é ideal se você quer mais controle sobre seus dados"
    ],
    warning: "⚠️ Mudar o tipo de banco pode afetar suas músicas e playlists salvas. Faça backup primeiro!"
  };

  return (
    <SettingsSection
      title="Banco de Dados"
      description="Configure onde seus dados serão armazenados"
      icon={<Database className="w-5 h-5 icon-neon-blue" />}
      instructions={instructions}
    >
      <div className="space-y-6">
        <RadioGroup
          value={config.type}
          onValueChange={(value) => updateConfig('type', value)}
          className="grid grid-cols-1 gap-3"
        >
          {/* SQLite Local */}
          <div 
            className={`flex items-center space-x-3 rounded-lg p-4 cursor-pointer transition-all ripple-effect ${
              config.type === 'sqlite-local' ? 'card-option-selected-3d' : 'card-option-dark-3d'
            }`}
            onClick={() => updateConfig('type', 'sqlite-local')}
          >
            <RadioGroupItem value="sqlite-local" id="sqlite-local" />
            <Label htmlFor="sqlite-local" className="flex items-center gap-3 cursor-pointer flex-1">
              <HardDrive className="w-5 h-5 icon-neon-blue" />
              <div>
                <p className="font-medium text-kiosk-text">SQLite Local</p>
                <p className="text-sm text-kiosk-text/90">Arquivo no servidor local - Simples e rápido</p>
              </div>
            </Label>
          </div>

          {/* SQLite Remote */}
          <div 
            className={`flex items-center space-x-3 rounded-lg p-4 cursor-pointer transition-all ripple-effect ${
              config.type === 'sqlite-remote' ? 'card-option-selected-3d' : 'card-option-dark-3d'
            }`}
            onClick={() => updateConfig('type', 'sqlite-remote')}
          >
            <RadioGroupItem value="sqlite-remote" id="sqlite-remote" />
            <Label htmlFor="sqlite-remote" className="flex items-center gap-3 cursor-pointer flex-1">
              <Server className="w-5 h-5 icon-neon-blue" />
              <div>
                <p className="font-medium text-kiosk-text">SQLite Remoto</p>
                <p className="text-sm text-kiosk-text/90">Arquivo em servidor externo via SSH</p>
              </div>
            </Label>
          </div>

          {/* Supabase */}
          <div 
            className={`flex items-center space-x-3 rounded-lg p-4 cursor-pointer transition-all ripple-effect ${
              config.type === 'supabase' ? 'card-option-selected-3d' : 'card-option-dark-3d'
            }`}
            onClick={() => updateConfig('type', 'supabase')}
          >
            <RadioGroupItem value="supabase" id="supabase" />
            <Label htmlFor="supabase" className="flex items-center gap-3 cursor-pointer flex-1">
              <Sparkles className="w-5 h-5 icon-neon-blue" />
              <div>
                <p className="font-medium text-kiosk-text">Supabase</p>
                <p className="text-sm text-kiosk-text/90">Banco PostgreSQL na nuvem com painel admin</p>
              </div>
            </Label>
          </div>

          {/* Lovable Cloud */}
          <div 
            className={`flex items-center space-x-3 rounded-lg p-4 cursor-pointer transition-all ripple-effect ${
              config.type === 'lovable-cloud' ? 'card-option-selected-3d' : 'card-option-dark-3d'
            }`}
            onClick={() => updateConfig('type', 'lovable-cloud')}
          >
            <RadioGroupItem value="lovable-cloud" id="lovable-cloud" />
            <Label htmlFor="lovable-cloud" className="flex items-center gap-3 cursor-pointer flex-1">
              <Cloud className="w-5 h-5 icon-neon-blue" />
              <div>
                <p className="font-medium text-kiosk-text">Lovable Cloud</p>
                <p className="text-sm text-kiosk-text/90">100% gerenciado - Zero configuração</p>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* SQLite Local Config */}
        {config.type === 'sqlite-local' && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <Label htmlFor="sqlite-path" className="text-label-yellow">Caminho do arquivo</Label>
              <Input
                id="sqlite-path"
                value={config.sqlitePath}
                onChange={(e) => updateConfig('sqlitePath', e.target.value)}
                placeholder="/var/lib/jukebox/jukebox.db"
                disabled={isDemoMode}
                className="input-3d bg-kiosk-bg"
              />
              <p className="text-xs text-kiosk-text/90">
                Caminho completo para o arquivo SQLite no computador
              </p>
            </div>
          </div>
        )}

        {/* SQLite Remote Config */}
        {config.type === 'sqlite-remote' && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sqlite-host" className="text-label-yellow">Endereço do Servidor</Label>
                <Input
                  id="sqlite-host"
                  value={config.sqliteHost}
                  onChange={(e) => updateConfig('sqliteHost', e.target.value)}
                  placeholder="192.168.1.100"
                  disabled={isDemoMode}
                  className="input-3d bg-kiosk-bg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sqlite-port" className="text-label-yellow">Porta SSH</Label>
                <Input
                  id="sqlite-port"
                  value={config.sqlitePort}
                  onChange={(e) => updateConfig('sqlitePort', e.target.value)}
                  placeholder="22"
                  disabled={isDemoMode}
                  className="input-3d bg-kiosk-bg"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sqlite-path-remote" className="text-label-yellow">Caminho do arquivo</Label>
              <Input
                id="sqlite-path-remote"
                value={config.sqlitePath}
                onChange={(e) => updateConfig('sqlitePath', e.target.value)}
                placeholder="/var/lib/jukebox/jukebox.db"
                disabled={isDemoMode}
                className="input-3d bg-kiosk-bg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sqlite-username" className="text-label-yellow">Usuário SSH</Label>
                <Input
                  id="sqlite-username"
                  value={config.sqliteUsername}
                  onChange={(e) => updateConfig('sqliteUsername', e.target.value)}
                  placeholder="admin"
                  disabled={isDemoMode}
                  className="input-3d bg-kiosk-bg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sqlite-password" className="text-label-yellow">Senha SSH</Label>
                <Input
                  id="sqlite-password"
                  type="password"
                  value={config.sqlitePassword}
                  onChange={(e) => updateConfig('sqlitePassword', e.target.value)}
                  placeholder="••••••••"
                  disabled={isDemoMode}
                  className="input-3d bg-kiosk-bg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Supabase Config */}
        {config.type === 'supabase' && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <Label htmlFor="supabase-url" className="text-label-yellow">URL do Projeto Supabase</Label>
              <Input
                id="supabase-url"
                value={config.supabaseUrl}
                onChange={(e) => updateConfig('supabaseUrl', e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                disabled={isDemoMode}
                className="input-3d bg-kiosk-bg"
              />
              <p className="text-xs text-kiosk-text/90">
                Encontre isso em: Supabase Dashboard → Settings → API
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-anon-key" className="text-label-yellow">Chave Pública (anon key)</Label>
              <Input
                id="supabase-anon-key"
                value={config.supabaseAnonKey}
                onChange={(e) => updateConfig('supabaseAnonKey', e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                disabled={isDemoMode}
                className="input-3d bg-kiosk-bg font-mono text-xs"
              />
              <p className="text-xs text-kiosk-text/90">
                Esta chave é segura para usar no frontend
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-service-key" className="text-label-yellow">Chave de Serviço (service_role)</Label>
              <Input
                id="supabase-service-key"
                type="password"
                value={config.supabaseServiceKey}
                onChange={(e) => updateConfig('supabaseServiceKey', e.target.value)}
                placeholder="••••••••"
                disabled={isDemoMode}
                className="input-3d bg-kiosk-bg"
              />
              <p className="text-xs text-amber-500">
                ⚠️ NUNCA compartilhe esta chave - ela tem acesso total!
              </p>
            </div>
          </div>
        )}

        {/* Lovable Cloud Info */}
        {config.type === 'lovable-cloud' && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3 p-4 rounded-lg card-option-selected-3d">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <p className="font-medium text-green-400">✨ Conectado ao Lovable Cloud</p>
                <p className="text-sm text-kiosk-text/90 mt-1">
                  Banco de dados gerenciado automaticamente. Nenhuma configuração necessária!
                </p>
                <ul className="mt-2 text-xs text-kiosk-text/85 space-y-1">
                  <li>• Backup automático diário</li>
                  <li>• Escalabilidade ilimitada</li>
                  <li>• Segurança de nível empresarial</li>
                  <li>• Suporte técnico incluído</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {config.type !== 'lovable-cloud' && (
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isDemoMode}
            className="w-full button-primary-glow-3d ripple-effect"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Configuração'}
          </Button>
        )}

        {isDemoMode && (
          <p className="text-xs text-amber-500 text-center">
            Configuração de banco de dados desabilitada no modo demo
          </p>
        )}
      </div>
    </SettingsSection>
  );
}
