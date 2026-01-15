import { HttpStatusCode } from '@area/shared/dist/enums/http-status';
import { UserRoles } from '@area/shared/enums/user-enums';
import type {
  LoginBody,
  LoginHeaders,
  LogoutBody,
  RefreshTokenHeaders,
  RegisterBody,
  RegisterHeaders,
} from '@area/shared/schemas/auth.schema';
import type { AccessToken, User } from '@area/shared/types/users.types';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AuthService } from '@/modules/auth/auth.service';
import ApiError from '@/utils/api-error';
import { decryptString, encryptString, safeEqualCheck } from '@/utils/crypt';
import { environment } from '@/utils/environment';
import { verifyToken } from '@/utils/token';

/**
 * @class AuthController
 * @description Controller for handling Auth-related HTTP requests.
 */
export class AuthController {
  private service: AuthService;

  constructor(service: AuthService) {
    this.service = service;
  }

  /**
   * @function registerUser
   * @description Handle the register of a user.
   *
   * @param {FastifyRequest} request - The Fastify request object.
   * @param {FastifyReply} reply - The Fastify reply object for sending the response.
   */
  async registerUser(
    request: FastifyRequest<{ Body: RegisterBody; Headers: RegisterHeaders }>,
    reply: FastifyReply,
  ): Promise<void> {
    const body = request.body;

    const data: User = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: safeEqualCheck(request.headers['x-admin-secret']!, environment.ADMIN_SECRET)
        ? UserRoles.ADMIN
        : UserRoles.USER,
      darkModeEnabled: false,
      dyslexiaEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { accessToken, refreshToken } = await this.service.registerUser(data);

    const encryptedAccessToken = encryptString(accessToken, environment.CRYPT_SECRET_KEY);
    const encryptedRefreshToken = encryptString(refreshToken, environment.CRYPT_SECRET_KEY);

    await this.service.sendTokensToUser(encryptedAccessToken, encryptedRefreshToken, request, reply, true);
  }

  /**
   * @function loginUser
   * @description Handle the login of a user.
   *
   * @param {FastifyRequest} request - The Fastify request object.
   * @param {FastifyReply} reply - The Fastify reply object for sending the response.
   */
  async loginUser(
    request: FastifyRequest<{ Body: LoginBody; Headers: LoginHeaders }>,
    reply: FastifyReply,
  ): Promise<void> {
    const body = request.body;

    const { accessToken, refreshToken } = await this.service.loginUser(body);

    const encryptedAccessToken = encryptString(accessToken, environment.CRYPT_SECRET_KEY);
    const encryptedRefreshToken = encryptString(refreshToken, environment.CRYPT_SECRET_KEY);

    const accessTokenPayload = verifyToken<AccessToken>(accessToken, environment.JWT_ACCESS_TOKEN_SECRET);
    await this.service.storeRefreshTokenInDatabase(
      accessTokenPayload._id,
      encryptedRefreshToken,
      new Date(Date.now() + (body.rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000),
    );

    await this.service.sendTokensToUser(encryptedAccessToken, encryptedRefreshToken, request, reply, false);
  }

  /**
   * @method refreshToken
   * @description Refresh the access and refresh tokens.
   *
   * @param request - The Fastify request object.
   * @param reply - The Fastify reply object.
   */
  async refreshToken(request: FastifyRequest<{ Headers: RefreshTokenHeaders }>, reply: FastifyReply): Promise<void> {
    const accessToken: string | undefined = request.headers.authorization?.replace('Bearer ', '');
    const refreshToken: string | undefined = this.service.getRefreshToken(request);

    if (!refreshToken) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Refresh token is missing');
    }

    if (!(await this.service.checkIfRefreshTokenIsValid(refreshToken))) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Token has been revoked');
    }

    const { newAccessToken, newRefreshToken } = await this.service.refreshToken(
      decryptString(refreshToken, environment.CRYPT_SECRET_KEY),
    );

    await this.service.invalidateAccessToken(request, accessToken);
    await this.service.invalidateRefreshToken(refreshToken);

    const encryptedAccessToken = encryptString(newAccessToken, environment.CRYPT_SECRET_KEY);
    const encryptedRefreshToken = encryptString(newRefreshToken, environment.CRYPT_SECRET_KEY);
    await this.service.sendTokensToUser(encryptedAccessToken, encryptedRefreshToken, request, reply, false);
  }

  /**
   * @method logout
   * @description Invalidate user tokens.
   *
   * @param request - The Fastify request object.
   * @param reply - The Fastify reply object.
   */
  async logout(request: FastifyRequest<{ Body: LogoutBody }>, reply: FastifyReply): Promise<void> {
    const accessToken: string | undefined = request.headers.authorization?.replace('Bearer ', '');
    const refreshToken: string | undefined = this.service.getRefreshToken(request);

    if (accessToken) {
      this.service.invalidateAccessToken(request, accessToken);
    }
    if (refreshToken) {
      this.service.invalidateRefreshToken(refreshToken);
    }
    reply.status(HttpStatusCode.NO_CONTENT).send();
  }
}
