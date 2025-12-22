/**
 * Fixtures de dados para testes de integração
 * Simula dados reais do banco de dados Supabase
 */

// ============================================
// PLAYBACK STATS FIXTURES
// ============================================

export const mockPlaybackTrack = {
  track_id: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
  track_name: 'Hotel California',
  artist_name: 'Eagles',
  album_name: 'Hotel California',
  album_art: 'https://i.scdn.co/image/ab67616d0000b273',
  provider: 'spotify' as const,
  duration_ms: 391376,
  completed: true,
};

export const mockPlaybackStats = {
  id: 'stat-uuid-1',
  ...mockPlaybackTrack,
  played_at: new Date().toISOString(),
  user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
  created_at: new Date().toISOString(),
};

export const mockAggregatedStats = {
  totalPlays: 1250,
  uniqueTracks: 342,
  uniqueArtists: 156,
  totalMinutes: 4800,
  topTracks: [
    {
      track_id: 'spotify:track:1',
      track_name: 'Bohemian Rhapsody',
      artist_name: 'Queen',
      album_art: 'https://i.scdn.co/image/1',
      plays: 45,
    },
    {
      track_id: 'spotify:track:2',
      track_name: 'Stairway to Heaven',
      artist_name: 'Led Zeppelin',
      album_art: 'https://i.scdn.co/image/2',
      plays: 38,
    },
    {
      track_id: 'spotify:track:3',
      track_name: 'Comfortably Numb',
      artist_name: 'Pink Floyd',
      album_art: 'https://i.scdn.co/image/3',
      plays: 32,
    },
  ],
  topArtists: [
    { artist_name: 'Queen', plays: 89 },
    { artist_name: 'Led Zeppelin', plays: 76 },
    { artist_name: 'Pink Floyd', plays: 65 },
    { artist_name: 'The Beatles', plays: 58 },
    { artist_name: 'Eagles', plays: 52 },
  ],
  hourlyActivity: [
    { hour: 0, count: 12 },
    { hour: 6, count: 5 },
    { hour: 12, count: 45 },
    { hour: 18, count: 78 },
    { hour: 21, count: 95 },
    { hour: 23, count: 42 },
  ],
  recentPlays: [
    {
      id: 'play-1',
      track_id: 'spotify:track:1',
      track_name: 'Bohemian Rhapsody',
      artist_name: 'Queen',
      album_art: 'https://i.scdn.co/image/1',
      provider: 'spotify',
      duration_ms: 354000,
      played_at: new Date().toISOString(),
      completed: true,
    },
  ],
  providerStats: [
    { provider: 'spotify', plays: 850 },
    { provider: 'youtube', plays: 320 },
    { provider: 'local', plays: 80 },
  ],
};

export const mockStatsPeriods = {
  today: { ...mockAggregatedStats, totalPlays: 45 },
  week: { ...mockAggregatedStats, totalPlays: 312 },
  month: { ...mockAggregatedStats, totalPlays: 1250 },
  all: { ...mockAggregatedStats, totalPlays: 8500 },
};

// ============================================
// JAM SESSION FIXTURES
// ============================================

