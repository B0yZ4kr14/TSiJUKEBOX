export type UserRole = 'newbie' | 'user' | 'admin';

export interface AppUser {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
}

export interface UserPermissions {
  canAddToQueue: boolean;
  canRemoveFromQueue: boolean;
  canModifyPlaylists: boolean;
  canControlPlayback: boolean;
  canAccessSettings: boolean;
  canManageUsers: boolean;
  canAccessSystemControls: boolean;
}

export const rolePermissions: Record<UserRole, UserPermissions> = {
  newbie: {
    canAddToQueue: false,
    canRemoveFromQueue: false,
    canModifyPlaylists: false,
    canControlPlayback: true, // Can play/pause only
    canAccessSettings: false,
    canManageUsers: false,
    canAccessSystemControls: false,
  },
  user: {
    canAddToQueue: true,
    canRemoveFromQueue: true,
    canModifyPlaylists: true,
    canControlPlayback: true,
    canAccessSettings: false,
    canManageUsers: false,
    canAccessSystemControls: false,
  },
  admin: {
    canAddToQueue: true,
    canRemoveFromQueue: true,
    canModifyPlaylists: true,
    canControlPlayback: true,
    canAccessSettings: true,
    canManageUsers: true,
    canAccessSystemControls: true,
  },
};

export type AuthProvider = 'local' | 'supabase';

export interface AuthConfig {
  provider: AuthProvider;
  autoLogin?: boolean;
}
