import {
  createUserMeActionReactionBodySchema,
  createUserMeActionReactionResponseSchema,
  type CreateUserMeActionReactionBody,
} from '@area/shared/schemas/action-reaction.schema';
import type { FastifyInstance } from 'fastify';
import { verifyUserAccess } from '@/middlewares/auth';
import { ActionsReactionsRepository, ActionsReactionsService } from '../actions-reactions';
import { GithubRepository, GithubService } from '../github';
import { ActionsReactionsController } from './actions-reactions.controller';
import { UsersRepository, UsersService } from '../users';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const usersService = new UsersService(new UsersRepository(app.mongo.db));

  const githubService = new GithubService(new GithubRepository(app.mongo.db), usersService);

  const repository = new ActionsReactionsRepository(app.mongo.db);
  const service = new ActionsReactionsService(repository, githubService);
  const controller = new ActionsReactionsController(service);

  app.route<{ Body: CreateUserMeActionReactionBody }>({
    method: 'POST',
    url: '/v1',
    schema: {
      summary: 'Create an action reaction',
      description: 'Create the given action reaction.',
      tags: ['Users'],
      body: createUserMeActionReactionBodySchema,
      response: {
        200: createUserMeActionReactionResponseSchema,
      },
    },
    preHandler: [verifyUserAccess(usersService)],
    handler: controller.createActionReaction.bind(controller),
  });
};
