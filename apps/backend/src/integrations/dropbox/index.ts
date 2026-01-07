import type { Service } from '@/integrations/_definitions/service.interface';

export const createDropboxService = (): Service => {
  return {
    name: 'Dropbox',
    actions: [],
    reactions: [],
  };
};
