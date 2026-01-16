import crypto from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import request from 'supertest';
import { v4 } from 'uuid';
import build from '@/app';
import { closeDiscordBot } from '@/config/discord-bot';
import { MongoCollections } from '@/enums/mongo-collection';
import { encryptString } from '@/utils/crypt';
import { removeValueFromDatabase } from '@/utils/db-cleaner';
import { environment } from '@/utils/environment';
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

    it('should return 409 for duplicate email', async () => {
      const response = await request(app.server)
        .post('/auth/v1/register')
        .set({ 'Content-Type': 'application/json' })
        .send({
          name: profiles[0]!.name,
          email: profiles[0]!.email, // Same email as first test
          password: 'password123',
        });

      expect(response.status).toBe(409);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app.server)
        .post('/auth/v1/register')
        .set({ 'Content-Type': 'application/json' })
        .send({
          name: 'John Doe',
          // Missing email and password
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
    const loginEmail = `login-${v4()}@example.com`;

    beforeAll(async () => {
      // Create user for login tests
      await request(app.server).post('/auth/v1/register').set({ 'Content-Type': 'application/json' }).send({
        name: profiles[1]!.name,
        email: loginEmail,
        password: profiles[1]!.password,
      });
    });

    it('should login user with valid credentials', async () => {
      const response = await request(app.server)
        .post('/auth/v1/login')
        .set({ 'Content-Type': 'application/json' })
        .send({
          email: loginEmail,
          password: profiles[1]!.password,
          rememberMe: false,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should login user with rememberMe enabled', async () => {
      const response = await request(app.server)
        .post('/auth/v1/login')
        .set({ 'Content-Type': 'application/json' })
        .send({
          email: loginEmail,
          password: profiles[1]!.password,
          rememberMe: true,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app.server)
        .post('/auth/v1/login')
        .set({ 'Content-Type': 'application/json' })
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
          rememberMe: false,
        });

      expect(response.status).toBe(404);
    });

    it('should return 401 for incorrect password', async () => {
      const response = await request(app.server)
        .post('/auth/v1/login')
        .set({ 'Content-Type': 'application/json' })
        .send({
          email: loginEmail,
          password: 'wrongpassword',
          rememberMe: false,
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for missing rememberMe field', async () => {
      const response = await request(app.server)
        .post('/auth/v1/login')
        .set({ 'Content-Type': 'application/json' })
        .send({
          email: loginEmail,
          password: profiles[1]!.password,
        });

      expect(response.status).toBe(400);
    });

    afterAll(async () => {
      if (!app.mongo?.db) {
        return;
      }
      await removeValueFromDatabase(app.mongo.db, MongoCollections.USERS, 'email', loginEmail);
    });
  });

  describe('POST /auth/v1/refresh', () => {
    let testEmail: string;
    let accessToken: string;
    let refreshTokenCookie: string[];

    beforeEach(async () => {
      testEmail = `refresh-${v4()}@example.com`;

      // Register a user to get tokens
      const registerResponse = await request(app.server)
        .post('/auth/v1/register')
        .set({ 'Content-Type': 'application/json' })
        .send({
          name: 'Refresh User',
          email: testEmail,
          password: 'password123',
        });

      accessToken = registerResponse.body.accessToken;
      refreshTokenCookie = registerResponse.headers['set-cookie'];

      // Store the refresh token in the database
      const loginResp = await request(app.server)
        .post('/auth/v1/login')
        .set({ 'Content-Type': 'application/json' })
        .send({
          email: testEmail,
          password: 'password123',
          rememberMe: true,
        });

      refreshTokenCookie = loginResp.headers['set-cookie'];
      accessToken = loginResp.body.accessToken;
    });

    afterEach(async () => {
      if (app.mongo?.db) {
        await removeValueFromDatabase(app.mongo.db, MongoCollections.USERS, 'email', testEmail);
        // Clean up refresh tokens
        await app.mongo.db.collection(MongoCollections.REFRESH_TOKENS).deleteMany({});
      }
    });

    it('should refresh token with valid cookie and Authorization header', async () => {
      const response = await request(app.server)
        .post('/auth/v1/refresh')
        .set('Cookie', refreshTokenCookie)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.accessToken).not.toBe(accessToken); // Should be a new token
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should fail if no refresh token cookie', async () => {
      const response = await request(app.server).post('/auth/v1/refresh').set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(401);
    });

    it('should fail if refresh token is invalid', async () => {
      const invalidToken = encryptString('invalid.token.here', environment.CRYPT_SECRET_KEY);

      const response = await request(app.server)
        .post('/auth/v1/refresh')
        .set('Cookie', [`refresh-token=${invalidToken}`])
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(401);
    });

    it('should fail if refresh token has been revoked', async () => {
      // First refresh - should work
      const firstRefresh = await request(app.server)
        .post('/auth/v1/refresh')
        .set('Cookie', refreshTokenCookie)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(firstRefresh.status).toBe(200);

      // Get new access token from first refresh
      const newAccessToken = firstRefresh.body.accessToken;
      const newRefreshTokenCookie = firstRefresh.headers['set-cookie'];

      // Second refresh with old token - should fail (token was invalidated)
      const secondRefresh = await request(app.server)
        .post('/auth/v1/refresh')
        .set('Cookie', refreshTokenCookie) // Old cookie
        .set('Authorization', `Bearer ${newAccessToken}`); // But using new access token

      expect(secondRefresh.status).toBe(401);
    });

    it('should fail if refresh token is not in database', async () => {
      // Create a valid token but don't store it in DB
      const fakeRefreshToken = encryptString(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.test',
        environment.CRYPT_SECRET_KEY,
      );

      const response = await request(app.server)
        .post('/auth/v1/refresh')
        .set('Cookie', [`refresh-token=${fakeRefreshToken}`])
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe('Token Invalidation', () => {
    let testEmail: string;
    let accessToken: string;
    let refreshTokenCookie: string[];

    beforeEach(async () => {
      testEmail = `invalidation-${v4()}@example.com`;

      // Register and login to get tokens
      await request(app.server).post('/auth/v1/register').set({ 'Content-Type': 'application/json' }).send({
        name: 'Invalidation User',
        email: testEmail,
        password: 'password123',
      });

      const loginResp = await request(app.server)
        .post('/auth/v1/login')
        .set({ 'Content-Type': 'application/json' })
        .send({
          email: testEmail,
          password: 'password123',
          rememberMe: true,
        });

      refreshTokenCookie = loginResp.headers['set-cookie'];
      accessToken = loginResp.body.accessToken;
    });

    afterEach(async () => {
      if (app.mongo?.db) {
        await removeValueFromDatabase(app.mongo.db, MongoCollections.USERS, 'email', testEmail);
        await app.mongo.db.collection(MongoCollections.REFRESH_TOKENS).deleteMany({});
      }
    });

    it('should invalidate access token on refresh', async () => {
      // Refresh the token
      const refreshResp = await request(app.server)
        .post('/auth/v1/refresh')
        .set('Cookie', refreshTokenCookie)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(refreshResp.status).toBe(200);

      // Check if old access token is blacklisted in Redis
      // Note: The access token is stored encrypted in the blacklist
      const isBlacklisted = await app.redis.get(`blacklist:${accessToken}`);

      // The invalidateAccessToken function should store the token in the blacklist
      // If this test fails, it means the token wasn't blacklisted (which may be intentional for valid use cases)
      expect(isBlacklisted).toBeTruthy();
    });

    it('should invalidate refresh token on refresh', async () => {
      // Extract the refresh token from cookie
      const refreshTokenMatch = refreshTokenCookie[0]?.match(/refresh-token=([^;]+)/);
      const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : '';
      const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

      // Refresh the token
      await request(app.server)
        .post('/auth/v1/refresh')
        .set('Cookie', refreshTokenCookie)
        .set('Authorization', `Bearer ${accessToken}`);

      // Check if old refresh token is deleted from database
      const tokenInDb = await app.mongo.db?.collection(MongoCollections.REFRESH_TOKENS).findOne({ hashedToken });

      expect(tokenInDb).toBeNull();
    });
  });

  describe('Token Validation', () => {
    let testEmail: string;

    beforeEach(() => {
      testEmail = `validation-${v4()}@example.com`;
    });

    afterEach(async () => {
      if (app.mongo?.db) {
        await removeValueFromDatabase(app.mongo.db, MongoCollections.USERS, 'email', testEmail);
        await app.mongo.db.collection(MongoCollections.REFRESH_TOKENS).deleteMany({});
      }
    });

    it('should validate and store refresh token on login', async () => {
      // Register user
      const registerResp = await request(app.server)
        .post('/auth/v1/register')
        .set({ 'Content-Type': 'application/json' })
        .send({
          name: 'Validation User',
          email: testEmail,
          password: 'password123',
        });

      // Login
      const loginResp = await request(app.server)
        .post('/auth/v1/login')
        .set({ 'Content-Type': 'application/json' })
        .send({
          email: testEmail,
          password: 'password123',
          rememberMe: true,
        });

      expect(loginResp.status).toBe(200);

      // Check if any refresh token is stored in database for this user
      // Get user ID from the access token payload or find by email
      const tokenCount = await app.mongo.db?.collection(MongoCollections.REFRESH_TOKENS).countDocuments({});

      // Refresh tokens should be stored in the database during login
      expect(tokenCount).toBeGreaterThan(0);
    });

    it('should check refresh token expiration', async () => {
      // Register user
      await request(app.server).post('/auth/v1/register').set({ 'Content-Type': 'application/json' }).send({
        name: 'Expiration User',
        email: testEmail,
        password: 'password123',
      });

      // Login
      const loginResp = await request(app.server)
        .post('/auth/v1/login')
        .set({ 'Content-Type': 'application/json' })
        .send({
          email: testEmail,
          password: 'password123',
          rememberMe: false, // 1 day expiration
        });

      expect(loginResp.status).toBe(200);

      // Expire ALL tokens in the database (since hash comparison is tricky)
      await app.mongo.db?.collection(MongoCollections.REFRESH_TOKENS).updateMany(
        {},
        { $set: { expiresAt: new Date(Date.now() - 1000) } }, // Expired 1 second ago
      );

      // Try to refresh with expired token - should fail because isRefreshTokenValid checks expiresAt
      const refreshTokenCookie = loginResp.headers['set-cookie'];
      const refreshResp = await request(app.server)
        .post('/auth/v1/refresh')
        .set('Cookie', refreshTokenCookie)
        .set('Authorization', `Bearer ${loginResp.body.accessToken}`);

      expect(refreshResp.status).toBe(401);
    });
  });
});
