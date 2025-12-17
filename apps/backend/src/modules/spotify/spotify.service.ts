import type { SpotifyAccount, SpotifyAuthorizationResponse } from '@/types/third-parties';
import type { ThirdPartiesService } from '../third-parties';
import { HttpStatusCode } from '@area/shared/enums/http-status';
import { environment } from '@/utils/environment';
import ApiError from '@/utils/api-error';
import { encryptString } from '@/utils/crypt';

/**
 * @class SpotifyService
 * @description The spotify service.
 */
export class SpotifyService {
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
        Authorization: `Basic ${Buffer.from(`${environment.SPOTIFY_CLIENT_ID}:${environment.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    if (response.status !== HttpStatusCode.OK) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Error when refreshing X access token');
    }

    const formattedResponse = (await response.json()) as SpotifyAuthorizationResponse;

    const account: Partial<SpotifyAccount> = {
      accessToken: encryptString(formattedResponse.access_token, environment.CRYPT_SECRET_KEY),
      refreshToken: encryptString(formattedResponse.refresh_token, environment.CRYPT_SECRET_KEY),
    };

    this.thirdPartiesService.updateThirdPartyAccount('spotify', accountId, account);
  }
}
