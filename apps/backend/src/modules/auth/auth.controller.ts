import { UserRoles } from '@area/shared/enums/user-enums';
import type { LoginBody, RegisterBody, RegisterHeaders } from '@area/shared/schemas/auth.schema';
import type { User } from '@area/shared/types/users.types';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AuthService } from '@/modules/auth/auth.service';
import { decryptString, encryptString, safeEqualCheck } from '@/utils/crypt';
import { environment } from '@/utils/environment';

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

    reply.setCookie('refresh-token', encryptString(refreshToken, environment.CRYPT_SECRET_KEY), {
      httpOnly: true,
      secure: true,
      sameSite: environment.NODE_ENV !== 'development' ? 'lax' : 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    reply.status(201).send({ accessToken: encryptString(accessToken, environment.CRYPT_SECRET_KEY) });
  }

  /**
   * @function loginUser
   * @description Handle the login of a user.
   *
   * @param {FastifyRequest} request - The Fastify request object.
   * @param {FastifyReply} reply - The Fastify reply object for sending the response.
   */
  async loginUser(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply): Promise<void> {
    const body = request.body;

    const { accessToken, refreshToken } = await this.service.loginUser(body);

    reply.setCookie('refresh-token', encryptString(refreshToken, environment.CRYPT_SECRET_KEY), {
      httpOnly: true,
      secure: true,
      sameSite: environment.NODE_ENV !== 'development' ? 'lax' : 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    reply.status(200).send({ accessToken: encryptString(accessToken, environment.CRYPT_SECRET_KEY) });
  }

  async refreshToken(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const refreshToken = request.cookies['refresh-token'];

    if (!refreshToken) {
      reply.status(401).send({ message: 'Refresh token is missing' });
      return;
    }

    const { accessToken } = await this.service.refreshToken(decryptString(refreshToken, environment.CRYPT_SECRET_KEY));

    reply.status(200).send({ accessToken: encryptString(accessToken, environment.CRYPT_SECRET_KEY) });
  }
}
