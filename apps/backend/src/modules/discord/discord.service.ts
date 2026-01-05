import { HttpStatusCode } from '@area/shared/enums/http-status';
import ApiError from '@/utils/api-error';
import { environment } from '@/utils/environment';
import type { DiscordChannel } from '@/types/discord';
import type { CreateAction, CreateReaction } from '@area/shared/schemas/actions-reactions.schema';
import type { ThirdPartiesService } from '@/modules/third-parties';
import type { DiscordAccount, DiscordAuthorizationResponse } from '@/types/third-parties';
import type { Tokens } from '@area/shared/types/auth.types';
import type { ActionPayload } from '@/types/action-reaction';
import { Reaction } from '@/integrations';

/**
 * @class DiscordService
 * @description The discord service.
 */
export class DiscordService {
  private thirdPartiesService: ThirdPartiesService;

  constructor(thirdPartiesService: ThirdPartiesService) {
    this.thirdPartiesService = thirdPartiesService;
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
   * @param {ActionPayload} action - The information about the issued action
   * @returns {Promise<boolean>} If the action was created
   */
  async createReaction(_userId: string, reaction: CreateReaction, action: ActionPayload): Promise<boolean> {
    switch (reaction.name) {
      case 'send_message':
        return this.sendMessage(reaction, action);
    }
    return false;
  }

  /**
   * @function sendMessage
   * @description Compute the send message reaction
   *
   * @param {CreateReaction} reaction - The information about the reaction
   * @param {ActionPayload} action - The information about the issued action
   * @returns {Promise<boolean>} If the action was created
   */
  private async sendMessage(reaction: CreateReaction, action: ActionPayload): Promise<boolean> {
    const [content] = Reaction.parseActionVariables(action, [reaction.params.content]);
    const response = await fetch(`https://discord.com/api/channels/${reaction.params.channel.id}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${environment.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
      }),
    });
    return response.ok;
  }

  /**
   * @function refreshDiscordTokens
   * @description Refresh a user discord tokens
   *
   * @param {state} refreshToken - The refresh token
   * @returns {Promise<Tokens>} The refreshed tokens
   */
  async refreshDiscordTokens(refreshToken: string): Promise<Tokens> {
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
   * @function listChannels
   * @description List the channels of a user
   *
   * @param {string} userId - The user id
   * @returns {Promise<DiscordChannel[]>} The list of discord channels
   */
  async listChannels(userId: string): Promise<DiscordChannel[]> {
    const discordAccount = await this.thirdPartiesService.getThirdPartyAccountByUserId<DiscordAccount>(
      'discord',
      userId,
    );

    const response = await fetch(`https://discord.com/api/guilds/${discordAccount.guildId}/channels`, {
      headers: {
        Authorization: `Bot ${environment.DISCORD_BOT_TOKEN}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Failed to list channels');
    }
    const data = await response.json();
    const channels: DiscordChannel[] = data
      .filter((channel: any) => channel.type === 0)
      .map((channel: any) => {
        return {
          name: channel.name,
          id: `${channel.id}`,
        };
      });
    return channels;
  }
}
