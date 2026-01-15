import type { TwitchService } from '@/modules/twitch/twitch.service';
import { TwitchNewFollowerAction } from '../new-follower.action';

describe('TwitchNewFollowerAction', () => {
  let action: TwitchNewFollowerAction;
  let mockTwitchService: jest.Mocked<TwitchService>;

  beforeEach(() => {
    mockTwitchService = {} as jest.Mocked<TwitchService>;
    action = new TwitchNewFollowerAction(mockTwitchService);
  });

  describe('refreshParams', () => {
    it('should resolve successfully', async () => {
      await expect(action.refreshParams('user-id')).resolves.toBeUndefined();
    });
  });
});
