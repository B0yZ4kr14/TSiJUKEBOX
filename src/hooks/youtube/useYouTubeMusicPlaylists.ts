import { useState, useCallback } from 'react';
import { useYouTubeMusic } from '@/contexts/YouTubeMusicContext';
import { youtubeMusicClient, YouTubeMusicPlaylist, YouTubeMusicTrack } from '@/lib/api/youtubeMusic';

interface UseYouTubeMusicPlaylistsReturn {
  playlists: YouTubeMusicPlaylist[];
  isLoading: boolean;
  error: string | null;
  
  // CRUD operations
  fetchPlaylists: () => Promise<void>;
  createPlaylist: (title: string, description?: string) => Promise<YouTubeMusicPlaylist | null>;
  
  // Track management
  getPlaylistTracks: (playlistId: string) => Promise<YouTubeMusicTrack[]>;
  addTrackToPlaylist: (playlistId: string, videoId: string) => Promise<boolean>;
  removeTrackFromPlaylist: (playlistId: string, videoId: string) => Promise<boolean>;
}

export function useYouTubeMusicPlaylists(): UseYouTubeMusicPlaylistsReturn {
  const { youtubeMusic } = useYouTubeMusic();
  const [playlists, setPlaylists] = useState<YouTubeMusicPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = useCallback(async () => {
    if (!youtubeMusic.isConnected) {
      setError('Not connected to YouTube Music');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await youtubeMusicClient.getPlaylists();
      setPlaylists(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch playlists';
      setError(message);
      setPlaylists([]);
    } finally {
      setIsLoading(false);
    }
  }, [youtubeMusic.isConnected]);

  const createPlaylist = useCallback(async (
    title: string, 
    description?: string
  ): Promise<YouTubeMusicPlaylist | null> => {
    if (!youtubeMusic.isConnected) {
      setError('Not connected to YouTube Music');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const playlist = await youtubeMusicClient.createPlaylist(title, description);
      // Refresh playlists after creation
      await fetchPlaylists();
      return playlist;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create playlist';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [youtubeMusic.isConnected, fetchPlaylists]);

  const getPlaylistTracks = useCallback(async (playlistId: string): Promise<YouTubeMusicTrack[]> => {
    if (!youtubeMusic.isConnected) {
      return [];
    }

    try {
      return await youtubeMusicClient.getPlaylistTracks(playlistId);
    } catch {
      return [];
    }
  }, [youtubeMusic.isConnected]);

  const addTrackToPlaylist = useCallback(async (
    playlistId: string, 
    videoId: string
  ): Promise<boolean> => {
    if (!youtubeMusic.isConnected) {
      return false;
    }

    try {
      const result = await youtubeMusicClient.addToPlaylist(playlistId, videoId);
      return result.success;
    } catch {
      return false;
    }
  }, [youtubeMusic.isConnected]);

  const removeTrackFromPlaylist = useCallback(async (
    playlistId: string, 
    videoId: string
  ): Promise<boolean> => {
    if (!youtubeMusic.isConnected) {
      return false;
    }

    try {
      const result = await youtubeMusicClient.removeFromPlaylist(playlistId, videoId);
      return result.success;
    } catch {
      return false;
    }
  }, [youtubeMusic.isConnected]);

  return {
    playlists,
    isLoading,
    error,
    fetchPlaylists,
    createPlaylist,
    getPlaylistTracks,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
  };
}
