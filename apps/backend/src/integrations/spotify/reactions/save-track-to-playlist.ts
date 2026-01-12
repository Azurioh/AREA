import { Reaction } from '@/integrations/_definitions/reaction.interface';
import type { SpotifyService } from '@/modules/spotify';

/**
 * @class SpotifySaveTrackToPlaylistReaction
 * @description The reaction to save a track to a spotify playlist
 */
export class SpotifySaveTrackToPlaylistReaction extends Reaction {
  private spotifyService: SpotifyService;

  constructor(spotifyService: SpotifyService) {
    super('save_track_to_playlist', 'Save a track to a playlist', [
      {
        type: 'select',
        key: 'playlist',
        label: 'Playlist',
        placeholder: 'Select a playlist',
        options: [],
      },
      {
        type: 'input',
        key: 'track',
        label: 'Track',
        placeholder: 'Enter the title of the track',
      },
    ]);
    this.spotifyService = spotifyService;
  }

  /**
   * @function refreshParams
   * @description Refresh the parameters of the reaction
   *
   * @param {string} userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  override async refreshParams(_userId: string): Promise<void> {
    const repositortyParam = this.params[0];

    this.spotifyService;
    if (repositortyParam?.type === 'select') {
      //   repositortyParam.options = await this.spotifyService.listRepositories(userId);
    }
    return Promise.resolve();
  }
}
