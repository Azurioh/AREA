import {
  createActionReactionBodySchema,
  createActionReactionResponseSchema,
  getMeActionsReactionsResponseSchema,
  type CreateActionReactionBody,
} from '@area/shared/schemas/action-reaction.schema';
import type { FastifyInstance } from 'fastify';
import { verifyUserAccess } from '@/middlewares/auth';
import { ActionsReactionsRepository, ActionsReactionsService } from '../actions-reactions';
import { GithubRepository, GithubService } from '../github';
import { ActionsReactionsController } from './actions-reactions.controller';
import { UsersRepository, UsersService } from '../users';
import { DiscordRepository, DiscordService } from '../discord';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const usersService = new UsersService(new UsersRepository(app.mongo.db));

  const githubService = new GithubService(new GithubRepository(app.mongo.db), usersService);
  const discordService = new DiscordService(new DiscordRepository(app.mongo.db), usersService);

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
