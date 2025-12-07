import { createGithubService, ServiceManager } from '@/integrations';
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

  ServiceManager.instance.register(createGithubService(githubService));
};
