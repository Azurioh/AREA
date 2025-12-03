import { HttpStatusCode } from '@area/shared/enums/http-status';
import ApiError from '@/utils/api-error';
import { environment } from '@/utils/environment';
import { verifyToken } from '@/utils/token';
import type { UsersService } from '../users';
import type { StateToken } from '@area/shared/types/user.types';
import type { DiscordRepository } from './discord.repository';
import type { MaybeNull } from '@area/shared/utils/common';
import type { WithId } from 'mongodb';
import { encryptString } from '@/utils/crypt';
import type { DiscordAccount, DiscordAuthorizationResponse } from '@/types/discord';

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
   * @function authorizeUser
   * @description Authorize a user to a discord account
   *
   * @param {string} code - The code provided by discrod to get the tokens
   * @param {state} state - A string to protect against threats
   * @returns {Promise<boolean>} If the autorization was succesful
   */
  async authorizeUser(code: string, state: string): Promise<boolean> {
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
      return false;
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
    return success;
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
}
