import type { FastifyInstance } from 'fastify';
import { PollingRepository } from '@/modules/polling/polling.repository';
import { PollingService } from '@/modules/polling/polling.service';
import { SpotifyPollingService } from '@/modules/polling/spotify-polling.service';
import { UnsplashPollingService } from '@/modules/polling/unsplash-polling.service';
import { SpotifyService } from '@/modules/spotify';
import { ThirdPartiesRepository, ThirdPartiesService } from '@/modules/third-parties';
import { UsersRepository, UsersService } from '@/modules/users';
import { NasaPollingService } from '@/modules/polling/nasa-polling.service';

export const setupPolling = async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const pollingRepository = new PollingRepository(app.mongo.db);
  const thirdPartiesRepository = new ThirdPartiesRepository(app.mongo.db);
  const usersRepository = new UsersRepository(app.mongo.db);
  await usersRepository.createIndex();

  const usersService = new UsersService(usersRepository);
  const thirdPartiesService = new ThirdPartiesService(thirdPartiesRepository, usersService);
  const pollingService = new PollingService(pollingRepository);

  const spotifyService = new SpotifyService(thirdPartiesService, pollingService);
  const spotifyPolling = new SpotifyPollingService(pollingRepository, thirdPartiesService, spotifyService);
  const unsplashPolling = new UnsplashPollingService(pollingRepository);
  const nasaPolling = new NasaPollingService(pollingRepository);

  if (process.env.NODE_ENV !== 'test') {
    const spotifyIntervalId = setInterval(async () => {
      try {
        await spotifyPolling.pollCurrentlyPlayingTrack();
      } catch (error) {
        console.error('Error polling Spotify:', error);
      }
    }, 40000);

    const unsplashIntervalId = setInterval(
      async () => {
        try {
          await unsplashPolling.pollDailyRandomImage();
        } catch (error) {
          console.error('Error polling Unsplash:', error);
        }
      },
      60 * 60 * 1000,
    );

    const nasaIntervalId = setInterval(async () => {
      try {
        await nasaPolling.pollNewAstronomyPictureOfTheDay();
      } catch (error) {
        console.error('Error polling NASA:', error);
      }
    }, 30);

    app.addHook('onClose', (_instance, done) => {
      clearInterval(spotifyIntervalId);
      clearInterval(unsplashIntervalId);
      clearInterval(nasaIntervalId);
      done();
    });
  }
};
