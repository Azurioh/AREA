import { HttpStatusCode } from '@area/shared/enums/http-status';
import type {
  CreateActionReactionBody,
  DeleteActionReactionParams,
  UpdateActionReactionExecutionStateBody,
  UpdateActionReactionExecutionStateParams,
} from '@area/shared/schemas/actions-reactions.schema';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ActionsReactionsService } from './actions-reactions.service';

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

  /**
   * @function updateActionReactionExecutionStateById
   * @description Update the action reaction execution state by id
   *
   * @param {FastifyRequest<{ Params: UpdateActionReactionExecutionStateParams, Body: UpdateActionReactionExecutionStateBody }>} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async updateActionReactionExecutionStateById(
    request: FastifyRequest<{
      Params: UpdateActionReactionExecutionStateParams;
      Body: UpdateActionReactionExecutionStateBody;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    await this.service.updateActionReactionExecutionStateById(request.params.id, request.body.executionState);

    return reply.status(HttpStatusCode.NO_CONTENT).send();
  }

  /**
   * @function deleteActionReactionById
   * @description Delete the action reaction by id
   *
   * @param {FastifyRequest<{ Params: DeleteActionReactionParams }>} request The FastifyRequest object
   * @param {FastifyReply} reply The FastifyReply object
   * @returns {Promise<void>} Nothing
   */
  async deleteActionReactionById(
    request: FastifyRequest<{
      Params: DeleteActionReactionParams;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    await this.service.deleteActionReactionById(request.params.id);

    return reply.status(HttpStatusCode.NO_CONTENT).send();
  }
}
