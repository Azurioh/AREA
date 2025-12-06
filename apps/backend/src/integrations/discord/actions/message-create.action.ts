import { Action } from '@/integrations/_definitions/action.interface';

export class DiscordMessageCreateAction extends Action {
  constructor() {
    super(
      'message_create',
      'Action triggered when a message is send in a discord channel',
      [
        {
          type: 'select',
          key: 'channel',
          label: 'Channel',
          placeholder: 'Select a channel',
          options: [],
        },
      ],
      [
        {
          key: 'content',
          description: 'The content of the message who triggered the action',
          type: 'string',
          path: 'repository.name',
        },
        {
          key: 'author',
          description: 'The author of the message',
          type: 'string',
          path: 'sender.login',
        },
      ],
    );
  }

  override async refreshParams(_userId: string): Promise<void> {
    return Promise.resolve();
  }
}