export const mockJamSession = {
  id: 'jam-uuid-123',
  code: 'ABC123',
  name: 'Friday Night Jam',
  host_id: 'host-uuid-1',
  host_nickname: 'DJ Master',
  privacy: 'public' as const,
  access_code: null,
  is_active: true,
  max_participants: 50,
  playlist_id: null,
  playlist_name: null,
  current_track: {
    track_id: 'spotify:track:1',
    name: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    album_art: 'https://i.scdn.co/image/1',
    duration_ms: 354000,
  },
  playback_state: {
    is_playing: true,
    position_ms: 120000,
    updated_at: new Date().toISOString(),
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockPrivateJamSession = {
  ...mockJamSession,
  id: 'jam-uuid-456',
  code: 'XYZ789',
  name: 'Private Party',
  privacy: 'private' as const,
  access_code: 'secret123',
};

export const mockJamParticipant = {
  id: 'participant-uuid-1',
  session_id: 'jam-uuid-123',
  user_id: null,
  nickname: 'MusicLover42',
  avatar_color: '#00d4ff',
  is_host: false,
  is_active: true,
  joined_at: new Date().toISOString(),
  last_seen_at: new Date().toISOString(),
};

export const mockJamHost = {
  ...mockJamParticipant,
  id: 'host-uuid-1',
  nickname: 'DJ Master',
  is_host: true,
};

export const mockJamParticipantsList = [
  mockJamHost,
  { ...mockJamParticipant, id: 'p-2', nickname: 'RockFan99', avatar_color: '#ff6b6b' },
  { ...mockJamParticipant, id: 'p-3', nickname: 'JazzCat', avatar_color: '#4ecdc4' },
  { ...mockJamParticipant, id: 'p-4', nickname: 'BeatDropper', avatar_color: '#ffe66d' },
];

export const mockJamQueueItem = {
  id: 'queue-uuid-1',
  session_id: 'jam-uuid-123',
  track_id: 'spotify:track:2',
  track_name: 'Stairway to Heaven',
  artist_name: 'Led Zeppelin',
  album_art: 'https://i.scdn.co/image/2',
  duration_ms: 482000,
  position: 1,
  votes: 5,
  is_played: false,
  added_by: 'participant-uuid-1',
  added_by_nickname: 'MusicLover42',
  created_at: new Date().toISOString(),
};

export const mockJamQueue = [
  mockJamQueueItem,
  { ...mockJamQueueItem, id: 'queue-2', track_name: 'Sweet Child O Mine', position: 2, votes: 3 },
  { ...mockJamQueueItem, id: 'queue-3', track_name: 'November Rain', position: 3, votes: 8 },
];

export const mockJamReaction = {
  id: 'reaction-uuid-1',
  session_id: 'jam-uuid-123',
  participant_id: 'participant-uuid-1',
  participant_nickname: 'MusicLover42',
  emoji: '🔥',
  track_id: 'spotify:track:1',
  created_at: new Date().toISOString(),
};

// ============================================
// CREATE SESSION CONFIG
// ============================================

export const mockCreateSessionConfig = {
  name: 'New Jam Session',
  nickname: 'HostUser',
  privacy: 'public' as const,
  maxParticipants: 50,
};

export const mockCreatePrivateSessionConfig = {
  ...mockCreateSessionConfig,
  name: 'Private Session',
  privacy: 'private' as const,
  accessCode: 'mySecret123',
};

// ============================================
// TRACK PLAYBACK DATA (for edge function tests)
// ============================================

export const mockTrackPlaybackData = {
  // Valid complete record request
  validComplete: {
    track_id: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
    track_name: 'Bohemian Rhapsody',
    artist_name: 'Queen',
    album_name: 'A Night at the Opera',
    album_art: 'https://i.scdn.co/image/ab67616d0000b273',
    provider: 'spotify' as const,
    duration_ms: 354000,
    completed: true,
  },

  // Valid minimal record request
  validMinimal: {
    track_id: 'yt:video:abc123',
    track_name: 'Test Track',
    artist_name: 'Test Artist',
    provider: 'youtube' as const,
  },

  // Invalid: missing track_id
  missingTrackId: {
    track_name: 'Song',
    artist_name: 'Artist',
    provider: 'spotify',
  },

  // Invalid: wrong provider
  invalidProvider: {
    track_id: '123',
    track_name: 'Song',
    artist_name: 'Artist',
    provider: 'invalid_provider',
  },

  // Invalid: missing required fields
  missingRequired: {},

  // Different providers
  withYoutubeProvider: {
    track_id: 'yt:video:dQw4w9WgXcQ',
    track_name: 'Never Gonna Give You Up',
    artist_name: 'Rick Astley',
    provider: 'youtube' as const,
    duration_ms: 213000,
  },

  withLocalProvider: {
    track_id: '/music/local/track.mp3',
    track_name: 'Local Track',
    artist_name: 'Local Artist',
    provider: 'local' as const,
  },

  withSoundcloudProvider: {
    track_id: 'sc:track:123456',
    track_name: 'Soundcloud Track',
    artist_name: 'Soundcloud Artist',
    provider: 'soundcloud' as const,
  },
};

// ============================================
// ERROR SCENARIOS
// ============================================

export const mockNetworkError = {
  message: 'Network request failed',
  code: 'NETWORK_ERROR',
};

export const mockSessionNotFoundError = {
  message: 'Session not found or inactive',
  code: 'PGRST116',
};

export const mockDuplicateNicknameError = {
  message: 'Nickname already in use in this session',
  code: '23505',
};

export const mockMaxParticipantsError = {
  message: 'Session has reached maximum participants',
  code: 'MAX_PARTICIPANTS',
};

// ============================================
// SPOTIFY AUTH DATA
// ============================================

export const mockSpotifyAuthData = {
  loginRequest: {
    clientId: 'spotify-client-id-123',
    clientSecret: 'spotify-client-secret-456',
    redirectUri: 'https://example.com/callback',
  },
  exchangeRequest: {
    clientId: 'spotify-client-id-123',
    clientSecret: 'spotify-client-secret-456',
    redirectUri: 'https://example.com/callback',
    code: 'auth-code-from-spotify',
  },
  refreshRequest: {
    clientId: 'spotify-client-id-123',
    clientSecret: 'spotify-client-secret-456',
    refreshToken: 'refresh-token-abc123',
  },
  tokenResponse: {
    accessToken: 'access-token-xyz789',
    refreshToken: 'refresh-token-abc123',
    expiresAt: Date.now() + 3600000,
    scope: 'user-read-playback-state playlist-read-private',
  },
  validateResponse: {
    valid: true,
    user: {
      id: 'spotify-user-123',
      displayName: 'Test User',
      email: 'test@example.com',
      imageUrl: 'https://i.scdn.co/image/avatar.jpg',
      product: 'premium',
    },
  },
};

// ============================================
// YOUTUBE MUSIC AUTH DATA
// ============================================

export const mockYouTubeAuthData = {
  getAuthUrlRequest: {
    action: 'getAuthUrl' as const,
    clientId: 'google-client-id-123',
    redirectUri: 'https://example.com/youtube-callback',
  },
  exchangeCodeRequest: {
    action: 'exchangeCode' as const,
    code: 'google-auth-code-abc',
    clientId: 'google-client-id-123',
    clientSecret: 'google-client-secret-456',
    redirectUri: 'https://example.com/youtube-callback',
  },
  refreshTokenRequest: {
    action: 'refreshToken' as const,
    refreshToken: 'google-refresh-token-xyz',
    clientId: 'google-client-id-123',
    clientSecret: 'google-client-secret-456',
  },
  tokenResponse: {
    accessToken: 'ya29.google-access-token',
    refreshToken: 'google-refresh-token-xyz',
    expiresIn: 3600,
    user: {
      id: 'google-user-123',
      name: 'YouTube User',
      email: 'user@gmail.com',
      imageUrl: 'https://lh3.googleusercontent.com/photo.jpg',
    },
  },
  refreshResponse: {
    accessToken: 'ya29.new-access-token',
    expiresIn: 3600,
  },
};

// ============================================
// ANALYZE JAM DATA
// ============================================

export const mockAnalyzeJamData = {
  suggestTracksRequest: {
    action: 'suggest-tracks' as const,
    queue: [
      { trackName: 'Bohemian Rhapsody', artistName: 'Queen' },
      { trackName: 'Stairway to Heaven', artistName: 'Led Zeppelin' },
    ],
    sessionName: 'Friday Night Jam',
  },
  suggestTracksResponse: {
    suggestions: [
      { trackName: 'Comfortably Numb', artistName: 'Pink Floyd', reason: 'Similar epic rock ballad' },
      { trackName: 'Hotel California', artistName: 'Eagles', reason: 'Classic rock anthem' },
    ],
    mood: 'epic and nostalgic',
    genre: 'classic rock',
  },
  analyzeMoodRequest: {
    action: 'analyze-mood' as const,
    queue: [
      { trackName: 'Bohemian Rhapsody', artistName: 'Queen' },
    ],
  },
  analyzeMoodResponse: {
    mood: 'dramatic and theatrical',
    energy: 'high' as const,
    genres: ['rock', 'progressive rock'],
    vibe: 'Epic rock journey with theatrical elements',
  },
  getSimilarRequest: {
    action: 'get-similar' as const,
    queue: [],
    currentTrack: { trackName: 'Bohemian Rhapsody', artistName: 'Queen' },
  },
  getSimilarResponse: {
    similar: [
      { trackName: 'A Day in the Life', artistName: 'The Beatles', similarity: 'Complex song structure' },
      { trackName: 'November Rain', artistName: "Guns N' Roses", similarity: 'Epic rock ballad' },
    ],
  },
};

// ============================================
// LYRICS SEARCH DATA
// ============================================

export const mockLyricsSearchData = {
  validRequest: {
    trackName: 'Bohemian Rhapsody',
    artistName: 'Queen',
  },
  lrclibSyncedResponse: {
    source: 'lrclib' as const,
    synced: true,
    lines: [
      { time: 0, text: 'Is this the real life?' },
      { time: 4, text: 'Is this just fantasy?' },
      { time: 8, text: 'Caught in a landslide' },
    ],
    plainText: 'Is this the real life?\nIs this just fantasy?',
    trackName: 'Bohemian Rhapsody',
    artistName: 'Queen',
  },
  lrclibPlainResponse: {
    source: 'lrclib' as const,
    synced: false,
    lines: [{ time: 0, text: 'Is this the real life?' }],
    plainText: 'Is this the real life?\nIs this just fantasy?',
    trackName: 'Bohemian Rhapsody',
    artistName: 'Queen',
  },
  geniusResponse: {
    source: 'genius' as const,
    synced: false,
    lines: [{ time: 0, text: 'Is this the real life?' }],
    plainText: 'Is this the real life?',
    trackName: 'Bohemian Rhapsody',
    artistName: 'Queen',
  },
  enhancedLrcResponse: {
    source: 'lrclib' as const,
    synced: true,
    lines: [{
      time: 0,
      text: 'Is this the real life',
      words: [
        { word: 'Is', startTime: 0, endTime: 0.3 },
        { word: 'this', startTime: 0.3, endTime: 0.6 },
      ],
    }],
    trackName: 'Bohemian Rhapsody',
    artistName: 'Queen',
  },
  notFoundResponse: {
    source: 'none' as const,
    synced: false,
    lines: [],
    trackName: 'Unknown Song',
    artistName: 'Unknown Artist',
  },
};
