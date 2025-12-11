// Mock the environment module to prevent validation during tests
jest.mock('./src/utils/environment', () => ({
  environment: {
    NODE_ENV: 'test',
    PORT: 3000,
    BASE_API_URL: 'http://localhost:3000',
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DATABASE: 'area-test',
    CRYPT_SECRET_KEY: 'test',
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
  },
}));
