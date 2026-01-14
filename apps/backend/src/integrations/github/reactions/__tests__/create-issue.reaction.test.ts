import type { GithubService } from '@/modules/github';
import { GithubCreateIssueReaction } from '../create-issue.reaction';

describe('GithubCreateIssueReaction', () => {
  let reaction: GithubCreateIssueReaction;
  let mockGithubService: GithubService;

  beforeEach(() => {
    mockGithubService = {
      listRepositories: jest.fn().mockResolvedValue([{ label: 'repo', value: '123' }]),
    } as unknown as GithubService;

    reaction = new GithubCreateIssueReaction(mockGithubService);
  });

  it('should be initialized correctly', () => {
    expect(reaction.name).toBe('create_issue');
    expect(reaction.params.length).toBeGreaterThan(0);
  });

  it('should refresh params with repositories', async () => {
    await reaction.refreshParams('user-id');
    expect(mockGithubService.listRepositories).toHaveBeenCalledWith('user-id');
  });
  it('should not refresh params if param type is not select', async () => {
    const repoParam = reaction.params.find((p) => p.key === 'repository');
    if (repoParam) {
      const originalType = repoParam.type;
      repoParam.type = 'input';

      await reaction.refreshParams('user-id');

      expect(mockGithubService.listRepositories).not.toHaveBeenCalled();

      repoParam.type = originalType;
    }
  });

  it('should handle missing params gracefully', async () => {
    reaction.params = [];
    await expect(reaction.refreshParams('user-id')).resolves.not.toThrow();
  });
});
