import { type FastifyInstance, fastify } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { setupCookie } from './config/cookie';
import { setupCors } from './config/cors';
import { setupErrorHandler } from './config/error-handler';
import { setupMongoDB } from './config/mongo';
import { setupNotFoundHandler } from './config/not-found';
import { setupSwagger } from './config/swagger';
import { setupZod } from './config/zod';
import { authRoutes } from './modules/auth';
import { usersRoutes } from './modules/users';
import { githubRoutes } from './modules/github';

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

  app.withTypeProvider<ZodTypeProvider>().register(githubRoutes, { prefix: '/github' });
  app.withTypeProvider<ZodTypeProvider>().register(authRoutes, { prefix: '/auth' });
  app.withTypeProvider<ZodTypeProvider>().register(usersRoutes, { prefix: '/users' });

  return app;
}

export default build;
