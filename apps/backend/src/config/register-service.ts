import type { FastifyInstance } from 'fastify';
import { createDiscordService, createGithubService, ServiceManager } from '@/integrations';
import { DiscordService } from '@/modules/discord';
import { GithubService } from '@/modules/github';
import { ThirdPartiesService } from '@/modules/third-parties';
import { ThirdPartiesRepository } from '@/modules/third-parties/third-parties.repository';
import { UsersRepository, UsersService } from '@/modules/users';

export const registerServices = (app: FastifyInstance): void => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const thirdPartiesRepository = new ThirdPartiesRepository(app.mongo.db);
  const usersRepository = new UsersRepository(app.mongo.db);

  const usersService = new UsersService(usersRepository);
  const thirdPartiesService = new ThirdPartiesService(thirdPartiesRepository, usersService);
  const githubService = new GithubService(thirdPartiesService);
  const discordService = new DiscordService(thirdPartiesService);

  ServiceManager.instance.register(createGithubService(githubService));
  ServiceManager.instance.register(createDiscordService(discordService));
};
