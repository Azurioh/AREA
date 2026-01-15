import { MongoCollections } from '@/enums/mongo-collection';
import { PollingRepository } from '../polling.repository';

describe('PollingRepository', () => {
  let repository: PollingRepository;
  let mockDb: any;
  let mockCollection: any;

  beforeEach(() => {
    mockCollection = {
      insertOne: jest.fn(),
      find: jest.fn(),
      updateOne: jest.fn(),
    };
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    repository = new PollingRepository(mockDb);
  });

  describe('addUserToPoll', () => {
    it('should add user to poll and return acknowledged status', async () => {
      const data: any = { userId: 'user1', service: 'spotify', type: 'test' };
      mockCollection.insertOne.mockResolvedValue({ acknowledged: true });

      const result = await repository.addUserToPoll(data);

      expect(result).toBe(true);
      expect(mockDb.collection).toHaveBeenCalledWith(MongoCollections.POLLING);
      expect(mockCollection.insertOne).toHaveBeenCalledWith(data);
    });
  });

  describe('getUsersToPoll', () => {
    it('should return users to poll', async () => {
      const service = 'spotify' as any;
      const type = ['test_type'];
      const mockUsers = [{ userId: 'user1' }, { userId: 'user2' }];

      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockUsers),
      });

      const result = await repository.getUsersToPoll(service, type);

      expect(result).toEqual(mockUsers);
      expect(mockCollection.find).toHaveBeenCalledWith({ service: service, type: { $in: type } });
    });
  });

  describe('updateUserToPoll', () => {
    it('should update user in poll', async () => {
      const service = 'spotify' as any;
      const userId = 'user1';
      const type = 'test';
      const data = { lastPolled: new Date() };
      mockCollection.updateOne.mockResolvedValue({ acknowledged: true });

      const result = await repository.updateUserToPoll(service, userId, type, data);

      expect(result.acknowledged).toBe(true);
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { service: service, userId: userId, type: type },
        { $set: data },
      );
    });
  });
});
