import { useState, useCallback } from 'react';
import { youtubeMusicClient, YouTubeMusicTrack, YouTubeMusicAlbum, YouTubeMusicPlaylist } from '@/lib/api/youtubeMusic';

interface SearchResults {
  tracks: YouTubeMusicTrack[];
  albums: YouTubeMusicAlbum[];
  playlists: YouTubeMusicPlaylist[];
}

export function useYouTubeMusicSearch() {
  const [results, setResults] = useState<SearchResults>({ tracks: [], albums: [], playlists: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');

  const search = useCallback(async (searchQuery: string, type?: 'song' | 'video' | 'album' | 'playlist') => {
    if (!searchQuery.trim()) {
      setResults({ tracks: [], albums: [], playlists: [] });
      return;
    }

    setIsSearching(true);
    setQuery(searchQuery);
    
    try {
      const data = await youtubeMusicClient.search(searchQuery, type);
      setResults(data);
    } catch {
      setResults({ tracks: [], albums: [], playlists: [] });
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults({ tracks: [], albums: [], playlists: [] });
    setQuery('');
  }, []);

  return {
    results,
    isSearching,
    query,
    search,
    clearResults,
  };
}
