import { PollingRepository } from '@/modules/polling/polling.repository';
import { PollingService } from '@/modules/polling/polling.service';
import { SpotifyPollingService } from '@/modules/polling/spotify-polling.service';
import { SpotifyService } from '@/modules/spotify';
import { ThirdPartiesRepository, ThirdPartiesService } from '@/modules/third-parties';
import { UsersRepository, UsersService } from '@/modules/users';
import type { FastifyInstance } from 'fastify';

export const setupPolling = async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const pollingRepository = new PollingRepository(app.mongo.db);
  const thirdPartiesRepository = new ThirdPartiesRepository(app.mongo.db);
  const usersRepository = new UsersRepository(app.mongo.db);

  const usersService = new UsersService(usersRepository);
  const thirdPartiesService = new ThirdPartiesService(thirdPartiesRepository, usersService);
  const pollingService = new PollingService(pollingRepository);

  const spotifyService = new SpotifyService(thirdPartiesService, pollingService);
  const spotifyPolling = new SpotifyPollingService(pollingRepository, thirdPartiesService, spotifyService);

  setInterval(async () => {
    await spotifyPolling.pollCurrentlyPlayingTrack();
  }, 30000);
};
