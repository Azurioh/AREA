import { Reaction } from '@/integrations/_definitions/reaction.interface';
import type { SpotifyService } from '@/modules/spotify';

/**
 * @class SpotifySaveEpisode
 * @description The reaction to save an episode on spotify
 */
export class SpotifySaveEpisode extends Reaction {
  constructor(_spotifyService: SpotifyService) {
    super('save_episode', 'Save an episode', [
      {
        type: 'input',
        key: 'episode',
        label: 'Episode',
        placeholder: 'Enter the title of the episode',
      },
    ]);
  }

  /**
   * @function refreshParams
   * @description Refresh the parameters of the reaction
   *
   * @param {string} userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  override async refreshParams(_userId: string): Promise<void> {
    return Promise.resolve();
  }
}
