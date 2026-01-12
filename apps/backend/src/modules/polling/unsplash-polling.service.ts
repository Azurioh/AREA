import type { Polling, UnsplashDailyRandomImage } from '@/types/polling';
import type { PollingRepository } from './polling.repository';
import { environment } from '@/utils/environment';

/**
 * @class UnsplashPollingService
 * @description The unsplash polling service.
 */
export class UnsplashPollingService {
  private readonly repository: PollingRepository;

  constructor(repository: PollingRepository) {
    this.repository = repository;
  }

  async pollDailyRandomImage() {
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

      await fetch(`${environment.BASE_API_URL}/webhook/v1/unsplash`, {
        method: 'POST',
        headers: {
          'x-unsplash-event': 'daily_random_image',
          'x-user-id': user.userId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    }
  }
}
