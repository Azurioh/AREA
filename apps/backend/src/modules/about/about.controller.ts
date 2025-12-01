import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AboutService } from './about.service';

export class AboutController {
  private readonly service: AboutService;

  constructor(service: AboutService) {
    this.service = service;
  }

  async getAboutFile(request: FastifyRequest, reply: FastifyReply) {
    const userIp = request.ip;
    const serverTime = this.service.getCurrentTime();
    const services = this.service.getServices();

    reply.status(200).send({
      client: { host: userIp },
      server: {
        current_time: serverTime,
        services,
      },
    });
  }
}
