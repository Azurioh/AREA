import type { GithubService } from '@/modules/github';
import { GithubPullRequestAction } from '../pull-request.action';

describe('GithubPullRequestAction', () => {
  let action: GithubPullRequestAction;
  let mockGithubService: GithubService;

  beforeEach(() => {
    mockGithubService = {
      listRepositories: jest.fn().mockResolvedValue(['repo1', 'repo2']),
    } as unknown as GithubService;

    action = new GithubPullRequestAction(mockGithubService);
  });

  it('should be initialized correctly', () => {
    expect(action.name).toBe('pull_request');
    expect(action.params.length).toBeGreaterThan(0);
  });

  it('should refresh params with repositories', async () => {
    const repoParam = action.params.find((p) => p.key === 'repository');
    expect(repoParam).toBeDefined();

    await action.refreshParams('user-id');

    expect(mockGithubService.listRepositories).toHaveBeenCalledWith('user-id');
    expect((repoParam as any)?.options).toEqual(['repo1', 'repo2']);
  });

  it('should not refresh params if param type is not select', async () => {
    const repoParam = action.params.find((p) => p.key === 'repository');
    if (repoParam) {
      const originalType = repoParam.type;
      repoParam.type = 'input';

      await action.refreshParams('user-id');

      expect(mockGithubService.listRepositories).not.toHaveBeenCalled();

      repoParam.type = originalType;
    }
  });

  it('should handle missing params gracefully', async () => {
    action.params = [];
    await expect(action.refreshParams('user-id')).resolves.not.toThrow();
  });
});
