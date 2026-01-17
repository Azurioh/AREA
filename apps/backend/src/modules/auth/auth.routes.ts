import {
  loginResponseSchema,
  loginBodySchema,
  refreshTokenResponseSchema,
  registerBodyResponseSchema,
  registerBodySchema,
  registerHeadersSchema,
  loginWithServiceResponseSchema,
  loginWithServiceQueryStringSchema,
  loginWithServiceParamsSchema,
} from '@area/shared/schemas/auth.schema';
import type { FastifyInstance } from 'fastify';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { UsersRepository, UsersService } from '@/modules/users';
import { ThirdPartiesRepository, ThirdPartiesService } from '@/modules/third-parties';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }
  const thirdPartiesRepository = new ThirdPartiesRepository(app.mongo.db);
  const usersRepository = new UsersRepository(app.mongo.db);

  const usersService = new UsersService(usersRepository);
  const thirdPartiesService = new ThirdPartiesService(thirdPartiesRepository, usersService);
  const service = new AuthService(usersService, thirdPartiesService);
  const controller = new AuthController(service);

  app.route({
    method: 'POST',
    url: '/v1/register',
    handler: controller.registerUser.bind(controller),
    schema: {
      summary: 'Register a new user',
      description: 'Returns an array with the users token.',
      tags: ['Auth'],
      headers: registerHeadersSchema,
      body: registerBodySchema,
      response: {
        201: registerBodyResponseSchema,
      },
    },
  });

  app.route({
    method: 'POST',
    url: '/v1/login',
    handler: controller.loginUser.bind(controller),
    schema: {
      summary: 'Login a user',
      description: 'Returns an array with the users token.',
      tags: ['Auth'],
      body: loginBodySchema,
      response: {
        200: loginResponseSchema,
      },
    },
  });

  app.route({
    method: 'POST',
    url: '/v1/login/:service',
    handler: controller.loginWithService.bind(controller),
    schema: {
      summary: 'Login a user with a third party service',
      description: 'Returns an array with the users token.',
      tags: ['Auth'],
      params: loginWithServiceParamsSchema,
      querystring: loginWithServiceQueryStringSchema,
      response: {
        200: loginWithServiceResponseSchema,
      },
    },
  });

  app.route({
    method: 'POST',
    url: '/v1/refresh',
    handler: controller.refreshToken.bind(controller),
    schema: {
      summary: 'Refresh access token',
      description: 'Generates a new access token using the refresh token.',
      tags: ['Auth'],
      response: {
        200: refreshTokenResponseSchema,
      },
    },
  });
};
