import { DysType, UserRoles } from '@area/shared/enums/user-enums';
import type { LoginBody, RegisterBody } from '@area/shared/schemas/auth.schema';
import type { User } from '@area/shared/types/user.types';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AuthService } from '@/modules/auth/auth.service';
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
  async registerUser(request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply): Promise<void> {
    const body = request.body;
    const data: User = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: UserRoles.USER,
      darkModeEnabled: false,
      dyslexiaType: DysType.NOTHING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { accessToken, refreshToken } = await this.service.registerUser(data);

    reply.setCookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: environment.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    reply.status(201).send({ accessToken: accessToken });
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

    reply.setCookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: environment.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    reply.status(200).send({ accessToken: accessToken });
  }
}
