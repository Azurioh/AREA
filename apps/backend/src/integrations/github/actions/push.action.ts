import { Action } from '@/integrations/_definitions/action.interface';

export class GithubPushAction extends Action {
  constructor() {
    super(
      'push',
      'Action triggered when a push is made on a repository',
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
          description: 'The author of the push',
          type: 'string',
          path: 'pusher.name',
        },
        {
          key: 'url',
          description: 'The URL of the push',
          type: 'string',
          path: 'repository.html_url',
        },
      ],
    );
  }

  override async refreshParams(_userId: string): Promise<void> {
    return Promise.resolve();
  }
}
