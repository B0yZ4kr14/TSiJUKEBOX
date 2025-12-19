import { useState, useEffect, useCallback } from 'react';
import { useYouTubeMusic } from '@/contexts/YouTubeMusicContext';
import { youtubeMusicClient, YouTubeMusicPlaylist, YouTubeMusicAlbum, YouTubeMusicTrack } from '@/lib/api/youtubeMusic';

interface BrowseCategory {
  id: string;
  title: string;
  thumbnailUrl: string | null;
}

interface UseYouTubeMusicBrowseReturn {
  // Browse data
  categories: BrowseCategory[];
  newReleases: YouTubeMusicAlbum[];
  topTracks: YouTubeMusicTrack[];
  featuredPlaylists: YouTubeMusicPlaylist[];
  
  // State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBrowseData: () => Promise<void>;
  fetchNewReleases: () => Promise<void>;
  fetchTopTracks: () => Promise<void>;
  refresh: () => void;
}

// Mock categories since YouTube Music API doesn't have a direct categories endpoint
const DEFAULT_CATEGORIES: BrowseCategory[] = [
  { id: 'pop', title: 'Pop', thumbnailUrl: null },
  { id: 'rock', title: 'Rock', thumbnailUrl: null },
  { id: 'hip-hop', title: 'Hip Hop', thumbnailUrl: null },
  { id: 'electronic', title: 'Eletrônica', thumbnailUrl: null },
  { id: 'jazz', title: 'Jazz', thumbnailUrl: null },
  { id: 'classical', title: 'Clássica', thumbnailUrl: null },
  { id: 'country', title: 'Country', thumbnailUrl: null },
  { id: 'latin', title: 'Latina', thumbnailUrl: null },
];

export function useYouTubeMusicBrowse(): UseYouTubeMusicBrowseReturn {
  const { youtubeMusic } = useYouTubeMusic();
  const [categories] = useState<BrowseCategory[]>(DEFAULT_CATEGORIES);
  const [newReleases, setNewReleases] = useState<YouTubeMusicAlbum[]>([]);
  const [topTracks, setTopTracks] = useState<YouTubeMusicTrack[]>([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState<YouTubeMusicPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewReleases = useCallback(async () => {
    if (!youtubeMusic.isConnected) return;

    try {
      const albums = await youtubeMusicClient.getAlbums();
      // Sort by year descending for "new releases"
      const sorted = [...albums].sort((a, b) => b.year - a.year);
      setNewReleases(sorted.slice(0, 20));
    } catch (err) {
      console.error('Failed to fetch new releases:', err);
    }
  }, [youtubeMusic.isConnected]);

  const fetchTopTracks = useCallback(async () => {
    if (!youtubeMusic.isConnected) return;

    try {
      // Use recently played as proxy for top tracks
      const tracks = await youtubeMusicClient.getRecentlyPlayed();
      setTopTracks(tracks.slice(0, 20));
    } catch (err) {
      console.error('Failed to fetch top tracks:', err);
    }
  }, [youtubeMusic.isConnected]);

  const fetchFeaturedPlaylists = useCallback(async () => {
    if (!youtubeMusic.isConnected) return;

    try {
      const playlists = await youtubeMusicClient.getPlaylists();
      setFeaturedPlaylists(playlists.slice(0, 10));
    } catch (err) {
      console.error('Failed to fetch featured playlists:', err);
    }
  }, [youtubeMusic.isConnected]);

  const fetchBrowseData = useCallback(async () => {
    if (!youtubeMusic.isConnected) {
      setError('Not connected to YouTube Music');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchNewReleases(),
        fetchTopTracks(),
        fetchFeaturedPlaylists(),
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch browse data';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [youtubeMusic.isConnected, fetchNewReleases, fetchTopTracks, fetchFeaturedPlaylists]);

  // Auto-fetch on connection
  useEffect(() => {
    if (youtubeMusic.isConnected) {
      fetchBrowseData();
    }
  }, [youtubeMusic.isConnected, fetchBrowseData]);

  return {
    categories,
    newReleases,
    topTracks,
    featuredPlaylists,
    isLoading,
    error,
    fetchBrowseData,
    fetchNewReleases,
    fetchTopTracks,
    refresh: fetchBrowseData,
  };
}
