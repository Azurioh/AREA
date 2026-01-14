import { Action } from '@/integrations/_definitions/action.interface';
import type { TwitchService } from '@/modules/twitch/twitch.service';

export class TwitchStreamOnlineAction extends Action {
  private twitchService: TwitchService;

  constructor(twitchService: TwitchService) {
    super(
      'stream_online',
      'Action triggered when a streamer goes live on their stream',
      [
        {
          type: 'select',
          key: 'streamer',
          label: 'Streamer',
          placeholder: 'Select a streamer',
          options: [],
        },
      ],
      [
        {
          key: 'streamerName',
          description: 'The name of the streamer',
          type: 'string',
          path: 'event.broadcaster_user_name',
        },
      ],
    );
    this.twitchService = twitchService;
  }

  /**
   * @function refreshParams
   * @description Refresh the parameters of the action
   *
   * @param {string} userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  override async refreshParams(userId: string): Promise<void> {
    const streamerParam = this.params[0];

    if (streamerParam?.type === 'select') {
      const streamers = await this.twitchService.listFollowedChannels(userId);
      streamerParam.options = streamers.map((streamer) => ({
        label: streamer.name,
        value: streamer.id,
      }));
    }
    return Promise.resolve();
  }
}
