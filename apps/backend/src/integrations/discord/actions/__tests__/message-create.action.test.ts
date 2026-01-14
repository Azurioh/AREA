import type { DiscordService } from '@/modules/discord';
import { DiscordMessageCreateAction } from '../message-create.action';

describe('DiscordMessageCreateAction', () => {
  let action: DiscordMessageCreateAction;
  let mockDiscordService: DiscordService;

  beforeEach(() => {
    mockDiscordService = {
      listChannels: jest.fn().mockResolvedValue([{ label: 'general', value: '123' }]),
    } as unknown as DiscordService;

    action = new DiscordMessageCreateAction(mockDiscordService);
  });

  it('should be initialized correctly', () => {
    expect(action.name).toBe('message_create');
    expect(action.params.length).toBeGreaterThan(0);
  });

  it('should refresh params with channels', async () => {
    const channelParam = action.params.find((p) => p.key === 'channel');
    expect(channelParam).toBeDefined();

    await action.refreshParams('user-id');

    expect(mockDiscordService.listChannels).toHaveBeenCalledWith('user-id');
    expect((channelParam as any)?.options).toEqual([{ label: 'general', value: '123' }]);
  });

  it('should not refresh params if param type is not select', async () => {
    const channelParam = action.params.find((p) => p.key === 'channel');
    if (channelParam) {
      const originalType = channelParam.type;
      channelParam.type = 'input';

      await action.refreshParams('user-id');

      expect(mockDiscordService.listChannels).not.toHaveBeenCalled();

      channelParam.type = originalType;
    }
  });

  it('should handle missing params gracefully', async () => {
    action.params = [];
    await expect(action.refreshParams('user-id')).resolves.not.toThrow();
  });
});
