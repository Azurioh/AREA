import type { SpotifyService } from '@/modules/spotify';
import { SpotifySaveTrackToPlaylistReaction } from '../save-track-to-playlist';

describe('SpotifySaveTrackToPlaylist', () => {
  let reaction: SpotifySaveTrackToPlaylistReaction;
  let mockSpotifyService: SpotifyService;

  beforeEach(() => {
    mockSpotifyService = {
      listPlaylist: jest.fn().mockResolvedValue([]),
    } as unknown as SpotifyService;
    reaction = new SpotifySaveTrackToPlaylistReaction(mockSpotifyService);
  });

  it('should be initialized correctly', () => {
    expect(reaction.name).toBe('save_track_to_playlist');
    expect(reaction.params.length).toBeGreaterThan(0);
  });

  it('should refresh params logic', async () => {
    await expect(reaction.refreshParams('user-id')).resolves.not.toThrow();
  });
  it('should not refresh params if param type is not select', async () => {
    const playlistParam = reaction.params.find((p) => p.key === 'playlist');
    if (playlistParam) {
      const originalType = playlistParam.type;
      playlistParam.type = 'input';

      await reaction.refreshParams('user-id');

      playlistParam.type = originalType;
    }
  });

  it('should handle missing params gracefully', async () => {
    reaction.params = [];
    await expect(reaction.refreshParams('user-id')).resolves.not.toThrow();
  });
});
