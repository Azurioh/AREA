import { aboutResponseSchema } from '@area/shared/schemas/about.schema';
import type { FastifyInstance } from 'fastify';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const service = new AboutService();
  const controller = new AboutController(service);

  app.route({
    method: 'GET',
    url: '/about.json',
    handler: controller.getAboutFile.bind(controller),
    schema: {
      summary: 'Get about file',
      description: 'Returns the about file',
      tags: ['About'],
      response: {
        200: aboutResponseSchema,
      },
    },
  });
};
