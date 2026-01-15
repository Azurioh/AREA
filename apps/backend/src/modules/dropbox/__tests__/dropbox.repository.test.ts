import type { Db } from 'mongodb';
import { MongoCollections } from '@/enums/mongo-collection';
import { DropboxRepository } from '../dropbox.repository';

describe('DropboxRepository', () => {
  let repository: DropboxRepository;
  let mockDb: jest.Mocked<Db>;
  let mockCollection: any;

  beforeEach(() => {
    mockCollection = {
      insertOne: jest.fn(),
      findOne: jest.fn(),
      deleteOne: jest.fn(),
    };
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<Db>;

    repository = new DropboxRepository(mockDb);
  });

  describe('createDropboxResource', () => {
    it('should insert a resource and return acknowledged status', async () => {
      const data = { id: '123', tag: 'file' as const };
      mockCollection.insertOne.mockResolvedValue({ acknowledged: true });

      const result = await repository.createDropboxResource(data);

      expect(mockDb.collection).toHaveBeenCalledWith(MongoCollections.DROPBOX_RESOURCES);
      expect(mockCollection.insertOne).toHaveBeenCalledWith(data);
      expect(result).toBe(true);
    });
  });

  describe('getDropboxResourceById', () => {
    it('should return a resource if found', async () => {
      const mockResource = { id: '123', tag: 'file' as const };
      mockCollection.findOne.mockResolvedValue(mockResource);

      const result = await repository.getDropboxResourceById('123');

      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: '123' });
      expect(result).toEqual(mockResource);
    });

    it('should return null if not found', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.getDropboxResourceById('123');

      expect(result).toBeNull();
    });
  });

  describe('deleteDropboxResource', () => {
    it('should delete a resource and return acknowledged status', async () => {
      mockCollection.deleteOne.mockResolvedValue({ acknowledged: true });

      const result = await repository.deleteDropboxResource('123');

      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: '123' });
      expect(result).toBe(true);
    });
  });
});
