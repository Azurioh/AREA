import { decryptString } from '@/utils/crypt';
import type { SpotifyService } from '../spotify';
import type { ThirdPartiesService } from '../third-parties';
import type { PollingRepository } from './polling.repository';
import { environment } from '@/utils/environment';
import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { Polling, SpotifyCurrentlyPlayingTrack } from '@/types/polling';
import type { SpotifyWebhookPayload } from '@/types/webhook';

/**
 * @class SpotifyPollingService
 * @description The spotify polling service.
 */
export class SpotifyPollingService {
  private readonly repository: PollingRepository;
  private readonly thirdPartiesService: ThirdPartiesService;
  private readonly spotifyService: SpotifyService;

  constructor(repository: PollingRepository, thirdPartiesService: ThirdPartiesService, spotifyService: SpotifyService) {
    this.repository = repository;
    this.thirdPartiesService = thirdPartiesService;
    this.spotifyService = spotifyService;
  }

  /**
   * @function pollCurrentlyPlayingTrack
   * @description Poll the currently playing track.
   *
   * @returns {Promise<void>} Nothing
   */
  async pollCurrentlyPlayingTrack(): Promise<void> {
    const usersToPoll = await this.repository.getUsersToPoll('spotify', ['listening_to_artist']);

    for (const user of usersToPoll) {
      const userSpotifyAccount = await this.thirdPartiesService.getThirdPartyAccountByUserId('spotify', user.userId);

      const tryToGetCurrentlyPlayingTrack = async (accessToken: string) => {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        return response;
      };

      let response = await tryToGetCurrentlyPlayingTrack(
        decryptString(userSpotifyAccount.accessToken, environment.CRYPT_SECRET_KEY),
      );

      if (response.status === HttpStatusCode.UNAUTHORIZED) {
        const accessToken = await this.spotifyService.refreshTokens(
          userSpotifyAccount.userId,
          decryptString(userSpotifyAccount.refreshToken || '', environment.CRYPT_SECRET_KEY),
        );

        response = await tryToGetCurrentlyPlayingTrack(accessToken);
      }

      if (!response.ok || response.status === HttpStatusCode.NO_CONTENT) {
        continue;
      }
      const formattedResponse = await response.json();

      if (
        user.trigger.lastTrackId &&
        user.trigger.lastTrackId === (formattedResponse as SpotifyCurrentlyPlayingTrack).item.id
      ) {
        continue;
      }

      const data: Partial<Omit<Polling, 'service' | 'userId' | 'type'>> = {
        trigger: {
          artistId: user.trigger.artistId,
          lastTrackId: (formattedResponse as SpotifyCurrentlyPlayingTrack).item.id,
        },
      };
      await this.repository.updateUserToPoll('spotify', user.userId, 'listening_to_artist', data);

      if (user.type === 'listening_to_artist') {
        const artist = (formattedResponse as SpotifyCurrentlyPlayingTrack).item.artists.find(
          (artist) => artist.id === user.trigger.artistId,
        );

        if (artist) {
          const payload = {
            artist: {
              name: artist.name,
              id: artist.id,
            },
          };

          await this.sendWebhook(user.userId, 'listening_to_artist', payload);
        }
      }
    }
  }

  /**
   * @function sendWebhook
   * @description Send the webhook to the API.
   *
   * @param {string} userId - The id of the user.
   * @param {string} event - The event name.
   * @param {SpotifyWebhookPayload} payload - The payload to send.
   * @returns {Promise<void>} Nothing
   */
  private async sendWebhook(userId: string, event: string, payload: SpotifyWebhookPayload): Promise<void> {
    await fetch(`${environment.BASE_API_URL}/webhook/v1/spotify`, {
      method: 'POST',
      headers: {
        'x-spotify-event': event,
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify(payload),
    });
  }
}
