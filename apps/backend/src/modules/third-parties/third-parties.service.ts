import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { StateToken } from '@area/shared/types/users.types';
import type { WithId } from 'mongodb';
import type { UsersService } from '@/modules/users';
import type {
  ClientType,
  DiscordAccount,
  DiscordAuthorizationResponse,
  DropboxAccount,
  DropboxAuthorizationResponse,
  GitHubAuthorizationResponse,
  GithubAccount,
  OAuthServiceType,
  ServiceType,
  SpotifyAccount,
  SpotifyAuthorizationResponse,
  ThirdPartyAccount,
  TwitchAccount,
} from '@/types/third-parties';
import ApiError from '@/utils/api-error';
import { encryptString } from '@/utils/crypt';
import { environment } from '@/utils/environment';
import { generateStateToken, verifyToken } from '@/utils/token';
import type { ThirdPartiesRepository } from './third-parties.repository';

/**
 * @class ThirdPartiesService
 * @description The third parties service.
 */
export class ThirdPartiesService {
  private usersService: UsersService;
  private repository: ThirdPartiesRepository;
  private authorizationUrls: Map<OAuthServiceType, string>;
  private servicesAuthorizationFunc: Map<
    OAuthServiceType,
    (userId: string, code: string) => Promise<ThirdPartyAccount | null>
  >;

  constructor(repository: ThirdPartiesRepository, usersService: UsersService) {
    this.repository = repository;
    this.usersService = usersService;
    this.authorizationUrls = new Map([
      [
        'github',
        `https://github.com/login/oauth/authorize?client_id=${environment.GITHUB_CLIENT_ID}&redirect_uri=${environment.BASE_API_URL}/third-parties/v1/authorize/github&response_type=code&scope=user%2Crepo&state={state}`,
      ],
      [
        'discord',
        `https://discord.com/oauth2/authorize?client_id=${environment.DISCORD_CLIENT_ID}&redirect_uri=${environment.BASE_API_URL}/third-parties/v1/authorize/discord&response_type=code&scope=identify+guilds+bot&state={state}&permissions=536870912`,
      ],
      [
        'spotify',
        `https://accounts.spotify.com/authorize?response_type=code&client_id=${environment.SPOTIFY_CLIENT_ID}&redirect_uri=${environment.BASE_API_URL}/third-parties/v1/authorize/spotify&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public%20user-library-read%20user-library-modify%20user-read-currently-playing&state={state}`,
      ],
      [
        'dropbox',
        `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${environment.DROPBOX_CLIENT_ID}&redirect_uri=${environment.BASE_API_URL}/third-parties/v1/authorize/dropbox&token_access_type=offline&state={state}`,
      ],
      [
        'twitch',
        `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${environment.TWITCH_CLIENT_ID}&redirect_uri=${environment.BASE_API_URL}/third-parties/v1/authorize/twitch&scope=moderator:read:followers%20user:read:follows&state={state}`,
      ],
    ]);
    this.servicesAuthorizationFunc = new Map([
      ['github', this.authorizeToGithub],
      ['discord', this.authorizeToDiscord],
      ['spotify', this.authorizeToSpotify],
      ['dropbox', this.authorizeToDropbox],
      ['twitch', this.authorizeToTwitch],
    ]);
  }

