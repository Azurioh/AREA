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
          path: 'content',
        },
        {
          key: 'author',
          description: 'The author of the message',
          type: 'string',
          path: 'author.globalName',
        },
      ],
    );
    this.discordService = discordService;
  }

  override async refreshParams(userId: string): Promise<void> {
    const channelParam = this.params[0];

    if (channelParam?.type === 'select') {
      channelParam.options = await this.discordService.listChannels(userId);
    }
    return Promise.resolve();
  }
}
