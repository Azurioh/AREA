import { HttpStatusCode } from '@area/shared/enums/http-status';
import { ServiceManager } from '@/integrations';
import ApiError from '@/utils/api-error';
import { ServicesService } from '../services.service';

jest.mock('@/integrations', () => ({
  ServiceManager: {
    instance: {
      get: jest.fn(),
    },
  },
}));

describe('ServicesService', () => {
  let service: ServicesService;

  const mockAction = {
    name: 'test-action',
    description: 'test-description',
    returnedValues: [{ key: 'key1', description: 'desc1', type: 'string' }],
    refreshParams: jest.fn(),
  };

  const mockReaction = {
    name: 'test-reaction',
    description: 'test-description',
    refreshParams: jest.fn(),
  };

  const mockService = {
    name: 'test-service',
    actions: [mockAction],
    reactions: [mockReaction],
  };

  beforeEach(() => {
    service = new ServicesService();
    jest.clearAllMocks();
    (ServiceManager.instance.get as jest.Mock).mockReturnValue(mockService);
  });

  describe('getServiceActions', () => {
    it('should return service actions', async () => {
      const result = await service.getServiceActions('test-service');

      expect(ServiceManager.instance.get).toHaveBeenCalledWith('test-service');
      expect(result).toEqual([{ name: 'test-action', description: 'test-description' }]);
    });

    it('should throw 404 if service not found', async () => {
      (ServiceManager.instance.get as jest.Mock).mockReturnValue(undefined);

      await expect(service.getServiceActions('unknown')).rejects.toThrow(
        new ApiError(HttpStatusCode.NOT_FOUND, 'Service unknown not found'),
      );
    });
  });

  describe('getActionDetails', () => {
    it('should return action details without returnedValues', async () => {
      const result = await service.getActionDetails('test-service', 'test-action', 'user-id');

      expect(mockAction.refreshParams).toHaveBeenCalledWith('user-id');
      expect(result).toHaveProperty('name', 'test-action');
      expect(result).not.toHaveProperty('returnedValues');
    });

    it('should throw 404 if service not found', async () => {
      (ServiceManager.instance.get as jest.Mock).mockReturnValue(undefined);

      await expect(service.getActionDetails('unknown', 'action', 'uid')).rejects.toThrow(
        new ApiError(HttpStatusCode.NOT_FOUND, 'Service unknown not found'),
      );
    });

    it('should throw 404 if action not found', async () => {
      await expect(service.getActionDetails('test-service', 'unknown', 'uid')).rejects.toThrow(
        new ApiError(HttpStatusCode.NOT_FOUND, 'Action unknown not found in service test-service'),
      );
    });
  });

  describe('getActionReturnedValues', () => {
    it('should return action returned values', async () => {
      const result = await service.getActionReturnedValues('test-service', 'test-action');

      expect(result).toEqual([{ key: 'key1', description: 'desc1', type: 'string' }]);
    });

    it('should throw 404 if service not found', async () => {
      (ServiceManager.instance.get as jest.Mock).mockReturnValue(undefined);

      await expect(service.getActionReturnedValues('unknown', 'action')).rejects.toThrow(
        new ApiError(HttpStatusCode.NOT_FOUND, 'Service unknown not found'),
      );
    });

    it('should throw 404 if action not found', async () => {
      await expect(service.getActionReturnedValues('test-service', 'unknown')).rejects.toThrow(
        new ApiError(HttpStatusCode.NOT_FOUND, 'Action unknown not found in service test-service'),
      );
    });
  });

  describe('getServiceReactions', () => {
    it('should return service reactions', async () => {
      const result = await service.getServiceReactions('test-service');

      expect(result).toEqual([{ name: 'test-reaction', description: 'test-description' }]);
    });

    it('should throw 404 if service not found', async () => {
      (ServiceManager.instance.get as jest.Mock).mockReturnValue(undefined);

      await expect(service.getServiceReactions('unknown')).rejects.toThrow(
        new ApiError(HttpStatusCode.NOT_FOUND, 'Service unknown not found'),
      );
    });
  });

  describe('getReactionDetails', () => {
    it('should return reaction details', async () => {
      const result = await service.getReactionDetails('test-service', 'test-reaction', 'user-id');

      expect(mockReaction.refreshParams).toHaveBeenCalledWith('user-id');
      expect(result).toHaveProperty('name', 'test-reaction');
    });

    it('should throw 404 if service not found', async () => {
      (ServiceManager.instance.get as jest.Mock).mockReturnValue(undefined);

      await expect(service.getReactionDetails('unknown', 'reaction', 'uid')).rejects.toThrow(
        new ApiError(HttpStatusCode.NOT_FOUND, 'Service unknown not found'),
      );
    });

    it('should throw 404 if reaction not found', async () => {
      await expect(service.getReactionDetails('test-service', 'unknown', 'uid')).rejects.toThrow(
        new ApiError(HttpStatusCode.NOT_FOUND, 'Reaction unknown not found in service test-service'),
      );
    });
  });
});
