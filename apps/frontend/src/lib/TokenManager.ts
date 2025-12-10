import type { RefreshTokenResponse } from '@area/shared/schemas/auth.schema';
import type { GetUserMeResponse } from '@area/shared/schemas/users.schema';
import type { AuthState } from '@/contexts/AuthContext';

/**
 * @class TokenManager
 * @description Handle token management
 */
export class TokenManager {
  private baseURL: string;
  private setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;

  constructor(baseURL: string, setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) {
    this.baseURL = baseURL;
    this.setAuthState = setAuthState;
  }

  /**
   * @function getAccessToken
   * @description Get the access token
   *
   * @returns {string | null} The access token
   */
  getAccessToken = (): string | null => localStorage.getItem('accessToken');

  /**
   * @function setTokens
   * @description Set the access and refresh tokens
   *
   * @param {string} accessToken The access token
   */
  setToken = async (accessToken: string) => {
    const userResponse = await fetch(`${this.baseURL}/users/v1/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (userResponse.ok) {
      localStorage.setItem('accessToken', accessToken);
      const userData: GetUserMeResponse = await userResponse.json();
      this.setAuthState({ isAuthenticated: true, user: userData });
    } else {
      this.logout();
    }
  };

  /**
   * @function refreshAccessToken
   * @description Refresh the access token
   *
   * @returns {Promise<boolean>} True if the refresh was successful, false otherwise.
   */
  async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/token/refresh`, {
        method: 'POST',
      });

      if (response.ok) {
        const data: RefreshTokenResponse = await response.json();
        this.setToken(data.accessToken);
        return true;
      }
    } catch (error) {
      console.error('Erreur lors du refresh token:', error);
    }

    return false;
  }

  /**
   * @function logout
   * @description Logout the user
   */
  logout() {
    localStorage.removeItem('accessToken');
    this.setAuthState({ isAuthenticated: false, user: null });
  }
}
