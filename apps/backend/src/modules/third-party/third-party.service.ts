import { HttpStatusCode } from '@area/shared/enums/http-status';
import ApiError from '@/utils/api-error';
import { environment } from '@/utils/environment';
import { generateStateToken } from '@/utils/token';

/**
 * @class ThirdPartyService
 * @description The third party service.
 */
export class ThirdPartyService {
  private authorizationUrls: Map<string, string>;

  constructor() {
    this.authorizationUrls = new Map([
      [
        'github',
        `https://github.com/login/oauth/authorize?client_id=${environment.GITHUB_CLIENT_ID}&redirect_uri=${environment.BASE_API_URL}/github/v1/authorize&response_type=code&scope=user%2Crepo&state={state}`,
      ],
      [
        'discord',
        `https://discord.com/oauth2/authorize?client_id=${environment.DISCORD_CLIENT_ID}&redirect_uri=${environment.BASE_API_URL}/discord/v1/authorize&response_type=code&scope=identify+guilds+bot&state={state}&permissions=536870912`,
      ],
    ]);
  }

  /**
   * @function getThirdPartyAuthorizationUrl
   * @description Get a third party authorization url
   *
   * @param {string} name - The third party name
   * @param {string} userId - The if of the user authenticating
   * @returns {Promise<string>} The authorization url to the given third party
   */
  async getThirdPartyAuthorizationUrl(name: string, userId: string): Promise<string> {
    if (!this.authorizationUrls.has(name)) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "Requested third party service doesn't exist");
    }
    const stateToken = generateStateToken({ _id: userId });
    const url = (this.authorizationUrls.get(name) as string).replace('{state}', stateToken);

    return url;
  }
}
