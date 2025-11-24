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
   * @function getRefreshToken
   * @description Get the refresh token
   *
   * @returns {string | null} The refresh token
   */
  getRefreshToken = (): string | null => localStorage.getItem('refreshToken');

  /**
   * @function setTokens
   * @description Set the access and refresh tokens
   *
   * @param {string} access - The access token
   * @param {string} refresh - The refresh token
   */
  setTokens = (access: string, refresh: string) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    this.setAuthState({ isAuthenticated: true, user: null }); // Mettre à jour l'état de l'utilisateur
  };

  /**
   * @function refreshAccessToken
   * @description Refresh the access token
   *
   * @returns {Promise<boolean>} True if the refresh was successful, false otherwise.
   */
  async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/token/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.newAccessToken, data.newRefreshToken || refreshToken);
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
    localStorage.removeItem('refreshToken');
    this.setAuthState({ isAuthenticated: false, user: null });
  }
}
