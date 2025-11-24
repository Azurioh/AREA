import type { UserRepository } from '@/repositories/user.repository';
import { Tokens } from '@area/shared/types/auth.type';
import { MongoServerError } from 'mongodb';
import { User } from '@area/shared/types/user.type';
import ApiError from '@/utils/api-error';
import { HttpStatusCode } from '@area/shared/enums/http-status';

/**
 * @class AuthService
 * @description Service for managing webhooks.
 */
export class AuthService {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  /**
   * @function registerUser
   * @description Register a new user.
   *
   * @param {User} data - The user to register
   * @returns {Promise<Tokens>} Array of webhooks.
   */
  async registerUser(data: User): Promise<Tokens> {
    try {
        const result = await this.repository.createUser(data);

        if (!result) {
            throw new ApiError(
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                'Failed to create the user, please contact an administrator.',
            );
        }
        return {access_token: "", refresh_token: ""};
    } catch (error: unknown) {
        if (error instanceof MongoServerError && error.codeName == 'IndexKeySpecsConflict') {
            throw new ApiError(
                HttpStatusCode.CONFLICT,
                'Failed to create user, user already exists.',
            );
        }
        throw error;
    }
  }

  /**
   * @function loginUser
   * @description Login a user.
   *
   * @param {Omit<User, 'name'>} data - The user to register
   * @returns {Promise<Tokens>} Array of webhooks.
   */
  async loginUser(data: Omit<User, 'name'>): Promise<Tokens> {
    const user = await this.repository.getUserByEmail(data.email)

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'User not found.');
    }
    return {access_token: "", refresh_token: ""};
  }
}
