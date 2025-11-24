import type React from 'react';
import { createContext, type ReactNode, useMemo, useState } from 'react';
import { WebhookClient } from '@/features/webhook';
import { TokenManager } from '@/lib/TokenManager';

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
  webhookClient: WebhookClient;
  authState: AuthState;
  logout: () => void;
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
if (!BASE_URL) {
  throw new Error('VITE_BACKEND_URL is not defined.');
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: null,
  });

  const tokenManager = useMemo(() => new TokenManager(BASE_URL, setAuthState), []);
  const webhookClient = useMemo(() => new WebhookClient(BASE_URL, tokenManager), []);

  const contextValue: AuthContextType = useMemo(
    () => ({
      webhookClient,
      authState,
      logout: tokenManager.logout.bind(tokenManager),
    }),
    [authState, tokenManager],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
