import type { Polling, UnsplashDailyRandomImage } from '@/types/polling';
import type { PollingRepository } from './polling.repository';
import { environment } from '@/utils/environment';
import type { UnsplashWebhookPayload } from '@/types/webhook';

/**
 * @class UnsplashPollingService
 * @description The unsplash polling service.
 */
export class UnsplashPollingService {
  private readonly repository: PollingRepository;

  constructor(repository: PollingRepository) {
    this.repository = repository;
  }

  /**
   * @function pollDailyRandomImage
   * @description Poll the daily random image.
   *
   * @returns {Promise<void>} Nothing
   */
  async pollDailyRandomImage(): Promise<void> {
    const usersToPoll = await this.repository.getUsersToPoll('unsplash', ['daily_random_image']);

    if (usersToPoll.length === 0) {
      return;
    }
    const date = new Date().toISOString().split('T')[0];

    for (const user of usersToPoll) {
      if (user.trigger.lastPoll && user.trigger.lastPoll === date) {
        continue;
      }
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${user.trigger.topic}&client_id=${environment.UNSPLASH_CLIENT_ID}`,
      );
      const formattedResponse = (await response.json()) as UnsplashDailyRandomImage;
      const data: Partial<Omit<Polling, 'service' | 'userId' | 'type'>> = {
        trigger: {
          topic: user.trigger.topic,
          lastPoll: date,
        },
      };
      await this.repository.updateUserToPoll('unsplash', user.userId, 'daily_random_image', data);

      const payload = {
        image: {
          url: formattedResponse.urls.regular,
          topic: user.trigger.topic,
          likes: formattedResponse.likes,
        },
        user: {
          username: formattedResponse.user.username,
          bio: formattedResponse.user.bio,
        },
      };

      await this.sendWebhook(user.userId, 'daily_random_image', payload);
    }
  }

  /**
   * @function sendWebhook
   * @description Send the webhook to the API.
   *
   * @param {string} userId - The id of the user.
   * @param {string} event - The event name.
   * @param {UnsplashWebhookPayload} payload - The payload to send.
   * @returns {Promise<void>} Nothing
   */
  private async sendWebhook(userId: string, event: string, payload: UnsplashWebhookPayload): Promise<void> {
    await fetch(`${environment.BASE_API_URL}/webhook/v1/unsplash`, {
      method: 'POST',
      headers: {
        'x-unsplash-event': event,
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify(payload),
    });
  }
}
