import type { Service } from '@/integrations/_definitions/service.interface';
import type { XService } from '@/modules/x';

export const createXService = (_xService: XService): Service => {
  return {
    name: 'X',
    actions: [],
    reactions: [],
  };
};
