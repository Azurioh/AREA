import { HttpStatusCode } from '@area/shared/enums/http-status';
import type {
  DeleteUserByIdParams,
  GetUserByIdParams,
  UpdateUserByIdBody,
  UpdateUserByIdParams,
  UpdateUserMeBody,
} from '@area/shared/schemas/users.schema';
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
    const body = Object.fromEntries(Object.entries(request.body).filter(([_, v]) => v !== undefined));
    await this.service.updateUser(request.user._id, body);

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
   * @function getAllUsers
   * @description Get a user by id
   *
   * @param {FastifyRequest} _ The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async getAllUsers(_: FastifyRequest, reply: FastifyReply): Promise<void> {
    const users = await this.service.getAllUsers();

    return reply.status(HttpStatusCode.OK).send(users);
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

  /**
   * @function updateUserById
   * @description Update a user by id
   *
   * @param {FastifyRequest<{ Params: UpdateUserByIdParams; Body: UpdateUserByIdBody }>} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async updateUserById(
    request: FastifyRequest<{ Params: UpdateUserByIdParams; Body: UpdateUserByIdBody }>,
    reply: FastifyReply,
  ): Promise<void> {
    const body = Object.fromEntries(Object.entries(request.body).filter(([_, v]) => v !== undefined));
    await this.service.updateUser(request.params.id, body);

    return reply.status(HttpStatusCode.NO_CONTENT).send();
  }

  /**
   * @function deleteUserById
   * @description Delete a user by id
   *
   * @param {FastifyRequest<{ Params: DeleteUserByIdParams }>} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async deleteUserById(request: FastifyRequest<{ Params: DeleteUserByIdParams }>, reply: FastifyReply): Promise<void> {
    await this.service.deleteUser(request.params.id);

    return reply.status(HttpStatusCode.NO_CONTENT).send();
  }
}
