import type { FastifyInstance } from 'fastify';
import githubRoutes from './github.routes';
import miscRoutes from './misc.routes';
import webhookRoutes from './webhook.routes';
import authRoutes from './auth.routes';

export const router = async (app: FastifyInstance) => {
  app.register(miscRoutes, { prefix: '/misc' });
  app.register(webhookRoutes, { prefix: '/webhook' });
  app.register(githubRoutes, { prefix: '/github' });
  app.register(authRoutes, { prefix: '/auth' })
};
