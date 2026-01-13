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
}

const variables: Record<string, string | undefined> = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  BASE_API_URL: process.env.BASE_API_URL,

  ADMIN_SECRET: process.env.ADMIN_SECRET,
  CRYPT_SECRET_KEY: process.env.CRYPT_SECRET_KEY,
  CORS_ORIGINS: process.env.CORS_ORIGINS,

  WEB_OAUTH_CALLBACK_URL: process.env.WEB_OAUTH_CALLBACK_URL,
  MOBILE_OAUTH_CALLBACK_URL: process.env.MOBILE_OAUTH_CALLBACK_URL,

  MONGO_URI: process.env.MONGO_URI,
  MONGO_DATABASE: process.env.MONGO_DATABASE,

  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_STATE_TOKEN_SECRET: process.env.JWT_STATE_TOKEN_SECRET,

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,

  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,

  DROPBOX_CLIENT_ID: process.env.DROPBOX_CLIENT_ID,
  DROPBOX_CLIENT_SECRET: process.env.DROPBOX_CLIENT_SECRET,

  UNSPLASH_CLIENT_ID: process.env.UNSPLASH_CLIENT_ID,

  TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
};

for (const [key, value] of Object.entries(variables)) {
  if (value === undefined) {
    console.error(`\r\x1b[31mError:\x1b[0m Variable ${key} is not defined`);
    process.exit(1);
  }
  if (value === '') {
    console.error(`\r\x1b[31mError:\x1b[0m Variable ${key} is empty`);
    process.exit(1);
  }
}

const port = Number(variables.PORT);

if (Number.isNaN(port)) {
  console.error('\r\x1b[31mError:\x1b[0m Variable PORT is not a number');
  process.exit(1);
}

export const environment: Environment = {
  PORT: port,
  NODE_ENV: process.env.NODE_ENV as string,
  BASE_API_URL: process.env.BASE_API_URL as string,

  ADMIN_SECRET: process.env.ADMIN_SECRET as string,
  CRYPT_SECRET_KEY: process.env.CRYPT_SECRET_KEY as string,
  CORS_ORIGINS: process.env.CORS_ORIGINS as string,

  WEB_OAUTH_CALLBACK_URL: process.env.WEB_OAUTH_CALLBACK_URL as string,
  MOBILE_OAUTH_CALLBACK_URL: process.env.MOBILE_OAUTH_CALLBACK_URL as string,

  MONGO_URI: process.env.MONGO_URI as string,
  MONGO_DATABASE: process.env.MONGO_DATABASE as string,

  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
  JWT_STATE_TOKEN_SECRET: process.env.JWT_STATE_TOKEN_SECRET as string,

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID as string,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET as string,

  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID as string,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET as string,
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN as string,

  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID as string,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET as string,

  DROPBOX_CLIENT_ID: process.env.DROPBOX_CLIENT_ID as string,
  DROPBOX_CLIENT_SECRET: process.env.DROPBOX_CLIENT_SECRET as string,

  UNSPLASH_CLIENT_ID: process.env.UNSPLASH_CLIENT_ID as string,

  TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID as string,
  TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET as string,
};
