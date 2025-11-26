import type { FastifyReply, FastifyRequest } from 'fastify';
import type { GithubService } from './github.service';
import { GitHubAuthenticationQueryString } from '@/types/github';
import { HttpStatusCode } from '@area/shared/enums/http-status';

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
   * @function listRepositories
   * @description Handles listing all repositories.
   *
   * @param {FastifyRequest} _ The Fastify request object.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   */
  async authenticateUser(request: FastifyRequest<{Querystring: GitHubAuthenticationQueryString}>, reply: FastifyReply): Promise<void> {
    const query = request.query;
    await this.service.authenticateUser(query.code, query.state);

    reply.status(HttpStatusCode.NO_CONTENT).send();
  }
}
