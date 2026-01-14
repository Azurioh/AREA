import type { FastifyReply, FastifyRequest } from 'fastify';
import { ServicesController } from '../services.controller';
import { ServicesService } from '../services.service';

jest.mock('../services.service');

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: jest.Mocked<ServicesService>;
  let request: Partial<FastifyRequest>;
  let reply: Partial<FastifyReply>;

  beforeEach(() => {
    service = new ServicesService() as jest.Mocked<ServicesService>;
    controller = new ServicesController(service);

    request = {
      params: {},
      user: { _id: 'user-id' } as any,
    };

    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe('getServiceActions', () => {
    it('should get service actions and send response', async () => {
      request.params = { service: 'test-service' };
      const mockActions = [{ name: 'action1', description: 'desc1' }];
      service.getServiceActions.mockResolvedValue(mockActions);

      await controller.getServiceActions(request as FastifyRequest<any>, reply as FastifyReply);

      expect(service.getServiceActions).toHaveBeenCalledWith('test-service');
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(mockActions);
    });
  });

  describe('getActionDetails', () => {
    it('should get action details and send response', async () => {
      request.params = { service: 'test-service', action: 'test-action' };
      const mockDetails = { name: 'test-action', description: 'desc' };
      service.getActionDetails.mockResolvedValue(mockDetails);

      await controller.getActionDetails(request as FastifyRequest<any>, reply as FastifyReply);

      expect(service.getActionDetails).toHaveBeenCalledWith('test-service', 'test-action', 'user-id');
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(mockDetails);
    });

    it('should use empty user id if not present', async () => {
      request.params = { service: 'test-service', action: 'test-action' };
      request.user = undefined;
      const mockDetails = { name: 'test-action', description: 'desc' };
      service.getActionDetails.mockResolvedValue(mockDetails);

      await controller.getActionDetails(request as FastifyRequest<any>, reply as FastifyReply);

      expect(service.getActionDetails).toHaveBeenCalledWith('test-service', 'test-action', '');
    });
  });

  describe('getActionReturnedValues', () => {
    it('should get action returned values and send response', async () => {
      request.params = { service: 'test-service', action: 'test-action' };
      const mockValues = [{ key: 'k', description: 'd', type: 't' }];
      service.getActionReturnedValues.mockResolvedValue(mockValues);

      await controller.getActionReturnedValues(request as FastifyRequest<any>, reply as FastifyReply);

      expect(service.getActionReturnedValues).toHaveBeenCalledWith('test-service', 'test-action');
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(mockValues);
    });
  });

  describe('getServiceReactions', () => {
    it('should get service reactions and send response', async () => {
      request.params = { service: 'test-service' };
      const mockReactions = [{ name: 'reaction1', description: 'desc1' }];
      service.getServiceReactions.mockResolvedValue(mockReactions);

      await controller.getServiceReactions(request as FastifyRequest<any>, reply as FastifyReply);

      expect(service.getServiceReactions).toHaveBeenCalledWith('test-service');
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(mockReactions);
    });
  });

  describe('getReactionDetails', () => {
    it('should get reaction details and send response', async () => {
      request.params = { service: 'test-service', reaction: 'test-reaction' };
      const mockDetails = { name: 'test-reaction', description: 'desc', key: 'k', inputs: {} };
      service.getReactionDetails.mockResolvedValue(mockDetails);

      await controller.getReactionDetails(request as FastifyRequest<any>, reply as FastifyReply);

      expect(service.getReactionDetails).toHaveBeenCalledWith('test-service', 'test-reaction', 'user-id');
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(mockDetails);
    });

    it('should use empty user id if not present', async () => {
      request.params = { service: 'test-service', reaction: 'test-reaction' };
      request.user = undefined;
      const mockDetails = { name: 'test-reaction', description: 'desc', key: 'k', inputs: {} };
      service.getReactionDetails.mockResolvedValue(mockDetails);

      await controller.getReactionDetails(request as FastifyRequest<any>, reply as FastifyReply);

      expect(service.getReactionDetails).toHaveBeenCalledWith('test-service', 'test-reaction', '');
    });
  });
});
