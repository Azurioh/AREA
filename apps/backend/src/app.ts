import { type FastifyInstance, fastify } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { setupCors } from './config/cors';
import { setupErrorHandler } from './config/error-handler';
import { setupMongoDB } from './config/mongo';
import { setupNotFoundHandler } from './config/not-found';
import { setupSwagger } from './config/swagger';
import { setupZod } from './config/zod';
import { router } from './routes';
import { setupCookie } from './config/cookie';

async function build(): Promise<FastifyInstance> {
  const app: FastifyInstance = fastify({
    logger: true,
    bodyLimit: 10 * 1024 * 1024,
    ignoreTrailingSlash: true,
  });

  setupCors(app);
  setupCookie(app);
  setupSwagger(app);
  setupMongoDB(app);
  setupNotFoundHandler(app);
  setupErrorHandler(app);
  setupZod(app);

  app.withTypeProvider<ZodTypeProvider>().register(router);

  return app;
}

export default build;
