import { Action } from '@/integrations/_definitions/action.interface';
import type { GithubService } from '@/modules/github';

export class GithubWatchAction extends Action {
  private githubService: GithubService;

  constructor(githubService: GithubService) {
    super(
      'watch',
      'Action triggered when a user star a repository',
      [
        {
          type: 'select',
          key: 'repository',
          label: 'Repository',
          placeholder: 'Select a repository',
          options: [],
        },
      ],
      [
        {
          key: 'repository',
          description: 'The repository that triggered the action',
          type: 'string',
          path: 'repository.name',
        },
        {
          key: 'author',
          description: 'The author of the star',
          type: 'string',
          path: 'sender.login',
        },
        {
          key: 'watchers',
          description: 'The current number of star',
          type: 'number',
          path: 'repository.watchers',
        },
      ],
    );
    this.githubService = githubService;
  }

  /**
   * @function refreshParams
   * @description Refresh the parameters of the action
   *
   * @param {string} userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  override async refreshParams(userId: string): Promise<void> {
    const repositoryParam = this.params[0];

    if (repositoryParam?.type === 'select') {
      repositoryParam.options = await this.githubService.listRepositories(userId);
    }
    return Promise.resolve();
  }
}
