import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AuthService } from '@/services/auth.service';
import { LoginUserBody, RegisterUserBody } from '@area/shared/types/auth.type';
import { User } from '@area/shared/types/user.type';

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
      password: body.password
    };
    const { access_token, refresh_token } = await this.service.registerUser(data);

    // Set the refresh token as cookie
    refresh_token;

    reply.status(201).send({ 'access_token' : access_token });
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
    const data: Omit<User, 'name'> = {
      email: body.email,
      password: body.password
    };
    const { access_token, refresh_token } = await this.service.loginUser(data);

    // Set the refresh token as cookie
    refresh_token;

    reply.status(200).send({ 'access_token' : access_token });
  }
}
