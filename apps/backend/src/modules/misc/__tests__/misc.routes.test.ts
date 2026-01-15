import type { FastifyInstance } from 'fastify';
import request from 'supertest';
import build from '@/app';
import { closeDiscordBot } from '@/config/discord-bot';

describe('Misc Routes', () => {
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

  describe('GET /v1/uptime', () => {
    it('should return server uptime', async () => {
      const response = await request(app.server).get('/v1/uptime');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.uptime).toBe('number');
    });
  });
});
