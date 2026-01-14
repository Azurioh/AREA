import { HttpStatusCode } from '@area/shared/enums/http-status';
import { UnsplashService } from '../unsplash.service';

jest.mock('../../polling/polling.service');

describe('UnsplashService', () => {
  let service: UnsplashService;
  let pollingService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    pollingService = {
      addUserToPoll: jest.fn(),
    };
    service = new UnsplashService(pollingService);
  });

  describe('createAction', () => {
    it('should add user to poll for daily_random_image', async () => {
      const action = {
        name: 'daily_random_image',
        params: { topic: { id: 'cats' } },
      };

      const result = await service.createAction('user123', action as any);

      expect(result).toBe('daily_random_image/cats/user123');
      expect(pollingService.addUserToPoll).toHaveBeenCalledWith({
        service: 'unsplash',
        userId: 'user123',
        type: 'daily_random_image',
        trigger: {
          topic: 'cats',
          lastPoll: null,
        },
      });
    });

    it('should throw ApiError if action name is unknown', async () => {
      const action = {
        name: 'unknown_action',
        params: {},
      };

      let error: any;
      try {
        await service.createAction('user123', action as any);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error.httpCode).toBe(HttpStatusCode.NOT_FOUND);
      expect(error.message).toBe('Action not found');
    });
  });
});
