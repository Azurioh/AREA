import type { FastifyInstance } from 'fastify';
import request from 'supertest';
import { v4 } from 'uuid';
import build from '@/app';
import { closeDiscordBot } from '@/config/discord-bot';
import { MongoCollections } from '@/enums/mongo-collection';
import { removeValueFromDatabase } from '@/utils/db-cleaner';

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
    await app?.close();
    await closeDiscordBot();
  });

  describe('POST /auth/v1/register', () => {
    it('should register a new user with valid data', async () => {
      const response = await request(app.server).post('/auth/v1/register').send({
        name: profiles[0]!.name,
        email: profiles[0]!.email,
        password: profiles[0]!.password,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app.server).post('/auth/v1/register').send({
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
      // First register a user
      await request(app.server).post('/auth/v1/register').send({
        name: profiles[1]!.name,
        email: profiles[1]!.email,
        password: profiles[1]!.password,
      });

      // Then login
      const response = await request(app.server).post('/auth/v1/login').send({
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
});
