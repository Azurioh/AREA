import { createDiscordService, createGithubService, ServiceManager } from '@/integrations';
import { DiscordRepository, DiscordService } from '@/modules/discord';
import { GithubRepository, GithubService } from '@/modules/github';
import { UsersRepository, UsersService } from '@/modules/users';
import type { FastifyInstance } from 'fastify';

export const registerServices = (app: FastifyInstance): void => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }
  const usersRepository = new UsersRepository(app.mongo.db);
  const usersService = new UsersService(usersRepository);

  const githubRepository = new GithubRepository(app.mongo.db!);
  const githubService = new GithubService(githubRepository, usersService);

  const discordRepository = new DiscordRepository(app.mongo.db);
  const discordService = new DiscordService(discordRepository, usersService);

  ServiceManager.instance.register(createGithubService(githubService));
  ServiceManager.instance.register(createDiscordService(discordService));
};
