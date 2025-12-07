import { Action } from '@/integrations/_definitions/action.interface';
import type { DiscordService } from '@/modules/discord';

export class DiscordMessageCreateAction extends Action {
  private discordService: DiscordService;

  constructor(discordService: DiscordService) {
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
    this.discordService = discordService;
  }

  override async refreshParams(_userId: string): Promise<void> {
    this.discordService;
    return Promise.resolve();
  }
}
