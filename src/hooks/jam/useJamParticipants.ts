import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface JamParticipant {
  id: string;
  session_id: string;
  user_id: string | null;
  nickname: string;
  avatar_color: string;
  is_host: boolean;
  is_active: boolean;
  joined_at: string;
  last_seen_at: string;
}

export function useJamParticipants(sessionId: string | null) {
  const [participants, setParticipants] = useState<JamParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch participants
  const fetchParticipants = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('jam_participants')
        .select('*')
        .eq('session_id', sessionId)
        .eq('is_active', true)
        .order('joined_at', { ascending: true });

      if (error) throw error;
      setParticipants(data as JamParticipant[]);
    } catch (err) {
      console.error('[JAM] Error fetching participants:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Update last seen
  const updatePresence = useCallback(async (participantId: string) => {
    try {
      await supabase
        .from('jam_participants')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', participantId);
    } catch (err) {
      console.error('[JAM] Error updating presence:', err);
    }
  }, []);

  // Subscribe to participant changes
  useEffect(() => {
    if (!sessionId) return;

    // Initial fetch
    fetchParticipants();

    // Real-time subscription
    const channel = supabase
      .channel(`jam-participants-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jam_participants',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log('[JAM] Participant change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newParticipant = payload.new as JamParticipant;
            if (newParticipant.is_active) {
              setParticipants(prev => [...prev, newParticipant]);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as JamParticipant;
            setParticipants(prev => {
              if (!updated.is_active) {
                return prev.filter(p => p.id !== updated.id);
              }
              return prev.map(p => p.id === updated.id ? updated : p);
            });
          } else if (payload.eventType === 'DELETE') {
            setParticipants(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, fetchParticipants]);

  const hostParticipant = participants.find(p => p.is_host);
  const guestParticipants = participants.filter(p => !p.is_host);

  return {
    participants,
    hostParticipant,
    guestParticipants,
    participantCount: participants.length,
    isLoading,
    updatePresence,
    refetch: fetchParticipants,
  };
}
