import type { TwitchService } from '@/modules/twitch/twitch.service';
import type { TwitchStreamer } from '@/types/twitch';
import { TwitchStreamOnlineAction } from '../stream-online.actions';

describe('TwitchStreamOnlineAction', () => {
  let action: TwitchStreamOnlineAction;
  let mockTwitchService: jest.Mocked<TwitchService>;

  beforeEach(() => {
    mockTwitchService = {
      listFollowedChannels: jest.fn(),
    } as unknown as jest.Mocked<TwitchService>;
    action = new TwitchStreamOnlineAction(mockTwitchService);
  });

  describe('refreshParams', () => {
    it('should update streamer options with followed channels', async () => {
      const mockStreamers: TwitchStreamer[] = [
        { id: '1', name: 'Streamer 1' },
        { id: '2', name: 'Streamer 2' },
      ];
      mockTwitchService.listFollowedChannels.mockResolvedValue(mockStreamers);

      await action.refreshParams('user-id');

      const streamerParam = action.params.find((p) => p.key === 'streamer');
      expect(streamerParam).toBeDefined();
      if (streamerParam?.type === 'select') {
        expect(streamerParam.options).toEqual([
          { name: 'Streamer 1', id: '1' },
          { name: 'Streamer 2', id: '2' },
        ]);
      }
      expect(mockTwitchService.listFollowedChannels).toHaveBeenCalledWith('user-id');
    });

    it('should handle empty streamer list', async () => {
      mockTwitchService.listFollowedChannels.mockResolvedValue([]);

      await action.refreshParams('user-id');

      const streamerParam = action.params.find((p) => p.key === 'streamer');
      expect(streamerParam).toBeDefined();
      if (streamerParam?.type === 'select') {
        expect(streamerParam.options).toEqual([]);
      }
    });

    it('should not update options if param type is not select', async () => {
      const streamerParam = action.params.find((p) => p.key === 'streamer');
      if (streamerParam) {
        streamerParam.type = 'string';
      }

      await action.refreshParams('user-id');

      expect(mockTwitchService.listFollowedChannels).not.toHaveBeenCalled();
    });
  });
});
