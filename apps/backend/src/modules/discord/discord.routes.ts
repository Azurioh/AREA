import {
  discordAuthorizationQueryStringSchema,
  discordAuthorizationResponseSchema,
} from '@area/shared/schemas/discord.schema';
import type { FastifyInstance } from 'fastify';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';
import { UsersRepository, UsersService } from '../users';
import { DiscordRepository } from './discord.repository';

export default async (app: FastifyInstance) => {
  if (!app.mongo.db) {
    throw new Error('MongoDB not initialized');
  }

  const repository = new DiscordRepository(app.mongo.db);
  const service = new DiscordService(repository, new UsersService(new UsersRepository(app.mongo.db)));
  const controller = new DiscordController(service);

  app.route({
    method: 'GET',
    url: '/v1/authorize',
    handler: controller.authorizeUser.bind(controller),
    schema: {
      summary: 'Authorize a user to a Discord account',
      description: 'Link a user Discrod account to its account',
      tags: ['Discord'],
      querystring: discordAuthorizationQueryStringSchema,
      response: {
        200: discordAuthorizationResponseSchema,
      },
    },
  });
};
