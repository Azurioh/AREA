import type { PollingRepository } from '../polling.repository';
import { PollingService } from '../polling.service';

describe('PollingService', () => {
  let service: PollingService;
  let mockRepository: jest.Mocked<PollingRepository>;

  beforeEach(() => {
    mockRepository = {
      addUserToPoll: jest.fn(),
      getUsersToPoll: jest.fn(),
      updateUserToPoll: jest.fn(),
    } as any;

    service = new PollingService(mockRepository);
  });

  describe('addUserToPoll', () => {
    it('should call repository addUserToPoll', async () => {
      const data: any = { userId: 'user1' };

      await service.addUserToPoll(data);

      expect(mockRepository.addUserToPoll).toHaveBeenCalledWith(data);
    });
  });

  describe('getUsersToPoll', () => {
    it('should call repository getUsersToPoll', async () => {
      const serviceType = 'spotify' as any;
      const type = ['test'];
      const mockResult = [{ userId: 'user1' }];

      mockRepository.getUsersToPoll.mockResolvedValue(mockResult as any);

      const result = await service.getUsersToPoll(serviceType, type);

      expect(result).toEqual(mockResult);
      expect(mockRepository.getUsersToPoll).toHaveBeenCalledWith(serviceType, type);
    });
  });

  describe('updateUserToPoll', () => {
    it('should call repository updateUserToPoll', async () => {
      const serviceType = 'spotify' as any;
      const userId = 'user1';
      const type = 'test';
      const data = { lastPolled: new Date() };

      await service.updateUserToPoll(serviceType, userId, type, data);

      expect(mockRepository.updateUserToPoll).toHaveBeenCalledWith(serviceType, userId, type, data);
    });
  });
});
