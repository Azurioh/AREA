import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AboutService } from './about.service';

/**
 * @class AboutController
 * @description Controller responsible for handling requests related to the "About" information of the application.
 */
export class AboutController {
  private readonly service: AboutService;

  constructor(service: AboutService) {
    this.service = service;
  }

  /**
   * @function getAboutFile
   * @description Handles GET requests to retrieve the "About" information, including client IP, server time, and available services.
   *
   * @param {FastifyRequest} request - The incoming request object.
   * @param {FastifyReply} reply - The reply object used to send responses.
   */
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
