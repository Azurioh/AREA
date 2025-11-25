import type {
  CreateWebhookBody,
  DeleteWebhookParams,
  GetWebhookByUuidParams,
} from '@area/shared/schemas/webhook.schema';
import type { Webhook } from '@area/shared/types/webhook.types';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { GithubService } from '@/modules/github';
import type { WebhookService } from '@/modules/webhook';

/**
 * @class WebhookController
 * @description Controller for handling webhook-related HTTP requests.
 */
export class WebhookController {
  private service: WebhookService;
  private githubService: GithubService;

  constructor(service: WebhookService, githubService: GithubService) {
    this.service = service;
    this.githubService = githubService;
  }

  /**
   * @function listWebhooks
   * @description Handles listing all webhooks.
   *
   * @param {FastifyRequest} _ The Fastify request object.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   * @returns {Promise<void>}
   */
  async listWebhooks(_: FastifyRequest, reply: FastifyReply): Promise<void> {
    const webhooks = await this.service.listWebhooks();

    reply.status(200).send(webhooks);
  }

  /**
   * @function createWebhook
   * @description Handles the creation of a new webhook.
   *
   * @param {FastifyRequest} request The Fastify request object containing the webhook data.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   * @returns {Promise<void>}
   */
  async createWebhook(request: FastifyRequest<{ Body: CreateWebhookBody }>, reply: FastifyReply): Promise<void> {
    const body = request.body;

    await this.githubService.createWebhookOnRepository(body.githubUrl, body.actions, body.discordWebhookUrl);

    const data: Webhook = {
      ...body,
      uuid: this.service.generateUuid(),
    };

    await this.service.createWebhook(data);

    reply.status(201).send({ data });
  }

  /**
   * @function getWebhookByUuid
   * @description Handles retrieving a webhook by its UUID.
   *
   * @param {FastifyRequest} request The Fastify request object containing the UUID parameter.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   * @returns {Promise<void>}
   */
  async getWebhookByUuid(
    request: FastifyRequest<{ Params: GetWebhookByUuidParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { uuid } = request.params;

    const webhook = await this.service.getWebhookByUuid(uuid);

    reply.status(200).send(webhook);
  }

  /**
   * @function deleteWebhook
   * @description Handles deleting a webhook by its UUID.
   *
   * @param {FastifyRequest} request The Fastify request object containing the UUID parameter.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   * @returns {Promise<void>}
   */
  async deleteWebhook(request: FastifyRequest<{ Params: DeleteWebhookParams }>, reply: FastifyReply): Promise<void> {
    const { uuid } = request.params;

    await this.service.deleteWebhook(uuid);

    reply.status(204).send();
  }
}
