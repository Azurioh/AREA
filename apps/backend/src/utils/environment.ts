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
  CRYPT_SECRET_KEY: string;
  FRONTEND_AUTHORIZE_CALLBACK_URL: string;
  MONGO_URI: string;
  MONGO_DATABASE: string;
  GITHUB_TOKEN: string;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_STATE_TOKEN_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  DISCORD_BOT_TOKEN: string;
}

const variables: Record<string, string | undefined> = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  BASE_API_URL: process.env.BASE_API_URL,
  MONGO_URI: process.env.MONGO_URI,
  MONGO_DATABASE: process.env.MONGO_DATABASE,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
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
  CRYPT_SECRET_KEY: process.env.CRYPT_SECRET_KEY as string,
  FRONTEND_AUTHORIZE_CALLBACK_URL: process.env.FRONTEND_AUTHORIZE_CALLBACK_URL as string,
  MONGO_URI: process.env.MONGO_URI as string,
  MONGO_DATABASE: process.env.MONGO_DATABASE as string,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN as string,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
  JWT_STATE_TOKEN_SECRET: process.env.JWT_STATE_TOKEN_SECRET as string,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID as string,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET as string,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID as string,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET as string,
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN as string
};
