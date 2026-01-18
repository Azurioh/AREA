import { HttpStatusCode } from '@area/shared/enums/http-status';
import { NasaService } from '../nasa.service';

jest.mock('../../polling/polling.service');

describe('NasaService', () => {
  let service: NasaService;
  let pollingService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    pollingService = {
      addUserToPoll: jest.fn(),
      getUsersToPoll: jest.fn().mockResolvedValue([]),
    };
    service = new NasaService(pollingService);
  });

  describe('createAction', () => {
    it('should add user to poll for new_astronomy_picture_of_the_day', async () => {
      const action = {
        name: 'new_astronomy_picture_of_the_day',
        params: { topic: { id: 'cats' } },
      };
      const actionReactionId = 'action-reaction-123';
      const result = await service.createAction(actionReactionId, 'user123', action as any);

      expect(result).toBe('new_astronomy_picture_of_the_day/user123');
      expect(pollingService.addUserToPoll).toHaveBeenCalledWith({
        service: 'nasa',
        actionReactionId,
        userId: 'user123',
        type: 'new_astronomy_picture_of_the_day',
        trigger: {
          lastPoll: null,
        },
      });
    });

    it('should throw ApiError if action name is unknown', async () => {
      const action = {
        name: 'unknown_action',
        params: {},
      };
      const actionReactionId = 'action-reaction-123';

      let error: any;
      try {
        await service.createAction(actionReactionId, 'user123', action as any);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error.httpCode).toBe(HttpStatusCode.NOT_FOUND);
      expect(error.message).toBe('Action not found');
    });
  });
});
