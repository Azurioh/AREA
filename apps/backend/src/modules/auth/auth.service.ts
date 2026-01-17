import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { LoginBody } from '@area/shared/schemas/auth.schema';
import type { Tokens } from '@area/shared/types/auth.types';
import type { StateToken, User } from '@area/shared/types/users.types';
import { type InsertOneResult, MongoServerError } from 'mongodb';
import type { UsersService } from '@/modules/users';
import ApiError from '@/utils/api-error';
import { comparePasswords, hashPassword } from '@/utils/crypt';
import { environment } from '@/utils/environment';
import { generateAccessToken, generateRefreshToken, verifyToken } from '@/utils/token';
import type { ServiceType } from '@/types/third-parties';
import { UserRoles } from '@area/shared/enums/user-enums';
import type { ThirdPartiesService } from '../third-parties';

/**
 * @class AuthService
 * @description Service for managing webhooks.
 */
export class AuthService {
  private usersService: UsersService;
  private thirdPartiesService: ThirdPartiesService;

  constructor(usersService: UsersService, thirdPartiesService: ThirdPartiesService) {
    this.usersService = usersService;
    this.thirdPartiesService = thirdPartiesService;
  }

  /**
   * @function registerUser
   * @description Register a new user.
   *
   * @param {Required<User>} data - The user to register
   * @returns {Promise<Tokens>} Array of webhooks.
   */
  async registerUser(data: Required<User>): Promise<Tokens> {
    try {
      if (!data.password || !data.email) {
        throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Password and email are required to create a classic user.');
      }

      data.password = await hashPassword(data.password);
      const result: InsertOneResult<User> = await this.usersService.createUser(data);

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
    const user = await this.usersService.getUserByEmail(data.email.toLowerCase());

    if (user.authType !== 'classic' || !user.password) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Invalid credentials.');
    }
    if (!(await comparePasswords(data.password, user.password))) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Invalid credentials.');
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

  async loginWithService(service: ServiceType, code: string, state: string): Promise<Tokens & { clientType: string }> {
    const decoded = verifyToken<StateToken>(state, environment.JWT_STATE_TOKEN_SECRET);
    const authorizatonFunction = await this.thirdPartiesService.getAuthorizationFunction(service);

    if (!authorizatonFunction) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Service not supported.');
    }

    const data = await authorizatonFunction('', code);
    let userId: string = '';

    if (!data || !('id' in data)) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Failed to authenticate user to the service.');
    }

    const account = await this.thirdPartiesService.getThirdPartyAccountByServiceAccountId(service, data.id, false);

    if (account) {
      const user = await this.usersService.getUserById(account.userId);
      userId = user._id.toString();

      data.userId = userId;
      await this.thirdPartiesService.updateThirdPartyAccount(service, account.userId, data);
    } else if ('username' in data && service === 'github') {
      const user: User = {
        name: data.username,
        role: UserRoles.USER,
        darkModeEnabled: false,
        dyslexiaEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        authType: service,
      };
      const insertedUser = await this.usersService.createUser(user);

      userId = insertedUser.insertedId.toString();

      data.userId = userId;
      await this.thirdPartiesService.createThirdPartyAccount(data);
    }

    const accessToken = generateAccessToken({
      _id: userId,
      role: UserRoles.USER,
      darkModeEnabled: false,
      dyslexiaEnabled: false,
    });
    const refreshToken = generateRefreshToken({ _id: userId }, true);

    return { accessToken, refreshToken, clientType: decoded.clientType };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const decoded = verifyToken<{ _id: string }>(refreshToken, environment.JWT_REFRESH_TOKEN_SECRET);
    const user = await this.usersService.getUserById(decoded._id);

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'User not found.');
    }

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      role: user.role,
      darkModeEnabled: user.darkModeEnabled,
      dyslexiaEnabled: user.dyslexiaEnabled,
    });

    return { accessToken };
  }
}
