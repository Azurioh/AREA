import type { AboutResponse } from '@area/shared/schemas/about.schema';
import type {
  GetActionDetailsResponse,
  GetActionReturnedValuesResponse,
  GetServiceActionsResponse,
  GetServiceReactionsResponse,
} from '@area/shared/schemas/services.schema';
import type { MaybeUndefined } from '@area/shared/utils/common';
import { ApiClient } from '@/lib/ApiClient';

/**
 * @class ServicesClient
 * @description Client for interacting with the Services API.
 */
export class ServicesClient extends ApiClient {
  /**
   * @function listServices
   * @description Fetches a list of all available services.
   *
   * @returns {Promise<MaybeUndefined<string[]>>} A promise that resolves to an array of service names.
   */
  async listServices(): Promise<MaybeUndefined<string[]>> {
    const response = await this.fetch<AboutResponse>('/about.json', {
      method: 'GET',
      skipAuth: true,
    });

    const services = response?.server.services.map((service) => service.name);

    return services;
  }

  /**
   * @function listServiceActions
   * @description Fetches a list of actions for a specific service.
   *
   * @param {string} service - The name of the service.
   * @returns {Promise<GetServiceActionsResponse>} A promise that resolves to an array of service actions.
   */
  async listServiceActions(service: string): Promise<MaybeUndefined<GetServiceActionsResponse>> {
    const response = await this.fetch<GetServiceActionsResponse>(`/services/v1/${service}/actions`, {
      method: 'GET',
      skipAuth: true,
    });

    return response;
  }

  /**
   * @function getActionDetails
   * @description Fetches the details of a specific action for a service.
   *
   * @param {string} service - The name of the service.
   * @param {string} action - The name of the action.
   * @returns {Promise<MaybeUndefined<GetActionDetailsResponse>>} A promise that resolves to the action details.
   */
  async getActionDetails(service: string, action: string): Promise<MaybeUndefined<GetActionDetailsResponse>> {
    const response = await this.fetch<GetActionDetailsResponse>(`/services/v1/${service}/actions/${action}`, {
      method: 'GET',
    });

    return response;
  }

  /**
   * @function getActionReturnedValues
   * @description Fetches the returned values of a specific action for a service.
   *
   * @param {string} service - The name of the service.
   * @param {string} action - The name of the action.
   * @returns {Promise<MaybeUndefined<GetActionReturnedValuesResponse>>} A promise that resolves to the action's returned values.
   */
  async getActionReturnedValues(
    service: string,
    action: string,
  ): Promise<MaybeUndefined<GetActionReturnedValuesResponse>> {
    const response = await this.fetch<GetActionReturnedValuesResponse>(
      `/services/v1/${service}/actions/${action}/return-values`,
      {
        method: 'GET',
      },
    );

    return response;
  }

  /**
   * @function listServiceReactions
   * @description Fetches a list of reactions for a specific service.
   *
   * @param {string} service - The name of the service.
   * @returns {Promise<MaybeUndefined<GetServiceReactionsResponse>>} A promise that resolves to an array of service reactions.
   */
  async listServiceReactions(service: string): Promise<MaybeUndefined<GetServiceReactionsResponse>> {
    const response = await this.fetch<GetServiceReactionsResponse>(`/services/v1/${service}/reactions`, {
      method: 'GET',
      skipAuth: true,
    });

    return response;
  }

  /**
   * @function getReactionDetails
   * @description Fetches the details of a specific reaction for a service.
   *
   * @param {string} service - The name of the service.
   * @param {string} reaction - The name of the reaction.
   * @returns {Promise<MaybeUndefined<GetActionDetailsResponse>>} A promise that resolves to the reaction details.
   */
  async getReactionDetails(service: string, reaction: string): Promise<MaybeUndefined<GetActionDetailsResponse>> {
    const response = await this.fetch<GetActionDetailsResponse>(`/services/v1/${service}/reactions/${reaction}`, {
      method: 'GET',
    });

    return response;
  }
}
