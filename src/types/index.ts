// Types barrel export

// Track types
export type {
  MusicGenre,
  BaseTrack,
  TrackInfo,
  QueueTrack,
  SpotifyTrack,
  YouTubeMusicTrack,
  LocalTrack,
  CurrentTrack,
} from './track';
export { isQueueTrack, isSpotifyTrack } from './track';

// User types
export type {
  UserRole,
  AppUser,
  UserPermissions,
  AuthProvider,
  AuthConfig,
} from './user';
export { rolePermissions } from './user';

// Lyrics types
export type {
  LyricsData,
  CachedLyrics,
  CacheStats,
} from './lyrics';

// Spotify API types
export type {
  SpotifyApiImage,
  SpotifyApiArtistSimple,
  SpotifyApiAlbumSimple,
  SpotifyApiTrack,
  SpotifyApiAlbum,
  SpotifyApiArtist,
  SpotifyApiPlaylistOwner,
  SpotifyApiPlaylist,
  SpotifyApiCategory,
  SpotifyApiDevice,
  SpotifyApiPaginated,
  SpotifyApiPlaylistsResponse,
  SpotifyApiPlaylistTracksResponse,
  SpotifyApiSavedTracksResponse,
  SpotifyApiSavedAlbumsResponse,
  SpotifyApiAlbumTracksResponse,
  SpotifyApiFollowedArtistsResponse,
  SpotifyApiSearchResponse,
  SpotifyApiRecentlyPlayedResponse,
  SpotifyApiTopItemsResponse,
  SpotifyApiFeaturedPlaylistsResponse,
  SpotifyApiNewReleasesResponse,
  SpotifyApiCategoriesResponse,
  SpotifyApiCategoryPlaylistsResponse,
  SpotifyApiPlaybackState,
  SpotifyApiDevicesResponse,
  SpotifyApiQueueResponse,
  SpotifyApiRecommendationsResponse,
  SpotifyApiArtistTopTracksResponse,
  LRCLIBResult,
} from './spotify-api';
