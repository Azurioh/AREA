import type { FastifyReply, FastifyRequest } from 'fastify';
import type { WebhookService } from '@/modules/webhook';
import { HttpStatusCode } from '@area/shared/enums/http-status';
import ApiError from '@/utils/api-error';
import type {
  DiscordWebhookPayload,
  DropboxWebhookPayload,
  GithubWebhookPayload,
  SpotifyWebhookPayload,
} from '@/types/webhook';

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
   * @function githubCallback
   * @description Handles the callback for the github service.
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

  /**
   * @function discordCallback
   * @description Handles the callback for the discord service.
   *
   * @param {FastifyRequest} request The Fastify request object containing the webhook data.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   * @returns {Promise<void>}
   */
  async discordCallback(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.headers['x-discord-event']) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Webhook informations are missing');
    }

    const body = request.body;
    const event = request.headers['x-discord-event'] as string;

    this.service.discordCallback(event, body as DiscordWebhookPayload);
    reply.status(HttpStatusCode.NO_CONTENT).send();
  }

  /**
   * @function spotifyCallback
   * @description Handles the callback for the spotify service.
   *
   * @param {FastifyRequest} request The Fastify request object containing the webhook data.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   * @returns {Promise<void>}
   */
  async spotifyCallback(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.headers['x-spotify-event']) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Webhook informations are missing');
    }

    const body = request.body;
    const event = request.headers['x-spotify-event'] as string;

    this.service.spotifyCallback(event, body as SpotifyWebhookPayload);
    reply.status(HttpStatusCode.NO_CONTENT).send();
  }

  /**
   * @function dropboxWebhookValidator
   * @description Handles the callback for dropbox webhook validator.
   *
   * @param {FastifyRequest} request The Fastify request object containing the webhook data.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   * @returns {Promise<void>}
   */
  async dropboxWebhookValidator(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    reply.status(HttpStatusCode.OK).send((request.query as { challenge: string }).challenge);
  }

  /**
   * @function dropboxCallback
   * @description Handles the callback for the dropbox service.
   *
   * @param {FastifyRequest} request The Fastify request object containing the webhook data.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   * @returns {Promise<void>}
   */
  async dropboxCallback(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body = request.body;

    this.service.dropboxCallback(body as DropboxWebhookPayload);
    reply.status(HttpStatusCode.OK).send();
  }
}
