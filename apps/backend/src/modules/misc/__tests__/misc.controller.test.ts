import type { FastifyReply, FastifyRequest } from 'fastify';
import { MiscController } from '../misc.controller';

describe('MiscController', () => {
  let controller: MiscController;
  let request: Partial<FastifyRequest>;
  let reply: Partial<FastifyReply>;

  beforeEach(() => {
    controller = new MiscController();
    request = {};
    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe('uptime', () => {
    it('should send uptime response', () => {
      const mockUptime = 100;
      jest.spyOn(process, 'uptime').mockReturnValue(mockUptime);

      controller.uptime(request as FastifyRequest, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({
        uptime: mockUptime,
      });
    });
  });
});
