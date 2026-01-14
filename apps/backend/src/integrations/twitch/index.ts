import type { Service } from '@/integrations/_definitions/service.interface';
import * as actions from './actions';
import type { TwitchService } from '@/modules/twitch/twitch.service';

export const createTwitchService = (twitchService: TwitchService): Service => {
  return {
    name: 'Twitch',
    actions: Object.values(actions).map((Action) => new Action(twitchService)),
    reactions: [],
  };
};
