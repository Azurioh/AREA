import { HttpStatusCode } from '@area/shared/enums/http-status';
import { ObjectId } from 'mongodb';
import { UsersService } from '@/modules/users';
import ApiError from '@/utils/api-error';
import { decryptString, encryptString } from '@/utils/crypt';
import { generateStateToken, verifyToken } from '@/utils/token';
import { ThirdPartiesRepository } from '../third-parties.repository';
import { ThirdPartiesService } from '../third-parties.service';

jest.mock('../third-parties.repository');
jest.mock('@/modules/users');
jest.mock('@/utils/token');
jest.mock('@/utils/crypt');

global.fetch = jest.fn();

describe('ThirdPartiesService', () => {
  let service: ThirdPartiesService;
  let repository: jest.Mocked<ThirdPartiesRepository>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new ThirdPartiesRepository({} as any) as jest.Mocked<ThirdPartiesRepository>;
    usersService = new UsersService({} as any) as jest.Mocked<UsersService>;
    service = new ThirdPartiesService(repository, usersService);

    (decryptString as jest.Mock).mockImplementation((str) => str?.replace('encrypted-', '') || '');
    (encryptString as jest.Mock).mockImplementation((str) => `encrypted-${str}`);
  });

  describe('getThirdPartyAuthorizationUrl', () => {
    it('should return authorization url for github', async () => {
      (generateStateToken as jest.Mock).mockReturnValue('state-token');
      const url = await service.getThirdPartyAuthorizationUrl('github', 'user-id', 'web');

      expect(url).toContain('https://github.com/login/oauth/authorize');
      expect(url).toContain('state=state-token');
      expect(generateStateToken).toHaveBeenCalledWith({ _id: 'user-id', clientType: 'web' });
    });

    it('should return authorization url for discord', async () => {
      (generateStateToken as jest.Mock).mockReturnValue('state-token');
      const url = await service.getThirdPartyAuthorizationUrl('discord', 'user-id', 'mobile');
      expect(url).toContain('https://discord.com/oauth2/authorize');
    });

    it('should throw error for unknown service', async () => {
      await expect(service.getThirdPartyAuthorizationUrl('unknown' as any, 'uid', 'web')).rejects.toThrow();
    });
  });

  describe('getThirdPartyAccountByUserId', () => {
    it('should return account from repository', async () => {
      const mockAccount = { userId: '123', service: 'github' };
      repository.getThirdPartyAccountByUserId.mockResolvedValue(mockAccount as any);

      const result = await service.getThirdPartyAccountByUserId('github', '123');

      expect(result).toEqual(mockAccount);
    });

    it('should throw 404 if account not found', async () => {
      repository.getThirdPartyAccountByUserId.mockResolvedValue(null);
      await expect(service.getThirdPartyAccountByUserId('github', '123')).rejects.toThrow(ApiError);
    });
  });

  describe('getThirdPartyAccountByServiceAccountId', () => {
    it('should return account from repository', async () => {
      const mockAccount = { userId: '123', service: 'github' };
      repository.getThirdPartyAccountByServiceAccountId.mockResolvedValue(mockAccount as any);

      const result = await service.getThirdPartyAccountByServiceAccountId('github', 'acc-123');

      expect(result).toEqual(mockAccount);
    });

    it('should throw 404 if account not found', async () => {
      repository.getThirdPartyAccountByServiceAccountId.mockResolvedValue(null);
      await expect(service.getThirdPartyAccountByServiceAccountId('github', 'acc-123')).rejects.toThrow(ApiError);
    });
  });

  describe('authorizeToService', () => {
    it('should return success and client type on successful authorization (create)', async () => {
      (verifyToken as jest.Mock).mockReturnValue({ _id: 'user-id', clientType: 'web' });
      usersService.checkIfUserExist.mockResolvedValue(true);

      const data = { userId: 'user-id', service: 'github' };
      // Directly mock the function in the map because references are captured in constructor
      (service as any).servicesAuthorizationFunc.set('github', jest.fn().mockResolvedValue(data));

      repository.getThirdPartyAccountByUserId.mockResolvedValue(null);
      repository.createThirdPartyAccount.mockResolvedValue(true);

      const result = await service.authorizeToService('github', 'code', 'state');

      expect(result).toEqual({ success: true, clientType: 'web' });
      expect(repository.createThirdPartyAccount).toHaveBeenCalledWith(data);
    });

    it('should return success and client type on successful authorization (update)', async () => {
      (verifyToken as jest.Mock).mockReturnValue({ _id: 'user-id', clientType: 'web' });
      usersService.checkIfUserExist.mockResolvedValue(true);

      const data = { userId: 'user-id', service: 'github' };
      (service as any).servicesAuthorizationFunc.set('github', jest.fn().mockResolvedValue(data));

      const mockId = new ObjectId();
      repository.getThirdPartyAccountByUserId.mockResolvedValue({ _id: mockId } as any);
      repository.updateThirdPartyAccount.mockResolvedValue({ acknowledged: true, matchedCount: 1 } as any);

      const result = await service.authorizeToService('github', 'code', 'state');

      expect(result).toEqual({ success: true, clientType: 'web' });
      expect(repository.updateThirdPartyAccount).toHaveBeenCalledWith('user-id', 'github', data);
    });

    it('should throw NOT_FOUND if user does not exist', async () => {
      (verifyToken as jest.Mock).mockReturnValue({ _id: 'user-id', clientType: 'web' });
      usersService.checkIfUserExist.mockResolvedValue(false);
      await expect(service.authorizeToService('github', 'code', 'state')).rejects.toThrow(ApiError);
    });

    it('should throw if state is invalid (verifyToken throws)', async () => {
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      await expect(service.authorizeToService('github', 'code', 'invalid-state')).rejects.toThrow('Invalid token');
    });

    it('should return failure if service authorization function not found', async () => {
      (verifyToken as jest.Mock).mockReturnValue({ _id: 'user-id', clientType: 'web' });
      usersService.checkIfUserExist.mockResolvedValue(true);
      const result = await service.authorizeToService('unknown' as any, 'code', 'state');
      expect(result.success).toBe(false);
    });

    it('should return success false if update matchedCount is 0', async () => {
      (verifyToken as jest.Mock).mockReturnValue({ _id: 'user-id', clientType: 'web' });
      usersService.checkIfUserExist.mockResolvedValue(true);
      const data = { userId: 'user-id', service: 'github' };
      (service as any).servicesAuthorizationFunc.set('github', jest.fn().mockResolvedValue(data));
      repository.getThirdPartyAccountByUserId.mockResolvedValue({ _id: new ObjectId() } as any);
      repository.updateThirdPartyAccount.mockResolvedValue({ acknowledged: true, matchedCount: 0 } as any);

      const result = await service.authorizeToService('github', 'code', 'state');
      expect(result.success).toBe(false);
    });

    it('should return failure if service authorization function returns null', async () => {
      (verifyToken as jest.Mock).mockReturnValue({ _id: 'user-id', clientType: 'web' });
      usersService.checkIfUserExist.mockResolvedValue(true);
      (service as any).servicesAuthorizationFunc.set('github', jest.fn().mockResolvedValue(null));

      const result = await service.authorizeToService('github', 'code', 'state');
      expect(result.success).toBe(false);
      expect(result.clientType).toBe('web');
    });

    it('should return failure and catch error if service authorization function throws', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (verifyToken as jest.Mock).mockReturnValue({ _id: 'user-id', clientType: 'web' });
      usersService.checkIfUserExist.mockResolvedValue(true);

      (service as any).servicesAuthorizationFunc.set('github', jest.fn().mockRejectedValue(new Error('Auth failed')));

      const result = await service.authorizeToService('github', 'code', 'state');
      expect(result).toEqual({ success: false, clientType: 'web' });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('authorizeToGithub', () => {
    it('should exchange code for token and create account', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          // Token exchange
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'at', refresh_token: 'rt' }),
        })
        .mockResolvedValueOnce({
          // User info
          status: HttpStatusCode.OK,
          json: async () => ({ login: 'gh-user' }),
        });

      const result = await (service as any).authorizeToGithub('user-id', 'code');

      expect(result).toEqual(
        expect.objectContaining({
          userId: 'user-id',
          service: 'github',
          accessToken: 'encrypted-at',
          username: 'gh-user',
        }),
      );
    });

    it('should return null if token exchange fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ status: HttpStatusCode.BAD_REQUEST });
      const result = await (service as any).authorizeToGithub('user-id', 'code');
      expect(result).toBeNull();
    });

    it('should throw if user info fetch fails', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.OK, json: async () => ({ access_token: 'at' }) })
        .mockResolvedValueOnce({ status: HttpStatusCode.BAD_REQUEST });

      await expect((service as any).authorizeToGithub('user-id', 'code')).rejects.toThrow(ApiError);
    });
  });

  describe('authorizeToDiscord', () => {
    it('should exchange code for token and create account', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: HttpStatusCode.OK,
        json: async () => ({ access_token: 'at', refresh_token: 'rt', guild: { id: 'guild-id' } }),
      });

      const result = await (service as any).authorizeToDiscord('user-id', 'code');
      expect(result).toEqual(
        expect.objectContaining({
          userId: 'user-id',
          service: 'discord',
          accessToken: 'encrypted-at',
          refreshToken: 'encrypted-rt',
          guildId: 'guild-id',
        }),
      );
    });

    it('should return null if token exchange fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ status: HttpStatusCode.BAD_REQUEST });
      const result = await (service as any).authorizeToDiscord('user-id', 'code');
      expect(result).toBeNull();
    });
  });

  describe('authorizeToSpotify', () => {
    it('should exchange code for token and create account', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'at', refresh_token: 'rt' }),
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ id: 'spotify-user' }),
        });

      const result = await (service as any).authorizeToSpotify('user-id', 'code');
      expect(result).toEqual(
        expect.objectContaining({
          service: 'spotify',
          id: 'spotify-user',
        }),
      );
    });

    it('should return null if token exchange fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ status: HttpStatusCode.BAD_REQUEST });
      const result = await (service as any).authorizeToSpotify('user-id', 'code');
      expect(result).toBeNull();
    });

    it('should throw if profile fetch fails', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'at' }),
        })
        .mockResolvedValueOnce({ status: HttpStatusCode.BAD_REQUEST });

      await expect((service as any).authorizeToSpotify('user-id', 'code')).rejects.toThrow(ApiError);
    });
  });

  describe('authorizeToDropbox', () => {
    it('should exchange code for token and create account', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'at', refresh_token: 'rt', account_id: 'dbx-id' }),
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          ok: true,
          json: async () => ({ cursor: 'dbx-cursor' }),
        });

      const result = await (service as any).authorizeToDropbox('user-id', 'code');
      expect(result).toEqual(
        expect.objectContaining({
          service: 'dropbox',
          id: 'dbx-id',
        }),
      );
    });

    it('should return null if token exchange fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ status: HttpStatusCode.BAD_REQUEST });
      const result = await (service as any).authorizeToDropbox('user-id', 'code');
      expect(result).toBeNull();
    });

    it('should return null if getCursor fails (response not ok)', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'at', refresh_token: 'rt', account_id: 'dbx-id' }),
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          ok: false,
        });

      const result = await (service as any).authorizeToDropbox('user-id', 'code');
      expect(result).toBeNull();
    });

    it('should return null if cursor is missing in getCursor response', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'at', refresh_token: 'rt', account_id: 'dbx-id' }),
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          ok: true,
          json: async () => ({}),
        });

      const result = await (service as any).authorizeToDropbox('user-id', 'code');
      expect(result).toBeNull();
    });
  });

  describe('authorizeToTwitch', () => {
    it('should exchange code for token and create account', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'at', refresh_token: 'rt' }),
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ data: [{ id: 'twitch-id' }] }),
        });

      const result = await (service as any).authorizeToTwitch('user-id', 'code');
      expect(result).toEqual(
        expect.objectContaining({
          userId: 'user-id',
          service: 'twitch',
          accessToken: 'encrypted-at',
          refreshToken: 'encrypted-rt',
          id: 'twitch-id',
        }),
      );
    });

    it('should return null if token exchange fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ status: HttpStatusCode.BAD_REQUEST });
      const result = await (service as any).authorizeToTwitch('user-id', 'code');
      expect(result).toBeNull();
    });

    it('should return null if getId fails (response not ok)', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'at' }),
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.BAD_REQUEST,
          json: async () => ({}),
        });

      const result = await (service as any).authorizeToTwitch('user-id', 'code');
      expect(result).toBeNull();
    });

    it('should return null if getId returns empty data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ access_token: 'at' }),
        })
        .mockResolvedValueOnce({
          status: HttpStatusCode.OK,
          json: async () => ({ data: [] }),
        });

      const result = await (service as any).authorizeToTwitch('user-id', 'code');
      expect(result).toBeNull();
    });
  });

  describe('getThirdPartyStatus', () => {
    it('should return true if account exists', async () => {
      repository.getThirdPartyAccountByUserId.mockResolvedValue({} as any);
      const result = await service.getThirdPartyStatus('github', 'user-id');
      expect(result).toBe(true);
    });

    it('should return false if account does not exist', async () => {
      repository.getThirdPartyAccountByUserId.mockResolvedValue(null);
      const result = await service.getThirdPartyStatus('github', 'user-id');
      expect(result).toBe(false);
    });
  });

  describe('updateThirdPartyAccount', () => {
    it('should call repository update', async () => {
      repository.updateThirdPartyAccount.mockResolvedValue({ acknowledged: true, matchedCount: 1 } as any);

      await service.updateThirdPartyAccount('github', 'doc-id', { accessToken: 'new' });

      expect(repository.updateThirdPartyAccount).toHaveBeenCalledWith('doc-id', 'github', { accessToken: 'new' });
    });

    it('should throw INTERNAL_SERVER_ERROR if not acknowledged', async () => {
      repository.updateThirdPartyAccount.mockResolvedValue({ acknowledged: false } as any);
      await expect(service.updateThirdPartyAccount('github', 'doc-id', {})).rejects.toThrow(ApiError);
    });

    it('should throw NOT_FOUND if matchedCount is 0', async () => {
      repository.updateThirdPartyAccount.mockResolvedValue({ acknowledged: true, matchedCount: 0 } as any);
      await expect(service.updateThirdPartyAccount('github', 'doc-id', {})).rejects.toThrow(ApiError);
    });
  });
});
