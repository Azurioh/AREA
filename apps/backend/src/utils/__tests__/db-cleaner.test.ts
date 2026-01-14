import type { Collection, Db, DeleteResult } from 'mongodb';
import { removeValueFromDatabase } from '../db-cleaner';

describe('DB Cleaner Utils', () => {
  describe('removeValueFromDatabase', () => {
    let mockDb: jest.Mocked<Db>;
    let mockCollection: jest.Mocked<Collection>;

    beforeEach(() => {
      mockCollection = {
        deleteMany: jest.fn().mockResolvedValue({ deletedCount: 1 } as DeleteResult),
      } as unknown as jest.Mocked<Collection>;

      mockDb = {
        collection: jest.fn().mockReturnValue(mockCollection),
      } as unknown as jest.Mocked<Db>;
    });

    it('should call collection with the correct collection name', async () => {
      await removeValueFromDatabase(mockDb, 'users', 'email', 'test@example.com');

      expect(mockDb.collection).toHaveBeenCalledWith('users');
    });

    it('should call deleteMany with the correct filter', async () => {
      await removeValueFromDatabase(mockDb, 'users', 'email', 'test@example.com');

      expect(mockCollection.deleteMany).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should work with different field names', async () => {
      await removeValueFromDatabase(mockDb, 'sessions', 'userId', '12345');

      expect(mockDb.collection).toHaveBeenCalledWith('sessions');
      expect(mockCollection.deleteMany).toHaveBeenCalledWith({ userId: '12345' });
    });

    it('should handle empty string values', async () => {
      await removeValueFromDatabase(mockDb, 'tokens', 'token', '');

      expect(mockCollection.deleteMany).toHaveBeenCalledWith({ token: '' });
    });
  });
});
