import type { FastifyInstance } from 'fastify';
import miscRoutes from './misc.routes';

export const router = async (app: FastifyInstance) => {
  app.register(miscRoutes, { prefix: '/misc' });
};
