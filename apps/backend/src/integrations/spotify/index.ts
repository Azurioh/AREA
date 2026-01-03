import type { Service } from '@/integrations/_definitions/service.interface';
import * as reactions from './reactions';
import type { SpotifyService } from '@/modules/spotify';

export const createSpotifyService = (spotifyService: SpotifyService): Service => {
  return {
    name: 'Spotify',
    actions: [],
    reactions: Object.values(reactions).map((Reaction) => new Reaction(spotifyService)),
  };
};
