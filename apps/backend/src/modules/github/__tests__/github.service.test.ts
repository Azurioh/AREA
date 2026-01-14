import type { ThirdPartiesService } from '@/modules/third-parties';
import ApiError from '@/utils/api-error';
import { GithubService } from '../github.service';

jest.mock('@/utils/environment', () => ({
  environment: {
    BASE_API_URL: 'https://api.area.com',
    CRYPT_SECRET_KEY: 'test_secret_key',
  },
}));

jest.mock('@/utils/crypt', () => ({
  decryptString: jest.fn((str) => str),
}));

jest.mock('@/integrations', () => ({
  Reaction: {
    parseActionVariables: jest.fn((_action, variables) => variables),
  },
}));

describe('GithubService', () => {
  let githubService: GithubService;
  let mockThirdPartiesService: jest.Mocked<ThirdPartiesService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockThirdPartiesService = {
      getThirdPartyAccountByUserId: jest.fn(),
    } as any;

    global.fetch = jest.fn();

    githubService = new GithubService(mockThirdPartiesService);
  });

  describe('createAction', () => {
    const userId = 'user123';
    const action: any = {
      name: 'push',
      params: {
        repository: { name: 'repo-name', id: 'repo-id' },
      },
    };
    const mockAccount = {
      username: 'testuser',
      accessToken: 'encrypted_token',
    };

    beforeEach(() => {
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockAccount as any);
    });

    it('should create webhook and return trigger string', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      const result = await githubService.createAction(userId, action);

      expect(result).toBe('push/repo-id');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/testuser/repo-name/hooks',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('https://api.area.com/webhook/v1/github'),
        }),
      );
    });

    it('should return trigger if webhook already exists', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          errors: [{ code: 'custom', message: 'Hook already exists on this repository' }],
        }),
      });

      const result = await githubService.createAction(userId, action);
      expect(result).toBe('push/repo-id');
    });

    it('should handle webhook already exists error with null error object in array', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          errors: [null, { code: 'custom', message: 'Hook already exists on this repository' }],
        }),
      });

      const result = await githubService.createAction(userId, action);
      expect(result).toBe('push/repo-id');
    });

    it('should throw ApiError if webhook creation fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          errors: [{ message: 'Some other error' }],
        }),
      });

      await expect(githubService.createAction(userId, action)).rejects.toThrow(ApiError);
    });

    it('should throw ApiError if webhook creation fails with empty errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({}),
      });

      await expect(githubService.createAction(userId, action)).rejects.toThrow(ApiError);
    });
  });

  describe('createReaction', () => {
    const userId = 'user123';
    const mockAccount = {
      username: 'testuser',
      accessToken: 'encrypted_token',
    };
    const actionPayload: any = {};

    beforeEach(() => {
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockAccount as any);
    });

    it('should call createIssue and return true when reaction is create_issue', async () => {
      const reaction: any = {
        name: 'create_issue',
        params: {
          repository: { name: 'repo-name' },
          title: 'Issue Title',
          body: 'Issue Body',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      const result = await githubService.createReaction(userId, reaction, actionPayload);

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/testuser/repo-name/issues',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Issue Title'),
        }),
      );
    });

    it('should return false for unknown reaction', async () => {
      const reaction: any = {
        name: 'unknown_reaction',
      };

      const result = await githubService.createReaction(userId, reaction, actionPayload);

      expect(result).toBe(false);
    });
  });

  describe('listRepositories', () => {
    const userId = 'user123';
    const mockAccount = {
      username: 'testuser',
      accessToken: 'encrypted_token',
    };

    beforeEach(() => {
      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockAccount as any);
    });

    it('should list admin repositories', async () => {
      const mockRepos = [
        { id: 1, name: 'repo1', permissions: { admin: true } },
        { id: 2, name: 'repo2', permissions: { admin: false } },
        { id: 3, name: 'repo3' }, // No permissions field
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockRepos),
      });

      const result = await githubService.listRepositories(userId);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ name: 'repo1', id: '1' });
    });

    it('should throw ApiError if fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(githubService.listRepositories(userId)).rejects.toThrow(ApiError);
    });
  });
});
