import type { FastifyInstance } from 'fastify';
import request from 'supertest';
import build from '@/app';
import { closeDiscordBot } from '@/config/discord-bot';

jest.mock('@/config/discord-bot', () => ({
  setupDiscordBot: jest.fn().mockResolvedValue(undefined),
  closeDiscordBot: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('@/modules/actions-reactions', () => {
  return {
    ActionsReactionsRepository: jest.fn().mockImplementation(() => ({})),
    ActionsReactionsService: jest.fn().mockImplementation(() => ({
      handleActionReception: jest.fn().mockResolvedValue(undefined),
    })),
    actionsReactionsRoutes: async (_app: any) => {},
  };
});

describe('Webhook Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await build();
    await app.ready();
  }, 30000);

  afterAll(async () => {
    if (app?.mongo?.client) {
      await app.mongo.client.close();
    }
    await app?.close();
    await closeDiscordBot();
  });

  describe('POST /webhook/v1/github/', () => {
    it('should return 400 if header is missing', async () => {
      const response = await request(app.server).post('/webhook/v1/github/');
      expect(response.status).toBe(400);
    });

    it('should return 204 if request is valid', async () => {
      const response = await request(app.server)
        .post('/webhook/v1/github/')
        .set('x-github-event', 'push')
        .send({
          repository: { id: 123 },
          sender: { login: 'testuser' },
        });

      expect(response.status).toBe(204);
    });
  });

  describe('POST /webhook/v1/discord/', () => {
    it('should return 400 if header is missing', async () => {
      const response = await request(app.server).post('/webhook/v1/discord/');
      expect(response.status).toBe(400);
    });

    it('should return 204 if request is valid', async () => {
      const response = await request(app.server).post('/webhook/v1/discord/').set('x-discord-event', 'message').send({
        channelId: '123',
        content: 'hello',
      });

      expect(response.status).toBe(204);
    });
  });

  describe('POST /webhook/v1/spotify/', () => {
    it('should return 400 if header is missing', async () => {
      const response = await request(app.server).post('/webhook/v1/spotify/');
      expect(response.status).toBe(400);
    });

    it('should return 204 if request is valid', async () => {
      const response = await request(app.server)
        .post('/webhook/v1/spotify/')
        .set('x-spotify-event', 'listening_to_artist')
        .set('x-user-id', 'user123')
        .send({
          artist: {
            id: 'artist-123',
            name: 'Artist Name',
          },
        });

      expect(response.status).toBe(204);
    });
  });

  describe('Route registration', () => {
    it('should throw error when MongoDB is not initialized', async () => {
      const webhookRoutes = require('../webhook.routes').default;
      const mockApp = {
        mongo: { db: null },
        route: jest.fn(),
      } as unknown as FastifyInstance;

      await expect(webhookRoutes(mockApp)).rejects.toThrow('MongoDB not initialized');
    });
  });
});
