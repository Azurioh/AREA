import path from 'node:path';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

// Mock the environment module to prevent validation during tests
jest.mock('./src/utils/environment', () => ({
  environment: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: Number(process.env.PORT),
    BASE_API_URL: process.env.BASE_API_URL,
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DATABASE: process.env.MONGO_INITDB_DATABASE || 'area-test',
    CRYPT_SECRET_KEY: process.env.CRYPT_SECRET_KEY,
    WEB_OAUTH_CALLBACK_URL: process.env.WEB_OAUTH_CALLBACK_URL,
    MOBILE_OAUTH_CALLBACK_URL: process.env.MOBILE_OAUTH_CALLBACK_URL,
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    JWT_STATE_TOKEN_SECRET: process.env.JWT_STATE_TOKEN_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
  },
}));
