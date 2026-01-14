import { environment } from '@/utils/environment';
import { PollingRepository } from '../polling.repository';
import { UnsplashPollingService } from '../unsplash-polling.service';

jest.mock('../polling.repository');
jest.mock('@/utils/environment', () => ({
  environment: {
    UNSPLASH_CLIENT_ID: 'test-client-id',
    BASE_API_URL: 'http://localhost:3000',
  },
}));

global.fetch = jest.fn();

describe('UnsplashPollingService', () => {
  let service: UnsplashPollingService;
  let repository: jest.Mocked<PollingRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PollingRepository({} as any) as jest.Mocked<PollingRepository>;
    service = new UnsplashPollingService(repository);
  });

  describe('pollDailyRandomImage', () => {
    it('should return if no users to poll', async () => {
      repository.getUsersToPoll.mockResolvedValue([]);
      await service.pollDailyRandomImage();
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should skip users already polled today', async () => {
      const today = new Date().toISOString().split('T')[0];
      const mockUsers = [
        {
          userId: 'u1',
          trigger: { topic: 'nature', lastPoll: today },
        },
      ];
      repository.getUsersToPoll.mockResolvedValue(mockUsers as any);

      await service.pollDailyRandomImage();

      expect(fetch).not.toHaveBeenCalled();
    });

    it('should poll Unsplash and trigger webhook for eligible users', async () => {
      const mockUsers = [
        {
          userId: 'u1',
          trigger: { topic: 'nature', lastPoll: 'yesterday' },
        },
      ];
      repository.getUsersToPoll.mockResolvedValue(mockUsers as any);

      const mockUnsplashResponse = {
        urls: { regular: 'http://image.url' },
        likes: 100,
        user: { username: 'photographer', bio: 'some bio' },
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => mockUnsplashResponse,
        }) // Unsplash API call
        .mockResolvedValueOnce({ ok: true }); // Webhook call

      const today = new Date().toISOString().split('T')[0];

      await service.pollDailyRandomImage();

      // Verify Unsplash API call
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('api.unsplash.com/photos/random?query=nature'));

      // Verify repository update
      expect(repository.updateUserToPoll).toHaveBeenCalledWith('unsplash', 'u1', 'daily_random_image', {
        trigger: { topic: 'nature', lastPoll: today },
      });

      // Verify Webhook call
      expect(fetch).toHaveBeenCalledWith(
        `${environment.BASE_API_URL}/webhook/v1/unsplash`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'x-unsplash-event': 'daily_random_image',
            'x-user-id': 'u1',
          }),
          body: JSON.stringify({
            image: { url: 'http://image.url', topic: 'nature', likes: 100 },
            user: { username: 'photographer', bio: 'some bio' },
          }),
        }),
      );
    });
  });
});
