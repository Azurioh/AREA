import { SpotifySaveEpisodeReaction } from '../save-episode';

describe('SpotifySaveEpisode', () => {
  let reaction: SpotifySaveEpisodeReaction;
  let mockSpotifyService: SpotifyService;

  beforeEach(() => {
    mockSpotifyService = {} as unknown as SpotifyService;
    reaction = new SpotifySaveEpisodeReaction(mockSpotifyService);
  });

  it('should be initialized correctly', () => {
    expect(reaction.name).toBe('save_episode');
    expect(reaction.params.length).toBeGreaterThan(0);
  });

  it('should refresh params successfully', async () => {
    await expect(reaction.refreshParams('user-id')).resolves.not.toThrow();
  });
});
