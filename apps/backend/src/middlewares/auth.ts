import { HttpStatusCode } from '@area/shared/enums/http-status';
import { UserRoles } from '@area/shared/enums/user-enums';
import type { AccessToken } from '@area/shared/types/user.types';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { UsersService } from '@/modules/users';
import ApiError from '@/utils/api-error';
import { decryptString } from '@/utils/crypt';
import { environment } from '@/utils/environment';
import { verifyToken } from '@/utils/token';

export type AuthMiddlewareOptions = {
  adminOnly?: boolean;
};

export const verifyUserAccess =
  (userService: UsersService, options?: AuthMiddlewareOptions) => async (request: FastifyRequest, _: FastifyReply) => {
    const accessToken = request.headers.authorization;

    if (!accessToken) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'No token was provided');
    }
    if (!accessToken.startsWith('Bearer ')) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Invalid authorization format, expected Bearer');
    }

    const decoded = verifyToken<AccessToken>(
      decryptString(accessToken.replace('Bearer ', ''), environment.CRYPT_SECRET_KEY),
      environment.JWT_ACCESS_TOKEN_SECRET,
    );

    if (options?.adminOnly && decoded.role !== UserRoles.ADMIN) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Unauthorized');
    }

    if (!(await userService.checkIfUserExist(decoded._id))) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Unauthorized');
    }

    request.user = decoded;
    return;
  };
