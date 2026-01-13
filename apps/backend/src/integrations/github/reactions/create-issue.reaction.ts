import { Reaction } from '@/integrations/_definitions/reaction.interface';
import type { GithubService } from '@/modules/github';

/**
 * @class GithubCreateIssueReaction
 * @description The reaction to create an issue on GitHub
 */
export class GithubCreateIssueReaction extends Reaction {
  private githubService: GithubService;

  constructor(githubService: GithubService) {
    super('create_issue', 'Create an issue on GitHub', [
      {
        type: 'select',
        key: 'repository',
        label: 'Repository',
        placeholder: 'Select a repository',
        options: [],
      },
      {
        type: 'input',
        key: 'title',
        label: 'Title',
        placeholder: 'Enter the title of the issue',
      },
      {
        type: 'input',
        key: 'body',
        label: 'Body',
        placeholder: 'Enter the body of the issue',
      },
    ]);
    this.githubService = githubService;
  }

  /**
   * @function refreshParams
   * @description Refresh the parameters of the reaction
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
