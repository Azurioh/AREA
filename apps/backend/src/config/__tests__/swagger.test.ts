import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import { setupSwagger } from '../swagger';

jest.mock('@/utils/environment', () => ({
  environment: {
    BASE_API_URL: 'http://localhost:3000',
    NODE_ENV: 'development',
  },
}));

describe('setupSwagger', () => {
  let mockApp: FastifyInstance;

  beforeEach(() => {
    mockApp = {
      register: jest.fn(),
    } as unknown as FastifyInstance;
  });

  it('should register swagger in development environment', () => {
    setupSwagger(mockApp);
    expect(mockApp.register).toHaveBeenCalledTimes(2);
    expect(mockApp.register).toHaveBeenCalledWith(fastifySwagger, expect.any(Object));
    expect(mockApp.register).toHaveBeenCalledWith(
      fastifySwaggerUi,
      expect.objectContaining({
        transformSpecification: expect.any(Function),
      }),
    );

    const swaggerUiOptions = (mockApp.register as jest.Mock).mock.calls[1][1];
    const transformSpec = swaggerUiOptions.transformSpecification;
    const obj = { swagger: '2.0' };
    expect(transformSpec(obj)).toBe(obj);
  });

  it('should NOT register swagger in non-development environment', () => {
    jest.resetModules();
    jest.doMock('@/utils/environment', () => ({
      environment: {
        BASE_API_URL: 'http://localhost:3000',
        NODE_ENV: 'production',
      },
    }));
    const { setupSwagger: setupSwaggerProd } = require('../swagger');

    setupSwaggerProd(mockApp);

    expect(mockApp.register).not.toHaveBeenCalled();
  });
});
