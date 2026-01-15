import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import ApiError from '@/utils/api-error';
import { setupErrorHandler } from '../error-handler';

jest.mock('@/utils/environment', () => ({
  environment: {
    NODE_ENV: 'test',
  },
}));

describe('setupErrorHandler', () => {
  let mockApp: FastifyInstance;
  let errorHandler: any;

  beforeEach(() => {
    mockApp = {
      setErrorHandler: jest.fn((handler) => {
        errorHandler = handler;
      }),
    } as unknown as FastifyInstance;
  });

  it('should set the error handler', () => {
    setupErrorHandler(mockApp);
    expect(mockApp.setErrorHandler).toHaveBeenCalled();
  });

  it('should handle ApiError', () => {
    setupErrorHandler(mockApp);
    const error = new ApiError(HttpStatusCode.FORBIDDEN, 'Forbidden access');
    const mockReply = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    errorHandler(error, {}, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.FORBIDDEN);
    expect(mockReply.send).toHaveBeenCalledWith({ data: 'Forbidden access' });
  });

  it('should handle ZodError', () => {
    setupErrorHandler(mockApp);
    const error = new ZodError([]);
    const mockReply = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    errorHandler(error, {}, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.BAD_REQUEST);
  });

  it('should handle Generic Error in development/test', () => {
    setupErrorHandler(mockApp);
    const error = new Error('Something went wrong');
    const mockReply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    errorHandler(error, {}, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({ data: 'Something went wrong' }));
    expect(consoleSpy).toHaveBeenCalledWith(error);

    consoleSpy.mockRestore();
  });

  it('should handle unknown error (non-Error object)', () => {
    setupErrorHandler(mockApp);
    const error = 'Just a string error';
    const mockReply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    errorHandler(error, {}, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(mockReply.send).toHaveBeenCalledWith({ data: 'An unknown error occurred, please contact administrator.' });
    expect(consoleSpy).toHaveBeenCalledWith(error);

    consoleSpy.mockRestore();
  });

  it('should handle Generic Error in development (with stack)', () => {
    jest.resetModules();
    jest.doMock('@/utils/environment', () => ({
      environment: {
        NODE_ENV: 'development',
      },
    }));

    const { setupErrorHandler: setupErrorHandlerDev } = require('../error-handler');

    setupErrorHandlerDev(mockApp);
    const error = new Error('Dev Error');
    error.stack = 'Error stack trace';

    const mockReply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const handler = (mockApp.setErrorHandler as jest.Mock).mock.calls[0][0];

    handler(error, {}, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(mockReply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        data: 'Dev Error',
        stack: 'Error stack trace',
      }),
    );
    expect(consoleSpy).toHaveBeenCalledWith(error);

    consoleSpy.mockRestore();
  });

  it('should NOT log Generic Error in production', () => {
    jest.resetModules();
    jest.doMock('@/utils/environment', () => ({
      environment: {
        NODE_ENV: 'production',
      },
    }));

    const { setupErrorHandler: setupErrorHandlerProd } = require('../error-handler');

    setupErrorHandlerProd(mockApp);
    const error = new Error('Prod Error');
    const mockReply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const handler = (mockApp.setErrorHandler as jest.Mock).mock.calls[0][0];

    handler(error, {}, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(mockReply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        data: 'Prod Error',
      }),
    );
    expect(mockReply.send).not.toHaveBeenCalledWith(
      expect.objectContaining({
        stack: expect.anything(),
      }),
    );
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
