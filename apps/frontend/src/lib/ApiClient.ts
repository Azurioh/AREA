import type { TokenManager } from './TokenManager';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * @class ApiClient
 * @description Base class for all API clients.
 * Handles automatic token addition and refresh token logic.
 */
export class ApiClient {
  protected baseURL: string;
  protected tokenManager: TokenManager;

  constructor(baseURL: string, tokenManager: TokenManager) {
    this.baseURL = baseURL;
    this.tokenManager = tokenManager;
  }

  /**
   * @function fetch
   * @description Fetch data from the API
   *
   * @template T The type of the data to fetch
   * @param {string} endpoint The endpoint to fetch data from
   * @param {FetchOptions} options The options to pass to the fetch function
   * @returns {Promise<T>} The data fetched from the API
   */
  protected async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    if (!options.skipAuth) {
      const accessToken = this.tokenManager.getAccessToken();
      if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }
    }

    let response = await fetch(url, options);

    if (response.status === 401 && !options.skipAuth) {
      console.log('Token expiré, tentative de refresh...');

      const refreshSuccessful = await this.tokenManager.refreshAccessToken();

      if (refreshSuccessful) {
        const newAccessToken = this.tokenManager.getAccessToken();
        if (newAccessToken) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
        }

        console.log('Refresh réussi, on retente la requête initiale.');
        response = await fetch(url, options);
      } else {
        console.log('Refresh échoué. Déconnexion forcée.');
        this.tokenManager.logout();
        throw new Error('Unauthorized: Session expired.');
      }
    }

    if (!response.ok) {
      throw await response.json();
    }

    return response.json() as Promise<T>;
  }
}
