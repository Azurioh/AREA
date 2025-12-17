import type { MaybeUndefined } from '@area/shared/utils/common';
import { toast } from 'sonner';
import type { TokenManager } from './TokenManager';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
  throwError?: boolean;
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
  protected async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<MaybeUndefined<T>> {
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
      const refreshSuccessful = await this.tokenManager.refreshAccessToken();

      if (refreshSuccessful) {
        const newAccessToken = this.tokenManager.getAccessToken();
        if (newAccessToken) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
        }
        response = await fetch(url, options);
      } else {
        this.tokenManager.logout();
        throw new Error('Unauthorized: Session expired.');
      }
    }

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage = errorResponse?.message || errorResponse?.data || 'An error occurred';

      toast.error(errorMessage);
      if (options.throwError) {
        throw new Error(errorMessage);
      }
      return undefined;
    }

    return response.json() as Promise<T>;
  }
}
