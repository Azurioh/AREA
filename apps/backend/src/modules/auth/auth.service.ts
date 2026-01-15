import crypto from 'node:crypto';
import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { LoginBody, LoginHeaders, RefreshTokenHeaders, RegisterHeaders } from '@area/shared/schemas/auth.schema';
import type { Tokens } from '@area/shared/types/auth.types';
import type { AccessToken, User } from '@area/shared/types/users.types';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type InsertOneResult, MongoServerError } from 'mongodb';
import type { UsersRepository } from '@/modules/users';
import ApiError from '@/utils/api-error';
import { comparePasswords, decryptString, hashPassword } from '@/utils/crypt';
import { environment } from '@/utils/environment';
import { generateAccessToken, generateRefreshToken, verifyToken } from '@/utils/token';
import type { AuthRepository } from './auth.repository';

/**
 * @class AuthService
 * @description Service for managing webhooks.
 */
export class AuthService {
  private userRepository: UsersRepository;
  private repository: AuthRepository;

  constructor(userRepository: UsersRepository, repository: AuthRepository) {
    this.userRepository = userRepository;
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
      const result: InsertOneResult<User> = await this.userRepository.createUser(data);

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
        dyslexiaEnabled: data.dyslexiaEnabled,
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
    const user = await this.userRepository.getUserByEmail(data.email);

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
      dyslexiaEnabled: user.dyslexiaEnabled,
    });
    const refreshToken = generateRefreshToken({ _id: user._id.toString() }, data.rememberMe);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    const decoded = verifyToken<{ _id: string }>(refreshToken, environment.JWT_REFRESH_TOKEN_SECRET);
    const user = await this.userRepository.getUserById(decoded._id);

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'User not found.');
    }

    const newAccessToken = generateAccessToken({
      _id: user._id.toString(),
      role: user.role,
      darkModeEnabled: user.darkModeEnabled,
      dyslexiaEnabled: user.dyslexiaEnabled,
    });

    const newRefreshToken = generateRefreshToken({
      _id: user._id.toString(),
    });

    return { newAccessToken, newRefreshToken };
  }

  getRefreshToken(request: FastifyRequest): string | undefined {
    if (
      !request.headers['x-client-type'] ||
      (request.headers['x-client-type'] !== 'mobile' && request.headers['x-refresh-token']) ||
      typeof request.headers['x-refresh-token'] !== 'string'
    ) {
      return request.cookies['refresh-token'];
    }
    return request.headers['x-refresh-token'];
  }

  async storeRefreshTokenInDatabase(userId: string, refreshToken: string, expiresAt: Date): Promise<void> {
    const hashdedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.repository.storeRefreshToken(userId, hashdedToken, expiresAt);
  }

  async checkIfRefreshTokenIsValid(refreshToken: string): Promise<boolean> {
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    return await this.repository.isRefreshTokenValid(hashedToken);
  }

  async invalidateAccessToken(request: FastifyRequest, accessToken?: string): Promise<void> {
    if (!accessToken) {
      return;
    }
    const decryptedToken = decryptString(accessToken, environment.CRYPT_SECRET_KEY);
    const payload = verifyToken<AccessToken>(decryptedToken, environment.JWT_ACCESS_TOKEN_SECRET);
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return;
    }
    await request.server.redis.setex(`blacklist:${accessToken}`, payload.exp - Math.floor(Date.now() / 1000), 'true');
  }

  async invalidateRefreshToken(refreshToken: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.repository.deleteRefreshToken(hashedToken);
  }

  async sendTokensToUser(
    accessToken: string,
    refreshToken: string,
    request: FastifyRequest<{ Headers: LoginHeaders | RegisterHeaders | RefreshTokenHeaders }>,
    reply: FastifyReply,
    isRegistering: boolean = false,
  ) {
    if (request.headers['x-client-type'] === 'mobile') {
      reply.status(HttpStatusCode.OK).send({ accessToken, refreshToken });
      return;
    }

    reply.setCookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: environment.NODE_ENV !== 'development',
      sameSite: environment.NODE_ENV !== 'development' ? 'lax' : 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    reply.status(isRegistering ? HttpStatusCode.CREATED : HttpStatusCode.OK).send({ accessToken });
  }
}
