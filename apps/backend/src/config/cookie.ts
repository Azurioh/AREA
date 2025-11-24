import fastifyCookie from '@fastify/cookie';
import type { FastifyInstance } from 'fastify';

export const setupCookie = (app: FastifyInstance): void => {
  app.register(fastifyCookie);
};
