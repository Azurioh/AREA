import type { FastifyReply, FastifyRequest } from 'fastify';

/**
 * @class MiscController
 * @description Controller for miscellaneous endpoints.
 */
export class MiscController {
  /**
   * @function uptime
   * @description Returns the uptime of the server.
   *
   * @param _ The request object (not used).
   * @param reply The reply object used to send the response.
   */
  uptime(_: FastifyRequest, reply: FastifyReply) {
    reply.status(200).send({
      uptime: process.uptime(),
    });
  }
}
