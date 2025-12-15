import type { XAccount, XAuthorizationResponse } from '@/types/third-parties';
import type { ThirdPartiesService } from '../third-parties';
import { HttpStatusCode } from '@area/shared/enums/http-status';
import { environment } from '@/utils/environment';
import ApiError from '@/utils/api-error';
import { encryptString } from '@/utils/crypt';

/**
 * @class XService
 * @description The github service.
 */
export class XService {
  private thirdPartiesService: ThirdPartiesService;

  constructor(thirdPartiesService: ThirdPartiesService) {
    this.thirdPartiesService = thirdPartiesService;
  }

  /**
   * @function refreshDiscordTokens
   * @description Refresh a user discord tokens
   *
   * @param {state} accountId - The id of the account
   * @param {state} refreshToken - The refresh token
   * @returns {Promise<void>} Nothing
   */
  async refreshTokens(accountId: string, refreshToken: string): Promise<void> {
    const response = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${environment.X_CLIENT_ID}:${environment.X_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    if (response.status !== HttpStatusCode.OK) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Error when refreshing X access token');
    }

    const formattedResponse = (await response.json()) as XAuthorizationResponse;

    const account: Partial<XAccount> = {
      accessToken: encryptString(formattedResponse.access_token, environment.CRYPT_SECRET_KEY),
      refreshToken: encryptString(formattedResponse.refresh_token, environment.CRYPT_SECRET_KEY),
    };

    this.thirdPartiesService.updateThirdPartyAccount('x', accountId, account);
  }
}
