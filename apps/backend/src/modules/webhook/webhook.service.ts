import type { Webhook } from '@area/shared/types/webhook.types';
import type { WithId } from 'mongodb';
import { v4 } from 'uuid';
import type { WebhookRepository } from './webhook.repository';
import type { DiscordWebhookPayload, GithubWebhookPayload } from '@/types/webhook';
import type { ActionPayload } from '@/types/action-reaction';
import type { ActionsReactionsService } from '@/modules/actions-reactions';

/**
 * @class WebhookService
 * @description Service for managing webhooks.
 */
export class WebhookService {
  private repository: WebhookRepository;
  private actionsReactionsService: ActionsReactionsService;

  constructor(repository: WebhookRepository, actionsReactionsService: ActionsReactionsService) {
    this.repository = repository;
    this.actionsReactionsService = actionsReactionsService;
  }

  /**
   * @function githubCallback
   * @description Handle the github callback.
   *
   * @param {string} event The event who triggered the callback.
   * @param {GithubWebhookPayload} body The body of the callback.
   */
  async githubCallback(event: string, body: GithubWebhookPayload): Promise<void> {
    const action: ActionPayload = {
      service: 'github',
      trigger: `${event}/${body.repository.id}`,
    };

    this.actionsReactionsService.handleReactions(action);
  }

  /**
   * @function discordCallback
   * @description Handle the discord callback.
   *
   * @param {string} event The event who triggered the callback.
   * @param {DiscordWebhookPayload} body The body of the callback.
   */
  async discordCallback(event: string, body: DiscordWebhookPayload): Promise<void> {
    const action: ActionPayload = {
      service: 'discord',
      trigger: `${event}/${body.channelId}`,
    };

    this.actionsReactionsService.handleReactions(action);
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
