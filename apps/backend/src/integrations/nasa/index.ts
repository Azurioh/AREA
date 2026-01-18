import type { Service } from '@/integrations/_definitions/service.interface';
import * as actions from './actions';

export const createNasaService = (): Service => {
  return {
    name: 'Nasa',
    actions: Object.values(actions).map((Action) => new Action()),
    reactions: [],
  };
};
