import {
  createActionReactionBodySchema,
  createActionReactionResponseSchema,
  getMeActionsReactionsResponseSchema,
  type CreateActionReactionBody,
} from '@area/shared/schemas/actions-reactions.schema';
import type { FastifyInstance } from 'fastify';
import { verifyUserAccess } from '@/middlewares/auth';
import { ActionsReactionsRepository, ActionsReactionsService } from '@/modules/actions-reactions';
import { GithubService } from '@/modules/github';
import { ActionsReactionsController } from './actions-reactions.controller';
import { UsersRepository, UsersService } from '@/modules/users';
import { DiscordService } from '@/modules/discord';
import { ThirdPartiesService, ThirdPartiesRepository } from '@/modules/third-parties';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const thirdPartiesRepository = new ThirdPartiesRepository(app.mongo.db);

  const usersService = new UsersService(new UsersRepository(app.mongo.db));
  const thirdPartiesService = new ThirdPartiesService(thirdPartiesRepository, usersService);

  const githubService = new GithubService(thirdPartiesService);
  const discordService = new DiscordService(thirdPartiesService);

  const repository = new ActionsReactionsRepository(app.mongo.db);
  const service = new ActionsReactionsService(repository, githubService, discordService);
  const controller = new ActionsReactionsController(service);

  app.route<{ Body: CreateActionReactionBody }>({
    method: 'POST',
    url: '/v1',
    schema: {
      summary: 'Create an action reaction',
      description: 'Create the given action reaction.',
      tags: ['Users'],
      body: createActionReactionBodySchema,
      response: {
        200: createActionReactionResponseSchema,
      },
    },
    preHandler: [verifyUserAccess(usersService)],
    handler: controller.createActionReaction.bind(controller),
  });

  app.route({
    method: 'GET',
    url: '/v1/me',
    schema: {
      summary: 'Get current user actions reactions',
      description: 'Get the current user actions and reactions.',
      tags: ['Users'],
      response: {
        200: getMeActionsReactionsResponseSchema,
      },
    },
    preHandler: [verifyUserAccess(usersService)],
    handler: controller.getMeActionsReactions.bind(controller),
  });
};
