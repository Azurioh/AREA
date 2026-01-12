import type { GetAllUsers } from '@area/shared/schemas/users.schema';
import type { MaybeUndefined } from '@area/shared/utils/common';
import { ApiClient } from '@/lib/ApiClient';

/**
 * @class UserInformationClient
 * @description Client to fetch user information
 */
export class UserAdminManagementClient extends ApiClient {
  /**
   * @function getUserInformation
   * @description Fetch user information
   *
   * @returns {Promise<MaybeUndefined<GetAllUsers>>} The user information
   */
  async getAllUsers(): Promise<MaybeUndefined<GetAllUsers>> {
    const response = await this.fetch<GetAllUsers>('/users/v1/', {
      method: 'GET',
    });

    return response;
  }

  /**
   * @function deleteUser
   * @description Delete a user by ID
   *
   * @param {string} userId The ID of the user to delete
   * @returns {Promise<MaybeUndefined<void>>} The response from the server
   */
  async deleteUser(userId: string): Promise<MaybeUndefined<void>> {
    const response = await this.fetch<void>(`/users/v1/${userId}`, {
      method: 'DELETE',
    });

    return response;
  }
}
