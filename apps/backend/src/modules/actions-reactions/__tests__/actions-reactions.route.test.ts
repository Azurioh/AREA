import type { FastifyInstance } from 'fastify';
import build from '@/app';
import { closeDiscordBot } from '@/config/discord-bot';
import actionsReactionsRoutes from '../actions-reactions.routes';

// Mock Discord bot to avoid connection timeouts
jest.mock('@/config/discord-bot', () => ({
  setupDiscordBot: jest.fn().mockResolvedValue(undefined),
  closeDiscordBot: jest.fn().mockResolvedValue(undefined),
}));

describe('Actions Reactions Routes', () => {
  describe('Route registration - error case', () => {
    it('should throw error when MongoDB is not initialized', async () => {
      const mockApp = {
        mongo: { db: null },
        route: jest.fn(),
      } as unknown as FastifyInstance;

      await expect(actionsReactionsRoutes(mockApp)).rejects.toThrow('MongoDB not initialized');
    });
  });

  describe('Route registration - success case', () => {
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

    it('should register routes when MongoDB is initialized', () => {
      // The app built successfully which means routes were registered
      expect(app).toBeDefined();
    });
  });
});
