import { type FastifyInstance, fastify } from 'fastify';
import { setupCors } from './config/cors';
import { setupErrorHandler } from './config/error-handler';
import { setupMongoDB } from './config/mongo';
import { setupNotFoundHandler } from './config/not-found';
import { setupSwagger } from './config/swagger';
import { router } from './routes';

async function build(): Promise<FastifyInstance> {
  const app: FastifyInstance = fastify({
    logger: true,
    bodyLimit: 10 * 1024 * 1024,
    ignoreTrailingSlash: true,
  });

  setupCors(app);
  setupSwagger(app);
  setupMongoDB(app);
  setupNotFoundHandler(app);
  setupErrorHandler(app);

  app.register(router);

  return app;
}

export default build;
