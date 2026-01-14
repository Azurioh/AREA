import type { FastifyInstance } from 'fastify';
import request from 'supertest';
import { v4 } from 'uuid';
import build from '@/app';
import { closeDiscordBot } from '@/config/discord-bot';
import { MongoCollections } from '@/enums/mongo-collection';
import { removeValueFromDatabase } from '@/utils/db-cleaner';
import authRoutes from '../auth.routes';

const profiles = [
  {
    name: 'John Doe',
    email: `john-${v4()}@example.com`,
    password: 'password123',
  },
  {
    name: 'Jane Doe',
    email: `jane-${v4()}@example.com`,
    password: 'password123',
  },
];

describe('Auth Routes', () => {
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

  describe('Route registration', () => {
    it('should throw error when MongoDB is not initialized', async () => {
      const mockApp = {
        mongo: { db: null },
        route: jest.fn(),
      } as unknown as FastifyInstance;

      await expect(authRoutes(mockApp)).rejects.toThrow('MongoDB not initialized');
    });
  });

  describe('POST /auth/v1/register', () => {
    it('should register a new user with valid data', async () => {
      const response = await request(app.server)
        .post('/auth/v1/register')
        .set({ 'Content-Type': 'application/json' })
        .send({
          name: profiles[0]!.name,
          email: profiles[0]!.email,
          password: profiles[0]!.password,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app.server)
        .post('/auth/v1/register')
        .set({ 'Content-Type': 'application/json' })
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });

    afterAll(async () => {
      if (!app.mongo?.db) {
        return;
      }
      await removeValueFromDatabase(app.mongo.db, MongoCollections.USERS, 'email', profiles[0]!.email);
    });
  });

  describe('POST /auth/v1/login', () => {
    it('should login user with valid credentials', async () => {
      // Create user first
      await request(app.server).post('/auth/v1/register').set({ 'Content-Type': 'application/json' }).send({
        name: profiles[1]!.name,
        email: profiles[1]!.email,
        password: profiles[1]!.password,
      });

      const response = await request(app.server)
        .post('/auth/v1/login')
        .set({ 'Content-Type': 'application/json' })
        .send({
          email: profiles[1]!.email,
          password: profiles[1]!.password,
          rememberMe: false,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    afterAll(async () => {
      if (!app.mongo?.db) {
        return;
      }
      await removeValueFromDatabase(app.mongo.db, MongoCollections.USERS, 'email', profiles[1]!.email);
    });
  });

  describe('POST /auth/v1/refresh', () => {
    it('should refresh token with valid cookie', async () => {
      // 1. Register a user to get tokens
      const registerResponse = await request(app.server)
        .post('/auth/v1/register')
        .set({ 'Content-Type': 'application/json' })
        .send({
          name: 'Refresh User',
          email: `refresh-${v4()}@example.com`,
          password: 'password123',
        });

      const cookies = registerResponse.headers['set-cookie'];
      expect(cookies).toBeDefined();

      // 2. Use the cookie to refresh token
      const response = await request(app.server).post('/auth/v1/refresh').set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');

      // Cleanup
      if (app.mongo?.db) {
        await removeValueFromDatabase(app.mongo.db, MongoCollections.USERS, 'email', `refresh-${v4()}@example.com`);
      }
    });

    it('should fail if no refresh token cookie', async () => {
      const response = await request(app.server).post('/auth/v1/refresh');

      expect(response.status).toBe(401);
    });
  });
});
