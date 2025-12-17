import type { User } from '@area/shared/types/user.types';
import type React from 'react';
import { createContext, type ReactNode, useMemo, useState, useEffect } from 'react';
import { AuthClient } from '@/features/auth/api/AuthClient';
import { ActionReactionClient, ServicesClient } from '@/features/workflows';
import { TokenManager } from '@/lib/TokenManager';
import { UserInformationClient } from '@/shared/api/UserInformationClient';
import { ThirdPartiesInformation } from '@/features/connections/api/ThirdPartiesInformation';
import { UserAdminManagementClient } from '@/features/adminDashboard/api/UserAdminManagement';

/**
 * @interface AuthState
 * @description Auth state interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: Omit<User, 'password'> | null;
}

/**
 * @interface AuthContextType
 * @description Api context type
 */
export interface AuthContextType {
  authClient: AuthClient;
  actionReactionClient: ActionReactionClient;
  servicesClient: ServicesClient;
  userInformationClient: UserInformationClient;
  authState: AuthState;
  tokenManager: TokenManager;
  thirdPartiesInformation: ThirdPartiesInformation;
  userAdminManagementClient: UserAdminManagementClient;
  logout: () => void;
}
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
if (!BASE_URL) {
  throw new Error('VITE_BACKEND_URL is not defined.');
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: null,
  });

  const tokenManager = useMemo(() => new TokenManager(BASE_URL, setAuthState), []);
  const servicesClient = useMemo(() => new ServicesClient(BASE_URL, tokenManager), [tokenManager]);
  const actionReactionClient = useMemo(() => new ActionReactionClient(BASE_URL, tokenManager), [tokenManager]);
  const userInformationClient = useMemo(() => new UserInformationClient(BASE_URL, tokenManager), [tokenManager]);
  const authClient = useMemo(() => new AuthClient(BASE_URL, tokenManager), [tokenManager]);
  const thirdPartiesInformation = useMemo(() => new ThirdPartiesInformation(BASE_URL, tokenManager), [tokenManager]);
  const userAdminManagementClient = useMemo(() => new UserAdminManagementClient(BASE_URL, tokenManager), [tokenManager]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (authState.isAuthenticated && !authState.user) {
        try {
          const userData = await userInformationClient.getUserInformation();
          if (userData) {
            setAuthState((prev) => ({
              ...prev,
              user: userData,
            }));
          }
        } catch (error) {
          console.error('Failed to fetch user information:', error);
        }
      }
    };

    fetchUserInfo();
  }, [authState.isAuthenticated, authState.user, userInformationClient]);

  const contextValue: AuthContextType = useMemo(
    () => ({
      servicesClient,
      authState,
      tokenManager,
      actionReactionClient,
      userInformationClient,
      authClient,
      thirdPartiesInformation,
      userAdminManagementClient,
      logout: tokenManager.logout.bind(tokenManager),
    }),
    [authState, tokenManager, actionReactionClient, servicesClient, userInformationClient, authClient, thirdPartiesInformation, userAdminManagementClient],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
