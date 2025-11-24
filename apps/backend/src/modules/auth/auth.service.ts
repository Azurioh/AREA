import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { LoginBody } from '@area/shared/schemas/auth.schema';
import type { Tokens } from '@area/shared/types/auth.types';
import type { User } from '@area/shared/types/user.types';
import { MongoServerError } from 'mongodb';
import type { UsersRepository } from '@/modules/users';
import ApiError from '@/utils/api-error';
import { comparePasswords, hashPassword } from '@/utils/crypt';
import { generateAccessToken, generateRefreshToken } from '@/utils/token';

/**
 * @class AuthService
 * @description Service for managing webhooks.
 */
export class AuthService {
  private repository: UsersRepository;

  constructor(repository: UsersRepository) {
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
      data.password = await hashPassword(data.password);

      const result = await this.repository.createUser(data);

      if (!result.acknowledged) {
        throw new ApiError(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'Failed to create the user, please contact an administrator.',
        );
      }

      const accessToken = generateAccessToken({
        _id: result.insertedId.toString(),
        ...data,
      });
      const refreshToken = generateRefreshToken({ _id: result.insertedId.toString() });

      return { accessToken, refreshToken };
    } catch (error: unknown) {
      if (error instanceof MongoServerError && error.code === 11000) {
        // 11000 is the error code for duplicates
        throw new ApiError(HttpStatusCode.CONFLICT, 'Failed to create user, user already exists.');
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
  async loginUser(data: LoginBody): Promise<Tokens> {
    const user = await this.repository.getUserByEmail(data.email);

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'User not found.');
    }
    if (!(await comparePasswords(data.password, user.password))) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Password is invalid.');
    }

    const accessToken = generateAccessToken({
      ...user,
      _id: user._id.toString(),
    });
    const refreshToken = generateRefreshToken({ _id: user._id.toString() }, data.rememberMe);

    return { accessToken, refreshToken };
  }
}
