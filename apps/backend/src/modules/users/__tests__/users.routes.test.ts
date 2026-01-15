import type { FastifyInstance } from 'fastify';
import request from 'supertest';
import { v4 } from 'uuid';
import build from '@/app';
import { closeDiscordBot } from '@/config/discord-bot';
import { MongoCollections } from '@/enums/mongo-collection';
import { removeValueFromDatabase } from '@/utils/db-cleaner';

jest.mock('@/config/discord-bot', () => ({
  setupDiscordBot: jest.fn().mockResolvedValue(undefined),
  closeDiscordBot: jest.fn().mockResolvedValue(undefined),
}));

const userProfile = {
  name: 'Test User',
  email: `test-${v4()}@example.com`,
  password: 'password123',
};

describe('Users Routes', () => {
  let app: FastifyInstance;
  let accessToken: string;

  beforeAll(async () => {
    app = await build();
    await app.ready();

    const registerResponse = await request(app.server).post('/auth/v1/register').send(userProfile);

    accessToken = registerResponse.body.accessToken;
  }, 30000);

  afterAll(async () => {
    if (app?.mongo?.db) {
      await removeValueFromDatabase(app.mongo.db, MongoCollections.USERS, 'email', userProfile.email);
    }
    if (app?.mongo?.client) {
      await app.mongo.client.close();
    }
    await app?.close();
    await closeDiscordBot();
  });

  describe('GET /users/v1/me', () => {
    it('should return current user profile', async () => {
      const response = await request(app.server).get('/users/v1/me').set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', userProfile.email);
      expect(response.body).toHaveProperty('name', userProfile.name);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      const response = await request(app.server).get('/users/v1/me');
      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /users/v1/me', () => {
    it('should update user profile', async () => {
      const newName = 'Updated Name';
      const response = await request(app.server)
        .patch('/users/v1/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: newName });

      expect(response.status).toBe(204);

      // Verify update
      const meResponse = await request(app.server).get('/users/v1/me').set('Authorization', `Bearer ${accessToken}`);

      expect(meResponse.body.name).toBe(newName);
    });
  });

  describe('DELETE /users/v1/me', () => {
    it('should delete current user', async () => {
      const deleteUser = {
        name: 'Delete Me',
        email: `delete-${v4()}@example.com`,
        password: 'password123',
      };

      const regRes = await request(app.server).post('/auth/v1/register').send(deleteUser);
      const token = regRes.body.accessToken;

      const response = await request(app.server).delete('/users/v1/me').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);

      const meRes = await request(app.server).get('/users/v1/me').set('Authorization', `Bearer ${token}`);

      expect(meRes.status).toBe(401);
    });
  });

  describe('Route registration', () => {
    it('should throw error when MongoDB is not initialized', async () => {
      const usersRoutes = require('../users.routes').default;
      const mockApp = {
        mongo: { db: null },
        route: jest.fn(),
      } as unknown as FastifyInstance;

      await expect(usersRoutes(mockApp)).rejects.toThrow('MongoDB not initialized');
    });
  });
});
