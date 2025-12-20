import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useJamSession, JamSession, CreateJamConfig, CurrentTrack, PlaybackState } from '@/hooks/jam/useJamSession';
import { useJamParticipants, JamParticipant } from '@/hooks/jam/useJamParticipants';
import { useJamQueue, JamQueueItem, AddTrackParams } from '@/hooks/jam/useJamQueue';

interface JamContextValue {
  // Session
  session: JamSession | null;
  isHost: boolean;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Participant
  participantId: string | null;
  nickname: string | null;
  
  // Participants
  participants: JamParticipant[];
  participantCount: number;
  
  // Queue
  queue: JamQueueItem[];
  queueLength: number;
  
  // Actions
  createSession: (config: CreateJamConfig) => Promise<string | null>;
  joinSession: (code: string, nickname: string) => Promise<boolean>;
  leaveSession: () => Promise<void>;
  
  // Playback (host only)
  updatePlaybackState: (state: Partial<PlaybackState>) => Promise<void>;
  updateCurrentTrack: (track: CurrentTrack | null) => Promise<void>;
  
  // Queue actions
  addToQueue: (track: AddTrackParams) => Promise<boolean>;
  voteTrack: (queueItemId: string) => Promise<void>;
  removeFromQueue: (queueItemId: string) => Promise<void>;
  markAsPlayed: (queueItemId: string) => Promise<void>;
  getNextTrack: () => JamQueueItem | null;
}

const JamContext = createContext<JamContextValue | null>(null);

export function JamProvider({ children }: { children: React.ReactNode }) {
  const [nickname, setNickname] = useState<string | null>(null);
  
  const {
    session,
    participantId,
    isHost,
    isLoading: sessionLoading,
    error,
    createSession: createSessionBase,
    joinSession: joinSessionBase,
    leaveSession: leaveSessionBase,
    updatePlaybackState,
    updateCurrentTrack,
  } = useJamSession();

  const {
    participants,
    participantCount,
    isLoading: participantsLoading,
    updatePresence,
  } = useJamParticipants(session?.id || null);

  const {
    queue,
    queueLength,
    isLoading: queueLoading,
    addToQueue,
    voteTrack,
    removeFromQueue,
    markAsPlayed,
    getNextTrack,
  } = useJamQueue(session?.id || null, participantId, nickname);

  // Wrapped create session
  const createSession = useCallback(async (config: CreateJamConfig): Promise<string | null> => {
    setNickname(config.hostNickname);
    return createSessionBase(config);
  }, [createSessionBase]);

  // Wrapped join session
  const joinSession = useCallback(async (code: string, nick: string): Promise<boolean> => {
    setNickname(nick);
    return joinSessionBase(code, nick);
  }, [joinSessionBase]);

  // Wrapped leave session
  const leaveSession = useCallback(async () => {
    await leaveSessionBase();
    setNickname(null);
  }, [leaveSessionBase]);

  // Update presence periodically
  useEffect(() => {
    if (!participantId) return;

    const interval = setInterval(() => {
      updatePresence(participantId);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [participantId, updatePresence]);

  const value = useMemo<JamContextValue>(() => ({
    session,
    isHost,
    isConnected: !!session,
    isLoading: sessionLoading || participantsLoading || queueLoading,
    error,
    participantId,
    nickname,
    participants,
    participantCount,
    queue,
    queueLength,
    createSession,
    joinSession,
    leaveSession,
    updatePlaybackState,
    updateCurrentTrack,
    addToQueue,
    voteTrack,
    removeFromQueue,
    markAsPlayed,
    getNextTrack,
  }), [
    session,
    isHost,
    sessionLoading,
    participantsLoading,
    queueLoading,
    error,
    participantId,
    nickname,
    participants,
    participantCount,
    queue,
    queueLength,
    createSession,
    joinSession,
    leaveSession,
    updatePlaybackState,
    updateCurrentTrack,
    addToQueue,
    voteTrack,
    removeFromQueue,
    markAsPlayed,
    getNextTrack,
  ]);

  return (
    <JamContext.Provider value={value}>
      {children}
    </JamContext.Provider>
  );
}

export function useJam() {
  const context = useContext(JamContext);
  if (!context) {
    throw new Error('useJam must be used within a JamProvider');
  }
  return context;
}
