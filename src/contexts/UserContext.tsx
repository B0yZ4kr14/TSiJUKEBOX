import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AppUser, UserPermissions, UserRole, AuthProvider, AuthConfig } from '@/types/user';
import { rolePermissions } from '@/types/user';

interface UserContextType {
  user: AppUser | null;
  permissions: UserPermissions;
  isAuthenticated: boolean;
  isLoading: boolean;
  authConfig: AuthConfig;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setAuthProvider: (provider: AuthProvider) => void;
  hasPermission: (permission: keyof UserPermissions) => boolean;
}

const defaultPermissions: UserPermissions = {
  canAddToQueue: false,
  canRemoveFromQueue: false,
  canModifyPlaylists: false,
  canControlPlayback: false,
  canAccessSettings: false,
  canManageUsers: false,
  canAccessSystemControls: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Local users for SQLite backend simulation
const LOCAL_USERS: Record<string, { password: string; role: UserRole }> = {
  'tsi': { password: 'connect', role: 'admin' },
  'user': { password: 'user123', role: 'user' },
  'guest': { password: 'guest', role: 'newbie' },
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authConfig, setAuthConfig] = useState<AuthConfig>(() => {
    const saved = localStorage.getItem('auth_config');
    return saved ? JSON.parse(saved) : { provider: 'local' as AuthProvider };
  });

  const permissions = user ? rolePermissions[user.role] : defaultPermissions;
  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      if (authConfig.provider === 'local') {
        // Check sessionStorage for local auth
        const savedUser = sessionStorage.getItem('current_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
      // Note: Supabase auth integration will be added when user_roles table is created
      setIsLoading(false);
    };

    initAuth();
  }, [authConfig.provider]);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (authConfig.provider === 'local') {
      // Local authentication
      const localUser = LOCAL_USERS[username];
      if (localUser && localUser.password === password) {
        const newUser: AppUser = {
          id: `local_${username}`,
          username,
          role: localUser.role,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        setUser(newUser);
        sessionStorage.setItem('current_user', JSON.stringify(newUser));
        sessionStorage.setItem('auth_token', `local_${username}_token`);
        return true;
      }
      return false;
    } else {
      // Supabase authentication - to be implemented when migration is run
      console.log('Supabase auth not yet configured');
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    sessionStorage.removeItem('current_user');
    sessionStorage.removeItem('auth_token');
  };

  const setAuthProvider = (provider: AuthProvider) => {
    const newConfig = { ...authConfig, provider };
    setAuthConfig(newConfig);
    localStorage.setItem('auth_config', JSON.stringify(newConfig));
    // Logout current user when switching providers
    logout();
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return permissions[permission];
  };

  return (
    <UserContext.Provider
      value={{
        user,
        permissions,
        isAuthenticated,
        isLoading,
        authConfig,
        login,
        logout,
        setAuthProvider,
        hasPermission,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
