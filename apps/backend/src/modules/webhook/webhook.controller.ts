import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { WebhookService } from '@/modules/webhook';
import ApiError from '@/utils/api-error';
import type {
  DiscordWebhookPayload,
  GithubWebhookPayload,
  SpotifyWebhookPayload,
  DropboxWebhookPayload,
  UnsplashWebhookPayload,
  TwitchWebhookPayload,
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
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Webhook information are missing');
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
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Webhook information are missing');
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
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Webhook information are missing');
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

  /**
   * @function unsplashCallback
   * @description Handles the callback for the unsplash service.
   *
   * @param {FastifyRequest} request The Fastify request object containing the webhook data.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   * @returns {Promise<void>}
   */
  async unsplashCallback(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.headers['x-unsplash-event'] || !request.headers['x-user-id']) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Webhook informations are missing');
    }

    const body = request.body;
    const event = request.headers['x-unsplash-event'] as string;
    const userId = request.headers['x-user-id'] as string;

    this.service.unsplashCallback(userId, event, body as UnsplashWebhookPayload);
    reply.status(HttpStatusCode.NO_CONTENT).send();
  }

  /**
   * @function twitchCallback
   * @description Handles the callback for the twitch service.
   *
   * @param {FastifyRequest} request The Fastify request object containing the webhook data.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   * @returns {Promise<void>}
   */
  async twitchCallback(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (request.body && (request.body as { challenge: string }).challenge) {
      return reply.status(HttpStatusCode.OK).send((request.body as { challenge: string }).challenge);
    }

    if (!request.headers['twitch-eventsub-subscription-type']) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Webhook information are missing');
    }

    const body = request.body;
    const event = request.headers['twitch-eventsub-subscription-type'] as string;

    this.service.twitchCallback(event, body as TwitchWebhookPayload);
    reply.status(HttpStatusCode.NO_CONTENT).send();
  }
}
