import { environment } from '@/utils/environment';
import { Client, Events, GatewayIntentBits, type Message, type OmitPartialGroupDMChannel } from 'discord.js';

export const setupDiscordBot = () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessagePolls,
    ],
  });

  client.on(Events.MessageCreate, async (message: OmitPartialGroupDMChannel<Message<boolean>>) => {
    if (message.author.id === environment.DISCORD_CLIENT_ID) {
      return;
    }
    await fetch(`${environment.BASE_API_URL}/webhook/v1/discord`, {
      method: 'POST',
      headers: {
        'x-discord-event': 'message_create',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  });

  client.login(environment.DISCORD_BOT_TOKEN);
};
