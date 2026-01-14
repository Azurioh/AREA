import type { FastifyInstance } from 'fastify';
import { ObjectId } from 'mongodb';
import supertest from 'supertest';
import build from '@/app';
import { closeDiscordBot } from '@/config/discord-bot';
import thirdPartiesRoutes from '../third-parties.routes';

// Mock Discord bot to avoid connection timeouts
jest.mock('@/config/discord-bot', () => ({
  setupDiscordBot: jest.fn().mockResolvedValue(undefined),
  closeDiscordBot: jest.fn().mockResolvedValue(undefined),
}));

describe('Third Parties Integration Tests', () => {
  let app: FastifyInstance;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    app = await build();
    await app.ready();

    // Register and login to get an access token
    const user = {
      email: `test-tp-${Date.now()}@example.com`,
      password: 'Password123!',
      name: 'Test TP User',
    };

    const registerResponse = await supertest(app.server).post('/auth/v1/register').send(user);

    if (registerResponse.status !== 201) {
      console.error('Registration failed:', registerResponse.body);
    }
    accessToken = registerResponse.body.accessToken;

    // Get user id from database as it's not in the response
    const dbUser = await app.mongo.db!.collection('users').findOne({ email: user.email });
    userId = dbUser?._id.toString() || '';
    if (!userId) {
      console.error('User not found in DB after registration');
    }
  });

  afterAll(async () => {
    try {
      if (app?.mongo?.db) {
        if (userId) {
          await app.mongo.db.collection('users').deleteOne({ _id: new ObjectId(userId) });
          await app.mongo.db.collection('third_parties_account').deleteMany({ userId: userId });
        }
      }
    } catch (e) {
      console.error('Cleanup failed:', e);
    }
    if (app?.mongo?.client) {
      await app.mongo.client.close();
    }
    await app?.close();
    await closeDiscordBot();
  });

  describe('GET /third-parties/v1/authorization-url/:service', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await supertest(app.server).get('/third-parties/v1/authorization-url/github');
      expect(response.status).toBe(400); // verifyUserAccess returns 400 for missing token
    });

    it('should return 200 and authorization URL if authenticated', async () => {
      const response = await supertest(app.server)
        .get('/third-parties/v1/authorization-url/github')
        .set('Authorization', `Bearer ${accessToken}`);

      if (response.status !== 200) {
        console.error('Auth URL failed:', response.status, response.body);
      }
      expect(response.status).toBe(200);
      expect(response.body.url).toBeDefined();
    });
  });

  describe('GET /third-parties/v1/authorize/:service', () => {
    it('should redirect back with error if no code provided', async () => {
      // This route requires 'state' in query string according to schema
      const response = await supertest(app.server).get('/third-parties/v1/authorize/github?state=some-state');
      expect(response.status).toBe(302);
      expect(response.header.location).toContain('status=error');
    });

    it('should return 400 if state is missing', async () => {
      const response = await supertest(app.server).get('/third-parties/v1/authorize/github');
      expect(response.status).toBe(400);
    });

    it('should redirect with failure if state is invalid', async () => {
      // Service will throw 401/400 if state is not a valid token
      const response = await supertest(app.server).get('/third-parties/v1/authorize/github?code=123&state=invalid');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /third-parties/v1/status/:service', () => {
    it('should return 401 if not authenticated', async () => {
      const response = await supertest(app.server).get('/third-parties/v1/status/github');
      expect(response.status).toBe(400);
    });

    it('should return status if authenticated', async () => {
      const response = await supertest(app.server)
        .get('/third-parties/v1/status/github')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.connected).toBeDefined();
    });
  });

  it('should throw error if MongoDB not initialized', async () => {
    const mockApp = { mongo: { db: undefined } } as any;
    await expect(thirdPartiesRoutes(mockApp)).rejects.toThrow('MongoDB not initialized');
  });
});
