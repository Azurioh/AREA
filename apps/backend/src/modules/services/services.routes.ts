import {
  type GetActionsDetailsParams,
  type GetReactionDetailsParams,
  getActionDetailsParamsSchema,
  getActionReturnedValuesParamsSchema,
  getActionReturnedValuesResponseSchema,
  getActionsDetailsResponseSchema,
  getReactionDetailsParamsSchema,
  getReactionDetailsResponseSchema,
  getServiceActionsParamsSchema,
  getServiceActionsResponseSchema,
  getServiceReactionsParamsSchema,
  getServiceReactionsResponseSchema,
} from '@area/shared/schemas/services.schema';
import type { FastifyInstance } from 'fastify';
import { verifyUserAccess } from '@/middlewares/auth';
import { UsersRepository, UsersService } from '../users';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

export default (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const userRepository = new UsersRepository(app.mongo.db);
  const userService = new UsersService(userRepository);
  const service = new ServicesService();
  const controller = new ServicesController(service);

  app.route({
    method: 'GET',
    url: '/v1/:service/actions',
    handler: controller.getServiceActions.bind(controller),
    schema: {
      summary: 'Get all actions for a specific service',
      description: 'Returns an array of actions with their names and descriptions for the specified service.',
      tags: ['Services'],
      params: getServiceActionsParamsSchema,
      response: {
        200: getServiceActionsResponseSchema,
      },
    },
  });

  app.route<{ Params: GetActionsDetailsParams }>({
    method: 'GET',
    url: '/v1/:service/actions/:action',
    preHandler: [verifyUserAccess(userService)],
    handler: controller.getActionDetails.bind(controller),
    schema: {
      summary: 'Get details of a specific action for a service',
      description: 'Returns the details of a specific action, including its name, description, and parameters.',
      tags: ['Services'],
      params: getActionDetailsParamsSchema,
      response: {
        200: getActionsDetailsResponseSchema,
      },
    },
  });

  app.route({
    method: 'GET',
    url: '/v1/:service/actions/:action/returned-values',
    handler: controller.getActionReturnedValues.bind(controller),
    schema: {
      summary: 'Get returned values of a specific action for a service',
      description: 'Returns the returned values of a specific action, including their keys and descriptions.',
      tags: ['Services'],
      params: getActionReturnedValuesParamsSchema,
      response: {
        200: getActionReturnedValuesResponseSchema,
      },
    },
  });

  app.route({
    method: 'GET',
    url: '/v1/:service/reactions',
    handler: controller.getServiceReactions.bind(controller),
    schema: {
      summary: 'Get all reactions for a specific service',
      description: 'Returns an array of reactions with their names and descriptions for the specified service.',
      tags: ['Services'],
      params: getServiceReactionsParamsSchema,
      response: {
        200: getServiceReactionsResponseSchema,
      },
    },
  });

  app.route<{ Params: GetReactionDetailsParams }>({
    method: 'GET',
    url: '/v1/:service/reactions/:reaction',
    preHandler: [verifyUserAccess(userService)],
    handler: controller.getReactionDetails.bind(controller),
    schema: {
      summary: 'Get details of a specific reaction for a service',
      description: 'Returns the details of a specific reaction, including its name, description, and parameters.',
      tags: ['Services'],
      params: getReactionDetailsParamsSchema,
      response: {
        200: getReactionDetailsResponseSchema,
      },
    },
  });
};
