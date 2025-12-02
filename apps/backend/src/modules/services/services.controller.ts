import type {
  GetActionReturnedValuesParams,
  GetActionsDetailsParams,
  GetReactionDetailsParams,
  GetServiceActionsParams,
  GetServiceReactionsParams,
} from '@area/shared/schemas/services.schema';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ServicesService } from './services.service';

/**
 * @class ServicesController
 * @description Controller for handling service-related requests
 */
export class ServicesController {
  private readonly service: ServicesService;

  constructor(service: ServicesService) {
    this.service = service;
  }

  /**
   * @function getServiceActions
   * @description Get all actions for a specific service
   *
   * @param {FastifyRequest<{ Params: GetServiceActionsParams }>} request The Fastify request object
   * @param {FastifyReply} reply The Fastify reply object
   * @returns {Promise<void>} A promise that resolves when the response is sent
   */
  async getServiceActions(
    request: FastifyRequest<{ Params: GetServiceActionsParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { serviceName } = request.params;

    const actions = await this.service.getServiceActions(serviceName);

    reply.status(200).send(actions);
  }

  /**
   * @function getActionDetails
   * @description Get details of a specific action for a service
   *
   * @param {FastifyRequest<{ Params: GetActionsDetailsParams }>} request The Fastify request object
   * @param {FastifyReply} reply The Fastify reply object
   * @returns {Promise<void>} A promise that resolves when the response is sent
   */
  async getActionDetails(
    request: FastifyRequest<{ Params: GetActionsDetailsParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { serviceName, actionName } = request.params;
    const userId = request.user?._id || '';

    const actionDetails = await this.service.getActionDetails(serviceName, actionName, userId);

    console.log(actionDetails);
    reply.status(200).send(actionDetails);
  }

  /**
   * @function getActionReturnedValues
   * @description Get the returned values of a specific action for a service
   *
   * @param {FastifyRequest<{ Params: GetActionReturnedValuesParams }>} request The Fastify request object
   * @param {FastifyReply} reply The Fastify reply object
   * @returns {Promise<void>} A promise that resolves when the response is sent
   */
  async getActionReturnedValues(
    request: FastifyRequest<{ Params: GetActionReturnedValuesParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { serviceName, actionName } = request.params;

    const returnedValues = await this.service.getActionReturnedValues(serviceName, actionName);

    reply.status(200).send(returnedValues);
  }

  /**
   * @function getServiceReactions
   * @description Get all reactions for a specific service
   *
   * @param {FastifyRequest<{ Params: GetServiceReactionsParams }>} request The Fastify request object
   * @param {FastifyReply} reply The Fastify reply object
   * @returns {Promise<void>} A promise that resolves when the response is sent
   */
  async getServiceReactions(
    request: FastifyRequest<{ Params: GetServiceReactionsParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { serviceName } = request.params;

    const reactions = await this.service.getServiceReactions(serviceName);

    reply.status(200).send(reactions);
  }

  /**
   * @function getReactionDetails
   * @description Get details of a specific reaction for a service
   *
   * @param {FastifyRequest<{ Params: GetReactionDetailsParams }>} request The Fastify request object
   * @param {FastifyReply} reply The Fastify reply object
   * @returns {Promise<void>} A promise that resolves when the response is sent
   */
  async getReactionDetails(
    request: FastifyRequest<{ Params: GetReactionDetailsParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { serviceName, reactionName } = request.params;
    const userId = request.user?._id || '';

    const reactionDetails = await this.service.getReactionDetails(serviceName, reactionName, userId);

    console.log(reactionDetails);

    reply.status(200).send(reactionDetails);
  }
}
