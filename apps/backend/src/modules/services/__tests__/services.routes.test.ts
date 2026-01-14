import type { FastifyInstance } from 'fastify';
import request from 'supertest';
import { v4 } from 'uuid';
import build from '@/app';
import { closeDiscordBot } from '@/config/discord-bot';
import { MongoCollections } from '@/enums/mongo-collection';
import { ServiceManager } from '@/integrations';
import { removeValueFromDatabase } from '@/utils/db-cleaner';
import servicesRoutes from '../services.routes';

jest.mock('@/integrations', () => {
  const actual = jest.requireActual('@/integrations');
  return {
    ...actual,
    ServiceManager: {
      instance: {
        get: jest.fn(),
        register: jest.fn(),
        getAll: jest.fn(),
      },
    },
  };
});

jest.mock('@/config/discord-bot', () => ({
  setupDiscordBot: jest.fn().mockResolvedValue(undefined),
  closeDiscordBot: jest.fn().mockResolvedValue(undefined),
}));

const testUser = {
  name: 'Test User',
  email: `test-${v4()}@example.com`,
  password: 'password123',
};

describe('Services Routes', () => {
  let app: FastifyInstance;
  let accessToken: string;
  let cookies: string[];

  const mockAction = {
    name: 'test-action',
    description: 'test-description',
    params: [],
    returnedValues: [{ key: 'key1', description: 'desc1', type: 'string' }],
    refreshParams: jest.fn(),
  };

  const mockReaction = {
    name: 'test-reaction',
    description: 'test-description',
    params: [],
    refreshParams: jest.fn(),
  };

  const mockService = {
    name: 'test-service',
    actions: [mockAction],
    reactions: [mockReaction],
  };

  beforeAll(async () => {
    (ServiceManager.instance.get as jest.Mock).mockReturnValue(mockService);

    app = await build();
    await app.ready();

    const registerResponse = await request(app.server)
      .post('/auth/v1/register')
      .set('Content-Type', 'application/json')
      .send(testUser);

    accessToken = registerResponse.body.accessToken;
    cookies = registerResponse.headers['set-cookie'];
  }, 30000);

  afterAll(async () => {
    if (app?.mongo?.db) {
      await removeValueFromDatabase(app.mongo.db, MongoCollections.USERS, 'email', testUser.email);
      await app.mongo.client.close();
    }
    await closeDiscordBot();
    await app?.close();
  });

  describe('Route registration', () => {
    it('should throw error when MongoDB is not initialized', async () => {
      const mockApp = {
        mongo: { db: null },
        route: jest.fn(),
      } as unknown as FastifyInstance;

      expect(() => servicesRoutes(mockApp)).toThrow('MongoDB not initialized');
    });
  });

  describe('GET /services/v1/:service/actions', () => {
    it('should return service actions', async () => {
      const response = await request(app.server).get('/services/v1/test-service/actions');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].name).toBe('test-action');
    });
  });

  describe('GET /services/v1/:service/actions/:action', () => {
    it('should return action details (authenticated)', async () => {
      const response = await request(app.server)
        .get('/services/v1/test-service/actions/test-action')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-action');
    });

    it('should fail without auth', async () => {
      const response = await request(app.server).get('/services/v1/test-service/actions/test-action');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /services/v1/:service/actions/:action/returned-values', () => {
    it('should return action returned values', async () => {
      const response = await request(app.server).get('/services/v1/test-service/actions/test-action/returned-values');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].key).toBe('key1');
    });
  });

  describe('GET /services/v1/:service/reactions', () => {
    it('should return service reactions', async () => {
      const response = await request(app.server).get('/services/v1/test-service/reactions');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].name).toBe('test-reaction');
    });
  });

  describe('GET /services/v1/:service/reactions/:reaction', () => {
    it('should return reaction details (authenticated)', async () => {
      const response = await request(app.server)
        .get('/services/v1/test-service/reactions/test-reaction')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('test-reaction');
    });

    it('should fail without auth', async () => {
      const response = await request(app.server).get('/services/v1/test-service/reactions/test-reaction');
      expect(response.status).toBe(400);
    });
  });
});
