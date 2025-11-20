import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { Webhook } from '@area/shared/types/webhook.types';
import type { Db, WithId } from 'mongodb';
import ApiError from '@/utils/api-error';

/**
 * @class WebhookRepository
 * @description Repository for managing webhooks in the database.
 */
export class WebhookRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * @function listWebhooks
   * @description Retrieves all webhooks from the database.
   *
   * @returns {Promise<WithId<Webhook>[]>} Array of webhooks.
   */
  async listWebhooks(): Promise<WithId<Webhook>[]> {
    return this.db.collection<Webhook>('webhooks').find().toArray();
  }

  /**
   * @function createWebhook
   * @description Creates a new webhook in the database.
   *
   * @param data The webhook data to be inserted.
   * @returns The created webhook data.
   */
  async createWebhook(data: Webhook): Promise<void> {
    const { acknowledged } = await this.db.collection<Webhook>('webhooks').insertOne(data);

    if (!acknowledged) {
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        'Failed to create webhook, please contact an administrator.',
      );
    }
  }

  /**
   * @function getWebhookByUuid
   * @description Retrieves a webhook by its UUID.
   *
   * @param uuid The UUID of the webhook to retrieve.
   * @returns The webhook data.
   */
  async getWebhookByUuid(uuid: string): Promise<WithId<Webhook>> {
    const webhook = await this.db.collection<Webhook>('webhooks').findOne({ uuid });

    if (!webhook) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Webhook not found.');
    }
    return webhook;
  }

  /**
   * @function deleteWebhook
   * @description Deletes a webhook by its UUID.
   *
   * @param uuid The UUID of the webhook to delete.
   */
  async deleteWebhook(uuid: string): Promise<void> {
    const { deletedCount } = await this.db.collection<Webhook>('webhooks').deleteOne({ uuid });

    if (deletedCount === 0) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Webhook not found.');
    }
  }
}
