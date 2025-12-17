import {
  type DeleteUserByIdParams,
  deleteUserByIdParamsSchema,
  deleteUserByIdResponseSchema,
  deleteUserMeResponseSchema,
  type GetUserByIdParams,
  getAllUsersResponseSchema,
  getUserByIdParamsSchema,
  getUserByIdResponseSchema,
  getUserMeResponseSchema,
  type UpdateUserByIdBody,
  type UpdateUserByIdParams,
  type UpdateUserMeBody,
  updateUserByIdBodySchema,
  updateUserByIdParamsSchema,
  updateUserByIdResponseSchema,
  updateUserMeBodySchema,
  updateUserMeResponseSchema,
} from '@area/shared/schemas/users.schema';
import type { FastifyInstance } from 'fastify';
import { verifyUserAccess } from '@/middlewares/auth';
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
    preHandler: [verifyUserAccess(service)],
    handler: controller.getUserMe.bind(controller),
  });

  app.route<{ Body: UpdateUserMeBody }>({
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
    preHandler: [verifyUserAccess(service)],
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
    preHandler: [verifyUserAccess(service)],
    handler: controller.deleteUserMe.bind(controller),
  });

  app.route({
    method: 'GET',
    url: '/v1',
    schema: {
      summary: 'Get all the users',
      description: 'Returns the users.',
      tags: ['Users'],
      response: {
        200: getAllUsersResponseSchema,
      },
    },
    preHandler: [verifyUserAccess(service, { adminOnly: true })],
    handler: controller.getAllUsers.bind(controller),
  });

  app.route<{ Params: GetUserByIdParams }>({
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
    preHandler: [verifyUserAccess(service, { adminOnly: true })],
    handler: controller.getUserById.bind(controller),
  });

  app.route<{ Params: UpdateUserByIdParams; Body: UpdateUserByIdBody }>({
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
    preHandler: [verifyUserAccess(service, { adminOnly: true })],
    handler: controller.updateUserById.bind(controller),
  });

  app.route<{ Params: DeleteUserByIdParams }>({
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
    preHandler: [verifyUserAccess(service, { adminOnly: true })],
    handler: controller.deleteUserById.bind(controller),
  });
};
