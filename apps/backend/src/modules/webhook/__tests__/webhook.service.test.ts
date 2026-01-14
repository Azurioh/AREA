import type { ActionsReactionsService } from '@/modules/actions-reactions';
import type { ActionPayload } from '@/types/action-reaction';
import { WebhookService } from '../webhook.service';

describe('WebhookService', () => {
  let webhookService: WebhookService;
  let mockActionsReactionsService: ActionsReactionsService;

  beforeEach(() => {
    mockActionsReactionsService = {
      handleReactions: jest.fn(),
      handleActionReception: jest.fn(),
    } as unknown as ActionsReactionsService;

    webhookService = new WebhookService(mockActionsReactionsService);
  });

  describe('githubCallback', () => {
    it('should call handleReactions with correct payload', async () => {
      const event = 'push';
      const body: any = {
        repository: {
          id: 12345,
        },
        otherData: 'data',
      };

      await webhookService.githubCallback(event, body);

      const expectedAction: ActionPayload = {
        service: 'github',
        name: event,
        trigger: `${event}/${body.repository.id}`,
        content: body,
      };

      expect(mockActionsReactionsService.handleActionReception).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('discordCallback', () => {
    it('should call handleReactions with correct payload', async () => {
      const event = 'message';
      const body: any = {
        channelId: 'channel-123',
        content: 'hello',
      };

      await webhookService.discordCallback(event, body);

      const expectedAction: ActionPayload = {
        service: 'discord',
        name: event,
        trigger: `${event}/${body.channelId}`,
        content: body,
      };

      expect(mockActionsReactionsService.handleActionReception).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('spotifyCallback', () => {
    it('should call handleReactions with correct payload', async () => {
      const event = 'track_played';
      const body: any = {
        ids: 'track-123',
        track: 'song',
      };

      await webhookService.spotifyCallback(event, body);

      const expectedAction: ActionPayload = {
        service: 'spotify',
        name: event,
        trigger: `${event}/${body.ids}`,
        content: body,
      };

      expect(mockActionsReactionsService.handleActionReception).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('dropboxCallback', () => {
    it('should call handleActionReception with correct payload', async () => {
      const body: any = {
        list_folder: {
          accounts: ['acc1', 'acc2'],
        },
      };

      await webhookService.dropboxCallback(body);

      expect(mockActionsReactionsService.handleActionReception).toHaveBeenCalledWith(
        expect.objectContaining({
          service: 'dropbox',
          content: { ids: ['acc1', 'acc2'] },
        }),
      );
    });
  });

  describe('unsplashCallback', () => {
    it('should call handleReactions with correct payload', async () => {
      const userId = 'user123';
      const event = 'daily_random_image';
      const body: any = {
        image: {
          topic: 'nature',
        },
      };

      await webhookService.unsplashCallback(userId, event, body);

      expect(mockActionsReactionsService.handleReactions).toHaveBeenCalledWith(
        expect.objectContaining({
          service: 'unsplash',
          name: event,
          trigger: `daily_random_image/nature/user123`,
          content: body,
        }),
      );
    });
  });

  describe('twitchCallback', () => {
    it('should handle channel.follow event', async () => {
      const event = 'channel.follow';
      const body: any = {
        subscription: {
          condition: {
            broadcaster_user_id: '123',
          },
        },
      };

      await webhookService.twitchCallback(event, body);

      expect(mockActionsReactionsService.handleActionReception).toHaveBeenCalledWith(
        expect.objectContaining({
          service: 'twitch',
          name: 'new_follower',
          trigger: 'new_follower/123',
          content: body,
        }),
      );
    });

    it('should handle stream.online event', async () => {
      const event = 'stream.online';
      const body: any = {
        subscription: {
          condition: {
            broadcaster_user_id: '456',
          },
        },
      };

      await webhookService.twitchCallback(event, body);

      expect(mockActionsReactionsService.handleActionReception).toHaveBeenCalledWith(
        expect.objectContaining({
          service: 'twitch',
          name: 'stream_online',
          trigger: 'stream_online/456',
          content: body,
        }),
      );
    });
  });
});
