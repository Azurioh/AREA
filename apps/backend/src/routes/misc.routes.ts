import type { FastifyInstance } from 'fastify';
import { MiscController } from '@/controllers/misc.controller';

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
        200: {
          type: 'object',
          properties: {
            uptime: { type: 'number', description: 'Server uptime in seconds' },
          },
        },
      },
    },
    handler: miscController.uptime.bind(miscController),
  });
};
