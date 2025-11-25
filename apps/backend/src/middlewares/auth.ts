import ApiError from '@/utils/api-error';
import { environment } from '@/utils/environment';
import { verifyToken } from '@/utils/token';
import { HttpStatusCode } from '@area/shared/enums/http-status';
import { User } from '@area/shared/types/user.type';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyUserAccess(request: FastifyRequest, _: FastifyReply) {
    const accessToken = request.headers.authorization;

    if (!accessToken) {
        throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'No token was provided');
    }
    if (!accessToken.startsWith('Bearer ')) {
        throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Invalid authorization format, expected Bearer');
    }

    const decoded = verifyToken<User>(accessToken.replace('Bearer ', ''), environment.JWT_ACCESS_TOKEN_SECRET);

    // Once the user routes will be merged a check will be made to make sure the user exists in the db

    request.user = decoded;
    return;
}
