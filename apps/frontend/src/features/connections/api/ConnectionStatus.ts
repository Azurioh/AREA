import type { GetThirdPartyStatusResponse } from "@area/shared/schemas/third-parties.schema";
import type { MaybeUndefined } from '@area/shared/utils/common';
import { ApiClient } from "@/lib/ApiClient";

export class ConnectionStatus extends ApiClient {
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
        );

        return response;
    }
}
