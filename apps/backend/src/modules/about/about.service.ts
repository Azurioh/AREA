import type { AboutServiceType } from '@area/shared/types/about.types';
import { ServiceManager } from '@/integrations';

/**
 * @class AboutService
 * @description Service responsible for providing "About" information of the application, including current server time and available services.
 */
export class AboutService {
  /**
   * @function getCurrentTime
   * @description Retrieves the current server time in milliseconds since the Unix epoch.
   *
   * @returns {number} The current server time.
   */
  getCurrentTime(): number {
    return Date.now();
  }

  /**
   * @function getServices
   * @description Retrieves a list of all available services along with their actions and reactions.
   *
   * @returns {AboutServiceType} An array of services with their details.
   */
  getServices(): AboutServiceType {
    const services = ServiceManager.instance.getAll();

    return services.map((service) => ({
      name: service.name,
      actions: service.actions.map((action) => ({ name: action.name, description: action.description })),
      reactions: service.reactions.map((reaction) => ({ name: reaction.name, description: reaction.description })),
    }));
  }
}
