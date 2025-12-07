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
    const status = { code: HttpStatusCode.BAD_REQUEST, text: 'error' };
    let callbackUrl = environment.WEB_OAUTH_CALLBACK_URL;

    if (query.code) {
      const clientType = await this.service.authorizeUser(query.code, query.state);

      if (clientType) {
        if (clientType === 'mobile') {
          callbackUrl = environment.MOBILE_OAUTH_CALLBACK_URL;
        }
        status.code = HttpStatusCode.NO_CONTENT;
        status.text = 'success';
      }
    }
    reply.redirect(`${callbackUrl}?status=${status.text}`);
    reply.status(status.code).send();
  }
}
