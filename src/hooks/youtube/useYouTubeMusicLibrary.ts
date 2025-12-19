import { useState, useEffect, useCallback } from 'react';
import { youtubeMusicClient, YouTubeMusicPlaylist, YouTubeMusicTrack, YouTubeMusicAlbum } from '@/lib/api/youtubeMusic';

export function useYouTubeMusicLibrary() {
  const [playlists, setPlaylists] = useState<YouTubeMusicPlaylist[]>([]);
  const [likedSongs, setLikedSongs] = useState<YouTubeMusicTrack[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<YouTubeMusicTrack[]>([]);
  const [albums, setAlbums] = useState<YouTubeMusicAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlaylists = useCallback(async () => {
    try {
      const data = await youtubeMusicClient.getPlaylists();
      setPlaylists(data);
    } catch {
      setPlaylists([]);
    }
  }, []);

  const fetchLikedSongs = useCallback(async () => {
    try {
      const data = await youtubeMusicClient.getLikedSongs();
      setLikedSongs(data);
    } catch {
      setLikedSongs([]);
    }
  }, []);

  const fetchRecentlyPlayed = useCallback(async () => {
    try {
      const data = await youtubeMusicClient.getRecentlyPlayed();
      setRecentlyPlayed(data);
    } catch {
      setRecentlyPlayed([]);
    }
  }, []);

  const fetchAlbums = useCallback(async () => {
    try {
      const data = await youtubeMusicClient.getAlbums();
      setAlbums(data);
    } catch {
      setAlbums([]);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      fetchPlaylists(),
      fetchLikedSongs(),
      fetchRecentlyPlayed(),
      fetchAlbums(),
    ]);
    setIsLoading(false);
  }, [fetchPlaylists, fetchLikedSongs, fetchRecentlyPlayed, fetchAlbums]);

  const getPlaylistTracks = useCallback(async (playlistId: string) => {
    return youtubeMusicClient.getPlaylistTracks(playlistId);
  }, []);

  const getAlbumTracks = useCallback(async (albumId: string) => {
    return youtubeMusicClient.getAlbumTracks(albumId);
  }, []);

  const createPlaylist = useCallback(async (title: string, description?: string) => {
    const playlist = await youtubeMusicClient.createPlaylist(title, description);
    await fetchPlaylists();
    return playlist;
  }, [fetchPlaylists]);

  const addToPlaylist = useCallback(async (playlistId: string, videoId: string) => {
    await youtubeMusicClient.addToPlaylist(playlistId, videoId);
  }, []);

  const removeFromPlaylist = useCallback(async (playlistId: string, videoId: string) => {
    await youtubeMusicClient.removeFromPlaylist(playlistId, videoId);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    playlists,
    likedSongs,
    recentlyPlayed,
    albums,
    isLoading,
    fetchAll,
    getPlaylistTracks,
    getAlbumTracks,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
  };
}
