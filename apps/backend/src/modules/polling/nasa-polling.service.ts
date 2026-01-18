import type { NasaNewAstronomyPictureOfTheDay, Polling } from '@/types/polling';
import type { PollingRepository } from './polling.repository';
import { environment } from '@/utils/environment';
import type { NasaWebhookPayload } from '@/types/webhook';

/**
 * @class NasaPollingService
 * @description The nasa polling service.
 */
export class NasaPollingService {
  private readonly repository: PollingRepository;

  constructor(repository: PollingRepository) {
    this.repository = repository;
  }

  /**
   * @function pollNewAstronomyPictureOfTheDay
   * @description Poll the new astronomy picture of the day.
   *
   * @returns {Promise<void>} Nothing
   */
  async pollNewAstronomyPictureOfTheDay(): Promise<void> {
    const usersToPoll = await this.repository.getUsersToPoll('nasa', ['new_astronomy_picture_of_the_day']);

    usersToPoll;
    if (usersToPoll.length === 0) {
      return;
    }
    const date = new Date().toISOString().split('T')[0];

    for (const user of usersToPoll) {
      if (user.trigger.lastPoll && user.trigger.lastPoll === date) {
        continue;
      }
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${environment.NASA_API_KEY}`);

      const formattedResponse = (await response.json()) as NasaNewAstronomyPictureOfTheDay;
      const data: Partial<Omit<Polling, 'service' | 'userId' | 'type'>> = {
        trigger: {
          lastPoll: date,
        },
      };

      await this.repository.updateUserToPoll('nasa', user.userId, 'new_astronomy_picture_of_the_day', data);

      const payload = {
        image: {
          title: formattedResponse.title,
          explanation: formattedResponse.explanation,
          url: formattedResponse.url,
        },
      };

      await this.sendWebhook(user.userId, 'new_astronomy_picture_of_the_day', payload);
    }
  }

  /**
   * @function sendWebhook
   * @description Send the webhook to the API.
   *
   * @param {string} userId - The id of the user.
   * @param {string} event - The event name.
   * @param {NasaWebhookPayload} payload - The payload to send.
   * @returns {Promise<void>} Nothing
   */
  private async sendWebhook(userId: string, event: string, payload: NasaWebhookPayload): Promise<void> {
    await fetch(`${environment.BASE_API_URL}/webhook/v1/nasa`, {
      method: 'POST',
      headers: {
        'x-nasa-event': event,
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify(payload),
    });
  }
}
