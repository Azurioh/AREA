import { HttpStatusCode } from '@area/shared/enums/http-status';
import { Reaction } from '@/integrations';
import ApiError from '@/utils/api-error';
import { decryptString, encryptString } from '@/utils/crypt';
import { environment } from '@/utils/environment';
import { PollingService } from '../../polling/polling.service';
import { ThirdPartiesService } from '../../third-parties/third-parties.service';
import { SpotifyService } from '../spotify.service';

jest.mock('../../third-parties/third-parties.service');
jest.mock('../../polling/polling.service');
jest.mock('@/utils/crypt');
jest.mock('@/integrations', () => {
  const actual = jest.requireActual('@/integrations');
  return {
    ...actual,
    ServiceManager: {
      instance: {
        get: jest.fn(),
      },
    },
    Reaction: {
      parseActionVariables: jest.fn(),
    },
  };
});

global.fetch = jest.fn();

describe('SpotifyService', () => {
  let spotifyService: SpotifyService;
  let thirdPartiesService: jest.Mocked<ThirdPartiesService>;
  let pollingService: jest.Mocked<PollingService>;

  const mockSpotifyAccount = {
    _id: 'account-id',
    userId: 'user-id',
    accessToken: 'encrypted-access-token',
    refreshToken: 'encrypted-refresh-token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    thirdPartiesService = new ThirdPartiesService({} as any) as jest.Mocked<ThirdPartiesService>;
    pollingService = new PollingService({} as any, {} as any) as jest.Mocked<PollingService>;
    spotifyService = new SpotifyService(thirdPartiesService, pollingService);

    (decryptString as jest.Mock).mockImplementation((str) => str?.replace('encrypted-', '') || '');
    (encryptString as jest.Mock).mockImplementation((str) => `encrypted-${str}`);
  });

  describe('createAction', () => {
    it('should call listeningToArtist for listening_to_artist action', async () => {
      const action = { name: 'listening_to_artist', params: { artist: 'Artist Name' } };
      thirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockSpotifyAccount as any);

      const spotifyServiceSpy = jest.spyOn(spotifyService, 'listeningToArtist').mockResolvedValue('action-id');

      const result = await spotifyService.createAction('user-id', action as any);

      expect(result).toBe('action-id');
      expect(spotifyServiceSpy).toHaveBeenCalledWith(mockSpotifyAccount, action);
    });

    it('should throw ApiError if action is not found', async () => {
      thirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockSpotifyAccount as any);
      const action = { name: 'unknown_action', params: {} };

      await expect(spotifyService.createAction('user-id', action as any)).rejects.toThrow(ApiError);
    });
  });

  describe('listeningToArtist', () => {
    it('should add user to poll and return action ID', async () => {
      const action = { name: 'listening_to_artist', params: { artist: 'Artist Name' } };
      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.OK,
        json: async () => ({
          artists: {
            items: [{ id: 'artist-id' }],
          },
        }),
      });

      const result = await spotifyService.listeningToArtist(mockSpotifyAccount as any, action as any);

      expect(result).toBe('listening_to_artist/user-id/artist-id');
      expect(pollingService.addUserToPoll).toHaveBeenCalledWith({
        service: 'spotify',
        userId: 'user-id',
        type: 'listening_to_artist',
        trigger: {
          artistId: 'artist-id',
          lastTrackId: null,
        },
      });
    });

    it('should refresh token if unauthorized', async () => {
      const action = { name: 'listening_to_artist', params: { artist: 'Artist Name' } };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.UNAUTHORIZED,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'new-token' }),
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({
            artists: {
              items: [{ id: 'artist-id' }],
            },
          }),
        });

      const result = await spotifyService.listeningToArtist(mockSpotifyAccount as any, action as any);

      expect(result).toBe('listening_to_artist/user-id/artist-id');
      expect(thirdPartiesService.updateThirdPartyAccount).toHaveBeenCalled();
    });

    it('should handle missing refresh token during refresh', async () => {
      const accountWithoutRefresh = { ...mockSpotifyAccount, refreshToken: undefined };
      const action = { name: 'listening_to_artist', params: { artist: 'Artist' } };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED, json: async () => ({}) })
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, json: async () => ({ access_token: 'new-token' }) })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ artists: { items: [{ id: 'id' }] } }),
        });

      await spotifyService.listeningToArtist(accountWithoutRefresh as any, action as any);
      expect(decryptString).toHaveBeenCalledWith('', environment.CRYPT_SECRET_KEY);
    });
  });

  describe('createReaction', () => {
    it('should return addTrackToPlayList result for add_track_to_playlist', async () => {
      const spotifyAccount = { ...mockSpotifyAccount };
      thirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(spotifyAccount as any);
      const reaction = { name: 'add_track_to_playlist' };
      const actionPayload = { service: 'github', name: 'push', content: {} };

      const spy = jest.spyOn(spotifyService, 'addTrackToPlayList').mockResolvedValue(true);

      const result = await spotifyService.createReaction('user-id', reaction as any, actionPayload as any);

      expect(result).toBe(true);
      expect(spy).toHaveBeenCalledWith(spotifyAccount, reaction, actionPayload);
    });

    it('should return saveEpisode result for save_episode', async () => {
      thirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockSpotifyAccount as any);
      const reaction = { name: 'save_episode' };
      const spy = jest.spyOn(spotifyService, 'saveEpisode').mockResolvedValue(true);

      const result = await spotifyService.createReaction('user-id', reaction as any, {} as any);

      expect(result).toBe(true);
      expect(spy).toHaveBeenCalled();
    });

    it('should return saveShow result for save_show', async () => {
      thirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockSpotifyAccount as any);
      const reaction = { name: 'save_show' };
      const spy = jest.spyOn(spotifyService, 'saveShow').mockResolvedValue(true);

      const result = await spotifyService.createReaction('user-id', reaction as any, {} as any);

      expect(result).toBe(true);
      expect(spy).toHaveBeenCalled();
    });

    it('should return false for unknown reaction', async () => {
      thirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockSpotifyAccount as any);
      const result = await spotifyService.createReaction('user-id', { name: 'unknown' } as any, {} as any);
      expect(result).toBe(false);
    });
  });

  describe('addTrackToPlayList', () => {
    it('should add track directly if it is a URI link', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['https://open.spotify.com/track/123']);
      (global.fetch as jest.Mock).mockResolvedValue({ status: HttpStatusCode.OK, ok: true });

      const result = await spotifyService.addTrackToPlayList(
        mockSpotifyAccount as any,
        { params: { track: 'link', playlist: { id: 'plist' } } } as any,
        {} as any,
      );

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/playlists/plist/tracks',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ uris: ['spotify:track:123'] }),
        }),
      );
    });

    it('should search for track if not a link', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['Track Name']);
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ tracks: { items: [{ uri: 'spotify:track:456' }] } }),
        })
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, ok: true });

      const result = await spotifyService.addTrackToPlayList(
        mockSpotifyAccount as any,
        { params: { track: 'name', playlist: { id: 'plist' } } } as any,
        {} as any,
      );

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('search?q=Track Name'), expect.anything());
    });

    it('should return false if track is not found by parseActionVariables', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue([undefined]);
      const result = await spotifyService.addTrackToPlayList(
        mockSpotifyAccount as any,
        { params: {} } as any,
        {} as any,
      );
      expect(result).toBe(false);
    });

    it('should handle unauthorized during search and retry after refresh', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['Track Name']);
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED, json: async () => ({}) }) // Initial search fails
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, json: async () => ({ access_token: 'new-token' }) }) // Refresh
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ tracks: { items: [{ uri: 'spotify:track:789' }] } }),
        }) // Search succeeds
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, ok: true }); // Add track succeeds

      const result = await spotifyService.addTrackToPlayList(
        mockSpotifyAccount as any,
        { params: { track: 'name', playlist: { id: 'plist' } } } as any,
        {} as any,
      );

      expect(result).toBe(true);
    });

    it('should handle missing match group 1 in track link', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['/track/']);
      (global.fetch as jest.Mock).mockResolvedValue({ status: HttpStatusCode.OK, ok: true });

      await spotifyService.addTrackToPlayList(
        mockSpotifyAccount as any,
        { params: { track: 'link', playlist: { id: 'plist' } } } as any,
        {} as any,
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: JSON.stringify({ uris: ['spotify:track:'] }),
        }),
      );
    });

    it('should handle missing refresh token in addTrackToPlayList', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['/track/123']);
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED })
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, json: async () => ({ access_token: 'new-token' }) })
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, ok: true });

      const accountWithoutRefresh = { ...mockSpotifyAccount, refreshToken: undefined };
      await spotifyService.addTrackToPlayList(
        accountWithoutRefresh as any,
        { params: { track: 'link', playlist: { id: 'plist' } } } as any,
        {} as any,
      );
      expect(decryptString).toHaveBeenCalledWith('', environment.CRYPT_SECRET_KEY);
    });
  });

  describe('saveEpisode', () => {
    it('should save episode by ID from link', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['https://open.spotify.com/episode/abc']);
      (global.fetch as jest.Mock).mockResolvedValue({ status: HttpStatusCode.OK, ok: true });

      const result = await spotifyService.saveEpisode(
        mockSpotifyAccount as any,
        { params: { episode: 'link' } } as any,
        {} as any,
      );

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/me/episodes',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ ids: ['abc'] }),
        }),
      );
    });

    it('should search for episode if not a link', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['Episode Name']);
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ episodes: { items: [{ id: 'ep123' }] } }),
        })
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, ok: true });

      const result = await spotifyService.saveEpisode(
        mockSpotifyAccount as any,
        { params: { episode: 'name' } } as any,
        {} as any,
      );

      expect(result).toBe(true);
    });

    it('should handle refresh token on unauthorized', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['abc']);
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED, json: async () => ({}) }) // Search fails
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, json: async () => ({ access_token: 'new-token' }) }) // Refresh
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ episodes: { items: [{ id: 'ep123' }] } }),
        }) // Search succeeds
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, ok: true }); // Save succeeds

      const result = await spotifyService.saveEpisode(
        mockSpotifyAccount as any,
        { params: { episode: 'abc' } } as any,
        {} as any,
      );

      expect(result).toBe(true);
    });

    it('should handle missing match group 1 in episode link', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['/episode/']);
      (global.fetch as jest.Mock).mockResolvedValue({ status: HttpStatusCode.OK, ok: true });

      await spotifyService.saveEpisode(mockSpotifyAccount as any, { params: { episode: 'link' } } as any, {} as any);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: JSON.stringify({ ids: [''] }),
        }),
      );
    });

    it('should handle missing refresh token in saveEpisode', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['/episode/abc']);
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED })
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, json: async () => ({ access_token: 'new-token' }) })
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, ok: true });

      const accountWithoutRefresh = { ...mockSpotifyAccount, refreshToken: undefined };
      await spotifyService.saveEpisode(accountWithoutRefresh as any, { params: { episode: 'link' } } as any, {} as any);
      expect(decryptString).toHaveBeenCalledWith('', environment.CRYPT_SECRET_KEY);
    });

    it('should return false if episode is empty', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue([undefined]);
      const result = await spotifyService.saveEpisode(mockSpotifyAccount as any, { params: {} } as any, {} as any);
      expect(result).toBe(false);
    });
  });

  describe('saveShow', () => {
    it('should save show by ID from link', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['https://open.spotify.com/show/xyz']);
      (global.fetch as jest.Mock).mockResolvedValue({ status: HttpStatusCode.OK, ok: true });

      const result = await spotifyService.saveShow(
        mockSpotifyAccount as any,
        { params: { show: 'link' } } as any,
        {} as any,
      );

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/me/shows?ids=xyz',
        expect.objectContaining({ method: 'PUT' }),
      );
    });

    it('should search for show if not a link', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['Show Name']);
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ shows: { items: [{ id: 'show123' }] } }),
        })
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, ok: true });

      const result = await spotifyService.saveShow(
        mockSpotifyAccount as any,
        { params: { show: 'name' } } as any,
        {} as any,
      );

      expect(result).toBe(true);
    });

    it('should handle refresh token on unauthorized', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['xyz']);
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED, json: async () => ({}) }) // Search fails
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, json: async () => ({ access_token: 'new-token' }) }) // Refresh
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ shows: { items: [{ id: 'show123' }] } }),
        }) // Search succeeds
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, ok: true }); // Save succeeds

      const result = await spotifyService.saveShow(
        mockSpotifyAccount as any,
        { params: { show: 'xyz' } } as any,
        {} as any,
      );

      expect(result).toBe(true);
    });

    it('should handle missing match group 1 in show link', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['/show/']);
      (global.fetch as jest.Mock).mockResolvedValue({ status: HttpStatusCode.OK, ok: true });

      await spotifyService.saveShow(mockSpotifyAccount as any, { params: { show: 'link' } } as any, {} as any);
      expect(global.fetch).toHaveBeenCalledWith('https://api.spotify.com/v1/me/shows?ids=', expect.anything());
    });

    it('should handle missing refresh token in saveShow', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue(['/show/xyz']);
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED })
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, json: async () => ({ access_token: 'new-token' }) })
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, ok: true });

      const accountWithoutRefresh = { ...mockSpotifyAccount, refreshToken: undefined };
      await spotifyService.saveShow(accountWithoutRefresh as any, { params: { show: 'link' } } as any, {} as any);
      expect(decryptString).toHaveBeenCalledWith('', environment.CRYPT_SECRET_KEY);
    });

    it('should return false if show is empty', async () => {
      (Reaction.parseActionVariables as jest.Mock).mockReturnValue([undefined]);
      const result = await spotifyService.saveShow(mockSpotifyAccount as any, { params: {} } as any, {} as any);
      expect(result).toBe(false);
    });
  });

  describe('refreshTokens', () => {
    it('should throw ApiError if refresh fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ status: HttpStatusCode.BAD_REQUEST });
      await expect(spotifyService.refreshTokens('acc-id', 'ref-token')).rejects.toThrow(ApiError);
    });

    it('should update account and return new token on success', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.OK,
        json: async () => ({ access_token: 'new-token' }),
      });

      const result = await spotifyService.refreshTokens('acc-id', 'ref-token');

      expect(result).toBe('new-token');
      expect(thirdPartiesService.updateThirdPartyAccount).toHaveBeenCalledWith('spotify', 'acc-id', {
        accessToken: 'encrypted-new-token',
      });
    });
  });

  describe('listPlaylist', () => {
    it('should return list of owned playlists', async () => {
      const spotifyAccount = { ...mockSpotifyAccount, id: 'sp-id' };
      thirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(spotifyAccount as any);

      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.OK,
        ok: true,
        json: async () => ({
          items: [
            { name: 'My Playlist', id: 'plist1', owner: { id: 'sp-id' } },
            { name: 'Other Playlist', id: 'plist2', owner: { id: 'other' } },
          ],
        }),
      });

      const result = await spotifyService.listPlaylist('user-id');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ name: 'My Playlist', id: 'plist1' });
    });

    it('should refresh token if unauthorized and retry', async () => {
      const spotifyAccount = { ...mockSpotifyAccount, id: 'sp-id' };
      thirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(spotifyAccount as any);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'new-token' }),
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          ok: true,
          json: async () => ({ items: [] }),
        });

      await spotifyService.listPlaylist('user-id');

      expect(thirdPartiesService.updateThirdPartyAccount).toHaveBeenCalled();
    });

    it('should handle undefined refresh token safely', async () => {
      const spotifyAccount = { ...mockSpotifyAccount, id: 'sp-id', refreshToken: undefined };
      thirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(spotifyAccount as any);

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'new-token' }),
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          ok: true,
          json: async () => ({ items: [] }),
        });

      await spotifyService.listPlaylist('user-id');

      expect(decryptString).toHaveBeenCalledWith('', environment.CRYPT_SECRET_KEY);
    });

    it('should throw ApiError if response is not ok', async () => {
      thirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockSpotifyAccount as any);
      (global.fetch as jest.Mock).mockResolvedValue({ status: HttpStatusCode.BAD_REQUEST, ok: false });

      await expect(spotifyService.listPlaylist('user-id')).rejects.toThrow('Failed to list playlists');
    });
  });
});
