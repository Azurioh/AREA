import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';
import path from 'node:path';

export const setupStaticFiles = (app: FastifyInstance): void => {
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../../public'),
  });
};
