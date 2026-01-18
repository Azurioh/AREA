import type { FastifyInstance } from 'fastify';
import {
  createDiscordService,
  createDropboxService,
  createGithubService,
  createSpotifyService,
  createTwitchService,
  createUnsplashService,
  createNasaService,
  ServiceManager,
} from '@/integrations';
import { DiscordService } from '@/modules/discord';
import { GithubService } from '@/modules/github';
import { PollingRepository } from '@/modules/polling/polling.repository';
import { PollingService } from '@/modules/polling/polling.service';
import { SpotifyService } from '@/modules/spotify';
import { ThirdPartiesService } from '@/modules/third-parties';
import { ThirdPartiesRepository } from '@/modules/third-parties/third-parties.repository';
import { TwitchService } from '@/modules/twitch/twitch.service';
import { UsersRepository, UsersService } from '@/modules/users';

export const registerServices = async (app: FastifyInstance): Promise<void> => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const usersRepository = new UsersRepository(app.mongo.db);
  await usersRepository.createIndex();
  const thirdPartiesRepository = new ThirdPartiesRepository(app.mongo.db);
  const pollingRepository = new PollingRepository(app.mongo.db);

  const usersService = new UsersService(usersRepository);
  const thirdPartiesService = new ThirdPartiesService(thirdPartiesRepository, usersService);
  const pollingService = new PollingService(pollingRepository);
  const githubService = new GithubService(thirdPartiesService);
  const discordService = new DiscordService(thirdPartiesService);
  const spotifyService = new SpotifyService(thirdPartiesService, pollingService);
  const twitchService = new TwitchService(thirdPartiesService);

  ServiceManager.instance.register(createGithubService(githubService));
  ServiceManager.instance.register(createDiscordService(discordService));
  ServiceManager.instance.register(createSpotifyService(spotifyService));
  ServiceManager.instance.register(createUnsplashService());
  ServiceManager.instance.register(createDropboxService());
  ServiceManager.instance.register(createTwitchService(twitchService));
  ServiceManager.instance.register(createNasaService());
};
