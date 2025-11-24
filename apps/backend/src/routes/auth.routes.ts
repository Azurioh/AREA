import type { FastifyInstance } from 'fastify';
import { AuthController } from '@/controllers/auth.controller';
import { AuthService } from '@/services/auth.service';
import { UserRepository } from '@/repositories/user.repository';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const repository = new UserRepository(app.mongo.db);
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
      response: {
        201: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' }
          }
        },
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
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' }
          }
        },
      },
    },
  });
};
