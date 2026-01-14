import { Client, Events, GatewayIntentBits, type Message, type OmitPartialGroupDMChannel } from 'discord.js';
import { environment } from '@/utils/environment';

export let discordClient: Client | null = null;

export const setupDiscordBot = async () => {
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

    const payload = {
      channelId: message.channelId,
      content: message.content,
      author: {
        globalName: message.author.globalName,
      },
    };

    await fetch(`${environment.BASE_API_URL}/webhook/v1/discord`, {
      method: 'POST',
      headers: {
        'x-discord-event': 'message_create',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  });

  await client.login(environment.DISCORD_BOT_TOKEN);
  discordClient = client;
};

export const closeDiscordBot = async () => {
  if (discordClient) {
    await discordClient.destroy();
    discordClient = null;
  }
};
