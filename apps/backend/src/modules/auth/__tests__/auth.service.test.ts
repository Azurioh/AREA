import { DysType, UserRoles } from '@area/shared/enums/user-enums';
import type { User } from '@area/shared/types/users.types';
import { MongoServerError } from 'mongodb';
import type { UsersRepository } from '@/modules/users';
import ApiError from '@/utils/api-error';
import { AuthService } from '../auth.service';

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
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      const newUser: User = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: UserRoles.USER,
        darkModeEnabled: false,
        dyslexiaType: DysType.NOTHING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.createUser.mockResolvedValueOnce({
        acknowledged: true,
        insertedId: { toString: () => '123' },
      } as any);

      const result = await authService.registerUser(newUser);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockRepository.createUser).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      const newUser: User = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: UserRoles.USER,
        darkModeEnabled: false,
        dyslexiaType: DysType.NOTHING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mongoError = new MongoServerError({ errmsg: 'E11000 duplicate key error' });
      (mongoError as any).code = 11000;

      mockRepository.createUser.mockRejectedValueOnce(mongoError);

      await expect(authService.registerUser(newUser)).rejects.toThrow(ApiError);
    });
  });
});
