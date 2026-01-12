import {
  type CreateActionReactionBody,
  createActionReactionBodySchema,
  createActionReactionResponseSchema,
  getMeActionsReactionsResponseSchema,
  type UpdateActionReactionExecutionStateBody,
  updateActionReactionExecutionStateBodySchema,
  type UpdateActionReactionExecutionStateParams,
  updateActionReactionExecutionStateParamsSchema,
  updateActionReactionExecutionStateResponseSchema,
} from '@area/shared/schemas/actions-reactions.schema';
import type { FastifyInstance } from 'fastify';
import { verifyUserAccess } from '@/middlewares/auth';
import { ActionsReactionsRepository, ActionsReactionsService } from '@/modules/actions-reactions';
import { DiscordService } from '@/modules/discord';
import { GithubService } from '@/modules/github';
import { ThirdPartiesRepository, ThirdPartiesService } from '@/modules/third-parties';
import { UsersRepository, UsersService } from '@/modules/users';
import { ActionsReactionsController } from './actions-reactions.controller';
import { SpotifyService } from '../spotify';
import { PollingService } from '../polling/polling.service';
import { PollingRepository } from '../polling/polling.repository';
import { DropboxRepository, DropboxService } from '../dropbox';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const thirdPartiesRepository = new ThirdPartiesRepository(app.mongo.db);
  const pollingRepository = new PollingRepository(app.mongo.db);
  const dropboxRepository = new DropboxRepository(app.mongo.db);

  const usersService = new UsersService(new UsersRepository(app.mongo.db));
  const thirdPartiesService = new ThirdPartiesService(thirdPartiesRepository, usersService);
  const pollingService = new PollingService(pollingRepository);

  const githubService = new GithubService(thirdPartiesService);
  const discordService = new DiscordService(thirdPartiesService);
  const spotifyService = new SpotifyService(thirdPartiesService, pollingService);
  const dropboxService = new DropboxService(dropboxRepository, thirdPartiesService);

  const repository = new ActionsReactionsRepository(app.mongo.db);
  const service = new ActionsReactionsService(
    repository,
    githubService,
    discordService,
    spotifyService,
    dropboxService,
  );
  const controller = new ActionsReactionsController(service);

  app.route<{ Body: CreateActionReactionBody }>({
    method: 'POST',
    url: '/v1',
    schema: {
      summary: 'Create an action reaction',
      description: 'Create the given action reaction.',
      tags: ['Action reactions'],
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
      tags: ['Action reactions'],
      response: {
        200: getMeActionsReactionsResponseSchema,
      },
    },
    preHandler: [verifyUserAccess(usersService)],
    handler: controller.getMeActionsReactions.bind(controller),
  });

  app.route<{ Params: UpdateActionReactionExecutionStateParams; Body: UpdateActionReactionExecutionStateBody }>({
    method: 'PATCH',
    url: '/v1/:id/execution-state',
    schema: {
      summary: 'Update workflow execution state',
      description: 'Enable or disable a workflow execution state.',
      tags: ['Action reactions'],
      params: updateActionReactionExecutionStateParamsSchema,
      body: updateActionReactionExecutionStateBodySchema,
      response: {
        200: updateActionReactionExecutionStateResponseSchema,
      },
    },
    preHandler: [verifyUserAccess(usersService)],
    handler: controller.updateActionReactionExecutionStateById.bind(controller),
  });
};
