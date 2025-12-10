import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';
import path from 'path';

export const setupStaticFiles = (app: FastifyInstance): void => {
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../../public'),
  });
};
