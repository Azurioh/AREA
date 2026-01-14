import type { GithubService } from '@/modules/github';
import { createGithubService } from '../index';

describe('createGithubService', () => {
  let mockGithubService: GithubService;

  beforeEach(() => {
    mockGithubService = {
      listRepositories: jest.fn(),
    } as unknown as GithubService;
  });

  it('should create a service with correct name and components', () => {
    const service = createGithubService(mockGithubService);

    expect(service.name).toBe('GitHub');
    expect(service.actions.length).toBeGreaterThan(0);
    expect(service.reactions.length).toBeGreaterThan(0);
  });
});
