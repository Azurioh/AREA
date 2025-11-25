import type { Webhook } from '@area/shared/types/webhook.types';
import type { WithId } from 'mongodb';
import { v4 } from 'uuid';
import type { WebhookRepository } from './webhook.repository';

/**
 * @class WebhookService
 * @description Service for managing webhooks.
 */
export class WebhookService {
  private repository: WebhookRepository;

  constructor(repository: WebhookRepository) {
    this.repository = repository;
  }

  /**
   * @function generateUuid
   * @description Generates a new UUID for a webhook.
   *
   * @returns {string} A newly generated UUID string.
   */
  generateUuid(): string {
    return v4();
  }

  /**
   * @function listWebhooks
   * @description Retrieves all webhooks from the database.
   *
   * @returns {Promise<WithId<Webhook>[]>} Array of webhooks.
   */
  async listWebhooks(): Promise<WithId<Webhook>[]> {
    return this.repository.listWebhooks();
  }

  /**
   * @function createWebhook
   * @description Creates a new webhook.
   *
   * @param {Webhook} data The webhook data to be created.
   */
  async createWebhook(data: Webhook): Promise<void> {
    return this.repository.createWebhook(data);
  }

  /**
   * @function getWebhookByUuid
   * @description Retrieves a webhook by its UUID.
   *
   * @param {string} uuid The UUID of the webhook to retrieve.
   * @returns The webhook data.
   */
  async getWebhookByUuid(uuid: string): Promise<Webhook> {
    return this.repository.getWebhookByUuid(uuid);
  }

  /**
   * @function deleteWebhook
   * @description Deletes a webhook by its UUID.
   *
   * @param {string} uuid The UUID of the webhook to delete.
   */
  async deleteWebhook(uuid: string): Promise<void> {
    return this.repository.deleteWebhook(uuid);
  }
}
