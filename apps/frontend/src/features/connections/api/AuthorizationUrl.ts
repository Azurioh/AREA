const BASE_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * @class AuthorizationUrl
 * @description Handle authorization url api call
 */
export class AuthorizationUrl {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * @function get
   * @description Get the authorization url for a service
   *
   * @param {string} service - The service for which to get the authorization url
   * @returns {Promise<any>} The response from the server
   */
  async get(service: string): Promise<any> {
    const url = `${this.baseURL}/third-parties/v1/authorization-url/${service}`;
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404) {
        throw new Error('Service was not found');
      }
      throw new Error(errorData.message || 'Couldnt get authorization url');
    }

    const data = await response.json();
    return data;
  }
}
