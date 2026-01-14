import { HttpStatusCode } from '@area/shared/enums/http-status';
import { UserRoles } from '@area/shared/enums/user-enums';
import type { UsersService } from '@/modules/users';
import ApiError from '@/utils/api-error';
import * as cryptUtils from '@/utils/crypt'; // We'll spy on this
import * as tokenUtils from '@/utils/token'; // We'll spy on this
import { verifyUserAccess } from '../auth';

// Mock environment
jest.mock('@/utils/environment', () => ({
  environment: {
    CRYPT_SECRET_KEY: 'secret',
    JWT_ACCESS_TOKEN_SECRET: 'jwt-secret',
  },
}));

describe('verifyUserAccess Middleware', () => {
  let mockUserService: jest.Mocked<UsersService>;
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    mockUserService = {
      checkIfUserExist: jest.fn(),
    } as any;

    mockRequest = {
      headers: {},
      user: undefined,
    };

    mockReply = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw BAD_REQUEST if no token is provided', async () => {
    const middleware = verifyUserAccess(mockUserService);
    await expect(middleware(mockRequest, mockReply)).rejects.toThrow(ApiError);
    await expect(middleware(mockRequest, mockReply)).rejects.toThrow('No token was provided');
  });

  it('should throw BAD_REQUEST if token format is invalid (Line 23)', async () => {
    mockRequest.headers.authorization = 'InvalidFormatToken';
    const middleware = verifyUserAccess(mockUserService);

    await expect(middleware(mockRequest, mockReply)).rejects.toThrow(ApiError);
    try {
      await middleware(mockRequest, mockReply);
    } catch (error: any) {
      expect(error.httpCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(error.message).toBe('Invalid authorization format, expected Bearer');
    }
  });

  it('should throw UNAUTHORIZED if adminOnly is true and user is not admin (Line 32)', async () => {
    mockRequest.headers.authorization = 'Bearer validtoken';
    const mockDecodedUser = { _id: 'user1', role: UserRoles.USER };

    jest.spyOn(cryptUtils, 'decryptString').mockReturnValue('decrypted');
    jest.spyOn(tokenUtils, 'verifyToken').mockReturnValue(mockDecodedUser as any);

    const middleware = verifyUserAccess(mockUserService, { adminOnly: true });

    await expect(middleware(mockRequest, mockReply)).rejects.toThrow(ApiError);
    try {
      await middleware(mockRequest, mockReply);
    } catch (error: any) {
      expect(error.httpCode).toBe(HttpStatusCode.UNAUTHORIZED);
      expect(error.message).toBe('Unauthorized');
    }
  });

  it('should throw UNAUTHORIZED if user does not exist', async () => {
    mockRequest.headers.authorization = 'Bearer validtoken';
    const mockDecodedUser = { _id: 'user1', role: UserRoles.USER };

    jest.spyOn(cryptUtils, 'decryptString').mockReturnValue('decrypted');
    jest.spyOn(tokenUtils, 'verifyToken').mockReturnValue(mockDecodedUser as any);
    mockUserService.checkIfUserExist.mockResolvedValue(false);

    const middleware = verifyUserAccess(mockUserService);

    await expect(middleware(mockRequest, mockReply)).rejects.toThrow(ApiError);
  });

  it('should attach user to request if valid', async () => {
    mockRequest.headers.authorization = 'Bearer validtoken';
    const mockDecodedUser = { _id: 'user1', role: UserRoles.USER };

    jest.spyOn(cryptUtils, 'decryptString').mockReturnValue('decrypted');
    jest.spyOn(tokenUtils, 'verifyToken').mockReturnValue(mockDecodedUser as any);
    mockUserService.checkIfUserExist.mockResolvedValue(true);

    const middleware = verifyUserAccess(mockUserService);
    await middleware(mockRequest, mockReply);

    expect(mockRequest.user).toEqual(mockDecodedUser);
  });

  it('should allow admin if adminOnly is true and user is admin', async () => {
    mockRequest.headers.authorization = 'Bearer validtoken';
    const mockDecodedUser = { _id: 'admin1', role: UserRoles.ADMIN };

    jest.spyOn(cryptUtils, 'decryptString').mockReturnValue('decrypted');
    jest.spyOn(tokenUtils, 'verifyToken').mockReturnValue(mockDecodedUser as any);
    mockUserService.checkIfUserExist.mockResolvedValue(true);

    const middleware = verifyUserAccess(mockUserService, { adminOnly: true });
    await middleware(mockRequest, mockReply);

    expect(mockRequest.user).toEqual(mockDecodedUser);
  });
});
