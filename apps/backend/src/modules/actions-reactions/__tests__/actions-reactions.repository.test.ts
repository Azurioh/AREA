import type { Collection, Db, InsertOneResult, UpdateResult } from 'mongodb';
import { ObjectId } from 'mongodb';
import type { ActionReaction } from '@/types/action-reaction';
import { ActionsReactionsRepository } from '../actions-reactions.repository';

describe('ActionsReactionsRepository', () => {
  let repository: ActionsReactionsRepository;
  let mockDb: jest.Mocked<Db>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    mockCollection = {
      insertOne: jest.fn(),
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      }),
      updateOne: jest.fn(),
    } as unknown as jest.Mocked<Collection>;

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<Db>;

    repository = new ActionsReactionsRepository(mockDb);
  });

  describe('createActionReaction', () => {
    it('should insert action reaction and return acknowledged status', async () => {
      const mockResult: InsertOneResult = {
        acknowledged: true,
        insertedId: new ObjectId(),
      };
      mockCollection.insertOne.mockResolvedValue(mockResult);

      const data: ActionReaction = {
        userId: 'user-123',
        action: { service: 'github', type: 'star_repo', params: {} },
        reaction: { service: 'discord', type: 'send_message', params: {} },
        trigger: 'github/star_repo/123',
        numberOfExecution: 0,
        executionState: true,
      };

      const result = await repository.createActionReaction(data);

      expect(mockDb.collection).toHaveBeenCalledWith('actions_reactions');
      expect(mockCollection.insertOne).toHaveBeenCalledWith(data);
      expect(result).toBe(true);
    });

    it('should return false when insert is not acknowledged', async () => {
      mockCollection.insertOne.mockResolvedValue({ acknowledged: false } as InsertOneResult);

      const data: ActionReaction = {
        userId: 'user-123',
        action: { service: 'github', type: 'star_repo', params: {} },
        reaction: { service: 'discord', type: 'send_message', params: {} },
        trigger: 'github/star_repo/123',
        numberOfExecution: 0,
        executionState: true,
      };

      const result = await repository.createActionReaction(data);
      expect(result).toBe(false);
    });
  });

  describe('getActionsReactionsByTrigger', () => {
    it('should return actions reactions matching trigger', async () => {
      const mockData = [{ _id: new ObjectId(), trigger: 'github/star_repo/123' }];
      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockData),
      } as any);

      const result = await repository.getActionsReactionsByTrigger('github/star_repo/123');

      expect(mockCollection.find).toHaveBeenCalledWith({ trigger: 'github/star_repo/123' });
      expect(result).toEqual(mockData);
    });
  });

  describe('getMeActionsReactions', () => {
    it('should return actions reactions for user', async () => {
      const mockData = [{ _id: new ObjectId(), userId: 'user-123' }];
      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockData),
      } as any);

      const result = await repository.getMeActionsReactions('user-123');

      expect(mockCollection.find).toHaveBeenCalledWith({ userId: 'user-123' });
      expect(result).toEqual(mockData);
    });
  });

  describe('incrementActionReactionExecution', () => {
    it('should increment execution count', async () => {
      mockCollection.updateOne.mockResolvedValue({ acknowledged: true } as UpdateResult);

      await repository.incrementActionReactionExecution('507f1f77bcf86cd799439011');

      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { _id: new ObjectId('507f1f77bcf86cd799439011') },
        { $inc: { numberOfExecution: 1 } },
      );
    });
  });

  describe('updateActionReactionExecutionStateById', () => {
    it('should update execution state', async () => {
      const mockResult: UpdateResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      };
      mockCollection.updateOne.mockResolvedValue(mockResult);

      const result = await repository.updateActionReactionExecutionStateById('507f1f77bcf86cd799439011', false);

      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { _id: new ObjectId('507f1f77bcf86cd799439011') },
        { $set: { executionState: false } },
      );
      expect(result).toEqual(mockResult);
    });
  });
});
