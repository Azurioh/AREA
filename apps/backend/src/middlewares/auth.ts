import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { AccessToken } from '@area/shared/types/user.types';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { UsersService } from '@/modules/users';
import ApiError from '@/utils/api-error';
import { environment } from '@/utils/environment';
import { verifyToken } from '@/utils/token';

export const verifyUserAccess =
  async (userService: UsersService) => async (request: FastifyRequest, _: FastifyReply) => {
    const accessToken = request.headers.authorization;

    if (!accessToken) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'No token was provided');
    }
    if (!accessToken.startsWith('Bearer ')) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Invalid authorization format, expected Bearer');
    }

    const decoded = verifyToken<AccessToken>(accessToken.replace('Bearer ', ''), environment.JWT_ACCESS_TOKEN_SECRET);

    if (!(await userService.checkIfUserExist(decoded._id))) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'User not found');
    }

    request.user = decoded;
    return;
  };
