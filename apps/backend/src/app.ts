import { type FastifyInstance, fastify } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { setupCookie } from './config/cookie';
import { setupCors } from './config/cors';
import { setupDiscordBot } from './config/discord-bot';
import { setupErrorHandler } from './config/error-handler';
import { setupMongoDB } from './config/mongo';
import { setupNotFoundHandler } from './config/not-found';
import { setupStaticFiles } from './config/static-files';
import { setupSwagger } from './config/swagger';
import { setupZod } from './config/zod';
import { aboutRoutes } from './modules/about';
import { actionsReactionsRoute } from './modules/actions-reactions';
import { authRoutes } from './modules/auth';
import { servicesRoutes } from './modules/services';
import thirdPartiesRoute from './modules/third-parties/third-parties.route';
import { usersRoutes } from './modules/users';
import { webhookRoutes } from './modules/webhook';

async function build(): Promise<FastifyInstance> {
  const app: FastifyInstance = fastify({
    logger: true,
    bodyLimit: 10 * 1024 * 1024,
    ignoreTrailingSlash: true,
  });

  setupCors(app);
  setupCookie(app);
  setupSwagger(app);
  await setupMongoDB(app);
  setupNotFoundHandler(app);
  setupErrorHandler(app);
  setupZod(app);
  await setupDiscordBot();
  setupStaticFiles(app);

  app.withTypeProvider<ZodTypeProvider>().register(aboutRoutes);
  app.withTypeProvider<ZodTypeProvider>().register(thirdPartiesRoute, { prefix: '/third-parties' });
  app.withTypeProvider<ZodTypeProvider>().register(webhookRoutes, { prefix: '/webhook' });
  app.withTypeProvider<ZodTypeProvider>().register(authRoutes, { prefix: '/auth' });
  app.withTypeProvider<ZodTypeProvider>().register(usersRoutes, { prefix: '/users' });
  app.withTypeProvider<ZodTypeProvider>().register(actionsReactionsRoute, { prefix: '/actions-reactions' });
  app.withTypeProvider<ZodTypeProvider>().register(servicesRoutes, { prefix: '/services' });

  return app;
}

export default build;
