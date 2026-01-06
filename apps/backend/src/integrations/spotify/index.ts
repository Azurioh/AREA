import type { Service } from '@/integrations/_definitions/service.interface';
import * as actions from './actions';
import * as reactions from './reactions';
import type { SpotifyService } from '@/modules/spotify';

export const createSpotifyService = (spotifyService: SpotifyService): Service => {
  return {
    name: 'Spotify',
    actions: Object.values(actions).map((Action) => new Action(spotifyService)),
    reactions: Object.values(reactions).map((Reaction) => new Reaction(spotifyService)),
  };
};
