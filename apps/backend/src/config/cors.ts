import fastifyCors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import { getEnvironment } from '@/utils/environment';

export const setupCors = (app: FastifyInstance): void => {
  const environment = getEnvironment();
  const allowedOrigins = (environment.CORS_ORIGINS ?? '').split(',').filter(Boolean);

  app.register(fastifyCors, {
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET, POST, PUT, DELETE, PATCH',
  });
};
