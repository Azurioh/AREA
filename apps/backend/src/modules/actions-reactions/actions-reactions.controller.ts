import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { CreateActionReactionBody } from '@area/shared/schemas/action-reaction.schema';
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
   * @function createActionReaction
   * @description Create action reaction for the current user
   *
   * @param {FastifyRequest<{ Body: CreateActionReactionBody }>} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async createActionReaction(
    request: FastifyRequest<{ Body: CreateActionReactionBody }>,
    reply: FastifyReply,
  ): Promise<void> {
    const body = request.body;
    await this.service.createActionReaction(request.user._id, body.action, body.reaction);

    return reply.status(HttpStatusCode.NO_CONTENT).send();
  }

  /**
   * @function getMeActionsReactions
   * @description get the current user action reaction
   *
   * @param {FastifyRequest} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async getMeActionsReactions(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const actionsReactions = await this.service.getMeActionsReactions(request.user._id);

    return reply.status(HttpStatusCode.OK).send(actionsReactions);
  }
}
