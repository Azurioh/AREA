import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { DiscordAuthorizationQueryString } from '@/types/discord';
import { environment } from '@/utils/environment';
import type { DiscordService } from './discord.service';

/**
 * @class DiscordController
 * @description Controller for handling Discord-related HTTP requests.
 */
export class DiscordController {
  private service: DiscordService;

  constructor(service: DiscordService) {
    this.service = service;
  }

  /**
   * @function authorizeUser
   * @description Authorize a user to its github account.
   *
   * @param {FastifyRequest} request The Fastify request object.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   */
  async authorizeUser(
    request: FastifyRequest<{ Querystring: DiscordAuthorizationQueryString }>,
    reply: FastifyReply,
  ): Promise<void> {
    const query = request.query;

    if (!query.code || !(await this.service.authorizeUser(query.code, query.state))) {
      reply.redirect(`${environment.FRONTEND_AUTHORIZE_CALLBACK_URL}?error=true`);
      return reply.status(HttpStatusCode.BAD_REQUEST).send();
    }

    reply.redirect(`${environment.FRONTEND_AUTHORIZE_CALLBACK_URL}`);
    reply.status(HttpStatusCode.NO_CONTENT).send();
  }
}
