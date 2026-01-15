import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { PollingRepository } from '../polling.repository';
import type { SpotifyService } from '../spotify';
import { SpotifyPollingService } from '../spotify-polling.service';
import type { ThirdPartiesService } from '../third-parties';

jest.mock('@/utils/environment', () => ({
  environment: {
    BASE_API_URL: 'http://test-api',
    CRYPT_SECRET_KEY: 'secret',
  },
}));

jest.mock('@/utils/crypt', () => ({
  decryptString: jest.fn((str) => str),
}));

describe('SpotifyPollingService', () => {
  let service: SpotifyPollingService;
  let mockRepository: jest.Mocked<PollingRepository>;
  let mockThirdPartiesService: jest.Mocked<ThirdPartiesService>;
  let mockSpotifyService: jest.Mocked<SpotifyService>;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();

    mockRepository = {
      getUsersToPoll: jest.fn(),
      updateUserToPoll: jest.fn(),
    } as any;

    mockThirdPartiesService = {
      getThirdPartyAccountByUserId: jest.fn(),
    } as any;

    mockSpotifyService = {
      refreshTokens: jest.fn(),
    } as any;

    service = new SpotifyPollingService(mockRepository, mockThirdPartiesService, mockSpotifyService);
  });

  describe('pollCurrentlyPlayingTrack', () => {
    const mockUsers = [
      {
        userId: 'user1',
        type: 'listening_to_artist',
        trigger: {
          artistId: 'artist1',
          lastTrackId: null,
        },
      },
    ];

    const mockAccount = {
      _id: 'account1',
      userId: 'user1',
      accessToken: 'encrypted_access',
      refreshToken: 'encrypted_refresh',
    };

    beforeEach(() => {
      mockRepository.getUsersToPoll.mockResolvedValue(mockUsers as any);
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockAccount as any);
    });

    it('should skip if API response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.BAD_REQUEST,
        ok: false,
      });

      await service.pollCurrentlyPlayingTrack();

      expect(global.fetch).toHaveBeenCalledTimes(1); // Spotify API
    });

    it('should skip if API response is NO_CONTENT', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.NO_CONTENT,
        ok: true,
      });

      await service.pollCurrentlyPlayingTrack();

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should refresh token if unauthorized and retry', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.UNAUTHORIZED,
          ok: false,
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          ok: true,
          json: jest.fn().mockResolvedValue({ item: { artists: [] } }),
        });

      mockSpotifyService.refreshTokens.mockResolvedValue('new_token');

      await service.pollCurrentlyPlayingTrack();

      expect(mockSpotifyService.refreshTokens).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should trigger webhook if artist matches', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          ok: true,
          json: jest.fn().mockResolvedValue({
            item: {
              artists: [{ id: 'artist1', name: 'Artist Name' }],
            },
          }),
        })
        .mockResolvedValueOnce({
          // Webhook call
          ok: true,
        });

      await service.pollCurrentlyPlayingTrack();

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        'https://api.spotify.com/v1/me/player/currently-playing',
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer encrypted_access',
          },
          method: 'GET',
        }),
      );
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        'http://test-api/webhook/v1/spotify',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'x-spotify-event': 'listening_to_artist',
          }),
          body: JSON.stringify({
            artist: { name: 'Artist Name', id: 'artist1' },
          }),
        }),
      );
    });

    it('should not trigger webhook if artist does not match', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.OK,
        ok: true,
        json: jest.fn().mockResolvedValue({
          item: {
            artists: [{ id: 'artist2', name: 'Other Artist' }],
          },
        }),
      });

      await service.pollCurrentlyPlayingTrack();

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should skip if user type is not listening_to_artist', async () => {
      mockRepository.getUsersToPoll.mockResolvedValue([{ userId: 'user2', type: 'other_type', trigger: 'abc' }] as any);

      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.OK,
        ok: true,
        json: jest.fn().mockResolvedValue({
          item: { artists: [{ id: 'abc' }] },
        }),
      });

      await service.pollCurrentlyPlayingTrack();

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
    it('should handle missing refresh token during refresh', async () => {
      const mockAccountNoToken = {
        ...mockAccount,
        refreshToken: undefined,
      };
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockAccountNoToken as any);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.UNAUTHORIZED,
          ok: false,
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          ok: true,
          json: jest.fn().mockResolvedValue({ item: { artists: [] } }),
        });

      mockSpotifyService.refreshTokens.mockResolvedValue('new_token');

      await service.pollCurrentlyPlayingTrack();

      expect(mockSpotifyService.refreshTokens).toHaveBeenCalledWith(expect.any(String), '');
    });
  });
});
