import { Action } from '@/integrations/_definitions/action.interface';

export class GithubPullRequestAction extends Action {
  constructor() {
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
          key: 'watcher',
          description: 'The current number of star',
          type: 'number',
          path: 'repository.watcher',
        },
      ],
    );
  }

  override async refreshParams(_userId: string): Promise<void> {
    return Promise.resolve();
  }
}
