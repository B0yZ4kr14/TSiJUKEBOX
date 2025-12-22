import { useState } from 'react';
import { Youtube, LogOut, Check, X, ExternalLink, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSettings } from '@/contexts/SettingsContext';
import { youtubeMusicClient } from '@/lib/api/youtubeMusic';
import { useToast } from '@/hooks';
import { YouTubeMusicSetupWizard } from './YouTubeMusicSetupWizard';

export function YouTubeMusicSection() {
  const { toast } = useToast();
  const { 
    youtubeMusic, 
    setYouTubeMusicCredentials,
    setYouTubeMusicTokens, 
    setYouTubeMusicUser, 
    clearYouTubeMusicAuth 
  } = useSettings();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [localCredentials, setLocalCredentials] = useState({
    clientId: youtubeMusic?.clientId || '',
    clientSecret: youtubeMusic?.clientSecret || '',
  });

  const hasCredentials = !!(youtubeMusic?.clientId && youtubeMusic?.clientSecret);

  const handleSaveCredentials = () => {
    if (!localCredentials.clientId || !localCredentials.clientSecret) {
      toast({
        title: 'Erro',
        description: 'Preencha Client ID e Client Secret',
        variant: 'destructive',
      });
      return;
    }
    setYouTubeMusicCredentials(localCredentials.clientId, localCredentials.clientSecret);
    toast({
      title: 'Credenciais salvas',
      description: 'Agora você pode conectar sua conta do YouTube Music',
    });
  };

  const handleConnect = async () => {
    if (!hasCredentials) {
      toast({
        title: 'Erro',
        description: 'Configure as credenciais primeiro',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    try {
      const redirectUri = `${window.location.origin}/settings`;
      const { authUrl } = await youtubeMusicClient.getAuthUrl(redirectUri);
      window.location.href = authUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Falha ao iniciar autenticação';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    clearYouTubeMusicAuth();
    youtubeMusicClient.clearTokens();
    toast({
      title: 'Desconectado',
      description: 'YouTube Music desconectado com sucesso',
    });
  };

  const handleWizardComplete = (clientId: string, clientSecret: string) => {
    setLocalCredentials({ clientId, clientSecret });
    setYouTubeMusicCredentials(clientId, clientSecret);
    toast({
      title: 'Configuração concluída!',
      description: 'Credenciais salvas. Clique em "Conectar com Google" para autorizar.',
    });
  };

  return (
    <>
      <Card className="card-dark-neon-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gold-neon font-bold">
            <Youtube className="w-5 h-5 text-red-500" />
            YouTube Music
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-label-yellow font-semibold">Status</span>
            {youtubeMusic?.isConnected ? (
              <Badge variant="default" className="bg-green-600 text-white font-bold">
                <Check className="w-3 h-3 mr-1" />
                Conectado
              </Badge>
            ) : (
              <Badge variant="secondary" className="font-bold">
                <X className="w-3 h-3 mr-1" />
                Não conectado
              </Badge>
            )}
          </div>

          {youtubeMusic?.isConnected && youtubeMusic.user && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-kiosk-surface/70 border border-cyan-500/20">
              <Avatar className="h-10 w-10">
                <AvatarImage src={youtubeMusic.user.imageUrl || undefined} />
                <AvatarFallback className="bg-red-600 text-white font-bold">{youtubeMusic.user.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-kiosk-text truncate">{youtubeMusic.user.name}</p>
                <p className="text-xs text-kiosk-text/90 truncate">{youtubeMusic.user.email}</p>
              </div>
            </div>
          )}

          {/* Wizard button - show when not connected and no credentials */}
          {!youtubeMusic?.isConnected && !hasCredentials && (
            <Button
              onClick={() => setShowWizard(true)}
              variant="outline"
              className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Configurar com Assistente Guiado
            </Button>
          )}

          {/* Credentials section - only show when not connected */}
          {!youtubeMusic?.isConnected && (
            <div className="space-y-3 pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Credenciais OAuth do Google Cloud Console:
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="ytClientId" className="text-xs">Client ID</Label>
                <Input
                  id="ytClientId"
                  placeholder="Seu Client ID do Google OAuth"
                  value={localCredentials.clientId}
                  onChange={(e) => setLocalCredentials(prev => ({ ...prev, clientId: e.target.value }))}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ytClientSecret" className="text-xs">Client Secret</Label>
                <div className="relative">
                  <Input
                    id="ytClientSecret"
                    type={showSecret ? 'text' : 'password'}
                    placeholder="Seu Client Secret"
                    value={localCredentials.clientSecret}
                    onChange={(e) => setLocalCredentials(prev => ({ ...prev, clientSecret: e.target.value }))}
                    className="font-mono text-sm pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowSecret(!showSecret)}
                  >
                    {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                </div>
              </div>

              {(localCredentials.clientId !== youtubeMusic?.clientId || 
                localCredentials.clientSecret !== youtubeMusic?.clientSecret) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveCredentials}
                  className="w-full"
                >
                  Salvar Credenciais
                </Button>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {youtubeMusic?.isConnected ? (
              <Button
                variant="outline"
                onClick={handleDisconnect}
                className="button-control-extreme-3d"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Desconectar
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting || !hasCredentials}
                className="button-control-extreme-3d bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                <Youtube className="w-4 h-4 mr-2" />
                {isConnecting ? 'Conectando...' : 'Conectar com Google'}
              </Button>
            )}
          </div>

          <div className="pt-2 border-t border-cyan-500/20">
            <p className="text-xs text-kiosk-text/90">
              Conecte sua conta do YouTube Music para acessar playlists, músicas curtidas e histórico.
              <a 
                href="https://music.youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline ml-1 inline-flex items-center gap-1 font-semibold"
              >
                Abrir YouTube Music <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      <YouTubeMusicSetupWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={handleWizardComplete}
      />
    </>
  );
}
