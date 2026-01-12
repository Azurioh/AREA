import type { Service } from '@/integrations/_definitions/service.interface';
import * as actions from './actions';

export const createDropboxService = (): Service => {
  return {
    name: 'Dropbox',
    actions: Object.values(actions).map((Action) => new Action()),
    reactions: [],
  };
};
