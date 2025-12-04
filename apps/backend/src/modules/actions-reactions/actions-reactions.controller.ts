import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { CreateUserMeActionReactionBody } from '@area/shared/schemas/action-reaction.schema';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ActionsReactionsService } from '../actions-reactions';

/**
 * @class ActionsReactionsController
 * @description The controller for the actions reactions module
 */
export class ActionsReactionsController {
  private readonly service: ActionsReactionsService;

  constructor(service: ActionsReactionsService) {
    this.service = service;
  }

  /**
   * @function createUserMeActionReaction
   * @description Create action reaction for the current user
   *
   * @param {FastifyRequest<{ Body: CreateUserMeActionReaction }>} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async createActionReaction(
    request: FastifyRequest<{ Body: CreateUserMeActionReactionBody }>,
    reply: FastifyReply,
  ): Promise<void> {
    const body = request.body;
    await this.service.createActionReaction(request.user._id, body.action, body.reaction);

    return reply.status(HttpStatusCode.NO_CONTENT).send();
  }
}
