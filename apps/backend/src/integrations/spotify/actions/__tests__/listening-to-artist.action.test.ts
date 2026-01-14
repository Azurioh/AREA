import type { SpotifyService } from '@/modules/spotify';
import { SpotifyListeningToArtistAction } from '../listening-to-artist';

describe('SpotifyListeningToArtist', () => {
  let action: SpotifyListeningToArtistAction;
  let mockSpotifyService: SpotifyService;

  beforeEach(() => {
    mockSpotifyService = {} as unknown as SpotifyService;
    action = new SpotifyListeningToArtistAction(mockSpotifyService);
  });

  it('should be initialized correctly', () => {
    expect(action.name).toBe('listening_to_artist');
    expect(action.params.length).toBeGreaterThan(0);
  });

  it('should refresh params successfully (even if it does nothing)', async () => {
    await expect(action.refreshParams('user-id')).resolves.not.toThrow();
  });
});
