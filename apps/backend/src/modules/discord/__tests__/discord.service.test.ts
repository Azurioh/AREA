import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { ThirdPartiesService } from '@/modules/third-parties';
import ApiError from '@/utils/api-error';
import { DiscordService } from '../discord.service';

// Mock dependencies
jest.mock('@/utils/environment', () => ({
  environment: {
    DISCORD_BOT_TOKEN: 'test_bot_token',
    DISCORD_CLIENT_ID: 'test_client_id',
    DISCORD_CLIENT_SECRET: 'test_client_secret',
  },
}));

jest.mock('@/integrations', () => ({
  Reaction: {
    parseActionVariables: jest.fn((_action, variables) => variables),
  },
}));

describe('DiscordService', () => {
  let discordService: DiscordService;
  let mockThirdPartiesService: jest.Mocked<ThirdPartiesService>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock ThirdPartiesService
    mockThirdPartiesService = {
      getThirdPartyAccountByUserId: jest.fn(),
    } as any;

    // Mock global fetch
    global.fetch = jest.fn();

    discordService = new DiscordService(mockThirdPartiesService);
  });

  describe('createAction', () => {
    it('should return correct trigger string', async () => {
      const userId = 'user123';
      const action: any = {
        name: 'test_action',
        params: {
          channel: { id: 'channel123' },
        },
      };

      const actionReactionId = 'action-reaction-123';
      const result = await discordService.createAction(actionReactionId, userId, action);
      expect(result).toBe('test_action/channel123');
    });
  });

  describe('createReaction', () => {
    it('should call sendMessage and return true when reaction is send_message', async () => {
      const userId = 'user123';
      const reaction: any = {
        name: 'send_message',
        params: {
          channel: { id: 'channel123' },
          content: 'Hello World',
        },
      };
      const actionPayload: any = {};

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      const result = await discordService.createReaction(userId, reaction, actionPayload);

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://discord.com/api/channels/channel123/messages',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bot test_bot_token',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ content: 'Hello World' }),
        }),
      );
    });

    it('should return false for unknown reaction', async () => {
      const userId = 'user123';
      const reaction: any = {
        name: 'unknown_reaction',
      };
      const actionPayload: any = {};

      const result = await discordService.createReaction(userId, reaction, actionPayload);

      expect(result).toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return false if sendMessage fails', async () => {
      const userId = 'user123';
      const reaction: any = {
        name: 'send_message',
        params: {
          channel: { id: 'channel123' },
          content: 'Hello World',
        },
      };
      const actionPayload: any = {};

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      const result = await discordService.createReaction(userId, reaction, actionPayload);

      expect(result).toBe(false);
    });
  });

  describe('refreshDiscordTokens', () => {
    it('should successfully refresh tokens', async () => {
      const refreshToken = 'valid_refresh_token';
      const mockResponse = {
        access_token: 'new_access_token',
        refresh_token: 'new_refresh_token',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.OK,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await discordService.refreshDiscordTokens(refreshToken);

      expect(result).toEqual({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://discord.com/api/oauth2/token',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(URLSearchParams),
        }),
      );
    });

    it('should throw ApiError if refresh fails', async () => {
      const refreshToken = 'invalid_refresh_token';

      (global.fetch as jest.Mock).mockResolvedValue({
        status: HttpStatusCode.BAD_REQUEST,
      });

      await expect(discordService.refreshDiscordTokens(refreshToken)).rejects.toThrow(ApiError);
    });
  });

  describe('listChannels', () => {
    it('should successfully list channels', async () => {
      const userId = 'user123';
      const mockAccount = { guildId: 'guild123' };
      const mockChannels = [
        { id: '1', name: 'general', type: 0 },
        { id: '2', name: 'voice', type: 2 }, // Should be filtered out
        { id: '3', name: 'random', type: 0 },
      ];

      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockAccount as any);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockChannels),
      });

      const result = await discordService.listChannels(userId);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: '1', name: 'general' },
        { id: '3', name: 'random' },
      ]);
      expect(mockThirdPartiesService.getThirdPartyAccountByUserId).toHaveBeenCalledWith('discord', userId);
      expect(global.fetch).toHaveBeenCalledWith('https://discord.com/api/guilds/guild123/channels', expect.any(Object));
    });

    it('should throw ApiError if fetch fails', async () => {
      const userId = 'user123';
      const mockAccount = { guildId: 'guild123' };

      mockThirdPartiesService.getThirdPartyAccountByUserId.mockResolvedValue(mockAccount as any);
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(discordService.listChannels(userId)).rejects.toThrow(ApiError);
    });
  });
});
