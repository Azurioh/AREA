import type { GithubService } from '@/modules/github';
import { GithubWatchAction } from '../watch.action';

describe('GithubWatchAction', () => {
  let action: GithubWatchAction;
  let mockGithubService: GithubService;

  beforeEach(() => {
    mockGithubService = {
      listRepositories: jest.fn().mockResolvedValue([{ label: 'repo', value: '123' }]),
    } as unknown as GithubService;

    action = new GithubWatchAction(mockGithubService);
  });

  it('should be initialized correctly', () => {
    expect(action.name).toBe('watch');
    expect(action.params.length).toBeGreaterThan(0);
  });

  it('should refresh params with repositories', async () => {
    await action.refreshParams('user-id');
    expect(mockGithubService.listRepositories).toHaveBeenCalledWith('user-id');
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
