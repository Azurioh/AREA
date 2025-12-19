import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { LoginBody } from '@area/shared/schemas/auth.schema';
import type { Tokens } from '@area/shared/types/auth.types';
import type { User } from '@area/shared/types/users.types';
import { type InsertOneResult, MongoServerError } from 'mongodb';
import type { UsersRepository } from '@/modules/users';
import ApiError from '@/utils/api-error';
import { comparePasswords, hashPassword } from '@/utils/crypt';
import { environment } from '@/utils/environment';
import { generateAccessToken, generateRefreshToken, verifyToken } from '@/utils/token';

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
      let result: InsertOneResult<User>;

      try {
        result = await this.repository.createUser(data);
      } catch (error) {
        if (error instanceof MongoServerError && error.code === 11000) {
          throw new ApiError(HttpStatusCode.CONFLICT, 'Failed to create user, user already exists.');
        }
        throw error;
      }

      if (!result.acknowledged) {
        throw new ApiError(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'Failed to create the user, please contact an administrator.',
        );
      }

      const accessToken = generateAccessToken({
        _id: result.insertedId.toString(),
        role: data.role,
        darkModeEnabled: data.darkModeEnabled,
        dyslexiaType: data.dyslexiaType,
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
      _id: user._id.toString(),
      role: user.role,
      darkModeEnabled: user.darkModeEnabled,
      dyslexiaType: user.dyslexiaType,
    });
    const refreshToken = generateRefreshToken({ _id: user._id.toString() }, data.rememberMe);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const decoded = verifyToken<{ _id: string }>(refreshToken, environment.JWT_REFRESH_TOKEN_SECRET);
    const user = await this.repository.getUserById(decoded._id);

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'User not found.');
    }

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      role: user.role,
      darkModeEnabled: user.darkModeEnabled,
      dyslexiaType: user.dyslexiaType,
    });

    return { accessToken };
  }
}
