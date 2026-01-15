import type { SpotifyService } from '@/modules/spotify';
import { createSpotifyService } from '../index';

describe('createSpotifyService', () => {
  let mockSpotifyService: SpotifyService;

  beforeEach(() => {
    mockSpotifyService = {} as unknown as SpotifyService;
  });

  it('should create a service with correct name and components', () => {
    const service = createSpotifyService(mockSpotifyService);

    expect(service.name).toBe('Spotify');
    expect(service.actions.length).toBeGreaterThanOrEqual(0);
    expect(service.reactions.length).toBeGreaterThanOrEqual(0);
  });
});
