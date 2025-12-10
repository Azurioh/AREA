import type { GetThirdPartyAuthorizationUrlResponse } from '@area/shared/schemas/third-parties.schema';
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
    });

    return response;
  }

  /**
   * @function getAuthorizationUrl
   * @description Fetch the authorization url for a third party service
   *
   * @param {string} service - The third party service
   * @returns {Promise<MaybeUndefined<GetThirdPartyAuthorizationUrlResponse>>} The authorization url
   */
  async getAuthorizationUrl(service: string): Promise<MaybeUndefined<GetThirdPartyAuthorizationUrlResponse>> {
    const response = await this.fetch<GetThirdPartyAuthorizationUrlResponse>(
      `/users/v1/me/authorization-url/${service}`,
      {
        method: 'GET',
      },
    );

    return response;
  }
}
