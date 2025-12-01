import type { AboutServiceType } from '@area/shared/types/about.types';
import { serviceManager } from '@/integrations';

export class AboutService {
  getCurrentTime(): number {
    return Date.now();
  }

  getServices(): AboutServiceType {
    const services = serviceManager.getAll();

    return services.map((service) => ({
      name: service.name,
      actions: service.actions.map((action) => ({ name: action.name, description: action.description })),
      reactions: service.reactions.map((reaction) => ({ name: reaction.name, description: reaction.description })),
    }));
  }
}
