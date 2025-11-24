import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { GetUserByIdParams, UpdateUserMeBody } from '@area/shared/schemas/user.schema';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { UsersService } from './users.service';

/**
 * @class UsersController
 * @description The controller for the users module
 */
export class UsersController {
  private readonly service: UsersService;

  constructor(service: UsersService) {
    this.service = service;
  }

  /**
   * @function getUserMe
   * @description Get the current user
   *
   * @param {FastifyRequest} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async getUserMe(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const user = await this.service.getUserById(request.user._id);

    const { password, ...rest } = user;

    return reply.status(HttpStatusCode.OK).send(rest);
  }

  /**
   * @function updateUserMe
   * @description Update the current user
   *
   * @param {FastifyRequest<{ Body: UpdateUserMeBody }>} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async updateUserMe(request: FastifyRequest<{ Body: UpdateUserMeBody }>, reply: FastifyReply): Promise<void> {
    await this.service.updateUserMe(request.user._id, request.body);

    return reply.status(HttpStatusCode.NO_CONTENT).send();
  }

  /**
   * @function deleteUserMe
   * @description Delete the current user
   *
   * @param {FastifyRequest} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async deleteUserMe(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    await this.service.deleteUser(request.user._id);

    return reply.status(HttpStatusCode.NO_CONTENT).send();
  }

  /**
   * @function getUserById
   * @description Get a user by id
   *
   * @param {FastifyRequest<{ Params: GetUserByIdParams }>} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async getUserById(request: FastifyRequest<{ Params: GetUserByIdParams }>, reply: FastifyReply): Promise<void> {
    const user = await this.service.getUserById(request.params.id);

    return reply.status(HttpStatusCode.OK).send(user);
  }
}
