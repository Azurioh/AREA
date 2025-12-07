import type { Service } from '@/integrations/_definitions/service.interface';
import * as actions from './actions';
import * as reactions from './reactions';
import type { DiscordService } from '@/modules/discord';

export const createDiscordService = (discordService: DiscordService): Service => {
  return {
    name: 'Discord',
    actions: Object.values(actions).map((Action) => new Action(discordService)),
    reactions: Object.values(reactions).map((Reaction) => new Reaction(discordService)),
  };
};
