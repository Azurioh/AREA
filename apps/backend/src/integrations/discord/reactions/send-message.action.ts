import { Reaction } from '@/integrations/_definitions/reaction.interface';

export class DiscordSendMessageReaction extends Reaction {
  constructor() {
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
  }

  override async refreshParams(_userId: string): Promise<void> {
    return Promise.resolve();
  }
}
