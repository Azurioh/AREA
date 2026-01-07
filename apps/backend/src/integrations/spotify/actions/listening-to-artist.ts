import { Action } from '@/integrations/_definitions/action.interface';
import type { SpotifyService } from '@/modules/spotify';

export class SpotifyListeningToArtist extends Action {
  constructor(_spotifyService: SpotifyService) {
    super(
      'listening_to_artist',
      'Action triggered when a user listen to a specific artist on spotify',
      [
        {
          type: 'input',
          key: 'artist',
          label: 'Arist',
          placeholder: 'Enter the artist name',
        },
      ],
      [
        {
          key: 'artist_name',
          description: 'The name of the artist',
          type: 'string',
          path: 'artist.name',
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
