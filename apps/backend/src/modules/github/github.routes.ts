import {
  githubAuthorizationQueryStringSchema,
  githubAuthorizationResponseSchema,
  listGithubRepositoriesResponseSchema,
} from '@area/shared/schemas/github.schema';
import type { FastifyInstance } from 'fastify';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { UsersRepository, UsersService } from '../users';
import { GithubRepository } from './github.repository';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const repository = new GithubRepository(app.mongo.db);
  const service = new GithubService(repository, new UsersService(new UsersRepository(app.mongo.db)));
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

  app.route({
    method: 'GET',
    url: '/v1/authorize',
    handler: controller.authorizeUser.bind(controller),
    schema: {
      summary: 'Authorize a user to a GitHub account',
      description: 'Link a user GitHub account to its account',
      tags: ['GitHub'],
      querystring: githubAuthorizationQueryStringSchema,
      response: {
        200: githubAuthorizationResponseSchema,
      },
    },
  });
};
