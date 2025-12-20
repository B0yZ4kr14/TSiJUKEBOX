import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface JamQueueItem {
  id: string;
  session_id: string;
  track_id: string;
  track_name: string;
  artist_name: string;
  album_art: string | null;
  duration_ms: number | null;
  added_by: string | null;
  added_by_nickname: string | null;
  position: number;
  votes: number;
  is_played: boolean;
  created_at: string;
}

export interface AddTrackParams {
  trackId: string;
  trackName: string;
  artistName: string;
  albumArt?: string;
  durationMs?: number;
}

export function useJamQueue(sessionId: string | null, participantId: string | null, nickname: string | null) {
  const [queue, setQueue] = useState<JamQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch queue
  const fetchQueue = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('jam_queue')
        .select('*')
        .eq('session_id', sessionId)
        .eq('is_played', false)
        .order('votes', { ascending: false })
        .order('position', { ascending: true });

      if (error) throw error;
      setQueue(data as JamQueueItem[]);
    } catch (err) {
      console.error('[JAM] Error fetching queue:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Add track to queue
  const addToQueue = useCallback(async (track: AddTrackParams): Promise<boolean> => {
    if (!sessionId || !participantId) {
      toast.error('Você precisa estar em uma sessão para adicionar músicas');
      return false;
    }

    try {
      // Get next position
      const maxPosition = queue.length > 0 
        ? Math.max(...queue.map(q => q.position)) + 1 
        : 0;

      const { error } = await supabase
        .from('jam_queue')
        .insert({
          session_id: sessionId,
          track_id: track.trackId,
          track_name: track.trackName,
          artist_name: track.artistName,
          album_art: track.albumArt || null,
          duration_ms: track.durationMs || null,
          added_by: participantId,
          added_by_nickname: nickname,
          position: maxPosition,
          votes: 0,
          is_played: false,
        });

      if (error) throw error;
      
      toast.success(`"${track.trackName}" adicionada à fila!`);
      return true;
    } catch (err) {
      console.error('[JAM] Error adding to queue:', err);
      toast.error('Erro ao adicionar música');
      return false;
    }
  }, [sessionId, participantId, nickname, queue]);

  // Vote for a track
  const voteTrack = useCallback(async (queueItemId: string) => {
    try {
      const item = queue.find(q => q.id === queueItemId);
      if (!item) return;

      await supabase
        .from('jam_queue')
        .update({ votes: item.votes + 1 })
        .eq('id', queueItemId);

      toast.success('Voto registrado!');
    } catch (err) {
      console.error('[JAM] Error voting:', err);
    }
  }, [queue]);

  // Remove from queue
  const removeFromQueue = useCallback(async (queueItemId: string) => {
    try {
      await supabase
        .from('jam_queue')
        .delete()
        .eq('id', queueItemId);

      toast.success('Música removida da fila');
    } catch (err) {
      console.error('[JAM] Error removing from queue:', err);
    }
  }, []);

  // Mark as played
  const markAsPlayed = useCallback(async (queueItemId: string) => {
    try {
      await supabase
        .from('jam_queue')
        .update({ is_played: true })
        .eq('id', queueItemId);
    } catch (err) {
      console.error('[JAM] Error marking as played:', err);
    }
  }, []);

  // Get next track
  const getNextTrack = useCallback((): JamQueueItem | null => {
    if (queue.length === 0) return null;
    return queue[0];
  }, [queue]);

  // Subscribe to queue changes
  useEffect(() => {
    if (!sessionId) return;

    // Initial fetch
    fetchQueue();

    // Real-time subscription
    const channel = supabase
      .channel(`jam-queue-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jam_queue',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log('[JAM] Queue change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newItem = payload.new as JamQueueItem;
            if (!newItem.is_played) {
              setQueue(prev => {
                const updated = [...prev, newItem];
                return updated.sort((a, b) => {
                  if (b.votes !== a.votes) return b.votes - a.votes;
                  return a.position - b.position;
                });
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as JamQueueItem;
            setQueue(prev => {
              if (updated.is_played) {
                return prev.filter(q => q.id !== updated.id);
              }
              const newQueue = prev.map(q => q.id === updated.id ? updated : q);
              return newQueue.sort((a, b) => {
                if (b.votes !== a.votes) return b.votes - a.votes;
                return a.position - b.position;
              });
            });
          } else if (payload.eventType === 'DELETE') {
            setQueue(prev => prev.filter(q => q.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, fetchQueue]);

  return {
    queue,
    queueLength: queue.length,
    isLoading,
    addToQueue,
    voteTrack,
    removeFromQueue,
    markAsPlayed,
    getNextTrack,
    refetch: fetchQueue,
  };
}
