import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { FastifyInstance } from 'fastify';
import { setupNotFoundHandler } from '../not-found';

describe('setupNotFoundHandler', () => {
  let mockApp: FastifyInstance;
  let notFoundHandler: any;

  beforeEach(() => {
    mockApp = {
      setNotFoundHandler: jest.fn((handler) => {
        notFoundHandler = handler;
      }),
    } as unknown as FastifyInstance;
  });

  it('should set the not found handler', () => {
    setupNotFoundHandler(mockApp);
    expect(mockApp.setNotFoundHandler).toHaveBeenCalled();
  });

  it('should return 404 with correct message', () => {
    setupNotFoundHandler(mockApp);

    const mockRequest = { url: '/unknown-route' };
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    notFoundHandler(mockRequest, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
    expect(mockReply.send).toHaveBeenCalledWith({
      data: "The resource /unknown-route doesn't exist",
    });
  });
});
