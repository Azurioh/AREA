import ApiError from '@/utils/api-error';
import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const checkAccessTokenBlackList = async (request: FastifyRequest, reply: FastifyReply) => {
  const token = request.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return;
  }
  try {
    const isBlacklisted = await request.server.redis?.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Token has been revoked');
    }
  } catch (err: unknown) {
    console.error(err);
    throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Error checking token blacklist');
  }
};

export const setupAuthHook = (app: FastifyInstance): void => {
  app.addHook('preHandler', checkAccessTokenBlackList);
};
