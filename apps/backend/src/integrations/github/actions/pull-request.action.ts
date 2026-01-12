import { Action } from '@/integrations/_definitions/action.interface';
import type { GithubService } from '@/modules/github';

export class GithubPullRequestAction extends Action {
  private githubService: GithubService;

  constructor(githubService: GithubService) {
    super(
      'pull_request',
      'Action triggered when a pull request is made on a repository',
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
          description: 'The author of the pull request',
          type: 'string',
          path: 'sender.login',
        },
        {
          key: 'url',
          description: 'The URL of the push',
          type: 'string',
          path: 'pull_request.html_url',
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
