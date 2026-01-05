import type { UpdateActionReactionExecutionStateBody } from '@area/shared/schemas/actions-reactions.schema';
import { ApiClient } from '@/lib/ApiClient';

/**
 * @class ActionReactionClient
 * @description Client for interacting with the Action-Reaction API.
 */
export class ExecutionState extends ApiClient {
  /**
   * @function updateExecutionState
   * @description Updates the execution state of an existing workflow.
   *
   * @param {string} id - Workflow identifier.
   * @param {boolean} executionState - Desired execution state.
   */
  async updateExecutionState(id: string, executionState: boolean): Promise<void> {
    const body: UpdateActionReactionExecutionStateBody = { executionState };

    await this.fetch<void>(`/actions-reactions/v1/${id}/execution-state`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
      throwError: true,
    });
  }
}
