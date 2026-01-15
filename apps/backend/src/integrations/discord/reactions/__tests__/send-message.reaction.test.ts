import type { DiscordService } from '@/modules/discord';
import { DiscordSendMessageReaction } from '../send-message.action';

describe('DiscordSendMessageReaction', () => {
  let reaction: DiscordSendMessageReaction;
  let mockDiscordService: DiscordService;

  beforeEach(() => {
    mockDiscordService = {
      listChannels: jest.fn().mockResolvedValue([{ label: 'general', value: '123' }]),
    } as unknown as DiscordService;

    reaction = new DiscordSendMessageReaction(mockDiscordService);
  });

  it('should be initialized correctly', () => {
    expect(reaction.name).toBe('send_message');
    expect(reaction.params.length).toBeGreaterThan(0);
  });

  it('should refresh params with channels', async () => {
    const channelParam = reaction.params.find((p) => p.key === 'channel');
    expect(channelParam).toBeDefined();

    await reaction.refreshParams('user-id');

    expect(mockDiscordService.listChannels).toHaveBeenCalledWith('user-id');
    expect((channelParam as any)?.options).toEqual([{ label: 'general', value: '123' }]);
  });

  it('should not refresh params if param type is not select', async () => {
    const channelParam = reaction.params.find((p) => p.key === 'channel');
    if (channelParam) {
      channelParam.type = 'input';
      await reaction.refreshParams('user-id');
      expect(mockDiscordService.listChannels).not.toHaveBeenCalled();
    }
  });

  it('should handle missing params gracefully', async () => {
    reaction.params = [];
    await expect(reaction.refreshParams('user-id')).resolves.not.toThrow();
  });
});
