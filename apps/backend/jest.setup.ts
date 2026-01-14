import { randomInt } from 'node:crypto';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env.test') });

// Get the actual module implementation
const actualEnvironment = jest.requireActual('./src/utils/environment');

// Create a test environment object
const PORT = randomInt(3000, 8000);
const testEnvironmentConfig = {
  NODE_ENV: 'test',
  PORT,
  BASE_API_URL: `http://localhost:${PORT}`,
  ADMIN_SECRET: 'test',
  CORS_ORIGINS: `http://localhost:${PORT}`,
  MONGO_URI: process.env.MONGO_URI,
  MONGO_DATABASE: 'area-test',
  CRYPT_SECRET_KEY: 'cc0e4ca4aaa19656747de47a835ccaea2bd4adb5a8f7ca44d1362bac6cd01c5d',
  WEB_OAUTH_CALLBACK_URL: 'http://localhost:3001/oauth/callback',
  MOBILE_OAUTH_CALLBACK_URL: 'area://oauth/callback',
  JWT_ACCESS_TOKEN_SECRET: 'test',
  JWT_REFRESH_TOKEN_SECRET: 'test',
  JWT_STATE_TOKEN_SECRET: 'test',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
  X_CLIENT_ID: process.env.X_CLIENT_ID,
  X_CLIENT_SECRET: process.env.X_CLIENT_SECRET,
  X_CODE_VERIFIER: 'challenge',
};

// Mock the environment module, exposing actual functions + test environment
jest.mock('./src/utils/environment', () => ({
  ...actualEnvironment,
  environment: testEnvironmentConfig,
  getEnvironment: () => testEnvironmentConfig,
  initEnvironment: () => testEnvironmentConfig,
}));
