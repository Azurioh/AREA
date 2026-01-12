import type { Service } from '@/integrations/_definitions/service.interface';
import * as actions from './actions';

export const createUnsplashService = (): Service => {
  return {
    name: 'Unsplash',
    actions: Object.values(actions).map((Action) => new Action()),
    reactions: [],
  };
};
