import type { FastifyInstance } from 'fastify';
import { GithubService } from '@/modules/github';
import { WebhookService } from '@/modules/webhook';
import { UsersRepository, UsersService } from '@/modules/users';
import { WebhookController } from './webhook.controller';
import { ActionsReactionsRepository, ActionsReactionsService } from '@/modules/actions-reactions';
import { DiscordService } from '@/modules/discord';
import { ThirdPartiesRepository, ThirdPartiesService } from '@/modules/third-parties';
import { SpotifyService } from '@/modules/spotify';
import { PollingRepository, PollingService } from '@/modules/polling';
import { UnsplashService } from '@/modules/unsplash';
import { DropboxRepository, DropboxService } from '@/modules/dropbox';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const userRepository = new UsersRepository(app.mongo.db);
  const actionsReactionsRepository = new ActionsReactionsRepository(app.mongo.db);
  const thirdPartiesRepository = new ThirdPartiesRepository(app.mongo.db);
  const pollingRepository = new PollingRepository(app.mongo.db);
  const dropboxRepository = new DropboxRepository(app.mongo.db);

  const pollingService = new PollingService(pollingRepository);
  const usersService = new UsersService(userRepository);
  const thirdPartiesService = new ThirdPartiesService(thirdPartiesRepository, usersService);
  const githubService = new GithubService(thirdPartiesService);
  const discordService = new DiscordService(thirdPartiesService);
  const spotifyService = new SpotifyService(thirdPartiesService, pollingService);
  const unsplashService = new UnsplashService(pollingService);
  const dropboxService = new DropboxService(dropboxRepository, thirdPartiesService);
  const actionsReactionsService = new ActionsReactionsService(
    actionsReactionsRepository,
    githubService,
    discordService,
    spotifyService,
    unsplashService,
    dropboxService,
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

  app.route({
    method: 'POST',
    url: '/v1/spotify/',
    handler: controller.spotifyCallback.bind(controller),
    schema: {
      summary: 'The callback of the spotify webhook',
      description: 'Handle the callback of the spotify webhook.',
      tags: ['Webhooks'],
    },
  });

  app.route({
    method: 'POST',
    url: '/v1/unsplash/',
    handler: controller.unsplashCallback.bind(controller),
    schema: {
      summary: 'The callback of the unsplash webhook',
      description: 'Handle the callback of the unsplash webhook.',
      tags: ['Webhooks'],
    },
  });

  app.route({
    method: 'GET',
    url: '/v1/dropbox/',
    handler: controller.dropboxWebhookValidator.bind(controller),
    schema: {
      summary: 'The callback of the dropbox webhook validator',
      description: 'Handle the callback of the dropbox webhook validator.',
      tags: ['Webhooks'],
    },
  });

  app.route({
    method: 'POST',
    url: '/v1/dropbox/',
    handler: controller.dropboxCallback.bind(controller),
    schema: {
      summary: 'The callback of the dropbox webhook',
      description: 'Handle the callback of the dropbox webhook.',
      tags: ['Webhooks'],
    },
  });
};
