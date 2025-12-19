import { useState, useCallback, useEffect } from 'react';
import { useYouTubeMusic } from '@/contexts/YouTubeMusicContext';
import { youtubeMusicClient, YouTubeMusicTrack, YouTubeMusicPlaylist } from '@/lib/api/youtubeMusic';

interface UseYouTubeMusicRecommendationsParams {
  seedTrackId?: string;
  autoFetch?: boolean;
  limit?: number;
}

interface UseYouTubeMusicRecommendationsReturn {
  // Recommendations data
  recommendations: YouTubeMusicTrack[];
  listenAgain: YouTubeMusicTrack[];
  mixedForYou: YouTubeMusicPlaylist[];
  
  // State
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  
  // Actions
  fetchRecommendations: () => Promise<void>;
  fetchBasedOnTrack: (trackId: string) => Promise<YouTubeMusicTrack[]>;
  refresh: () => void;
}

export function useYouTubeMusicRecommendations({
  seedTrackId,
  autoFetch = true,
  limit = 20,
}: UseYouTubeMusicRecommendationsParams = {}): UseYouTubeMusicRecommendationsReturn {
  const { youtubeMusic } = useYouTubeMusic();
  const [recommendations, setRecommendations] = useState<YouTubeMusicTrack[]>([]);
  const [listenAgain, setListenAgain] = useState<YouTubeMusicTrack[]>([]);
  const [mixedForYou, setMixedForYou] = useState<YouTubeMusicPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListenAgain = useCallback(async () => {
    try {
      const tracks = await youtubeMusicClient.getRecentlyPlayed();
      // Deduplicate and limit
      const unique = tracks.reduce((acc, track) => {
        if (!acc.find(t => t.videoId === track.videoId)) {
          acc.push(track);
        }
        return acc;
      }, [] as YouTubeMusicTrack[]);
      setListenAgain(unique.slice(0, limit));
    } catch {
      // Silent fail for secondary data
    }
  }, [limit]);

  const fetchMixedForYou = useCallback(async () => {
    try {
      const playlists = await youtubeMusicClient.getPlaylists();
      // Filter public playlists as "mixed for you"
      const publicPlaylists = playlists.filter(p => p.privacy === 'PUBLIC');
      setMixedForYou(publicPlaylists.slice(0, 6));
    } catch {
      // Silent fail for secondary data
    }
  }, []);

  const fetchBasedOnTrack = useCallback(async (trackId: string): Promise<YouTubeMusicTrack[]> => {
    if (!youtubeMusic.isConnected) {
      return [];
    }

    try {
      // Search for similar tracks based on the track title/artist
      // This is a workaround since YouTube Music API doesn't have direct recommendations
      const result = await youtubeMusicClient.search(trackId, 'song');
      return result.tracks.slice(0, limit);
    } catch {
      return [];
    }
  }, [youtubeMusic.isConnected, limit]);

  const fetchRecommendations = useCallback(async () => {
    if (!youtubeMusic.isConnected) {
      setError('Not connected to YouTube Music');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch liked songs as base for recommendations
      const likedSongs = await youtubeMusicClient.getLikedSongs();
      
      if (likedSongs.length > 0) {
        // Use first liked song to seed recommendations
        const seedTrack = seedTrackId || likedSongs[0]?.title;
        if (seedTrack) {
          const result = await youtubeMusicClient.search(seedTrack, 'song');
          // Filter out the seed track itself
          const filtered = result.tracks.filter(t => t.videoId !== likedSongs[0]?.videoId);
          setRecommendations(filtered.slice(0, limit));
        }
      } else {
        // Fallback to recently played
        const recent = await youtubeMusicClient.getRecentlyPlayed();
        setRecommendations(recent.slice(0, limit));
      }

      // Fetch secondary data in parallel
      await Promise.all([
        fetchListenAgain(),
        fetchMixedForYou(),
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch recommendations';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [youtubeMusic.isConnected, seedTrackId, limit, fetchListenAgain, fetchMixedForYou]);

  // Auto-fetch on connection if enabled
  useEffect(() => {
    if (autoFetch && youtubeMusic.isConnected) {
      fetchRecommendations();
    }
  }, [autoFetch, youtubeMusic.isConnected, fetchRecommendations]);

  return {
    recommendations,
    listenAgain,
    mixedForYou,
    isLoading,
    error,
    isConnected: youtubeMusic.isConnected,
    fetchRecommendations,
    fetchBasedOnTrack,
    refresh: fetchRecommendations,
  };
}
