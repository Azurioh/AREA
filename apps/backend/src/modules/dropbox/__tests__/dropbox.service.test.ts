import { HttpStatusCode } from '@area/shared/enums/http-status';
import { decryptString, encryptString } from '@/utils/crypt';
import { ThirdPartiesService } from '../../third-parties/third-parties.service';
import { DropboxRepository } from '../dropbox.repository';
import { DropboxService } from '../dropbox.service';

jest.mock('../dropbox.repository');
jest.mock('../../third-parties/third-parties.service');
jest.mock('@/utils/crypt');
jest.mock('@/utils/environment', () => ({
  environment: {
    CRYPT_SECRET_KEY: 'test-secret',
    DROPBOX_CLIENT_ID: 'client-id',
    DROPBOX_CLIENT_SECRET: 'client-secret',
    BASE_API_URL: 'http://localhost:3000',
  },
}));

global.fetch = jest.fn();

describe('DropboxService', () => {
  let service: DropboxService;
  let repository: jest.Mocked<DropboxRepository>;
  let thirdPartiesService: jest.Mocked<ThirdPartiesService>;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new DropboxRepository({} as any) as jest.Mocked<DropboxRepository>;
    thirdPartiesService = new ThirdPartiesService({} as any, {} as any) as jest.Mocked<ThirdPartiesService>;
    service = new DropboxService(repository, thirdPartiesService);

    (decryptString as jest.Mock).mockImplementation((str) => str);
    (encryptString as jest.Mock).mockImplementation((str) => str);
  });

  describe('createAction', () => {
    it('should return action trigger and update account with new path', async () => {
      const mockAccount = { id: 'acc123', cursor: { ref: 'ref1', paths: ['/path1'] } };
      thirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockAccount as any);

      const action = { name: 'file_created', params: { path: '/path2' } };
      const actionReactionId = 'action-reaction-123';
      const result = await service.createAction(actionReactionId, 'user1', action as any);

      expect(result).toBe('file_created/(/path2)/acc123');
      expect(thirdPartiesService.updateThirdPartyAccount).toHaveBeenCalledWith('dropbox', 'user1', {
        cursor: { ref: 'ref1', paths: ['/path1', '/path2'] },
      });
    });

    it('should not duplicate paths in cursor', async () => {
      const mockAccount = { id: 'acc123', cursor: { ref: 'ref1', paths: ['/path1'] } };
      thirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockAccount as any);

      const action = { name: 'file_created', params: { path: '/path1' } };
      const actionReactionId = 'action-reaction-123';
      await service.createAction(actionReactionId, 'user1', action as any);

      expect(thirdPartiesService.updateThirdPartyAccount).toHaveBeenCalledWith('dropbox', 'user1', {
        cursor: { ref: 'ref1', paths: ['/path1'] },
      });
    });
  });

  describe('createCursor', () => {
    it('should return cursor on success', async () => {
      const mockAccount = { userId: 'u1', accessToken: 'at', refreshToken: 'rt' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: HttpStatusCode.OK,
        json: async () => ({ cursor: 'new-cursor' }),
      });

      const result = await service.createCursor(mockAccount as any);

      expect(result).toBe('new-cursor');
    });

    it('should refresh token and retry on 401', async () => {
      const mockAccount = { userId: 'u1', accessToken: 'at', refreshToken: 'rt' };
      service.refreshTokens = jest.fn().mockResolvedValue('new-at');

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED, ok: false })
        .mockResolvedValueOnce({
          ok: true,
          status: HttpStatusCode.OK,
          json: async () => ({ cursor: 'retry-cursor' }),
        });

      const result = await service.createCursor(mockAccount as any);

      expect(service.refreshTokens).toHaveBeenCalledWith('u1', 'rt');
      expect(result).toBe('retry-cursor');
    });

    it('should return null if final attempt fails', async () => {
      const mockAccount = { userId: 'u1', accessToken: 'at' };
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: HttpStatusCode.BAD_REQUEST });

      const result = await service.createCursor(mockAccount as any);

      expect(result).toBeNull();
    });
  });

  describe('actionReception', () => {
    it('should process changes and return actions', async () => {
      const mockAccount = {
        userId: 'u1',
        id: 'acc1',
        cursor: { ref: 'ref1', paths: ['/A'] },
        accessToken: 'at',
      };
      thirdPartiesService.getThirdPartyAccountByServiceAccountId.mockResolvedValue(mockAccount as any);

      const mockActionPayload = { content: { ids: ['acc1'] } };

      // Mock Dropbox list_folder/continue response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: HttpStatusCode.OK,
        json: async () => ({
          entries: [
            { '.tag': 'file', id: 'f1', name: 'img.png', path_lower: '/a/img.png' },
            { '.tag': 'folder', id: 'd1', name: 'docs', path_lower: '/a/docs' },
            { '.tag': 'file', id: 'f2', name: 'other.txt', path_lower: '/b/other.txt' }, // different path
          ],
          cursor: 'ref2',
        }),
      });

      repository.getDropboxResourceById.mockImplementation(async (id) =>
        id === 'f1' ? { id: 'f1', tag: 'file' } : null,
      );

      const results = await service.actionReception(mockActionPayload as any);

      expect(results).toHaveLength(2);
      expect(results[0]).toMatchObject({ name: 'file_modified', content: { name: 'img.png', path: '/A' } });
      expect(results[1]).toMatchObject({ name: 'folder_created', content: { name: 'docs', path: '/A' } });

      expect(thirdPartiesService.updateThirdPartyAccount).toHaveBeenCalledWith('dropbox', 'u1', {
        cursor: { ref: 'ref2', paths: ['/A'] },
      });
    });

    it('should ignore entries with unsupported tags (e.g., deleted)', async () => {
      const mockAccount = {
        userId: 'u1',
        id: 'acc1',
        cursor: { ref: 'ref1', paths: ['/A'] },
        accessToken: 'at',
      };
      thirdPartiesService.getThirdPartyAccountByServiceAccountId.mockResolvedValue(mockAccount as any);

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: HttpStatusCode.OK,
        json: async () => ({
          entries: [{ '.tag': 'deleted', name: 'old.txt', path_lower: '/a/old.txt' }],
          cursor: 'ref2',
        }),
      });

      const results = await service.actionReception({ content: { ids: ['acc1'] } } as any);

      expect(results).toHaveLength(0);
    });

    it('should skip if account has no cursor', async () => {
      thirdPartiesService.getThirdPartyAccountByServiceAccountId.mockResolvedValue({ id: 'acc1', cursor: null } as any);
      const results = await service.actionReception({ content: { ids: ['acc1'] } } as any);
      expect(results).toHaveLength(0);
    });

    it('should retry after token refresh on 401', async () => {
      const mockAccount = { userId: 'u1', id: 'acc1', cursor: { ref: 'ref1', paths: ['/A'] }, accessToken: 'at' };
      thirdPartiesService.getThirdPartyAccountByServiceAccountId.mockResolvedValue(mockAccount as any);
      service.refreshTokens = jest.fn().mockResolvedValue('new-at');

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED, ok: false })
        .mockResolvedValueOnce({
          ok: true,
          status: HttpStatusCode.OK,
          json: async () => ({ entries: [], cursor: 'ref2' }),
        });

      await service.actionReception({ content: { ids: ['acc1'] } } as any);

      expect(service.refreshTokens).toHaveBeenCalled();
    });

    it('should skip if response is not ok', async () => {
      const mockAccount = { userId: 'u1', id: 'acc1', cursor: { ref: 'ref1', paths: ['/A'] }, accessToken: 'at' };
      thirdPartiesService.getThirdPartyAccountByServiceAccountId.mockResolvedValue(mockAccount as any);
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: HttpStatusCode.BAD_REQUEST });

      const results = await service.actionReception({ content: { ids: ['acc1'] } } as any);
      expect(results).toHaveLength(0);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens and update account', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.OK,
        json: async () => ({ access_token: 'new-at' }),
      });

      const result = await service.refreshTokens('u1', 'rt');

      expect(result).toBe('new-at');
      expect(thirdPartiesService.updateThirdPartyAccount).toHaveBeenCalledWith('dropbox', 'u1', {
        accessToken: expect.any(String),
      });
    });

    it('should throw ApiError if refresh fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ status: HttpStatusCode.UNAUTHORIZED });

      const error = await service.refreshTokens('u1', 'rt').catch((e) => e);
      expect(error.httpCode).toBe(HttpStatusCode.UNAUTHORIZED);
      expect(error.message).toBe('Error when refreshing Dropbox tokens');
    });
  });

  describe('createCursor', () => {
    it('should handle missing refresh token during retry', async () => {
      const mockAccount = { userId: 'u1', accessToken: 'at', refreshToken: null };
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: HttpStatusCode.UNAUTHORIZED, ok: false })
        .mockResolvedValueOnce({ status: HttpStatusCode.BAD_REQUEST, ok: false }); // refreshTokens fail

      await expect(service.createCursor(mockAccount as any)).rejects.toThrow('Error when refreshing Dropbox tokens');
    });
  });

  describe('Wrapper methods', () => {
    it('createDropboxResource should call repository', async () => {
      await service.createDropboxResource('file', 'f1');
      expect(repository.createDropboxResource).toHaveBeenCalledWith({ tag: 'file', id: 'f1' });
    });

    it('getDropboxResourceById should call repository', async () => {
      await service.getDropboxResourceById('f1');
      expect(repository.getDropboxResourceById).toHaveBeenCalledWith('f1');
    });

    it('deleteDropboxResource should call repository', async () => {
      await service.deleteDropboxResource('f1');
      expect(repository.deleteDropboxResource).toHaveBeenCalledWith('f1');
    });
  });
});
