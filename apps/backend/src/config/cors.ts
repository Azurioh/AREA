import fastifyCors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';

export const setupCors = (app: FastifyInstance): void => {
  app.register(fastifyCors, { origin: ['localhost:3000', '167.86.110.198:8085'] });
};
