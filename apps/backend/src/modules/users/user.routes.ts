import {
  deleteUserByIdParamsSchema,
  deleteUserByIdResponseSchema,
  deleteUserMeResponseSchema,
  getUserByIdParamsSchema,
  getUserByIdResponseSchema,
  getUserMeResponseSchema,
  updateUserByIdBodySchema,
  updateUserByIdParamsSchema,
  updateUserByIdResponseSchema,
  updateUserMeBodySchema,
  updateUserMeResponseSchema,
} from '@area/shared/schemas/user.schema';
import type { FastifyInstance } from 'fastify';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const repository = new UsersRepository(app.mongo.db);
  const service = new UsersService(repository);
  const controller = new UsersController(service);

  app.route({
    method: 'GET',
    url: '/v1/me',
    schema: {
      summary: 'Get current user informations',
      description: 'Returns the current user informations.',
      tags: ['Users'],
      response: {
        200: getUserMeResponseSchema,
      },
    },
    handler: controller.getUserMe.bind(controller),
  });

  app.route({
    method: 'PATCH',
    url: '/v1/me',
    schema: {
      summary: 'Update current user informations',
      description: 'Updates the current user informations.',
      tags: ['Users'],
      body: updateUserMeBodySchema,
      response: {
        204: updateUserMeResponseSchema,
      },
    },
    handler: controller.updateUserMe.bind(controller),
  });

  app.route({
    method: 'DELETE',
    url: '/v1/me',
    schema: {
      summary: 'Delete current user',
      description: 'Deletes the current user.',
      tags: ['Users'],
      response: {
        204: deleteUserMeResponseSchema,
      },
    },
    handler: controller.deleteUserMe.bind(controller),
  });

  app.route({
    method: 'GET',
    url: '/v1/:id',
    schema: {
      summary: 'Get user by id',
      description: 'Returns the user by id.',
      tags: ['Users'],
      params: getUserByIdParamsSchema,
      response: {
        200: getUserByIdResponseSchema,
      },
    },
    handler: controller.getUserById.bind(controller),
  });

  app.route({
    method: 'PUT',
    url: '/v1/:id',
    schema: {
      summary: 'Update user by id',
      description: 'Updates the user by id.',
      tags: ['Users'],
      params: updateUserByIdParamsSchema,
      body: updateUserByIdBodySchema,
      response: {
        204: updateUserByIdResponseSchema,
      },
    },
    handler: controller.updateUserById.bind(controller),
  });

  app.route({
    method: 'DELETE',
    url: '/v1/:id',
    schema: {
      summary: 'Delete user by id',
      description: 'Deletes the user by id.',
      tags: ['Users'],
      params: deleteUserByIdParamsSchema,
      response: {
        204: deleteUserByIdResponseSchema,
      },
    },
    handler: controller.deleteUserById.bind(controller),
  });
};
