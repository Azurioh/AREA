import type { GetThirdPartyAuthorizationUrlResponse } from "@area/shared/schemas/third-parties.schema";
import type { MaybeUndefined } from '@area/shared/utils/common';
import { ApiClient } from "@/lib/ApiClient";

export class AuthorizationUrl extends ApiClient {
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
