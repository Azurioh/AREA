import type { FastifyInstance } from 'fastify';
import request from 'supertest';
import build from '@/app';
import { closeDiscordBot } from '@/config/discord-bot';
import aboutRoutes from '../about.routes';

describe('About Routes', () => {
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

  describe('GET /about.json', () => {
    it('should return about information with correct structure', async () => {
      const response = await request(app.server).get('/about.json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('client');
      expect(response.body.client).toHaveProperty('host');
      expect(response.body).toHaveProperty('server');
      expect(response.body.server).toHaveProperty('current_time');
      expect(response.body.server).toHaveProperty('services');
      expect(Array.isArray(response.body.server.services)).toBe(true);
    });
  });

  describe('Route registration', () => {
    it('should throw error when MongoDB is not initialized', async () => {
      const mockApp = {
        mongo: { db: null },
        route: jest.fn(),
      } as unknown as FastifyInstance;

      await expect(aboutRoutes(mockApp)).rejects.toThrow('MongoDB not initialized');
    });
  });
});
