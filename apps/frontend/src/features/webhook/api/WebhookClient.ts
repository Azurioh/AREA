import type { CreateWebhookBody, Webhook } from '@area/shared/types/webhook.types';
import { ApiClient } from '@/lib/ApiClient';

/**
 * @class WebhookClient
 * @description Webhook service
 */
export class WebhookClient extends ApiClient {
  /**
   * @function listWebhooks
   * @description List webhooks
   *
   * @returns {Promise<Webhook[]>} The list of webhooks
   */
  async listWebhooks(): Promise<Webhook[]> {
    const response = await this.fetch<Webhook[]>('/v1', {
      method: 'GET',
      skipAuth: true,
    });

    return response;
  }

  /**
   * @function createWebhook
   * @description Create a webhook
   *
   * @param {CreateWebhookBody} webhook - The webhook to create
   *
   * @returns {Promise<{ message: string }>} The response from the server
   */
  async createWebhook(webhook: CreateWebhookBody): Promise<{ message: string }> {
    const response = await this.fetch<{ message: string }>(`/v1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhook),
      skipAuth: true,
    });

    return response;
  }
}
