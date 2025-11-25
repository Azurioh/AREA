import { listGithubRepositoriesResponseSchema } from '@area/shared/schemas/github.schema';
import type { FastifyInstance } from 'fastify';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

export default async (app: FastifyInstance) => {
  const service = new GithubService();
  const controller = new GithubController(service);

  app.route({
    method: 'GET',
    url: '/v1/repositories',
    handler: controller.listRepositories.bind(controller),
    schema: {
      summary: 'List all repositories',
      description: 'Returns an array of repository names.',
      tags: ['GitHub'],
      response: {
        200: listGithubRepositoriesResponseSchema,
      },
    },
  });
};
