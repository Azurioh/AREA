import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { ActionReturnValues, IAction, IReaction } from '@area/shared/types/services.types';
import { serviceManager } from '@/integrations';
import ApiError from '@/utils/api-error';

/**
 * @class ServicesService
 * @description The service for managing services, actions, and reactions
 */
export class ServicesService {
  /**
   * @function getServiceActions
   * @description Get the actions of a service
   *
   * @param {string} serviceName The name of the service
   * @returns {Promise<IAction[]>} The actions of the service
   */
  async getServiceActions(serviceName: string): Promise<Pick<IAction, 'name' | 'description'>[]> {
    const service = serviceManager.get(serviceName);
    if (!service) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, `Service ${serviceName} not found`);
    }

    const actions = service.actions.map((action) => ({
      name: action.name,
      description: action.description,
    }));

    return actions;
  }

  /**
   * @function getActionDetails
   * @description Get the details of an action
   *
   * @param {string} serviceName The name of the service
   * @param {string} actionName The name of the action
   * @param {string} userId The id of the users
   * @returns {Promise<IAction>} The details of the action
   */
  async getActionDetails(
    serviceName: string,
    actionName: string,
    userId: string,
  ): Promise<Omit<IAction, 'returnedValues'>> {
    const service = serviceManager.get(serviceName);
    if (!service) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, `Service ${serviceName} not found`);
    }

    const action = service.actions.find((a) => a.name === actionName);
    if (!action) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, `Action ${actionName} not found in service ${serviceName}`);
    }

    await action.refreshParams(userId);

    const { returnedValues, ...actionWithoutReturnedValues } = action;

    return actionWithoutReturnedValues;
  }

  /**
   * @function getActionReturnedValues
   * @description Get the returned values of an action
   *
   * @param {string} serviceName The name of the service
   * @param {string} actionName The name of the action
   * @returns {Promise<ActionReturnValues[]>} The returned values of the action
   */
  async getActionReturnedValues(serviceName: string, actionName: string): Promise<Omit<ActionReturnValues, 'path'>[]> {
    const service = serviceManager.get(serviceName);
    if (!service) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, `Service ${serviceName} not found`);
    }

    const action = service.actions.find((a) => a.name === actionName);
    if (!action) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, `Action ${actionName} not found in service ${serviceName}`);
    }

    const returnedValues = action.returnedValues.map((returnValue) => {
      return {
        key: returnValue.key,
        description: returnValue.description,
        type: returnValue.type,
      };
    });

    return returnedValues;
  }

  /**
   * @function getServiceReactions
   * @description Get the reactions of a service
   *
   * @param {string} serviceName The name of the service
   * @returns {IReaction[]} The reactions of the service
   */
  async getServiceReactions(serviceName: string): Promise<Pick<IReaction, 'name' | 'description'>[]> {
    const service = serviceManager.get(serviceName);
    if (!service) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, `Service ${serviceName} not found`);
    }

    const reactions = service.reactions.map((reaction) => ({
      name: reaction.name,
      description: reaction.description,
    }));

    return reactions;
  }

  /**
   * @function getReactionDetails
   * @description Get the details of a reaction
   *
   * @param {string} serviceName The name of the service
   * @param {string} reactionName The name of the reaction
   * @param {string} userId The id of the users
   * @returns {Promise<IReaction>} The details of the reaction
   */
  async getReactionDetails(serviceName: string, reactionName: string, userId: string): Promise<IReaction> {
    const service = serviceManager.get(serviceName);
    if (!service) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, `Service ${serviceName} not found`);
    }

    const reaction = service.reactions.find((r) => r.name === reactionName);
    if (!reaction) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, `Reaction ${reactionName} not found in service ${serviceName}`);
    }

    await reaction.refreshParams(userId);

    return reaction;
  }
}
