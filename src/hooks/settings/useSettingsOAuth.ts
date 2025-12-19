import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { spotifyClient } from '@/lib/api/spotify';
import { youtubeMusicClient } from '@/lib/api/youtubeMusic';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

interface UseSettingsOAuthReturn {
  isProcessingCallback: boolean;
  isConnecting: boolean;
  oauthError: string | null;
  handleSpotifyConnect: () => Promise<void>;
  handleSpotifyDisconnect: () => void;
  clearOAuthError: () => void;
}

export function useSettingsOAuth(): UseSettingsOAuthReturn {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [oauthError, setOAuthError] = useState<string | null>(null);

  const {
    spotify,
    setSpotifyTokens,
    setSpotifyUser,
    clearSpotifyAuth,
    setYouTubeMusicTokens,
    setYouTubeMusicUser,
  } = useSettings();

  // Handle OAuth callbacks
  useEffect(() => {
    const code = searchParams.get('spotify_code');
    const ytCode = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('spotify_error') || searchParams.get('error');

    if (error) {
      setOAuthError(error);
      toast.error(`Erro na autenticação: ${error}`);
      setSearchParams({});
      return;
    }

    // Spotify OAuth callback
    if (code && spotify.clientId && spotify.clientSecret) {
      handleSpotifyCallback(code);
    }

    // YouTube Music OAuth callback
    if (ytCode && state === 'youtube-music-oauth') {
      handleYouTubeMusicCallback(ytCode);
    }
  }, [searchParams, spotify.clientId, spotify.clientSecret]);

  const handleSpotifyCallback = useCallback(async (code: string) => {
    setIsProcessingCallback(true);
    setIsConnecting(true);
    try {
      const tokens = await spotifyClient.exchangeCode(code);
      setSpotifyTokens(tokens);
      
      const user = await spotifyClient.validateToken();
      if (user) {
        setSpotifyUser(user);
        toast.success(`Conectado como ${user.displayName}`);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Failed to exchange code:', error);
      toast.error('Falha ao conectar com Spotify');
      setOAuthError('Failed to exchange Spotify code');
    } finally {
      setIsProcessingCallback(false);
      setIsConnecting(false);
      setSearchParams({});
    }
  }, [setSpotifyTokens, setSpotifyUser, setSearchParams]);

  const handleYouTubeMusicCallback = useCallback(async (code: string) => {
    setIsProcessingCallback(true);
    setIsConnecting(true);
    try {
      const redirectUri = `${window.location.origin}/settings`;
      const tokens = await youtubeMusicClient.exchangeCode(code, redirectUri);
      setYouTubeMusicTokens(tokens);
      
      const user = await youtubeMusicClient.getCurrentUser();
      if (user) {
        setYouTubeMusicUser(user);
        toast.success(`YouTube Music conectado como ${user.name}`);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Failed to exchange YouTube Music code:', error);
      toast.error('Falha ao conectar com YouTube Music');
      setOAuthError('Failed to exchange YouTube Music code');
    } finally {
      setIsProcessingCallback(false);
      setIsConnecting(false);
      setSearchParams({});
    }
  }, [setYouTubeMusicTokens, setYouTubeMusicUser, setSearchParams]);

  const handleSpotifyConnect = useCallback(async () => {
    if (!spotify.clientId || !spotify.clientSecret) {
      toast.error('Configure as credenciais primeiro');
      return;
    }

    setIsConnecting(true);
    try {
      const { authUrl } = await spotifyClient.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Failed to get auth URL:', error);
      toast.error('Falha ao iniciar autenticação');
      setIsConnecting(false);
    }
  }, [spotify.clientId, spotify.clientSecret]);

  const handleSpotifyDisconnect = useCallback(() => {
    clearSpotifyAuth();
    toast.success('Desconectado do Spotify');
  }, [clearSpotifyAuth]);

  const clearOAuthError = useCallback(() => {
    setOAuthError(null);
  }, []);

  return {
    isProcessingCallback,
    isConnecting,
    oauthError,
    handleSpotifyConnect,
    handleSpotifyDisconnect,
    clearOAuthError,
  };
}