  /**
   * @function getThirdPartyAuthorizationUrl
   * @description Get a third party authorization url
   *
   * @param {ServiceType} service - The service name
   * @param {string} userId - The id of the user authenticating
   * @param {ClientType} clientType - The type of the client
   * @returns {Promise<string>} The authorization url to the given third party
   */
  async getThirdPartyAuthorizationUrl(service: ServiceType, userId: string, clientType: ClientType): Promise<string> {
    const authorizationUrl = this.authorizationUrls.get(service);

    if (!authorizationUrl) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "Requested third party service doesn't exist");
    }
    const stateToken = generateStateToken({ _id: userId, clientType: clientType });
    const url = authorizationUrl.replace('{state}', stateToken);

    return url;
  }

  /**
   * @function getThirdPartyAccountByUserId
   * @description Get a third party account by user id
   *
   * @param {ServiceType} service - The service name
   * @param {string} userId - The if of the user authenticating
   * @returns {Promise<WithId<ThirdPartyAccount>>} The third party account
   */
  async getThirdPartyAccountByUserId<T extends ThirdPartyAccount>(
    service: ServiceType,
    userId: string,
  ): Promise<WithId<T>> {
    const result = await this.repository.getThirdPartyAccountByUserId<T>(userId, service);

    if (!result) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Third party account was not found');
    }
    return result;
  }

  /**
   * @function getThirdPartyAccountByServiceAccountId
   * @description Get a third party account by service id
   *
   * @param {ServiceType} service - The service name
   * @param {string} id - The service id of the user
   * @returns {Promise<WithId<ThirdPartyAccount>>} The third party account
   */
  async getThirdPartyAccountByServiceAccountId<T extends ThirdPartyAccount>(
    service: ServiceType,
    id: string,
  ): Promise<WithId<T>> {
    const result = await this.repository.getThirdPartyAccountByServiceAccountId<T>(id, service);

    if (!result) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Third party account was not found');
    }
    return result;
  }

  /**
   * @function authorizeToService
   * @description Authorize a user to a service
   *
   * @param {ServiceType} service - The service name
   * @param {string} code - The code provided by the service to get the tokens
   * @param {state} state - A string to protect against threats
   * @returns {Promise<{ success: boolean, clientType: string }>} If the authorization was a success and the client type
   */
  async authorizeToService(
    service: ServiceType,
    code: string,
    state: string,
  ): Promise<{ success: boolean; clientType: string }> {
    const decoded = verifyToken<StateToken>(state, environment.JWT_STATE_TOKEN_SECRET);

    if (!(await this.usersService.checkIfUserExist(decoded._id))) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'User does not exist');
    }
    try {
      const serviceAuthorizationFunc = this.servicesAuthorizationFunc.get(service);

      if (!serviceAuthorizationFunc) {
        return { success: false, clientType: decoded.clientType };
      }

      const data = await serviceAuthorizationFunc(decoded._id, code);
      let success = false;

      if (data) {
        const account = await this.repository.getThirdPartyAccountByUserId(decoded._id, service);

        if (account) {
          const update = await this.repository.updateThirdPartyAccount(decoded._id, service, data);

          success = update.acknowledged && update.matchedCount > 0;
        } else {
          success = await this.repository.createThirdPartyAccount(data);
        }
      }
      return { success, clientType: decoded.clientType };
    } catch (err: unknown) {
      console.error('Third-party authorization failed:', err);
      return { success: false, clientType: decoded.clientType };
    }
  }

  /**
   * @function authorizeToGithub
   * @description Authorize a user to github
   *
   * @param {string} userId - The user id
   * @param {string} code - The code provided by the service to get the tokens
   * @returns {Promise<ThirdPartyAccount | null>} The create third party account
   */
  private async authorizeToGithub(userId: string, code: string): Promise<ThirdPartyAccount | null> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'application/json',
      },
      body: new URLSearchParams({
        client_id: environment.GITHUB_CLIENT_ID,
        client_secret: environment.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    if (response.status !== HttpStatusCode.OK) {
      return null;
    }

    const formattedResponse = (await response.json()) as GitHubAuthorizationResponse;

    const getUsername = async () => {
      const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${formattedResponse.access_token}`,
          Accept: 'application/vnd.github+json',
        },
      });

      if (response.status !== HttpStatusCode.OK) {
        throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Failed to get github user information');
      }
      const data = (await response.json()) as { login: string };

      return data.login;
    };

    const data: GithubAccount = {
      userId,
      service: 'github',
      accessToken: encryptString(formattedResponse.access_token, environment.CRYPT_SECRET_KEY),
      refreshToken: null,
      username: await getUsername(),
    };
    return data;
  }

  /**
   * @function authorizeToDiscord
   * @description Authorize a user to discord
   *
   * @param {string} userId - The user id
   * @param {string} code - The code provided by the service to get the tokens
   * @returns {Promise<ThirdPartyAccount | null>} The create third party account
   */
  private async authorizeToDiscord(userId: string, code: string): Promise<ThirdPartyAccount | null> {
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: environment.DISCORD_CLIENT_ID,
        client_secret: environment.DISCORD_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${environment.BASE_API_URL}/third-parties/v1/authorize/discord`,
      }),
    });

    if (response.status !== HttpStatusCode.OK) {
      return null;
    }

    const formattedResponse = (await response.json()) as DiscordAuthorizationResponse;

    const data: DiscordAccount = {
      userId,
      service: 'discord',
      accessToken: encryptString(formattedResponse.access_token, environment.CRYPT_SECRET_KEY),
      refreshToken: encryptString(formattedResponse.refresh_token, environment.CRYPT_SECRET_KEY),
      guildId: formattedResponse.guild.id,
    };
    return data;
  }

  /**
   * @function authorizeToSpotify
   * @description Authorize a user to Spotify
   *
   * @param {string} userId - The user id
   * @param {string} code - The code provided by the service to get the tokens
   * @returns {Promise<ThirdPartyAccount | null>} The create third party account
   */
  private async authorizeToSpotify(userId: string, code: string): Promise<ThirdPartyAccount | null> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${environment.SPOTIFY_CLIENT_ID}:${environment.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${environment.BASE_API_URL}/third-parties/v1/authorize/spotify`,
      }).toString(),
    });

    if (response.status !== HttpStatusCode.OK) {
      return null;
    }

    const formattedResponse = (await response.json()) as SpotifyAuthorizationResponse;

    const getUserId = async () => {
      const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${formattedResponse.access_token}`,
          Accept: 'application/x-www-form-urlencoded',
        },
      });

      if (response.status !== HttpStatusCode.OK) {
        throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Failed to get spotify user information');
      }
      const data = (await response.json()) as { id: string };

      return data.id;
    };

    const data: SpotifyAccount = {
      userId,
      service: 'spotify',
      accessToken: encryptString(formattedResponse.access_token, environment.CRYPT_SECRET_KEY),
      refreshToken: encryptString(formattedResponse.refresh_token, environment.CRYPT_SECRET_KEY),
      id: await getUserId(),
    };
    return data;
  }

  /**
   * @function authorizeToDropbox
   * @description Authorize a user to discord
   *
   * @param {string} userId - The user id
   * @param {string} code - The code provided by the service to get the tokens
   * @returns {Promise<ThirdPartyAccount | null>} The create third party account
   */
  private async authorizeToDropbox(userId: string, code: string): Promise<ThirdPartyAccount | null> {
    const response = await fetch('https://www.dropbox.com/oauth2/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: environment.DROPBOX_CLIENT_ID,
        client_secret: environment.DROPBOX_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${environment.BASE_API_URL}/third-parties/v1/authorize/dropbox`,
      }),
    });

    if (response.status !== HttpStatusCode.OK) {
      return null;
    }

    const formattedResponse = (await response.json()) as DropboxAuthorizationResponse;

    const getCursor = async () => {
      const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${formattedResponse.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: '',
          recursive: true,
        }),
      });
      if (!response.ok) {
        return null;
      }
      return (await response.json()).cursor;
    };

    const cursor = await getCursor();

    if (!cursor) {
      return null;
    }
    const data: DropboxAccount = {
      userId,
      service: 'dropbox',
      accessToken: encryptString(formattedResponse.access_token, environment.CRYPT_SECRET_KEY),
      refreshToken: encryptString(formattedResponse.refresh_token, environment.CRYPT_SECRET_KEY),
      id: formattedResponse.account_id,
      cursor: {
        ref: cursor,
        paths: [],
      },
    };
    return data;
  }

  /**
   * @function authorizeToTwitch
   * @description Authorize a user to twitch
   *
   * @param {string} userId - The user id
   * @param {string} code - The code provided by the service to get the tokens
   * @returns {Promise<ThirdPartyAccount | null>} The create third party account
   */
  private async authorizeToTwitch(userId: string, code: string): Promise<ThirdPartyAccount | null> {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: environment.TWITCH_CLIENT_ID,
        client_secret: environment.TWITCH_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${environment.BASE_API_URL}/third-parties/v1/authorize/twitch`,
      }),
    });

    if (response.status !== HttpStatusCode.OK) {
      return null;
    }

    const formattedResponse = (await response.json()) as DiscordAuthorizationResponse;

    const getId = async (accessToken: string): Promise<string | null> => {
      const response = await fetch('https://api.twitch.tv/helix/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Client-Id': environment.TWITCH_CLIENT_ID,
        },
      });

      const formattedResponse = await response.json();

      if (response.status !== HttpStatusCode.OK || !formattedResponse.data || formattedResponse.data.length === 0) {
        return null;
      }
      return formattedResponse.data[0].id;
    };

    const id = await getId(formattedResponse.access_token);

    if (!id) {
      return null;
    }

    const data: TwitchAccount = {
      userId,
      service: 'twitch',
      accessToken: encryptString(formattedResponse.access_token, environment.CRYPT_SECRET_KEY),
      refreshToken: encryptString(formattedResponse.refresh_token, environment.CRYPT_SECRET_KEY),
      id,
    };
    return data;
  }

  /**
   * @function getThirdPartyStatus
   * @description Get a third party status
   *
   * @param {ServiceType} service - The service name
   * @param {string} userId - The id of the user authenticating
   * @returns {Promise<boolean>} The status of the connection with the third party service
   */
  async getThirdPartyStatus(service: ServiceType, userId: string): Promise<boolean> {
    const account = await this.repository.getThirdPartyAccountByUserId(userId, service);

    return account !== null;
  }

  /**
   * @function updateThirdPartyAccount
   * @description Update a third party account
   *
   * @param {ServiceType} service - The service type
   * @param {string} userId - The user id
   * @param {Partial<ThirdPartyAccount>} account - The data to update the account
   * @returns {Promise<void>} Nothing
   */
  async updateThirdPartyAccount(
    service: ServiceType,
    userId: string,
    account: Partial<ThirdPartyAccount>,
  ): Promise<void> {
    const updated = await this.repository.updateThirdPartyAccount(userId, service, account);

    if (!updated.acknowledged) {
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        'Failed to update the third party account, please contact an administrator',
      );
    }

    if (updated.matchedCount === 0) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Third party account not found');
    }
  }
}
