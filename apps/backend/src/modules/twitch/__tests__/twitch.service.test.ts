import { HttpStatusCode } from '@area/shared/enums/http-status';
import ApiError from '@/utils/api-error';
import * as CacheUtils from '@/utils/caching';
import * as CryptUtils from '@/utils/crypt';
import type { ThirdPartiesService } from '../third-parties';
import { TwitchService } from '../twitch.service';

jest.mock('@/utils/environment', () => ({
  environment: {
    TWITCH_CLIENT_ID: 'client-id',
    TWITCH_CLIENT_SECRET: 'client-secret',
    TWITCH_WEBHOOK_SECRET: 'webhook-secret',
    BASE_API_URL: 'http://localhost',
    CRYPT_SECRET_KEY: 'secret-key',
  },
}));

jest.mock('@/utils/caching');
jest.mock('@/utils/crypt');

describe('TwitchService', () => {
  let service: TwitchService;
  let mockThirdPartiesService: jest.Mocked<ThirdPartiesService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockThirdPartiesService = {
      getThirdPartyAccountByUserId: jest.fn(),
      updateThirdPartyAccount: jest.fn(),
    } as unknown as jest.Mocked<ThirdPartiesService>;

    service = new TwitchService(mockThirdPartiesService);

    // Default mocks
    (CryptUtils.decryptString as jest.Mock).mockReturnValue('decrypted-token');
    (CryptUtils.encryptString as jest.Mock).mockReturnValue('encrypted-token');
    (global.fetch as jest.Mock) = jest.fn();
  });

  describe('createAction', () => {
    it('should create new_follower action', async () => {
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue({ id: '123' } as any);
      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.OK,
        json: async () => ({ access_token: 'app-token', expires_in: 3600 }),
      });
      // Mock getAppAccessToken response
      (CacheUtils.getFromCache as jest.Mock).mockReturnValue(undefined);

      // Mock subscription creation
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'app-token', expires_in: 3600 }),
        }) // token
        .mockResolvedValueOnce({ status: HttpStatusCode.ACCEPTED }); // subscription

      const actionReactionId = 'action-reaction-123';
      const result = await service.createAction(actionReactionId, 'user-id', {
        name: 'new_follower',
        params: {},
      } as any);

      expect(result).toBe('new_follower/123');
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should create stream_online action', async () => {
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue({ id: '123' } as any);
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'app-token', expires_in: 3600 }),
        }) // token
        .mockResolvedValueOnce({ status: HttpStatusCode.ACCEPTED }); // subscription

      const actionReactionId = 'action-reaction-123';
      const result = await service.createAction(actionReactionId, 'user-id', {
        name: 'stream_online',
        params: { streamer: { id: 'streamer-id' } },
      } as any);

      expect(result).toBe('stream_online/streamer-id');
    });

    it('should throw error if subscription creation fails', async () => {
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue({ id: '123' } as any);
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'app-token', expires_in: 3600 }),
        })
        .mockResolvedValueOnce({ status: HttpStatusCode.BAD_REQUEST });

      const actionReactionId = 'action-reaction-123';
      await expect(
        service.createAction(actionReactionId, 'user-id', { name: 'new_follower', params: {} } as any),
      ).rejects.toThrow(ApiError);
    });

    it('should throw NOT_FOUND for unknown action', async () => {
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue({ id: '123' } as any);

      const actionReactionId = 'action-reaction-123';
      await expect(
        service.createAction(actionReactionId, 'user-id', { name: 'unknown', params: {} } as any),
      ).rejects.toThrow(ApiError);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.OK,
        json: async () => ({ access_token: 'new-token', refresh_token: 'new-refresh' }),
      });

      const result = await service.refreshTokens('user-id', 'old-refresh');

      expect(result).toBe('new-token');
      expect(mockThirdPartiesService.updateThirdPartyAccount).toHaveBeenCalled();
    });

    it('should throw error on failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ status: HttpStatusCode.BAD_REQUEST });
      await expect(service.refreshTokens('user-id', 'old-refresh')).rejects.toThrow(ApiError);
    });
  });

  describe('getAppAccessToken', () => {
    it('should return cached token if valid', async () => {
      (CacheUtils.getFromCache as jest.Mock).mockReturnValue({
        accessToken: 'cached-token',
        expiresAt: Date.now() + 10000,
      });

      const result = await service.getAppAccessToken();
      expect(result).toBe('cached-token');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fetch new token if cache missing', async () => {
      (CacheUtils.getFromCache as jest.Mock).mockReturnValue(undefined);
      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.OK,
        json: async () => ({ access_token: 'new-token', expires_in: 3600 }),
      });

      const result = await service.getAppAccessToken();
      expect(result).toBe('new-token');
      expect(CacheUtils.setInCache).toHaveBeenCalled();
    });

    it('should throw error if fetch fails', async () => {
      (CacheUtils.getFromCache as jest.Mock).mockReturnValue(undefined);
      (global.fetch as jest.Mock).mockResolvedValue({ status: HttpStatusCode.BAD_REQUEST });

      await expect(service.getAppAccessToken()).rejects.toThrow(ApiError);
    });
  });

  describe('listFollowedChannels', () => {
    it('should list followed channels', async () => {
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue({
        id: '123',
        accessToken: 'enc-token',
      } as any);

      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.OK,
        ok: true,
        json: async () => ({
          data: [{ broadcaster_name: 'Streamer 1', broadcaster_id: 's1' }],
          pagination: {},
        }),
      });

      const result = await service.listFollowedChannels('user-id');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Streamer 1');
    });

    it('should handle pagination', async () => {
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue({
        id: '123',
        accessToken: 'enc-token',
      } as any);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          ok: true,
          json: async () => ({
            data: [{ broadcaster_name: 'Streamer 1', broadcaster_id: 's1' }],
            pagination: { cursor: 'cursor' },
          }),
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          ok: true,
          json: async () => ({
            data: [{ broadcaster_name: 'Streamer 2', broadcaster_id: 's2' }],
            pagination: {},
          }),
        });

      const result = await service.listFollowedChannels('user-id');
      expect(result).toHaveLength(2);
    });

    it('should refresh token on 401', async () => {
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue({
        id: '123',
        accessToken: 'enc-token',
        refreshToken: 'enc-refresh',
      } as any);

      (global.fetch as jest.Mock)
        // First call fails with 401
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED })
        // Refresh token call
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'new-token' }),
        })
        // Retry call succeeds
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          ok: true,
          json: async () => ({
            data: [],
            pagination: {},
          }),
        });

      await service.listFollowedChannels('user-id');
      expect(mockThirdPartiesService.updateThirdPartyAccount).toHaveBeenCalled();
    });

    it('should refresh token on 401 with missing refresh token', async () => {
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue({
        id: '123',
        accessToken: 'enc-token',
        // refreshToken missing
      } as any);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'new-token' }),
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          ok: true,
          json: async () => ({
            data: [],
            pagination: {},
          }),
        });

      await service.listFollowedChannels('user-id');
      expect(mockThirdPartiesService.updateThirdPartyAccount).toHaveBeenCalled();
    });

    it('should throw error if response not ok', async () => {
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue({
        id: '123',
        accessToken: 'enc-token',
      } as any);

      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.BAD_REQUEST,
        ok: false,
      });

      await expect(service.listFollowedChannels('user-id')).rejects.toThrow(ApiError);
    });
  });
});
