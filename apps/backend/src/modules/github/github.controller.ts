import type { FastifyReply, FastifyRequest } from 'fastify';
import type { GithubService } from './github.service';
import { GitHubAuthorizationQueryString } from '@/types/github';
import { HttpStatusCode } from '@area/shared/enums/http-status';
import { environment } from '@/utils/environment';

/**
 * @class GithubController
 * @description Controller for handling GitHub-related HTTP requests.
 */
export class GithubController {
  private service: GithubService;

  constructor(service: GithubService) {
    this.service = service;
  }

  /**
   * @function listRepositories
   * @description Handles listing all repositories.
   *
   * @param {FastifyRequest} _ The Fastify request object.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   */
  async listRepositories(_: FastifyRequest, reply: FastifyReply): Promise<void> {
    const repositories = await this.service.listRepositories();

    reply.status(200).send(repositories);
  }

  /**
   * @function authorizeUser
   * @description Authorize a user to its github account.
   *
   * @param {FastifyRequest} request The Fastify request object.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   */
  async authorizeUser(request: FastifyRequest<{Querystring: GitHubAuthorizationQueryString}>, reply: FastifyReply): Promise<void> {
    const query = request.query;

    if (!query.code || !await this.service.authorizeUser(query.code, query.state)) {
      reply.redirect(`${environment.FRONTEND_AUTHORIZE_CALLBACK_URL}?error=true`);
      return reply.status(HttpStatusCode.BAD_REQUEST).send();
    }

    reply.redirect(`${environment.FRONTEND_AUTHORIZE_CALLBACK_URL}`);
    reply.status(HttpStatusCode.NO_CONTENT).send();
  }
}
