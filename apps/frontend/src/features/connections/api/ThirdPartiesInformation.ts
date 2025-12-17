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
        const response = await this.fetch<GetThirdPartyStatusResponse>(
            `/third-parties/v1/status/${service}`,
            {
                method: 'GET',
            },
              return response;
            }
        );
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
     * @function getAuthorizationUrl
     * @description Fetch the authorization url for a third party service
     *
     * @param {string} service - The third party service
     * @returns {Promise<MaybeUndefined<GetThirdPartyAuthorizationUrlResponse>>} The authorization url
     */
    async getAuthorizationUrl(service: string): Promise<MaybeUndefined<GetThirdPartyAuthorizationUrlResponse>> {
      const response = await this.fetch<GetThirdPartyAuthorizationUrlResponse>(
        `/third-parties/v1/authorization-url/${service}`,
        {
          method: 'GET',
          credentials: 'include',
        },
      );

      /**
       * @function getAuthorizationUrl
       * @description Fetch the authorization url for a third party service
       *
       * @param {string} service - The third party service
       * @returns {Promise<MaybeUndefined<GetThirdPartyAuthorizationUrlResponse>>} The authorization url
       */
      async getAuthorizationUrl(service: string): Promise<MaybeUndefined<GetThirdPartyAuthorizationUrlResponse>> {
          const response = await this.fetch<GetThirdPartyAuthorizationUrlResponse>(
              `/third-parties/v1/authorization-url/${service}`,
              {
                  method: 'GET',
              },
          );

          return response;
      }
}
