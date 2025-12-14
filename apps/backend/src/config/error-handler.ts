import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import ApiError from '@/utils/api-error';
import { environment } from '@/utils/environment';

export const setupErrorHandler = (app: FastifyInstance) => {
  app.setErrorHandler((error: unknown, _: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof ApiError) {
      reply.status(error.httpCode).send({
        data: error.message,
      });
    } else if (error instanceof ZodError || (error as any).code === 'FST_ERR_VALIDATION') {
      reply.status(HttpStatusCode.BAD_REQUEST).send({
        data: (error as any).message,
      });
    } else if (error instanceof Error) {
      if (environment.NODE_ENV === 'development' || environment.NODE_ENV === 'test') {
        console.log(error);
      }
      reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        data: error.message,
        ...(environment.NODE_ENV === 'development' && { stack: error.stack }),
      });
    } else {
      console.log(error);
      reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        data: 'An unknown error occurred, please contact administrator.',
      });
    }
  });
};
