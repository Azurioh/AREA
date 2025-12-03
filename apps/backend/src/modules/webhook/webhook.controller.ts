import type { FastifyReply, FastifyRequest } from 'fastify';
import type { WebhookService } from '@/modules/webhook';
import { HttpStatusCode } from '@area/shared/enums/http-status';
import ApiError from '@/utils/api-error';
import { GithubWebhookPayload } from '@/types/webhook';

/**
 * @class WebhookController
 * @description Controller for handling webhook-related HTTP requests.
 */
export class WebhookController {
  private service: WebhookService;

  constructor(service: WebhookService) {
    this.service = service;
  }

  /**
   * @function createWebhook
   * @description Handles the creation of a new webhook.
   *
   * @param {FastifyRequest} request The Fastify request object containing the webhook data.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   * @returns {Promise<void>}
   */
  async githubCallback(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.headers['x-github-event']) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Webhook informations are missing');
    }

    const body = request.body;
    const event = request.headers['x-github-event'] as string;

    this.service.githubCallback(event, body as GithubWebhookPayload);
    reply.status(HttpStatusCode.NO_CONTENT).send();
  }
}
