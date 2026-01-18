import type { CreateActionReactionBody, GetMeActionsReactions } from '@area/shared/schemas/actions-reactions.schema';
import type { MaybeUndefined } from '@area/shared/utils/common';
import { ApiClient } from '@/lib/ApiClient';

/**
 * @class ActionReactionClient
 * @description Client for interacting with the Action-Reaction API.
 */
export class ActionReactionClient extends ApiClient {
  /**
   * @function createWorkflow
   * @description Creates a new action-reaction workflow for the authenticated user.
   *
   * @param {CreateActionReactionBody} body - The body of the request containing action and reaction details.
   * @returns {Promise<void>} A promise that resolves when the workflow is created.
   */
  async createWorkflow(body: CreateActionReactionBody): Promise<void> {
    try {
      await this.fetch<void>('/actions-reactions/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  }

  /**
   * @function getAllWorkflows
   * @description Retrieves all action-reaction workflows for the authenticated user.
   *
   * @returns {Promise<MaybeUndefined<GetMeActionsReactions>>} A promise that resolves to the user's workflows or undefined.
   */
  async getAllWorkflows(): Promise<MaybeUndefined<GetMeActionsReactions>> {
    const response = await this.fetch<GetMeActionsReactions>('/actions-reactions/v1/me', {
      method: 'GET',
      credentials: 'include',
    });

    return response;
  }

  /**
   * @function deleteWorkflow
   * @description Deletes an action-reaction workflow by its ID.
   *
   * @param {string} id - The workflow ID
   * @returns {Promise<void>} A promise that resolves when the workflow is deleted.
   */
  async deleteWorkflow(id: string): Promise<void> {
    await this.fetch<void>(`/actions-reactions/v1/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  }
}
