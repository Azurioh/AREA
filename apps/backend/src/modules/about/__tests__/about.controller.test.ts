import type { FastifyReply, FastifyRequest } from 'fastify';
import { AboutController } from '../about.controller';
import { AboutService } from '../about.service';

jest.mock('../about.service');

describe('AboutController', () => {
  let controller: AboutController;
  let service: jest.Mocked<AboutService>;
  let request: Partial<FastifyRequest>;
  let reply: Partial<FastifyReply>;

  beforeEach(() => {
    service = new AboutService() as jest.Mocked<AboutService>;
    controller = new AboutController(service);

    request = {
      ip: '127.0.0.1',
    };

    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe('getAboutFile', () => {
    it('should send correct response structure', async () => {
      const mockTime = 1234567890;
      const mockServices = [
        {
          name: 'test-service',
          actions: [{ name: 'test-action', description: 'desc' }],
          reactions: [{ name: 'test-reaction', description: 'desc' }],
        },
      ];

      service.getCurrentTime.mockReturnValue(mockTime);
      service.getServices.mockReturnValue(mockServices);

      await controller.getAboutFile(request as FastifyRequest, reply as FastifyReply);

      expect(service.getCurrentTime).toHaveBeenCalled();
      expect(service.getServices).toHaveBeenCalled();
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({
        client: {
          host: '127.0.0.1',
        },
        server: {
          current_time: mockTime,
          services: mockServices,
        },
      });
    });
  });
});
