import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { CreateAction } from '@area/shared/schemas/actions-reactions.schema';
import type { TwitchAccount, TwitchAuthorizationResponse } from '@/types/third-parties';
import type {
  FollowedChannel,
  FollowedChannelsResponse,
  TwitchAppAccessToken,
  TwitchAppAccessTokenResponse,
  TwitchEventSubscription,
  TwitchStreamer,
} from '@/types/twitch';
import ApiError from '@/utils/api-error';
import { getFromCache, setInCache } from '@/utils/caching';
import { decryptString, encryptString } from '@/utils/crypt';
import { environment } from '@/utils/environment';
import type { ThirdPartiesService } from '../third-parties';

/**
 * @class TwitchService
 * @description The twitch service.
 */
export class TwitchService {
  private thirdPartiesService: ThirdPartiesService;

  constructor(thirdPartiesService: ThirdPartiesService) {
    this.thirdPartiesService = thirdPartiesService;
  }

  /**
   * @function createAction
   * @description Create an action with the unsplash service
   *
   * @param {string} userId - The id of the user creating the action
   * @param {CreateAction} action - The information about the action
   * @returns {Promise<boolean>} If the action was created
   */
  async createAction(userId: string, action: CreateAction): Promise<string> {
    const twitchAccount = await this.thirdPartiesService.getThirdPartyAccountByUserId<TwitchAccount>('twitch', userId);
    let subscription: TwitchEventSubscription | null = null;
    let trigger = '';

    switch (action.name) {
      case 'new_follower': {
        subscription = await this.newFollower(twitchAccount);
        trigger = `${action.name}/${twitchAccount.id}`;
        break;
      }
      case 'stream_online': {
        subscription = await this.streamOnline(action);
        trigger = `${action.name}/${action.params.streamer.id}`;
        break;
      }
      default: {
        throw new ApiError(HttpStatusCode.NOT_FOUND, 'Action not found');
      }
    }

    const response = await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await this.getAppAccessToken()}`,
        'Content-Type': 'application/json',
        'Client-Id': environment.TWITCH_CLIENT_ID,
      },
      body: JSON.stringify(subscription),
    });

    if (response.status !== HttpStatusCode.ACCEPTED) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Error when creating Twitch subscription');
    }
    return trigger;
  }

  /**
   * @function newFollower
   * @description Create a new follower subscription
   *
   * @param {TwitchAccount} twitchAccount The twitch account of the user
   * @returns {Promise<TwitchEventSubscription>} The twitch event subscription
   */
  async newFollower(twitchAccount: TwitchAccount): Promise<TwitchEventSubscription> {
    const subscription: TwitchEventSubscription = {
      type: 'channel.follow',
      version: '2',
      condition: {
        broadcaster_user_id: `${twitchAccount.id}`,
        moderator_user_id: `${twitchAccount.id}`,
      },
      transport: {
        method: 'webhook',
        callback: `${environment.BASE_API_URL}/webhook/v1/twitch`,
        secret: environment.TWITCH_WEBHOOK_SECRET,
      },
    };

    return subscription;
  }

  /**
   * @function streamOnline
   * @description Create a new stream online subscription
   *
   * @param {CreateAction} action The information about the action
   * @returns {Promise<TwitchEventSubscription>} The twitch event subscription
   */
  async streamOnline(action: CreateAction): Promise<TwitchEventSubscription> {
    const subscription: TwitchEventSubscription = {
      type: 'stream.online',
      version: '1',
      condition: {
        broadcaster_user_id: `${action.params.streamer.id}`,
      },
      transport: {
        method: 'webhook',
        callback: `${environment.BASE_API_URL}/webhook/v1/twitch`,
        secret: environment.TWITCH_WEBHOOK_SECRET,
      },
    };

    return subscription;
  }

  /**
   * @function refreshDiscordTokens
   * @description Refresh a user dropbox tokens
   *
   * @param {state} userId - The id of the user
   * @param {state} refreshToken - The refresh token
   * @returns {Promise<string>} The refreshed token
   */
  async refreshTokens(userId: string, refreshToken: string): Promise<string> {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: environment.TWITCH_CLIENT_ID,
        client_secret: environment.TWITCH_CLIENT_SECRET,
      }).toString(),
    });

    if (response.status !== HttpStatusCode.OK) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Error when refreshing Twitch tokens');
    }

    const formattedResponse = (await response.json()) as TwitchAuthorizationResponse;

    const accessToken = formattedResponse.access_token;

    const account: Partial<TwitchAccount> = {
      accessToken: encryptString(accessToken, environment.CRYPT_SECRET_KEY),
      refreshToken: encryptString(formattedResponse.refresh_token, environment.CRYPT_SECRET_KEY),
    };

    this.thirdPartiesService.updateThirdPartyAccount('twitch', userId, account);
    return accessToken;
  }

  /**
   * @function getAppAccessToken
   * @description Get the app access token
   *
   * @returns {Promise<string>} The app access token
   */
  async getAppAccessToken(): Promise<string> {
    const appAccessToken = getFromCache<TwitchAppAccessToken>('twitch_app_access_token');

    if (appAccessToken && appAccessToken.expiresAt > Date.now()) {
      return appAccessToken.accessToken;
    }

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID!,
        client_secret: process.env.TWITCH_CLIENT_SECRET!,
        grant_type: 'client_credentials',
      }),
    });

    if (response.status !== HttpStatusCode.OK) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Error when getting Twitch app access token');
    }

    const formattedReponse = (await response.json()) as TwitchAppAccessTokenResponse;

    setInCache<TwitchAppAccessToken>('twitch_app_access_token', {
      accessToken: formattedReponse.access_token,
      expiresAt: Date.now() + (formattedReponse.expires_in - 60 * 60) * 1000,
    });
    return formattedReponse.access_token;
  }

  /**
   * @function listFollowedChannels
   * @description List the followed channels of the user
   *
   * @param {string} userId The id of the user
   * @returns {Promise<TwitchStreamer[]>} The list of followed channels
   */
  async listFollowedChannels(userId: string): Promise<TwitchStreamer[]> {
    const twitchAccount = await this.thirdPartiesService.getThirdPartyAccountByUserId<TwitchAccount>('twitch', userId);
    const data: FollowedChannelsResponse = {
      data: [],
      pagination: {
        cursor: '',
      },
    };

    const tryToListFollowedChannels = async (accessToken: string, cursor: string) => {
      const response = await fetch(
        `https://api.twitch.tv/helix/channels/followed?user_id=${twitchAccount.id}&after=${cursor}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Client-Id': environment.TWITCH_CLIENT_ID,
          },
        },
      );
      return response;
    };

    while (data.pagination.cursor !== undefined) {
      let response = await tryToListFollowedChannels(
        decryptString(twitchAccount.accessToken, environment.CRYPT_SECRET_KEY),
        data.pagination.cursor,
      );

      if (response.status === HttpStatusCode.UNAUTHORIZED) {
        const accessToken = await this.refreshTokens(
          twitchAccount.userId,
          decryptString(twitchAccount.refreshToken || '', environment.CRYPT_SECRET_KEY),
        );

        response = await tryToListFollowedChannels(accessToken, data.pagination.cursor);
      }

      if (!response.ok) {
        throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Failed to list playlists');
      }

      const formattedResponse = (await response.json()) as FollowedChannelsResponse;

      data.data.push(...formattedResponse.data);
      data.pagination.cursor = formattedResponse.pagination.cursor;
    }

    const streamers: TwitchStreamer[] = data.data.map((streamer: FollowedChannel) => {
      return {
        name: streamer.broadcaster_name,
        id: streamer.broadcaster_id,
      };
    });
    return streamers;
  }
}
