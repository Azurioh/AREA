import { type Collection, type Db, ObjectId } from 'mongodb';
import { MongoCollections } from '@/enums/mongo-collection';
import { ThirdPartiesRepository } from '../third-parties.repository';

describe('ThirdPartiesRepository', () => {
  let repository: ThirdPartiesRepository;
  let mockDb: jest.Mocked<Db>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    mockCollection = {
      insertOne: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn(),
    } as any;

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    } as any;

    repository = new ThirdPartiesRepository(mockDb);
  });

  describe('createThirdPartyAccount', () => {
    it('should insert a third party account and return success', async () => {
      const data = { userId: '123', service: 'github' } as any;
      mockCollection.insertOne.mockResolvedValue({ acknowledged: true } as any);

      const result = await repository.createThirdPartyAccount(data);

      expect(mockDb.collection).toHaveBeenCalledWith(MongoCollections.THIRD_PARTIES_ACCOUNT);
      expect(mockCollection.insertOne).toHaveBeenCalledWith(data);
      expect(result).toBe(true);
    });

    it('should return false if insertion is not acknowledged', async () => {
      mockCollection.insertOne.mockResolvedValue({ acknowledged: false } as any);
      const result = await repository.createThirdPartyAccount({} as any);
      expect(result).toBe(false);
    });
  });

  describe('getThirdPartyAccountByUserId', () => {
    it('should find a third party account by user id and service', async () => {
      const mockAccount = { _id: new ObjectId(), userId: '123', service: 'github' };
      mockCollection.findOne.mockResolvedValue(mockAccount as any);

      const result = await repository.getThirdPartyAccountByUserId('123', 'github');

      expect(mockCollection.findOne).toHaveBeenCalledWith({ userId: '123', service: 'github' });
      expect(result).toEqual(mockAccount);
      expect(result).toEqual(mockAccount);
    });
  });

  describe('getThirdPartyAccountByServiceAccountId', () => {
    it('should find a third party account by service account id and service', async () => {
      const mockAccount = { _id: new ObjectId(), id: 'acc-123', service: 'github' };
      mockCollection.findOne.mockResolvedValue(mockAccount as any);

      const result = await repository.getThirdPartyAccountByServiceAccountId('acc-123', 'github');

      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: 'acc-123', service: 'github' });
      expect(result).toEqual(mockAccount);
    });
  });

  describe('updateThirdPartyAccount', () => {
    it('should update a third party account by id and service', async () => {
      const id = new ObjectId().toString();
      const accountData = { accessToken: 'new-token' };
      mockCollection.updateOne.mockResolvedValue({ acknowledged: true } as any);

      const result = await repository.updateThirdPartyAccount(id, 'github', accountData as any);

      expect(mockCollection.updateOne).toHaveBeenCalledWith({ userId: id, service: 'github' }, { $set: accountData });
      expect(result.acknowledged).toBe(true);
    });
  });
});
