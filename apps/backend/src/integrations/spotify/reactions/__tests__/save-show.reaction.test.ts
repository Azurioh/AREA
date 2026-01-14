import type { SpotifyService } from '@/modules/spotify';
import { SpotifySaveShowReaction } from '../save-show';

describe('SpotifySaveShow', () => {
  let reaction: SpotifySaveShowReaction;
  let mockSpotifyService: SpotifyService;

  beforeEach(() => {
    mockSpotifyService = {} as unknown as SpotifyService;
    reaction = new SpotifySaveShowReaction(mockSpotifyService);
  });

  it('should be initialized correctly', () => {
    expect(reaction.name).toBe('save_show');
    expect(reaction.params.length).toBeGreaterThan(0);
  });

  it('should refresh params successfully', async () => {
    await expect(reaction.refreshParams('user-id')).resolves.not.toThrow();
  });
});
