import { Action } from '@/integrations/_definitions/action.interface';
import type { TwitchService } from '@/modules/twitch/twitch.service';

export class TwitchNewFollowerAction extends Action {
  constructor(_twitchService: TwitchService) {
    super(
      'new_follower',
      'Action triggered when a user get a new follower',
      [],
      [
        {
          key: 'followerName',
          description: 'The name of the follower',
          type: 'string',
          path: 'event.user_name',
        },
      ],
    );
  }

  /**
   * @function refreshParams
   * @description Refresh the parameters of the action
   *
   * @param {string} userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  override async refreshParams(_userId: string): Promise<void> {
    return Promise.resolve();
  }
}
