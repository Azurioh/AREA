import type { LoginBody, LoginResponse, RegisterBody, RegisterResponse } from '@area/shared/schemas/auth.schema';
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
   * @returns {Promise<LoginResponse>} The response from the server
   */
  async login(data: LoginBody): Promise<MaybeUndefined<LoginResponse>> {
    const response = await this.fetch<LoginResponse>(`/auth/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
   * @returns {Promise<any>} The response from the server
   */
  async register(data: RegisterBody): Promise<MaybeUndefined<RegisterResponse>> {
    const response = await this.fetch<RegisterResponse>('/auth/v1/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      skipAuth: true,
    });

    return response;
  }
}
