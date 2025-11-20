import type { FastifyReply, FastifyRequest } from 'fastify';
import type { GithubService } from '@/services/github.service';

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
}
