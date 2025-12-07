const BASE_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * @class LoginClient
 * @description Handle login and register API calls
 */
export class LoginClient {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * @function login
   * @description Login a user
   *
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Remember me option
   * @returns {Promise<any>} The response from the server
   */
  async login(email: string, password: string, rememberMe: boolean = false): Promise<any> {
    const url = `${this.baseURL}/auth/v1/login`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404 || response.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    return data;
  }

  /**
   * @function register
   * @description Register a new user
   *
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<any>} The response from the server
   */
  async register(name: string, email: string, password: string): Promise<any> {
    const url = `${this.baseURL}/auth/v1/register`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 409) {
        throw new Error('Email already used');
      }
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  }
}
