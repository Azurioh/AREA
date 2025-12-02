import { type FastifyInstance, fastify } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { githubService, serviceManager } from '@/integrations';
import { setupCookie } from './config/cookie';
import { setupCors } from './config/cors';
import { setupErrorHandler } from './config/error-handler';
import { setupMongoDB } from './config/mongo';
import { setupNotFoundHandler } from './config/not-found';
import { setupSwagger } from './config/swagger';
import { setupZod } from './config/zod';
import { aboutRoutes } from './modules/about';
import { authRoutes } from './modules/auth';
import { discordRoutes } from './modules/discord';
import { githubRoutes } from './modules/github';
import { servicesRoutes } from './modules/services';
import { usersRoutes } from './modules/users';

const registerServices = () => {
  serviceManager.register(githubService);
};

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

  registerServices();

  app.withTypeProvider<ZodTypeProvider>().register(aboutRoutes);
  app.withTypeProvider<ZodTypeProvider>().register(githubRoutes, { prefix: '/github' });
  app.withTypeProvider<ZodTypeProvider>().register(discordRoutes, { prefix: '/discord' });
  app.withTypeProvider<ZodTypeProvider>().register(authRoutes, { prefix: '/auth' });
  app.withTypeProvider<ZodTypeProvider>().register(usersRoutes, { prefix: '/users' });
  app.withTypeProvider<ZodTypeProvider>().register(servicesRoutes, { prefix: '/services' });

  return app;
}

export default build;
