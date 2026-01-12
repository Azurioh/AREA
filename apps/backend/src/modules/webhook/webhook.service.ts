import type {
  DiscordWebhookPayload,
  GithubWebhookPayload,
  SpotifyWebhookPayload,
  UnsplashWebhookPayload,
  DropboxWebhookPayload,
} from '@/types/webhook';
import type { ActionPayload } from '@/types/action-reaction';
import type { ActionsReactionsService } from '@/modules/actions-reactions';

/**
 * @class WebhookService
 * @description Service for managing webhooks.
 */
export class WebhookService {
  private actionsReactionsService: ActionsReactionsService;

  constructor(actionsReactionsService: ActionsReactionsService) {
    this.actionsReactionsService = actionsReactionsService;
  }

  /**
   * @function githubCallback
   * @description Handle the github callback.
   *
   * @param {string} event The event who triggered the callback.
   * @param {GithubWebhookPayload} body The body of the callback.
   * @returns {Promise<void>}
   */
  async githubCallback(event: string, body: GithubWebhookPayload): Promise<void> {
    const action: ActionPayload = {
      service: 'github',
      name: event,
      trigger: `${event}/${body.repository.id}`,
      content: body,
    };

    this.actionsReactionsService.handleActionReception(action);
  }

  /**
   * @function discordCallback
   * @description Handle the discord callback.
   *
   * @param {string} event The event who triggered the callback.
   * @param {DiscordWebhookPayload} body The body of the callback.
   * @returns {Promise<void>}
   */
  async discordCallback(event: string, body: DiscordWebhookPayload): Promise<void> {
    const action: ActionPayload = {
      service: 'discord',
      name: event,
      trigger: `${event}/${body.channelId}`,
      content: body,
    };

    this.actionsReactionsService.handleActionReception(action);
  }

  /**
   * @function spotifyCallback
   * @description Handle the spotify callback.
   *
   * @param {string} event The event who triggered the callback.
   * @param {DiscordWebhookPayload} body The body of the callback.
   * @returns {Promise<void>}
   */
  async spotifyCallback(event: string, body: SpotifyWebhookPayload): Promise<void> {
    const action: ActionPayload = {
      service: 'spotify',
      name: event,
      trigger: `${event}/${body.ids}`,
      content: body,
    };

    this.actionsReactionsService.handleActionReception(action);
  }

  /**
   * @function dropboxCallback
   * @description Handle the dropbox callback.
   *
   * @param {string} event The event who triggered the callback.
   * @param {DiscordWebhookPayload} body The body of the callback.
   * @returns {Promise<void>}
   */
  async dropboxCallback(body: DropboxWebhookPayload): Promise<void> {
    const action: ActionPayload = {
      service: 'dropbox',
      name: '',
      trigger: '',
      content: {
        ids: body.list_folder.accounts,
      },
    };

    this.actionsReactionsService.handleActionReception(action);
  }

  /**
   * @function unsplashCallback
   * @description Handle the unsplash callback.
   *
   * @param {string} userId The id of the user.
   * @param {string} event The event who triggered the callback.
   * @param {UnsplashWebhookPayload} body The body of the callback.
   * @returns {Promise<void>}
   */
  async unsplashCallback(userId: string, event: string, body: UnsplashWebhookPayload): Promise<void> {
    const action: ActionPayload = {
      service: 'unsplash',
      name: event,
      trigger: `${event}/${body.image.topic}/${userId}`,
      content: body,
    };

    console.log('Unsplash webhook action:', action);
    this.actionsReactionsService.handleReactions(action);
  }
}
