import type { FastifyInstance } from 'fastify';
import { verifyUserAccess } from '@/middlewares/auth';
import { ThirdPartiesService } from '../third-parties';
import { ThirdPartiesController } from './third-parties.controller';
import {
  type GetThirdPartyAuthorizationUrlParams,
  getThirdPartyAuthorizationUrlParamsSchema,
  getThirdPartyAuthorizationUrlResponseSchema,
  thirdPartyAuthorizationParamsSchema,
  thirdPartyAuthorizationQueryStringSchema,
  thirdPartyAuthorizationResponseSchema,
} from '@area/shared/schemas/third-parties.schema';
import { UsersRepository, UsersService } from '../users';
import { ThirdPartiesRepository } from './third-parties.repository';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const usersRepository = new UsersRepository(app.mongo.db);
  const usersService = new UsersService(usersRepository);

  const repository = new ThirdPartiesRepository(app.mongo.db);
  const service = new ThirdPartiesService(repository, usersService);
  const controller = new ThirdPartiesController(service);

  app.route<{ Params: GetThirdPartyAuthorizationUrlParams }>({
    method: 'GET',
    url: '/v1/authorization-url/:provider',
    schema: {
      summary: 'Get the authorization url for a third pary service',
      description: 'Returns the authentication url for the specified third party service',
      tags: ['Third parties'],
      params: getThirdPartyAuthorizationUrlParamsSchema,
      response: {
        200: getThirdPartyAuthorizationUrlResponseSchema,
      },
    },
    preHandler: [verifyUserAccess(usersService)],
    handler: controller.getThirdPartyAuthorizationUrl.bind(controller),
  });

  app.route({
    method: 'GET',
    url: '/v1/authorize/:service',
    handler: controller.authorizeToService.bind(controller),
    schema: {
      summary: 'Authorize a user to a service',
      description: 'Link a user account to a service account',
      tags: ['Third parties'],
      params: thirdPartyAuthorizationParamsSchema,
      querystring: thirdPartyAuthorizationQueryStringSchema,
      response: {
        200: thirdPartyAuthorizationResponseSchema,
      },
    },
  });
};
