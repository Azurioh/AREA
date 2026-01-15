import { Client } from 'discord.js';
import { closeDiscordBot, setupDiscordBot } from '../discord-bot';

jest.mock('discord.js', () => {
  const mockClient = {
    on: jest.fn(),
    login: jest.fn().mockResolvedValue('token'),
    destroy: jest.fn().mockResolvedValue(true),
  };
  return {
    Client: jest.fn(() => mockClient),
    Events: { MessageCreate: 'messageCreate' },
    GatewayIntentBits: { Guilds: 1 },
  };
});

jest.mock('@/utils/environment', () => ({
  environment: {
    DISCORD_CLIENT_ID: 'client-id',
    DISCORD_BOT_TOKEN: 'bot-token',
    BASE_API_URL: 'http://localhost:3000',
  },
}));

// Mock global fetch
global.fetch = jest.fn() as any;

describe('Discord Bot config', () => {
  let mockClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    const { Client } = require('discord.js');
    mockClient = new Client();
  });

  describe('setupDiscordBot', () => {
    it('should initialize client and login', async () => {
      await setupDiscordBot();
      expect(Client).toHaveBeenCalled();
      expect(mockClient.login).toHaveBeenCalledWith('bot-token');
    });

    it('should register messageCreate handler', async () => {
      await setupDiscordBot();
      expect(mockClient.on).toHaveBeenCalledWith('messageCreate', expect.any(Function));
    });

    it('should handle message event correctly', async () => {
      await setupDiscordBot();
      const messageHandler = mockClient.on.mock.calls.find((call: any[]) => call[0] === 'messageCreate')[1];

      await messageHandler({ author: { id: 'client-id' } });
      expect(fetch).not.toHaveBeenCalled();

      const mockMessage = {
        author: { id: 'other-id', globalName: 'User' },
        channelId: '123',
        content: 'Hello',
      };
      await messageHandler(mockMessage);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/webhook/v1/discord',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            channelId: '123',
            content: 'Hello',
            author: { globalName: 'User' },
          }),
        }),
      );
    });
  });

  describe('closeDiscordBot', () => {
    it('should destroy client if initialized', async () => {
      await setupDiscordBot();
      await closeDiscordBot();
      expect(mockClient.destroy).toHaveBeenCalled();
    });

    it('should do nothing if not initialized', async () => {
      (mockClient.destroy as jest.Mock).mockClear();
      await closeDiscordBot();
      expect(mockClient.destroy).not.toHaveBeenCalled();
    });
  });
});
