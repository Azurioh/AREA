import type { FastifyInstance } from 'fastify';
import { GithubService } from '@/modules/github';
import { GithubRepository } from '@/modules/github/github.repository';
import { WebhookService } from '@/modules/webhook';
import { UsersRepository, UsersService } from '../users';
import { WebhookController } from './webhook.controller';
import { WebhookRepository } from './webhook.repository';
import { ActionsReactionsRepository, ActionsReactionsService } from '../actions-reactions';
import { DiscordRepository, DiscordService } from '../discord';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const userRepository = new UsersRepository(app.mongo.db);
  const repository = new WebhookRepository(app.mongo.db);
  const githubRepository = new GithubRepository(app.mongo.db);
  const discordRepository = new DiscordRepository(app.mongo.db);
  const actionsReactionsRepository = new ActionsReactionsRepository(app.mongo.db);

  const userService = new UsersService(userRepository);
  const githubService = new GithubService(githubRepository, userService);
  const discordService = new DiscordService(discordRepository, userService);
  const actionsReactionsService = new ActionsReactionsService(
    actionsReactionsRepository,
    githubService,
    discordService,
  );
  const service = new WebhookService(repository, actionsReactionsService);

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
};
