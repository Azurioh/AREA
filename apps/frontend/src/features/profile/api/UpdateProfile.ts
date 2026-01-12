import type { UpdateUserMeBody } from '@area/shared/schemas/users.schema';
import { ApiClient } from '@/lib/ApiClient';

/**
 * @class UpdateUser
 * @description Client for interacting with the Action-Reaction API.
 */
export class UpdateUser extends ApiClient {
  /**
   * @function updateExecutionState
   * @description Updates the execution state of an existing workflow.
   *
   */
  async updateExecutionState(name: string, darkModeEnabled: boolean, dyslexiaEnabled: boolean): Promise<void> {
    const body: UpdateUserMeBody = { name, darkModeEnabled, dyslexiaEnabled };

    await this.fetch<UpdateUserMeBody>('/users/v1/me', {
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
