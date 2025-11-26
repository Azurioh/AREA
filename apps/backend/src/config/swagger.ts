import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import { environment } from '@/utils/environment';

export const setupSwagger = (app: FastifyInstance): void => {
  const apibaseUrl: string = environment.BASE_API_URL;

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'AREA API',
        description: 'Official documentation for the AREA API',
        version: '0.0.1',
      },
      servers: [{ url: apibaseUrl }],
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    staticCSP: true,
    transformSpecification: (swaggerObject) => swaggerObject,
  });
};
