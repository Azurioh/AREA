import { Reaction } from '@/integrations/_definitions/reaction.interface';
import type { SpotifyService } from '@/modules/spotify';

/**
 * @class SpotifySaveShow
 * @description The reaction to save a show on spotify
 */
export class SpotifySaveShow extends Reaction {
  constructor(_spotifyService: SpotifyService) {
    super('save_show', 'Save a show', [
      {
        type: 'input',
        key: 'show',
        label: 'Show',
        placeholder: 'Enter the title of the show',
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
