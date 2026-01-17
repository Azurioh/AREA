import {
  type GetThirdPartyAuthorizationUrlParams,
  type GetThirdPartyStatusParams,
  getThirdPartyAuthorizationUrlParamsSchema,
  getThirdPartyAuthorizationUrlResponseSchema,
  getThirdPartyStatusParamsSchema,
  getThirdPartyStatusResponseSchema,
  thirdPartyAuthorizationParamsSchema,
  thirdPartyAuthorizationQueryStringSchema,
  thirdPartyAuthorizationResponseSchema,
} from '@area/shared/schemas/third-parties.schema';
import type { FastifyInstance } from 'fastify';
import { verifyUserAccess } from '@/middlewares/auth';
import { ThirdPartiesController, ThirdPartiesRepository, ThirdPartiesService } from '@/modules/third-parties';
import { UsersRepository, UsersService } from '@/modules/users';

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
    url: '/v1/authorization-url/:service/service',
    schema: {
      summary: 'Get the authorization url to connect to a third party service',
      description: 'Returns the authentication url for the specified third party service',
      tags: ['Third parties'],
      params: getThirdPartyAuthorizationUrlParamsSchema,
      response: {
        200: getThirdPartyAuthorizationUrlResponseSchema,
      },
    },
    preHandler: [verifyUserAccess(usersService)],
    handler: controller.getThirdPartyAuthorizationUrlService.bind(controller),
  });

  app.route<{ Params: GetThirdPartyAuthorizationUrlParams }>({
    method: 'GET',
    url: '/v1/authorization-url/:service/app',
    schema: {
      summary: 'Get the authorization url to connect to the app via a third party service',
      description: 'Returns the authentication url for the specified third party service',
      tags: ['Third parties'],
      params: getThirdPartyAuthorizationUrlParamsSchema,
      response: {
        200: getThirdPartyAuthorizationUrlResponseSchema,
      },
    },
    handler: controller.getThirdPartyAuthorizationUrlApp.bind(controller),
  });

  app.route({
    method: 'GET',
    url: '/v1/authorize/:service',
    handler: controller.authorizeTo.bind(controller),
    schema: {
      summary: 'Authorize a user to a service or the app',
      description: 'Link a user account to a service account',
      tags: ['Third parties'],
      params: thirdPartyAuthorizationParamsSchema,
      querystring: thirdPartyAuthorizationQueryStringSchema,
      response: {
        200: thirdPartyAuthorizationResponseSchema,
      },
    },
  });

  app.route<{ Params: GetThirdPartyStatusParams }>({
    method: 'GET',
    url: '/v1/status/:service',
    schema: {
      summary: 'Return the status of a user regarding a service',
      description: 'Return if the user is connected to the service or no',
      tags: ['Third parties'],
      params: getThirdPartyStatusParamsSchema,
      response: {
        200: getThirdPartyStatusResponseSchema,
      },
    },
    preHandler: [verifyUserAccess(usersService)],
    handler: controller.getThirdPartyStatus.bind(controller),
  });
};
