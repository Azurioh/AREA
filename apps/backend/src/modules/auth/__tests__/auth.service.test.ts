import { UserRoles } from '@area/shared/enums/user-enums';
import type { User } from '@area/shared/types/users.types';
import { MongoServerError, ObjectId } from 'mongodb';
import type { UsersRepository } from '@/modules/users';
import ApiError from '@/utils/api-error';
import { comparePasswords, hashPassword } from '@/utils/crypt';
import { environment } from '@/utils/environment';
import { generateAccessToken, generateRefreshToken, verifyToken } from '@/utils/token';
import { AuthService } from '../auth.service';

jest.mock('@/utils/crypt');
jest.mock('@/utils/token');

describe('AuthService', () => {
  let authService: AuthService;
  let mockRepository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    mockRepository = {
      createIndex: jest.fn(),
      createUser: jest.fn(),
      getUserById: jest.fn(),
      getUserByEmail: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    } as any;

    authService = new AuthService(mockRepository);

    // Default mock implementations
    (hashPassword as jest.Mock).mockResolvedValue('hashed_password');
    (comparePasswords as jest.Mock).mockResolvedValue(true);
    (generateAccessToken as jest.Mock).mockReturnValue('access_token');
    (generateRefreshToken as jest.Mock).mockReturnValue('refresh_token');
    (verifyToken as jest.Mock).mockReturnValue({ _id: '123' });
  });

  describe('registerUser', () => {
    const newUser: User = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: UserRoles.USER,
      darkModeEnabled: false,
      dyslexiaEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should successfully register a new user', async () => {
      mockRepository.createUser.mockResolvedValue({
        acknowledged: true,
        insertedId: new ObjectId('507f1f77bcf86cd799439011'),
      } as any);

      const result = await authService.registerUser(newUser);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(hashPassword).toHaveBeenCalledWith('password123');
    });

    it('should throw error if user creation is not acknowledged', async () => {
      mockRepository.createUser.mockResolvedValue({
        acknowledged: false,
      } as any);

      await expect(authService.registerUser(newUser)).rejects.toThrow(ApiError);
    });

    it('should throw CONFLICT error if user already exists (duplicate key)', async () => {
      const mongoError = new MongoServerError({ errmsg: 'E11000 duplicate key error' });
      mongoError.code = 11000;

      mockRepository.createUser.mockRejectedValue(mongoError);

      await expect(authService.registerUser(newUser)).rejects.toThrow('Failed to create user, user already exists.');
    });

    it('should rethrow other errors', async () => {
      const error = new Error('Database connection failed');
      mockRepository.createUser.mockRejectedValue(error);

      await expect(authService.registerUser(newUser)).rejects.toThrow('Database connection failed');
    });
  });

  describe('loginUser', () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123',
      rememberMe: true,
    };

    const mockUser = {
      _id: new ObjectId('507f1f77bcf86cd799439011'),
      email: 'john@example.com',
      password: 'hashed_password',
      role: UserRoles.USER,
      darkModeEnabled: false,
      dyslexiaEnabled: false,
    };

    it('should successfully login user', async () => {
      mockRepository.getUserByEmail.mockResolvedValue(mockUser as any);
      (comparePasswords as jest.Mock).mockResolvedValue(true);

      const result = await authService.loginUser(loginData);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockRepository.getUserByEmail).toHaveBeenCalledWith(loginData.email);
      expect(generateRefreshToken).toHaveBeenCalledWith({ _id: mockUser._id.toString() }, true);
    });

    it('should throw NOT_FOUND if user does not exist', async () => {
      mockRepository.getUserByEmail.mockResolvedValue(null);

      await expect(authService.loginUser(loginData)).rejects.toThrow('User not found.');
    });

    it('should throw UNAUTHORIZED if password is invalid', async () => {
      mockRepository.getUserByEmail.mockResolvedValue(mockUser as any);
      (comparePasswords as jest.Mock).mockResolvedValue(false);

      await expect(authService.loginUser(loginData)).rejects.toThrow('Password is invalid.');
    });
  });

  describe('refreshToken', () => {
    const refreshToken = 'valid_refresh_token';
    const mockUser = {
      _id: new ObjectId('507f1f77bcf86cd799439011'),
      role: UserRoles.USER,
      darkModeEnabled: false,
      dyslexiaEnabled: false,
    };

    it('should successfully refresh access token', async () => {
      (verifyToken as jest.Mock).mockReturnValue({ _id: '507f1f77bcf86cd799439011' });
      mockRepository.getUserById.mockResolvedValue(mockUser as any);

      const result = await authService.refreshToken(refreshToken);

      expect(result).toHaveProperty('newAccessToken');
      expect(verifyToken).toHaveBeenCalledWith(refreshToken, environment.JWT_REFRESH_TOKEN_SECRET);
      expect(mockRepository.getUserById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NOT_FOUND if user does not exist', async () => {
      (verifyToken as jest.Mock).mockReturnValue({ _id: '507f1f77bcf86cd799439011' });
      mockRepository.getUserById.mockResolvedValue(null);

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow('User not found.');
    });
  });

  describe('getRefreshToken', () => {
    it('should return cookie refresh token when x-client-type is not set', () => {
      const mockRequest = {
        headers: {},
        cookies: { 'refresh-token': 'cookie_token' },
      } as any;

      const result = authService.getRefreshToken(mockRequest);
      expect(result).toBe('cookie_token');
    });

    it('should return header refresh token when x-client-type is mobile and x-refresh-token is string', () => {
      const mockRequest = {
        headers: {
          'x-client-type': 'mobile',
          'x-refresh-token': 'mobile_refresh_token',
        },
        cookies: { 'refresh-token': 'cookie_token' },
      } as any;

      const result = authService.getRefreshToken(mockRequest);
      expect(result).toBe('mobile_refresh_token');
    });

    it('should return cookie when x-client-type is not mobile', () => {
      const mockRequest = {
        headers: {
          'x-client-type': 'web',
          'x-refresh-token': 'header_token',
        },
        cookies: { 'refresh-token': 'cookie_token' },
      } as any;

      const result = authService.getRefreshToken(mockRequest);
      expect(result).toBe('cookie_token');
    });
  });

  describe('invalidateAccessToken', () => {
    it('should return early when accessToken is undefined', async () => {
      const mockRequest = { server: { redis: { setex: jest.fn() } } } as any;

      await authService.invalidateAccessToken(mockRequest, undefined);

      expect(mockRequest.server.redis.setex).not.toHaveBeenCalled();
    });

    it('should return early when token is expired', async () => {
      const mockRequest = { server: { redis: { setex: jest.fn() } } } as any;
      // Mock an expired token
      (verifyToken as jest.Mock).mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 100 });

      await authService.invalidateAccessToken(mockRequest, 'expired_token');

      expect(mockRequest.server.redis.setex).not.toHaveBeenCalled();
    });

    it('should blacklist token when it is valid and not expired', async () => {
      const mockRequest = { server: { redis: { setex: jest.fn() } } } as any;
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      (verifyToken as jest.Mock).mockReturnValue({ exp: futureExp });

      await authService.invalidateAccessToken(mockRequest, 'valid_token');

      expect(mockRequest.server.redis.setex).toHaveBeenCalled();
    });
  });

  describe('sendTokensToUser', () => {
    it('should send tokens in body for mobile clients', async () => {
      const mockRequest = {
        headers: { 'x-client-type': 'mobile' },
      } as any;
      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        setCookie: jest.fn(),
      } as any;

      await authService.sendTokensToUser('access_token', 'refresh_token', mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({ accessToken: 'access_token', refreshToken: 'refresh_token' });
      expect(mockReply.setCookie).not.toHaveBeenCalled();
    });

    it('should set cookie for web clients with CREATED status when registering', async () => {
      const mockRequest = {
        headers: {},
      } as any;
      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        setCookie: jest.fn(),
      } as any;

      await authService.sendTokensToUser('access_token', 'refresh_token', mockRequest, mockReply, true);

      expect(mockReply.setCookie).toHaveBeenCalledWith('refresh-token', 'refresh_token', expect.any(Object));
      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({ accessToken: 'access_token' });
    });

    it('should set cookie for web clients with OK status when logging in', async () => {
      const mockRequest = {
        headers: {},
      } as any;
      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        setCookie: jest.fn(),
      } as any;

      await authService.sendTokensToUser('access_token', 'refresh_token', mockRequest, mockReply, false);

      expect(mockReply.setCookie).toHaveBeenCalled();
      expect(mockReply.status).toHaveBeenCalledWith(200);
    });

    it('should set development cookie options when NODE_ENV is development', async () => {
      // Temporarily change NODE_ENV
      const originalEnv = environment.NODE_ENV;
      (environment as any).NODE_ENV = 'development';

      const mockRequest = {
        headers: {},
      } as any;
      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        setCookie: jest.fn(),
      } as any;

      try {
        await authService.sendTokensToUser('access_token', 'refresh_token', mockRequest, mockReply, false);

        expect(mockReply.setCookie).toHaveBeenCalledWith(
          'refresh-token',
          'refresh_token',
          expect.objectContaining({
            secure: false,
            sameSite: 'none',
          }),
        );
      } finally {
        (environment as any).NODE_ENV = originalEnv;
      }
    });
  });
});

// Test auth.types.ts schema for coverage
describe('refreshTokenValidatorSchema', () => {
  it('should validate correct token data', () => {
    const { refreshTokenValidatorSchema } = require('../../../types/auth');

    const validData = {
      userId: '64b8f0c2e1d3f2a5b6c7d8e9',
      hashedToken: 'abc123hashedtoken',
      expiresAt: new Date(),
    };

    const result = refreshTokenValidatorSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid token data', () => {
    const { refreshTokenValidatorSchema } = require('../../../types/auth');

    const invalidData = {
      userId: '',
      hashedToken: '',
      expiresAt: 'not-a-date',
    };

    const result = refreshTokenValidatorSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
