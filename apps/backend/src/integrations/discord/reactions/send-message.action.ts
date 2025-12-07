import { Reaction } from '@/integrations/_definitions/reaction.interface';
import type { DiscordService } from '@/modules/discord';

export class DiscordSendMessageReaction extends Reaction {
  private discordService: DiscordService;

  constructor(discordService: DiscordService) {
    super('send_message', 'Send a message in a discord channel', [
      {
        type: 'select',
        key: 'channel',
        label: 'Channel',
        placeholder: 'Select a channel',
        options: [],
      },
      {
        type: 'input',
        key: 'content',
        label: 'Content',
        placeholder: 'The content of the message',
      },
    ]);
    this.discordService = discordService;
  }

  override async refreshParams(_userId: string): Promise<void> {
    this.discordService;
    return Promise.resolve();
  }
}
