import {
  createWebhookBodySchema,
  createWebhookResponseSchema,
  getWebhookByUuidParamsSchema,
  getWebhookByUuidResponseSchema,
  listWebhooksResponseSchema,
} from '@area/shared/schemas/webhook.schema';
import type { FastifyInstance } from 'fastify';
import { GithubService } from '@/modules/github';
import { GithubRepository } from '@/modules/github/github.repository';
import { WebhookService } from '@/modules/webhook';
import { UsersRepository, UsersService } from '../users';
import { WebhookController } from './webhook.controller';
import { WebhookRepository } from './webhook.repository';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const repository = new WebhookRepository(app.mongo.db);
  const githubRepository = new GithubRepository(app.mongo.db);
  const userRepository = new UsersRepository(app.mongo.db);
  const userService = new UsersService(userRepository);
  const githubService = new GithubService(githubRepository, userService);
  const service = new WebhookService(repository);
  const controller = new WebhookController(service, githubService);

  app.route({
    method: 'GET',
    url: '/v1',
    handler: controller.listWebhooks.bind(controller),
    schema: {
      summary: 'List all webhooks',
      description: 'Returns an array of webhooks.',
      tags: ['Webhooks'],
      response: {
        200: listWebhooksResponseSchema,
      },
    },
  });

  app.route({
    method: 'POST',
    url: '/v1',
    handler: controller.createWebhook.bind(controller),
    schema: {
      summary: 'Create a new webhook',
      description: 'Creates a new webhook.',
      tags: ['Webhooks'],
      body: createWebhookBodySchema,
      response: {
        201: createWebhookResponseSchema,
      },
    },
  });

  app.route({
    method: 'GET',
    url: '/v1/:uuid',
    handler: controller.getWebhookByUuid.bind(controller),
    schema: {
      summary: 'Get a webhook by UUID',
      description: 'Returns a webhook by UUID.',
      tags: ['Webhooks'],
      params: getWebhookByUuidParamsSchema,
      response: {
        200: getWebhookByUuidResponseSchema,
      },
    },
  });

  app.route({
    method: 'DELETE',
    url: '/v1/:uuid',
    handler: controller.deleteWebhook.bind(controller),
    schema: {
      summary: 'Delete a webhook by UUID',
      description: 'Deletes a webhook by UUID.',
      tags: ['Webhooks'],
      params: getWebhookByUuidParamsSchema,
    },
  });
};
