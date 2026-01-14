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

      expect(result).toHaveProperty('accessToken');
      expect(verifyToken).toHaveBeenCalledWith(refreshToken, environment.JWT_REFRESH_TOKEN_SECRET);
      expect(mockRepository.getUserById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NOT_FOUND if user does not exist', async () => {
      (verifyToken as jest.Mock).mockReturnValue({ _id: '507f1f77bcf86cd799439011' });
      mockRepository.getUserById.mockResolvedValue(null);

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow('User not found.');
    });
  });
});
