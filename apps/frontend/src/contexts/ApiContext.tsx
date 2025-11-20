import type React from 'react';
import { createContext, type ReactNode, useMemo, useState } from 'react';
import { GithubService } from '@/services/GithubService';
import { TokenManager } from '@/services/TokenManager';
import { WebhookService } from '@/services/WebhookService';

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
  user: User | null; // User info if authenticated
}

/**
 * @interface ApiContextType
 * @description Api context type
 */
export interface ApiContextType {
  githubService: GithubService;
  webhookService: WebhookService;
  authState: AuthState;
  logout: () => void;
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
if (!BASE_URL) {
  throw new Error('VITE_BACKEND_URL is not defined.');
}

export const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: null,
  });

  const tokenManager = useMemo(() => new TokenManager(BASE_URL, setAuthState), []);
  const githubService = useMemo(() => new GithubService(`${BASE_URL}/github`, tokenManager), [tokenManager]);
  const webhookService = useMemo(() => new WebhookService(`${BASE_URL}/webhook`, tokenManager), [tokenManager]);

  const contextValue: ApiContextType = useMemo(
    () => ({
      githubService,
      webhookService,
      authState,
      logout: tokenManager.logout.bind(tokenManager),
    }),
    [githubService, webhookService, authState, tokenManager],
  );

  return <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>;
};
