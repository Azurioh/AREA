import type { CreateActionReactionBody } from '../../../../../../packages/shared/schemas/action-reaction.schema';
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
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  }
}
