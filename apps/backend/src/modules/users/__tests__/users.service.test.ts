import { HttpStatusCode } from '@area/shared/enums/http-status';
import ApiError from '@/utils/api-error';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';

jest.mock('../users.repository');

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    repository = new UsersRepository({} as any) as jest.Mocked<UsersRepository>;
    service = new UsersService(repository);
  });

  describe('getUserByEmail', () => {
    it('should return user if found', async () => {
      const mockUser = { _id: 'id', email: 'test@test.com', authType: 'classic' };
      repository.getUserByEmail.mockResolvedValue(mockUser as any);

      const result = await service.getUserByEmail('test@test.com');
      expect(result).toEqual(mockUser);
    });

    it('should throw NOT_FOUND if user not found', async () => {
      repository.getUserByEmail.mockResolvedValue(null);

      await expect(service.getUserByEmail('test@test.com')).rejects.toThrow(
        new ApiError(HttpStatusCode.NOT_FOUND, 'User not found'),
      );
    });
  });

  describe('createUser', () => {
    it('should create user if email not taken', async () => {
      repository.getUserByEmail.mockResolvedValue(null);
      repository.createUser.mockResolvedValue({ acknowledged: true } as any);

      const user = { name: 'Test', email: 'new@test.com', password: 'pwd', authType: 'classic' } as any;
      await service.createUser(user);

      expect(repository.createUser).toHaveBeenCalledWith(user);
    });

    it('should throw CONFLICT if email already taken', async () => {
      repository.getUserByEmail.mockResolvedValue({} as any);

      const user = { name: 'Test', email: 'new@test.com', password: 'pwd', authType: 'classic' } as any;
      await expect(service.createUser(user)).rejects.toThrow(
        new ApiError(HttpStatusCode.CONFLICT, 'User with same email already exists'),
      );
    });

    it('should throw INTERNAL_SERVER_ERROR if insert is not acknowledged', async () => {
      repository.getUserByEmail.mockResolvedValue(null);
      repository.createUser.mockResolvedValue({ acknowledged: false } as any);

      const user = { name: 'Test', email: 'new@test.com', password: 'pwd', authType: 'classic' } as any;
      await expect(service.createUser(user)).rejects.toThrow(
        new ApiError(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'Failed to created the user, please contact an administrator',
        ),
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return all users with string ids', async () => {
      const mockUsers = [
        { _id: { toString: () => 'id1' }, name: 'User 1', email: 'user1@test.com', authType: 'classic' },
        { _id: { toString: () => 'id2' }, name: 'User 2', email: 'user2@test.com', authType: 'classic' },
      ];
      repository.getAllUsers.mockResolvedValue(mockUsers as any);

      const result = await service.getAllUsers();

      expect(result).toEqual([
        { _id: 'id1', name: 'User 1', email: 'user1@test.com', authType: 'classic' },
        { _id: 'id2', name: 'User 2', email: 'user2@test.com', authType: 'classic' },
      ]);
    });
  });

  describe('getUserById', () => {
    it('should throw NOT_FOUND if user not found', async () => {
      repository.getUserById.mockResolvedValue(null);

      await expect(service.getUserById('nonexistent')).rejects.toThrow(
        new ApiError(HttpStatusCode.NOT_FOUND, 'User not found'),
      );
    });
  });

  describe('updateUser', () => {
    it('should throw INTERNAL_SERVER_ERROR if update is not acknowledged', async () => {
      repository.updateUser.mockResolvedValue({ acknowledged: false, matchedCount: 0 } as any);

      await expect(service.updateUser('user-id', { name: 'New Name' })).rejects.toThrow(
        new ApiError(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'Failed to update the user, please contact an administrator',
        ),
      );
    });

    it('should throw NOT_FOUND if user not found', async () => {
      repository.updateUser.mockResolvedValue({ acknowledged: true, matchedCount: 0 } as any);

      await expect(service.updateUser('user-id', { name: 'New Name' })).rejects.toThrow(
        new ApiError(HttpStatusCode.NOT_FOUND, 'User not found'),
      );
    });
  });

  describe('deleteUser', () => {
    it('should throw INTERNAL_SERVER_ERROR if delete is not acknowledged', async () => {
      repository.deleteUser.mockResolvedValue({ acknowledged: false, deletedCount: 0 } as any);

      await expect(service.deleteUser('user-id')).rejects.toThrow(
        new ApiError(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'Failed to delete the user, please contact an administrator',
        ),
      );
    });

    it('should throw NOT_FOUND if user not found', async () => {
      repository.deleteUser.mockResolvedValue({ acknowledged: true, deletedCount: 0 } as any);

      await expect(service.deleteUser('user-id')).rejects.toThrow(
        new ApiError(HttpStatusCode.NOT_FOUND, 'User not found'),
      );
    });
  });
});
