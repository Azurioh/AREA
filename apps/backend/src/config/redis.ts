import { environment } from '@/utils/environment';
import fastifyRedis from '@fastify/redis';
import type { FastifyInstance } from 'fastify';

export const setupRedis = async (app: FastifyInstance): Promise<void> => {
  await app.register(fastifyRedis, {
    host: environment.REDIS_HOST,
    port: environment.REDIS_PORT,
    password: environment.REDIS_PASSWORD,
  });
};
