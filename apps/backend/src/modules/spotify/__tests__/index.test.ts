import { SpotifyService as SpotifyServiceFromIndex } from '../index';
import { SpotifyService } from '../spotify.service';

describe('Spotify Module Index', () => {
  it('should export SpotifyService', () => {
    expect(SpotifyServiceFromIndex).toBe(SpotifyService);
  });
});
