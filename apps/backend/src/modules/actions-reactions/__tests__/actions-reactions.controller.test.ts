import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ActionsReactionsController } from '../actions-reactions.controller';
import type { ActionsReactionsService } from '../actions-reactions.service';

describe('ActionsReactionsController', () => {
  let controller: ActionsReactionsController;
  let mockService: jest.Mocked<ActionsReactionsService>;
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockService = {
      createActionReaction: jest.fn().mockResolvedValue(undefined),
      getMeActionsReactions: jest.fn().mockResolvedValue([]),
      updateActionReactionExecutionStateById: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<ActionsReactionsService>;

    controller = new ActionsReactionsController(mockService);

    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      user: { _id: 'user-123' },
    } as Partial<FastifyRequest>;
  });

  describe('createActionReaction', () => {
    it('should create action reaction and return NO_CONTENT', async () => {
      const action = { service: 'github', type: 'star_repo', params: {} };
      const reaction = { service: 'discord', type: 'send_message', params: {} };
      mockRequest.body = { action, reaction };

      await controller.createActionReaction(
        mockRequest as FastifyRequest<{ Body: { action: typeof action; reaction: typeof reaction } }>,
        mockReply as FastifyReply,
      );

      expect(mockService.createActionReaction).toHaveBeenCalledWith('user-123', action, reaction);
      expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.NO_CONTENT);
      expect(mockReply.send).toHaveBeenCalled();
    });
  });

  describe('getMeActionsReactions', () => {
    it('should return user actions reactions', async () => {
      const mockActionsReactions = [{ _id: '1', action: {}, reaction: {}, numberOfExecution: 0, executionState: true }];
      mockService.getMeActionsReactions.mockResolvedValue(mockActionsReactions as any);

      await controller.getMeActionsReactions(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockService.getMeActionsReactions).toHaveBeenCalledWith('user-123');
      expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockActionsReactions);
    });
  });

  describe('updateActionReactionExecutionStateById', () => {
    it('should update execution state and return NO_CONTENT', async () => {
      mockRequest.params = { id: 'action-123' };
      mockRequest.body = { executionState: false };

      await controller.updateActionReactionExecutionStateById(
        mockRequest as FastifyRequest<{
          Params: { id: string };
          Body: { executionState: boolean };
        }>,
        mockReply as FastifyReply,
      );

      expect(mockService.updateActionReactionExecutionStateById).toHaveBeenCalledWith('action-123', false);
      expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.NO_CONTENT);
      expect(mockReply.send).toHaveBeenCalled();
    });
  });
});
