import { HttpStatusCode } from '@area/shared/enums/http-status';
import fastifyMongo from '@fastify/mongodb';
import type { FastifyInstance } from 'fastify';
import { setupMongoDB } from '../mongo';

jest.mock('@/utils/environment', () => ({
  environment: {
    MONGO_URI: 'mongodb://localhost:27017/test',
    MONGO_DATABASE: 'test_db',
  },
}));

describe('setupMongoDB', () => {
  let mockApp: FastifyInstance;
  let preHandler: any;

  beforeEach(() => {
    mockApp = {
      register: jest.fn(),
      addHook: jest.fn((hook, handler) => {
        if (hook === 'preHandler') preHandler = handler;
      }),
      mongo: { db: {}, client: {} },
    } as unknown as FastifyInstance;
  });

  it('should register fastifyMongo with correct options', async () => {
    await setupMongoDB(mockApp);

    expect(mockApp.register).toHaveBeenCalledWith(fastifyMongo, {
      forceClose: true,
      url: 'mongodb://localhost:27017/test',
      database: 'test_db',
    });
  });

  it('should add preHandler hook', async () => {
    await setupMongoDB(mockApp);
    expect(mockApp.addHook).toHaveBeenCalledWith('preHandler', expect.any(Function));
  });

  it('should throw error in preHandler if mongo is not initialized', async () => {
    await setupMongoDB(mockApp);
    const mockRequest: any = {};

    (mockApp as any).mongo = undefined;

    await expect(preHandler(mockRequest, {} as any)).rejects.toMatchObject({
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: 'MongoDB client or database not found',
    });
  });

  it('should attach db to request in preHandler', async () => {
    await setupMongoDB(mockApp);
    const mockRequest: any = {};
    const mockDb = { name: 'test_db' };
    (mockApp as any).mongo = { client: {}, db: mockDb };

    await preHandler(mockRequest, {} as any);

    expect(mockRequest.db).toBe(mockDb);
  });
});
