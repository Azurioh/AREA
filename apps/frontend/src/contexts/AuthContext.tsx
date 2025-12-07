import type React from 'react';
import { createContext, type ReactNode, useMemo, useState } from 'react';
import { WebhookClient } from '@/features/webhook';
import { ActionReactionClient, ServicesClient } from '@/features/workflows';
import { TokenManager } from '@/lib/TokenManager';
import { LoginClient } from '@/features/auth/api/AuthClient';

/**
 * @interface User
 * @description User interface
 */
interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * @interface AuthState
 * @description Auth state interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

/**
 * @interface AuthContextType
 * @description Api context type
 */
export interface AuthContextType {
    loginClient: LoginClient;
  webhookClient: WebhookClient;
  actionReactionClient: ActionReactionClient;
  servicesClient: ServicesClient;
  authState: AuthState;
  tokenManager: TokenManager;
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
  const webhookClient = useMemo(() => new WebhookClient(BASE_URL, tokenManager), [tokenManager]);
  const servicesClient = useMemo(() => new ServicesClient(BASE_URL, tokenManager), [tokenManager]);
  const actionReactionClient = useMemo(() => new ActionReactionClient(BASE_URL, tokenManager), [tokenManager]);
  const loginClient = useMemo(() => new LoginClient(BASE_URL), []);

  const contextValue: AuthContextType = useMemo(
    () => ({
      webhookClient,
      servicesClient,
      authState,
      tokenManager,
      actionReactionClient,
      loginClient,
      logout: tokenManager.logout.bind(tokenManager),
    }),
    [authState, tokenManager, actionReactionClient, servicesClient, webhookClient, loginClient],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
