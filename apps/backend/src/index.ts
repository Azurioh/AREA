/// <reference path="./types/fastify.d.ts" />
import { initEnvironment } from '@/utils/environment';
import build from './app';

/**
 * @function start
 *
 * @description Starts the server.
 */
async function start(): Promise<void> {
  const environment = initEnvironment();

  const app = await build();

  await app.listen({ port: environment.PORT, host: '0.0.0.0' });
}

start();
