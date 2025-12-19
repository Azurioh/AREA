import type { FastifyInstance } from 'fastify';
import { GithubService } from '@/modules/github';
import { WebhookService } from '@/modules/webhook';
import { UsersRepository, UsersService } from '../users';
import { WebhookController } from './webhook.controller';
import { ActionsReactionsRepository, ActionsReactionsService } from '../actions-reactions';
import { DiscordService } from '../discord';
import { ThirdPartiesRepository } from '../third-parties/third-parties.repository';
import { ThirdPartiesService } from '../third-parties';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const userRepository = new UsersRepository(app.mongo.db);
  const actionsReactionsRepository = new ActionsReactionsRepository(app.mongo.db);
  const thirdPartiesRepository = new ThirdPartiesRepository(app.mongo.db);

  const usersService = new UsersService(userRepository);
  const thirdPartiesService = new ThirdPartiesService(thirdPartiesRepository, usersService);
  const githubService = new GithubService(thirdPartiesService);
  const discordService = new DiscordService(thirdPartiesService);
  const actionsReactionsService = new ActionsReactionsService(
    actionsReactionsRepository,
    githubService,
    discordService,
  );
  const service = new WebhookService(actionsReactionsService);

  const controller = new WebhookController(service);

  app.route({
    method: 'POST',
    url: '/v1/github/',
    handler: controller.githubCallback.bind(controller),
    schema: {
      summary: 'The callback of the github webhook',
      description: 'Handle the callback of the github webhook.',
      tags: ['Webhooks'],
    },
  });

  app.route({
    method: 'POST',
    url: '/v1/discord/',
    handler: controller.discordCallback.bind(controller),
    schema: {
      summary: 'The callback of the discord webhook',
      description: 'Handle the callback of the discord webhook.',
      tags: ['Webhooks'],
    },
  });
};
