import { ServiceManager } from '@/integrations';
import { AboutService } from '../about.service';

jest.mock('@/integrations', () => ({
  ServiceManager: {
    instance: {
      getAll: jest.fn(),
    },
  },
}));

describe('AboutService', () => {
  let service: AboutService;

  beforeEach(() => {
    service = new AboutService();
    jest.clearAllMocks();
  });

  describe('getCurrentTime', () => {
    it('should return current time', () => {
      const now = 1234567890;
      jest.spyOn(Date, 'now').mockReturnValue(now);

      const result = service.getCurrentTime();
      expect(result).toBe(now);
    });
  });

  describe('getServices', () => {
    it('should return formatted services from ServiceManager', () => {
      const mockServices = [
        {
          name: 'test-service',
          actions: [{ name: 'test-action', description: 'action description', key: 'test-action', inputs: {} }],
          reactions: [{ name: 'test-reaction', description: 'reaction description', key: 'test-reaction', inputs: {} }],
        },
      ];

      (ServiceManager.instance.getAll as jest.Mock).mockReturnValue(mockServices);

      const result = service.getServices();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: 'test-service',
        actions: [{ name: 'test-action', description: 'action description' }],
        reactions: [{ name: 'test-reaction', description: 'reaction description' }],
      });
      expect(ServiceManager.instance.getAll).toHaveBeenCalled();
    });
  });
});
