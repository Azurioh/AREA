import { uptimeResponseSchema } from '@area/shared/schemas/misc.schema';
import type { FastifyInstance } from 'fastify';
import { MiscController } from './misc.controller';

export default async (app: FastifyInstance) => {
  const miscController = new MiscController();

  app.route({
    method: 'GET',
    url: '/v1/uptime',
    schema: {
      summary: 'Get the server uptime',
      description: 'Returns the uptime of the server in seconds.',
      tags: ['Miscellaneous'],
      response: {
        200: uptimeResponseSchema,
      },
    },
    handler: miscController.uptime.bind(miscController),
  });
};
