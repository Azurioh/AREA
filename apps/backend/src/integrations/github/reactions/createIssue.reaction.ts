import { Reaction } from '@/integrations/_definitions/reaction.interface';

/**
 * @class GithubCreateIssueReaction
 * @description The reaction to create an issue on GitHub
 */
export class GithubCreateIssueReaction extends Reaction {
  constructor() {
    super('createIssue', 'Create an issue on GitHub', [
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
  }

  /**
   * @function refreshParams
   * @description Refresh the parameters of the reaction
   *
   * @param {string} _userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  override async refreshParams(_userId: string): Promise<void> {
    return Promise.resolve();
  }
}
