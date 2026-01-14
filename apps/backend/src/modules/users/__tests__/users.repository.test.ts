import type { Db } from 'mongodb';
import { UsersRepository } from '../users.repository';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let mockDb: jest.Mocked<Db>;
  let mockCollection: any;

  beforeEach(() => {
    mockCollection = {
      insertOne: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      createIndex: jest.fn(),
    };

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    } as any;

    repository = new UsersRepository(mockDb);
  });

  describe('getAllUsers', () => {
    it('should return all users from database', async () => {
      const mockUsers = [
        { _id: 'id1', name: 'User 1', email: 'user1@test.com' },
        { _id: 'id2', name: 'User 2', email: 'user2@test.com' },
      ];

      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockUsers),
      });

      const result = await repository.getAllUsers();

      expect(mockDb.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });
});
