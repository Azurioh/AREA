import type { FastifyInstance } from 'fastify';

jest.mock('@/utils/environment', () => ({
  environment: {
    CORS_ORIGINS: 'http://localhost:3000,http://example.com',
  },
}));

describe('setupCors', () => {
  let mockApp: FastifyInstance;

  beforeEach(() => {
    jest.resetModules();
    mockApp = {
      register: jest.fn(),
    } as unknown as FastifyInstance;
  });

  it('should register fastifyCors with correct options', () => {
    const { setupCors } = require('../cors');
    setupCors(mockApp);

    expect(mockApp.register).toHaveBeenCalledWith(expect.any(Function), {
      origin: ['http://localhost:3000', 'http://example.com'],
      credentials: true,
      methods: 'GET, POST, PUT, DELETE, PATCH',
    });
  });

  it('should handle undefined CORS_ORIGINS', () => {
    jest.resetModules();
    jest.doMock('@/utils/environment', () => ({
      environment: {
        CORS_ORIGINS: undefined,
      },
    }));

    const { setupCors } = require('../cors');
    setupCors(mockApp);

    expect(mockApp.register).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        origin: [],
      }),
    );
  });
});
