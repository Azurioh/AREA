import type { Service } from '@/integrations/_definitions/service.interface';
import type { SpotifyService } from '@/modules/spotify';

export const createSpotifyService = (_spotifyService: SpotifyService): Service => {
  return {
    name: 'Spotify',
    actions: [],
    reactions: [],
  };
};
