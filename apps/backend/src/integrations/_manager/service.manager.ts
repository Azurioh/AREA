import type { Service } from '@/integrations/_definitions/service.interface';

/**
 * @class ServiceManager
 * @description Gestionnaire des services
 */
class ServiceManager {
  private services: Map<string, Service> = new Map();

  /**
   * @function register
   * @description Ajoute un service à la liste
   *
   * @param {Service} service Le service à ajouter
   * @returns {void} Nothing
   */
  register(service: Service): void {
    this.services.set(service.name, service);
  }

  /**
   * @function get
   * @description Récupère un service par son nom
   *
   * @param {string} serviceName Le nom du service
   * @returns {Service | undefined} Le service trouvé, ou undefined si non trouvé
   */
  get(serviceName: string): Service | undefined {
    return this.services.get(serviceName);
  }

  /**
   * @function getAll
   * @description Récupère tous les services
   *
   * @returns {Service[]} Tous les services
   */
  getAll(): Service[] {
    return Array.from(this.services.values());
  }
}

const serviceManager = new ServiceManager();

export default serviceManager;
