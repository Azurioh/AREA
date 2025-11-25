import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { UpdateUserMeBody } from '@area/shared/schemas/user.schema';
import type { User } from '@area/shared/types/user.types';
import type { InsertOneResult } from 'mongodb';
import ApiError from '@/utils/api-error';
import type { UsersRepository } from './users.repository';

export class UsersService {
  private readonly userRepository: UsersRepository;

  constructor(userRepository: UsersRepository) {
    this.userRepository = userRepository;
  }

  /**
   * @function createUser
   * @description Create a new user
   *
   * @param {User} user The user to create
   * @returns {Promise<InsertOneResult<User>>} The created user
   */
  async createUser(user: User): Promise<InsertOneResult<User>> {
    const userAlreadyExist = await this.userRepository.getUserByEmail(user.email);
    if (userAlreadyExist) {
      throw new ApiError(HttpStatusCode.CONFLICT, 'User with same email already exists');
    }

    const userCreated = await this.userRepository.createUser(user);

    if (!userCreated.acknowledged) {
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        'Failed to created the user, please contact an administrator',
      );
    }

    return userCreated;
  }

  /**
   * @function checkIfUserExist
   * @description Check if a user exists
   *
   * @param {string} id The id of the user
   * @returns {Promise<boolean>} True if the user exists, false otherwise
   */
  async checkIfUserExist(id: string): Promise<boolean> {
    const user = await this.userRepository.getUserById(id);

    return user !== null;
  }

  /**
   * @function getUserByEmail
   * @description Get a user by email
   *
   * @param {string} email The email of the user
   * @returns {Promise<User>} The user
   */
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'User not found');
    }

    return user;
  }

  /**
   * @function getUserById
   * @description Get a user by id
   *
   * @param {string} id The id of the user
   * @returns {Promise<User>} The user
   */
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'User not found');
    }

    return user;
  }

  /**
   * @function updateUserMe
   * @description Update the current user
   *
   * @param {string} id The id of the user
   * @param {UpdateUserMeBody} user The user to update
   * @returns {Promise<void>} The updated user
   */
  async updateUserMe(id: string, user: UpdateUserMeBody): Promise<void> {
    return this.updateUser(id, user);
  }

  /**
   * @function deleteUser
   * @description Delete a user
   *
   * @param {string} id The id of the user
   * @returns {Promise<void>} The deleted user
   */
  async deleteUser(id: string): Promise<void> {
    const userDeleted = await this.userRepository.deleteUser(id);

    if (!userDeleted.acknowledged) {
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        'Failed to delete the user, please contact an administrator',
      );
    }

    if (userDeleted.deletedCount === 0) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'User not found');
    }
  }

  /**
   * @function updateUser
   * @description Update a user
   *
   * @param {string} id The id of the user
   * @param {User} user The user to update
   * @returns {Promise<void>} The updated user
   */
  private async updateUser(id: string, user: Partial<User>): Promise<void> {
    const userUpdated = await this.userRepository.updateUser(id, user);

    if (!userUpdated.acknowledged) {
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        'Failed to update the user, please contact an administrator',
      );
    }

    if (userUpdated.matchedCount === 0) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'User not found');
    }
  }
}
