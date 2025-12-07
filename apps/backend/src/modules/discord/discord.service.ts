import { HttpStatusCode } from '@area/shared/enums/http-status';
import ApiError from '@/utils/api-error';
import { environment } from '@/utils/environment';
import { verifyToken } from '@/utils/token';
import type { UsersService } from '../users';
import type { StateToken } from '@area/shared/types/user.types';
import type { DiscordRepository } from './discord.repository';
import type { MaybeNull } from '@area/shared/utils/common';
import type { WithId } from 'mongodb';
import { decryptString, encryptString } from '@/utils/crypt';
import type { DiscordAccount, DiscordAuthorizationResponse, DiscordChannel } from '@/types/discord';
import type { CreateAction, CreateReaction } from '@area/shared/schemas/action-reaction.schema';

/**
 * @class DiscordService
 * @description The discord service.
 */
export class DiscordService {
  private repository: DiscordRepository;
  private usersService: UsersService;

  constructor(repository: DiscordRepository, usersService: UsersService) {
    this.repository = repository;
    this.usersService = usersService;
  }

  /**
   * @function createAction
   * @description Create an action with the discord service
   *
   * @param {string} _userId - The id of the user creating the action
   * @param {CreateAction} action - The information about the action
   * @returns {Promise<boolean>} If the action was created
   */
  async createAction(_userId: string, action: CreateAction): Promise<string> {
    const trigger = `${action.name}/${action.params.channel.id}`;

    return trigger;
  }

  /**
   * @function createReaction
   * @description Create a reaction with the discord service
   *
   * @param {string} _userId - The id of the user creating the action
   * @param {CreateReaction} reaction - The information about the reaction
   * @returns {Promise<boolean>} If the action was created
   */
  async createReaction(_userId: string, reaction: CreateReaction): Promise<boolean> {
    switch (reaction.name) {
      case 'send_message': {
        const response = await fetch(`https://discord.com/api/channels/${reaction.params.channel.id}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bot ${environment.DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: reaction.params.content,
          }),
        });
        return response.ok;
      }
    }
    return false;
  }

  /**
   * @function authorizeUser
   * @description Authorize a user to a discord account
   *
   * @param {string} code - The code provided by discrod to get the tokens
   * @param {state} state - A string to protect against threats
   * @returns {Promise<string | null>} The client type authorizing
   */
  async authorizeUser(code: string, state: string): Promise<string | null> {
    const decoded = verifyToken<StateToken>(state, environment.JWT_STATE_TOKEN_SECRET);

    if (!(await this.usersService.checkIfUserExist(decoded._id))) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'User does not exist');
    }

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
        redirect_uri: 'https://area-dev.loca.lt/discord/v1/authorize',
      }),
    });

    if (response.status !== HttpStatusCode.OK) {
      return null;
    }

    const formattedResponse = (await response.json()) as DiscordAuthorizationResponse;

    const data: DiscordAccount = {
      userId: decoded._id,
      accessToken: encryptString(formattedResponse.access_token, environment.CRYPT_SECRET_KEY),
      refreshToken: encryptString(formattedResponse.refresh_token, environment.CRYPT_SECRET_KEY),
      guildId: formattedResponse.guild.id,
    };

    let success = false;
    const account = await this.getDiscordAccountByUserId(decoded._id);

    if (account) {
      const update = await this.repository.updateDiscordAccount(account._id.toString(), data);

      success = update.acknowledged && update.matchedCount > 0;
    } else {
      success = await this.repository.createDiscordAccount(data);
    }
    return success ? decoded.clientType : null;
  }

  /**
   * @function refreshDiscordTokens
   * @description Refresh a user discord tokens
   *
   * @param {state} refreshToken - The refresh token
   * @returns {Promise<{accessToken: string, refreshToken: string}>} The refreshed tokens
   */
  async refreshDiscordTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: environment.DISCORD_CLIENT_ID,
        client_secret: environment.DISCORD_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (response.status !== HttpStatusCode.OK) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Error when refreshing discord access token');
    }

    const formattedResponse = (await response.json()) as DiscordAuthorizationResponse;

    return { accessToken: formattedResponse.access_token, refreshToken: formattedResponse.refresh_token };
  }

  /**
   * @function getDiscordAccountByUserId
   * @description Get a discord account by a user id
   *
   * @param {string} userId - The user id
   * @returns {Promise<MaybeNull<WithId<DiscordAccount>>>} The discord account
   */
  async getDiscordAccountByUserId(userId: string): Promise<MaybeNull<WithId<DiscordAccount>>> {
    return await this.repository.getDiscordAccountByUserId(userId);
  }

  /**
   * @function listChannels
   * @description List the channels of a user
   *
   * @param {string} userId - The user id
   * @returns {Promise<DiscordChannel[]>} The list of discord channels
   */
  async listChannels(userId: string): Promise<DiscordChannel[]> {
    const discordAccount = await this.getDiscordAccountByUserId(userId);

    if (!discordAccount) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Discord account not found');
    }
    const getChannels = async (accessToken: string) => {
      return await fetch(`https://discord.com/api/guilds/${discordAccount.guildId}/channels`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      });
    };
    let response = await getChannels(decryptString(discordAccount.accessToken, environment.CRYPT_SECRET_KEY));

    if (response.status === HttpStatusCode.UNAUTHORIZED) {
      const tokens = await this.refreshDiscordTokens(
        decryptString(discordAccount.refreshToken, environment.CRYPT_SECRET_KEY),
      );

      response = await getChannels(tokens.accessToken);
    }

    console.log(response);
    if (!response.ok) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Failed to list channels');
    }

    console.log();
    return [];
  }
}
