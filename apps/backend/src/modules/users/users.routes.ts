import {
  deleteUserByIdParamsSchema,
  deleteUserByIdResponseSchema,
  deleteUserMeResponseSchema,
  getUserByIdParamsSchema,
  getUserByIdResponseSchema,
  getUserMeResponseSchema,
  type UpdateUserMeBody,
  updateUserByIdBodySchema,
  updateUserByIdParamsSchema,
  updateUserByIdResponseSchema,
  updateUserMeBodySchema,
  updateUserMeResponseSchema,
  createUserMeStateTokenResponseSchema,
  GetUserMeThirdPartyAuthorizationUrlParams,
  getUserMeThirdPartyAuthorizationUrlParamsSchema,
  getUserMeThirdPartyAuthorizationUrlResponseSchema,
} from '@area/shared/schemas/user.schema';
import type { FastifyInstance } from 'fastify';
import { verifyUserAccess } from '@/middlewares/auth';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { ThirdPartyService } from '../third-party';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const repository = new UsersRepository(app.mongo.db);
  const service = new UsersService(repository);
  const controller = new UsersController(service, new ThirdPartyService());

  app.route({
    method: 'POST',
    url: '/v1/me/state-token',
    schema: {
      summary: 'Create the current user state token',
      description: 'Returns the current user state token.',
      tags: ['Users'],
      response: {
        200: createUserMeStateTokenResponseSchema,
      },
    },
    preHandler: [verifyUserAccess(service)],
    handler: controller.createUserMeState.bind(controller),
  });

  app.route<{ Params: GetUserMeThirdPartyAuthorizationUrlParams }>({
    method: 'GET',
    url: '/v1/me/authorization-url/:third_party_service',
    schema: {
      summary: 'Get the authorization url for a third pary service',
      description: 'Returns the authentication url for the specified third party service',
      tags: ['Users'],
      params: getUserMeThirdPartyAuthorizationUrlParamsSchema,
      response: {
        200: getUserMeThirdPartyAuthorizationUrlResponseSchema,
      },
    },
    preHandler: [verifyUserAccess(service)],
    handler: controller.getUserMeThirdPartyAuthorizationUrl.bind(controller),
  });

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
