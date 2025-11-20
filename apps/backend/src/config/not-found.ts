import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const setupNotFoundHandler = (app: FastifyInstance): void => {
  app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    reply.status(HttpStatusCode.NOT_FOUND).send({
      data: `The resource ${request.url} doesn't exist`,
    });
  });
};
