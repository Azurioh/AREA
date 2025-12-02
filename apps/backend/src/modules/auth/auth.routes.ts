import {
  loginBodyResponseSchema,
  loginBodySchema,
  refreshTokenResponseSchema,
  registerBodyResponseSchema,
  registerBodySchema,
} from '@area/shared/schemas/auth.schema';
import type { FastifyInstance } from 'fastify';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { UsersRepository } from '@/modules/users';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const repository = new UsersRepository(app.mongo.db);
  const service = new AuthService(repository);
  const controller = new AuthController(service);

  app.route({
    method: 'POST',
    url: '/v1/register',
    handler: controller.registerUser.bind(controller),
    schema: {
      summary: 'Register a new user',
      description: 'Returns an array with the users token.',
      tags: ['Auth'],
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
        200: loginBodyResponseSchema,
      },
    },
  });

  app.route({
    method: 'POST',
    url: '/v1/refresh',
    handler: controller.refreshToken.bind(service),
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
