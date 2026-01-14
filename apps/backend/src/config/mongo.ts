import { HttpStatusCode } from '@area/shared/enums/http-status';
import fastifyMongo from '@fastify/mongodb';
import type { FastifyInstance } from 'fastify';
import ApiError from '@/utils/api-error';
import { environment } from '@/utils/environment';

export const setupMongoDB = async (app: FastifyInstance): Promise<void> => {
  await app.register(fastifyMongo, {
    forceClose: true,
    url: environment.MONGO_URI,
    database: environment.MONGO_DATABASE,
  });

  app.addHook('preHandler', async (request, _reply) => {
    if (!app.mongo?.client || !app.mongo?.db) {
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'MongoDB client or database not found');
    }
    request.db = app.mongo.db;
  });
};
