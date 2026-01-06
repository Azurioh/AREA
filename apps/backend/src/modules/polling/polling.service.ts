import type { Polling, ServiceToPoll } from '@/types/polling';
import type { PollingRepository } from './polling.repository';

/**
 * @class PollingService
 * @description The polling repository.
 */
export class PollingService {
  private repository: PollingRepository;

  constructor(repository: PollingRepository) {
    this.repository = repository;
  }

  /**
   * @function addUserToPoll
   * @description Add a user that will be polled
   *
   * @param {Polling} data The polling to add
   * @returns {Promise<void>} Nothing
   */
  async addUserToPoll(data: Polling): Promise<void> {
    await this.repository.addUserToPoll(data);
  }

  /**
   * @function getUsersToPoll
   * @description Get the users to poll
   *
   * @param {ServiceToPoll} service The service polling
   * @param {string[]} type The type of the polling
   * @returns {Promise<Polling[]>} If the user to poll was added
   */
  async getUsersToPoll(service: ServiceToPoll, type: string[]): Promise<Polling[]> {
    return await this.repository.getUsersToPoll(service, type);
  }
}
