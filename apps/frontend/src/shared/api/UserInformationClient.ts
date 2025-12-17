import type { GetUserMeResponse } from '@area/shared/schemas/users.schema';
import type { MaybeUndefined } from '@area/shared/utils/common';
import { ApiClient } from '@/lib/ApiClient';

/**
 * @class UserInformationClient
 * @description Client to fetch user information
 */
export class UserInformationClient extends ApiClient {
  /**
   * @function getUserInformation
   * @description Fetch user information
   *
   * @returns {Promise<MaybeUndefined<GetUserMeResponse>>} The user information
   */
  async getUserInformation(): Promise<MaybeUndefined<GetUserMeResponse>> {
    const response = await this.fetch<GetUserMeResponse>('/users/v1/me', {
      method: 'GET',
      credentials: 'include',
    });

    return response;
  }
}
