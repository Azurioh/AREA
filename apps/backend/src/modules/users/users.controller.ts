import { HttpStatusCode } from '@area/shared/enums/http-status';
import type {
  DeleteUserByIdParams,
  GetUserByIdParams,
  GetUserMeThirdPartyAuthorizationUrlParams,
  UpdateUserByIdBody,
  UpdateUserByIdParams,
  UpdateUserMeBody,
} from '@area/shared/schemas/user.schema';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { UsersService } from './users.service';
import { generateStateToken } from '@/utils/token';
import type { ThirdPartyService } from '../third-party';
import type { ClientType } from '@/types/third-party';

/**
 * @class UsersController
 * @description The controller for the users module
 */
export class UsersController {
  private readonly service: UsersService;
  private readonly thirdPartyService: ThirdPartyService;

  constructor(service: UsersService, thirdPartyService: ThirdPartyService) {
    this.service = service;
    this.thirdPartyService = thirdPartyService;
  }

  /**
   * @function createUserMeState
   * @description Create the current user state
   *
   * @param {FastifyRequest} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async createUserMeState(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const stateToken = generateStateToken({ _id: request.user._id, clientType: 'web' });

    return reply.status(HttpStatusCode.OK).send({ stateToken: stateToken });
  }

  /**
   * @function getUserMeThirdPartyAuthorizationUrl
   * @description Connect the current user to a thid party service
   *
   * @param {FastifyRequest} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async getUserMeThirdPartyAuthorizationUrl(
    request: FastifyRequest<{ Params: GetUserMeThirdPartyAuthorizationUrlParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const headers = request.headers;

    if (headers['x-client-type'] !== 'web' && headers['x-client-type'] !== 'mobile') {
      headers['x-client-type'] = 'web';
    }
    const url = await this.thirdPartyService.getThirdPartyAuthorizationUrl(
      request.params.third_party_service,
      request.user._id,
      headers['x-client-type'] as ClientType,
    );

    reply.status(HttpStatusCode.OK).send({ url: url });
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
    await this.service.updateUser(request.user._id, request.body);

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
    await this.service.updateUser(request.params.id, request.body);

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
