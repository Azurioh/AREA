import dotenv from 'dotenv';

dotenv.config();

/**
 * @interface Environment
 * @description This interface defines the structure of the environment variables
 */

export interface Environment {
  NODE_ENV: string;
  PORT: number;
  BASE_API_URL: string;

  ADMIN_SECRET: string;
  CRYPT_SECRET_KEY: string;
  CORS_ORIGINS: string;

  WEB_OAUTH_CALLBACK_URL: string;
  MOBILE_OAUTH_CALLBACK_URL: string;

  MONGO_URI: string;
  MONGO_DATABASE: string;

  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_STATE_TOKEN_SECRET: string;

  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;

  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  DISCORD_BOT_TOKEN: string;

  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;

  DROPBOX_CLIENT_ID: string;
  DROPBOX_CLIENT_SECRET: string;

  UNSPLASH_CLIENT_ID: string;

  TWITCH_CLIENT_ID: string;
  TWITCH_CLIENT_SECRET: string;
  TWITCH_WEBHOOK_SECRET: string;
}

/**
 * Helper to get and validate an environment variable
 * @param key - The environment variable key
 * @returns The value of the environment variable
 * @throws Calls process.exit(1) if the variable is undefined or empty
 */
export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    console.error(`\r\x1b[31mError:\x1b[0m Variable ${key} is not defined`);
    process.exit(1);
  }
  if (value === '') {
    console.error(`\r\x1b[31mError:\x1b[0m Variable ${key} is empty`);
    process.exit(1);
  }
  return value;
};

/**
 * Validate and parse the PORT environment variable
 * @returns The parsed port number
 * @throws Calls process.exit(1) if PORT is invalid
 */
export const validatePort = (): number => {
  const portStr = process.env.PORT;
  if (portStr === undefined || portStr === '') {
    console.error(`\r\x1b[31mError:\x1b[0m Variable PORT is not defined or empty`);
    process.exit(1);
  }

  const port = Number(portStr);
  if (Number.isNaN(port)) {
    console.error('\r\x1b[31mError:\x1b[0m Variable PORT is not a number');
    process.exit(1);
  }
  return port;
};

/**
 * Load and validate all environment variables
 * @returns The validated Environment object
 */
export const loadEnvironment = (): Environment => {
  const requiredVars = [
    'NODE_ENV',
    'BASE_API_URL',

    'ADMIN_SECRET',
    'CRYPT_SECRET_KEY',
    'CORS_ORIGINS',

    'WEB_OAUTH_CALLBACK_URL',
    'MOBILE_OAUTH_CALLBACK_URL',

    'MONGO_URI',
    'MONGO_DATABASE',

    'JWT_ACCESS_TOKEN_SECRET',
    'JWT_REFRESH_TOKEN_SECRET',
    'JWT_STATE_TOKEN_SECRET',

    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',

    'DISCORD_CLIENT_ID',
    'DISCORD_CLIENT_SECRET',
    'DISCORD_BOT_TOKEN',

    'SPOTIFY_CLIENT_ID',
    'SPOTIFY_CLIENT_SECRET',

    'DROPBOX_CLIENT_ID',
    'DROPBOX_CLIENT_SECRET',

    'UNSPLASH_CLIENT_ID',

    'TWITCH_CLIENT_ID',
    'TWITCH_CLIENT_SECRET',
    'TWITCH_WEBHOOK_SECRET',
  ];

  // Validate existence
  for (const key of requiredVars) {
    getEnv(key);
  }

  // Validate and get PORT
  const port = validatePort();

  return {
    NODE_ENV: process.env.NODE_ENV!,
    PORT: port,
    BASE_API_URL: process.env.BASE_API_URL!,
    ADMIN_SECRET: process.env.ADMIN_SECRET!,
    CRYPT_SECRET_KEY: process.env.CRYPT_SECRET_KEY!,
    CORS_ORIGINS: process.env.CORS_ORIGINS!,
    WEB_OAUTH_CALLBACK_URL: process.env.WEB_OAUTH_CALLBACK_URL!,
    MOBILE_OAUTH_CALLBACK_URL: process.env.MOBILE_OAUTH_CALLBACK_URL!,
    MONGO_URI: process.env.MONGO_URI!,
    MONGO_DATABASE: process.env.MONGO_DATABASE!,
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
    JWT_STATE_TOKEN_SECRET: process.env.JWT_STATE_TOKEN_SECRET!,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID!,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID!,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET!,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN!,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID!,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET!,
    DROPBOX_CLIENT_ID: process.env.DROPBOX_CLIENT_ID!,
    DROPBOX_CLIENT_SECRET: process.env.DROPBOX_CLIENT_SECRET!,
    UNSPLASH_CLIENT_ID: process.env.UNSPLASH_CLIENT_ID!,
    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID!,
    TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET!,
    TWITCH_WEBHOOK_SECRET: process.env.TWITCH_WEBHOOK_SECRET!,
  };
};

// Singleton environment cache
let _environment: Environment | null = null;

/**
 * Initialize the environment configuration.
 * Must be called once at application startup before accessing environment.
 * @returns The validated Environment object
 */
export const initEnvironment = (): Environment => {
  if (_environment === null) {
    _environment = loadEnvironment();
  }
  return _environment;
};

/**
 * Get the environment configuration.
 * @throws Error if initEnvironment() has not been called
 * @returns The Environment object
 */
export const getEnvironment = (): Environment => {
  if (_environment === null) {
    throw new Error('Environment not initialized. Call initEnvironment() first.');
  }
  return _environment;
};

/**
 * Reset the environment cache (for testing purposes only)
 */
export const resetEnvironmentCache = (): void => {
  _environment = null;
};

// For backward compatibility - export environment getter as property
// This will throw if initEnvironment() hasn't been called
export const environment = new Proxy({} as Environment, {
  get(_target, prop) {
    return getEnvironment()[prop as keyof Environment];
  },
});
