import type { GetUserMeResponse, GetUserMeThirdPartyAuthorizationUrlResponse } from '@area/shared/schemas/user.schema';
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
   * @returns {Promise<MaybeUndefined<GetUserMeThirdPartyAuthorizationUrlResponse>>} The authorization url
   */
  async getAuthorizationUrl(service: string): Promise<MaybeUndefined<GetUserMeThirdPartyAuthorizationUrlResponse>> {
    const response = await this.fetch<GetUserMeThirdPartyAuthorizationUrlResponse>(
      `/users/v1/me/authorization-url/${service}`,
      {
        method: 'GET',
      },
    );

    return response;
  }
}
