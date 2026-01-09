import fastifyCors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import { environment } from '@/utils/environment';

const allowedOrigins = environment.CORS_ORIGINS.split(',') || [];

export const setupCors = (app: FastifyInstance): void => {
  app.register(fastifyCors, {
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET, POST, PUT, DELETE, PATCH',
  });
};
