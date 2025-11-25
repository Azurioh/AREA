import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AuthService } from '@/services/auth.service';
import { LoginUserBody, RegisterUserBody } from '@area/shared/types/auth.type';
import { User } from '@area/shared/types/user.type';
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
  async registerUser(request: FastifyRequest<{ Body: RegisterUserBody }>, reply: FastifyReply): Promise<void> {
    const body = request.body;
    const data: User = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: ""
    };
    const { accessToken, refreshToken } = await this.service.registerUser(data);

    reply.setCookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: environment.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    reply.status(201).send({ 'accessToken' : accessToken });
  }

  /**
   * @function loginUser
   * @description Handle the login of a user.
   *
   * @param {FastifyRequest} request - The Fastify request object.
   * @param {FastifyReply} reply - The Fastify reply object for sending the response.
   */
  async loginUser(request: FastifyRequest<{ Body: LoginUserBody }>, reply: FastifyReply): Promise<void> {
    const body = request.body;
    const data: Omit<User, 'name' | 'role'> = {
      email: body.email,
      password: body.password
    };
    const { accessToken, refreshToken } = await this.service.loginUser(data);

    reply.setCookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: environment.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    reply.status(200).send({ 'accessToken' : accessToken });
  }
}
