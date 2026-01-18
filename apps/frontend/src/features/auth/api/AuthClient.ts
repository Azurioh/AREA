import type {
  LoginBody,
  LoginResponse,
  LoginWithServiceResponse,
  RegisterBody,
  RegisterResponse,
} from '@area/shared/schemas/auth.schema';
import type { MaybeUndefined } from '@area/shared/utils/common';
import { ApiClient } from '@/lib/ApiClient';

/**
 * @class LoginClient
 * @description Handle login and register API calls
 */
export class AuthClient extends ApiClient {
  /**
   * @function login
   * @description Login a user
   *
   * @param {LoginBody} data The login data
   * @returns {Promise<MaybeUndefined<LoginResponse>>} The response from the server
   */
  async login(data: LoginBody): Promise<MaybeUndefined<LoginResponse>> {
    const response = await this.fetch<LoginResponse>(`/auth/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
      skipAuth: true,
    });

    return response;
  }

  /**
   * @function register
   * @description Register a new user
   *
   * @param {RegisterBody} data The registration data
   * @returns {Promise<MaybeUndefined<RegisterResponse>>} The response from the server
   */
  async register(data: RegisterBody): Promise<MaybeUndefined<RegisterResponse>> {
    const response = await this.fetch<RegisterResponse>('/auth/v1/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
      skipAuth: true,
    });

    return response;
  }

  /**
   * @function loginWithService
   * @description Login a user with a third party service
   *
   * @param {string} service The service to login with
   * @param {string} code The code received from the service
   * @param {string} state The state received from the service
   * @returns {Promise<MaybeUndefined<LoginWithServiceResponse>>} The response from the server
   */
  async loginWithService(
    service: string,
    code: string,
    state: string,
  ): Promise<MaybeUndefined<LoginWithServiceResponse>> {
    const response = await this.fetch<LoginWithServiceResponse>(
      `/auth/v1/login/${service}?code=${code}&state=${state}`,
      {
        method: 'POST',
        credentials: 'include',
        skipAuth: true,
      },
    );

    return response;
  }
}
