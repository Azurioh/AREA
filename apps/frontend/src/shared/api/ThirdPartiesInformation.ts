import type {
  GetThirdPartyStatusResponse,
  GetThirdPartyAuthorizationUrlResponse,
} from '@area/shared/schemas/third-parties.schema';
import type { MaybeUndefined } from '@area/shared/utils/common';
import { ApiClient } from '@/lib/ApiClient';

export class ThirdPartiesInformation extends ApiClient {
  /**
   * @function getConnectionStatus
   * @description Fetch the connection status for a third party service
   *
   * @param {string} service - The third party service
   * @returns {Promise<MaybeUndefined<GetThirdPartyStatusResponse>>} The connection status
   */
  async getConnectionStatus(service: string): Promise<MaybeUndefined<GetThirdPartyStatusResponse>> {
    const response = await this.fetch<GetThirdPartyStatusResponse>(`/third-parties/v1/status/${service}`, {
      method: 'GET',
      credentials: 'include',
    });

    return response;
  }

  /**
   * @function getAuthorizationUrlService
   * @description Fetch the authorization url to connect a third party service
   *
   * @param {string} service - The third party service
   * @returns {Promise<MaybeUndefined<GetThirdPartyAuthorizationUrlResponse>>} The authorization url
   */
  async getAuthorizationUrlService(service: string): Promise<MaybeUndefined<GetThirdPartyAuthorizationUrlResponse>> {
    const response = await this.fetch<GetThirdPartyAuthorizationUrlResponse>(
      `/third-parties/v1/authorization-url/${service}/service`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    return response;
  }

  /**
   * @function getAuthorizationUrlApp
   * @description Fetch the authorization url to connect to the app via a third party service
   *
   * @param {string} service - The third party service
   * @returns {Promise<MaybeUndefined<GetThirdPartyAuthorizationUrlResponse>>} The authorization url
   */
  async getAuthorizationUrlApp(service: string): Promise<MaybeUndefined<GetThirdPartyAuthorizationUrlResponse>> {
    const response = await this.fetch<GetThirdPartyAuthorizationUrlResponse>(
      `/third-parties/v1/authorization-url/${service}/app`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    return response;
  }
}
