import { HttpStatusCode } from '@area/shared/enums/http-status';
import type {
  GetThirdPartyAuthorizationUrlParams,
  GetThirdPartyStatusParams,
} from '@area/shared/schemas/third-parties.schema';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
  ClientType,
  ServiceType,
  ThirdPartyAuthorizationParams,
  ThirdPartyAuthorizationQueryString,
} from '@/types/third-parties';
import { environment } from '@/utils/environment';
import type { ThirdPartiesService } from './third-parties.service';

/**
 * @class UsersController
 * @description The controller for the users module
 */
export class ThirdPartiesController {
  private readonly service: ThirdPartiesService;

  constructor(service: ThirdPartiesService) {
    this.service = service;
  }

  /**
   * @function getThirdPartyAuthorizationUrl
   * @description Connect the current user to a thid party service
   *
   * @param {FastifyRequest} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async getThirdPartyAuthorizationUrl(
    request: FastifyRequest<{ Params: GetThirdPartyAuthorizationUrlParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const headers = request.headers;

    if (headers['x-client-type'] !== 'web' && headers['x-client-type'] !== 'mobile') {
      headers['x-client-type'] = 'web';
    }
    const url = await this.service.getThirdPartyAuthorizationUrl(
      request.params.service.toLowerCase() as ServiceType,
      request.user._id,
      headers['x-client-type'] as ClientType,
    );

    reply.status(HttpStatusCode.OK).send({ url: url });
  }

  /**
   * @function authorizeToService
   * @description Authorize a user to the given service.
   *
   * @param {FastifyRequest} request The Fastify request object.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   */
  async authorizeToService(
    request: FastifyRequest<{ Params: ThirdPartyAuthorizationParams; Querystring: ThirdPartyAuthorizationQueryString }>,
    reply: FastifyReply,
  ): Promise<void> {
    const query = request.query;
    const status = { code: HttpStatusCode.BAD_REQUEST, text: 'error' };
    let callbackUrl = environment.WEB_OAUTH_CALLBACK_URL;

    if (query.code) {
      const result = await this.service.authorizeToService(
        request.params.service as ServiceType,
        query.code,
        query.state,
      );

      if (result.clientType === 'mobile') {
        callbackUrl = environment.MOBILE_OAUTH_CALLBACK_URL;
      }
      if (result.success) {
        status.code = HttpStatusCode.NO_CONTENT;
        status.text = 'success';
      }
    }
    reply.redirect(`${callbackUrl}?status=${status.text}`);
  }

  /**
   * @function getThirdPartyStatus
   * @description Get the status of the given third party service.
   *
   * @param {FastifyRequest} request The Fastify request object.
   * @param {FastifyReply} reply The Fastify reply object for sending the response.
   */
  async getThirdPartyStatus(
    request: FastifyRequest<{ Params: GetThirdPartyStatusParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const connected = await this.service.getThirdPartyStatus(
      request.params.service.toLowerCase() as ServiceType,
      request.user._id,
    );

    reply.status(HttpStatusCode.OK).send({ connected: connected });
  }
}
