import type { FastifyInstance } from 'fastify';
import { WebhookController } from '@/controllers/webhook.controller';
import { WebhookRepository } from '@/repositories/webhook.repository';
import { GithubService } from '@/services/github.service';
import { WebhookService } from '@/services/webhook.service';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const repository = new WebhookRepository(app.mongo.db);
  const githubService = new GithubService();
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
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              uuid: { type: 'string' },
              githubUrl: { type: 'string' },
              actions: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              discordWebhookUrl: { type: 'string' },
            },
          },
        },
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
      body: {
        type: 'object',
        properties: {
          githubUrl: { type: 'string' },
          actions: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          discordWebhookUrl: { type: 'string' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
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
      params: {
        type: 'object',
        properties: {
          uuid: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            uuid: { type: 'string' },
            githubUrl: { type: 'string' },
            discordWebhookUrl: { type: 'string' },
          },
        },
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
      params: {
        type: 'object',
        properties: {
          uuid: { type: 'string' },
        },
      },
    },
  });
};
