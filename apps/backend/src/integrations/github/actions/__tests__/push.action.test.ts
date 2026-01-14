import type { GithubService } from '@/modules/github';
import { GithubPushAction } from '../push.action';

describe('GithubPushAction', () => {
  let action: GithubPushAction;
  let mockGithubService: GithubService;

  beforeEach(() => {
    mockGithubService = {
      listRepositories: jest.fn().mockResolvedValue([{ label: 'repo', value: '123' }]),
    } as unknown as GithubService;

    action = new GithubPushAction(mockGithubService);
  });

  it('should be initialized correctly', () => {
    expect(action.name).toBe('push');
    expect(action.params.length).toBeGreaterThan(0);
  });

  it('should refresh params with repositories', async () => {
    const repoParam = action.params.find((p) => p.key === 'repository');
    expect(repoParam).toBeDefined();

    await action.refreshParams('user-id');

    expect(mockGithubService.listRepositories).toHaveBeenCalledWith('user-id');
  });

  it('should handle missing params gracefully', async () => {
    action.params = [];
    await expect(action.refreshParams('user-id')).resolves.not.toThrow();
  });
});
