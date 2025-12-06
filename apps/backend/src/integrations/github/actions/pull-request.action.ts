import { Action } from '@/integrations/_definitions/action.interface';

export class GithubPullRequestAction extends Action {
  constructor() {
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
          path: 'repository.full_name',
        },
        {
          key: 'author',
          description: 'The author of the pull request',
          type: 'string',
          path: 'pull_request.user.login',
        },
        {
          key: 'url',
          description: 'The URL of the push',
          type: 'string',
          path: 'pull_request.html_url',
        },
      ],
    );
  }

  override async refreshParams(_userId: string): Promise<void> {
    return Promise.resolve();
  }
}
