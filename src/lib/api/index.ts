// API clients barrel export
export { api, API_BASE_URL, ApiError, type ApiErrorType } from './client';
export { 
  localMusicClient,
  type LocalMusicFile,
  type MusicUploadProgress,
  type UserMusicSync,
  type JukeboxInstance,
  type ReplicationResult,
  type MusicPlaylist,
  type ConfigReplicationSettings,
} from './localMusic';
export type {
  MusicGenre,
  TrackInfo,
  SystemStatus,
  QueueItem,
  PlaybackQueue,
  PlaybackAction,
  VolumeControl,
  Track,
  LogEntry,
  Feedback,
  ApiResponse,
} from './types';
