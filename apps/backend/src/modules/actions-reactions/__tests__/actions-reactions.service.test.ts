import { ObjectId } from 'mongodb';
import { ServiceManager } from '@/integrations';
import type { DiscordService } from '@/modules/discord';
import type { DropboxService } from '@/modules/dropbox';
import type { GithubService } from '@/modules/github';
import type { SpotifyService } from '@/modules/spotify';
import type { TwitchService } from '@/modules/twitch/twitch.service';
import type { UnsplashService } from '@/modules/unsplash';
import ApiError from '@/utils/api-error';
import type { ActionsReactionsRepository } from '../actions-reactions.repository';
import { ActionsReactionsService } from '../actions-reactions.service';
import type { NasaService } from '@/modules/nasa/nasa.service';

describe('ActionsReactionsService', () => {
  let service: ActionsReactionsService;
  let mockRepository: jest.Mocked<ActionsReactionsRepository>;
  let mockGithubService: jest.Mocked<GithubService>;
  let mockDiscordService: jest.Mocked<DiscordService>;
  let mockSpotifyService: jest.Mocked<SpotifyService>;
  let mockUnsplashService: jest.Mocked<UnsplashService>;
  let mockDropboxService: jest.Mocked<DropboxService>;
  let mockTwitchService: jest.Mocked<TwitchService>;
  let mockNasaService: jest.Mocked<NasaService>;

  beforeEach(() => {
    mockRepository = {
      createActionReaction: jest.fn().mockResolvedValue(true),
      getActionsReactionsByTrigger: jest.fn().mockResolvedValue([]),
      getMeActionsReactions: jest.fn().mockResolvedValue([]),
      incrementActionReactionExecution: jest.fn().mockResolvedValue(undefined),
      updateActionReactionExecutionStateById: jest.fn().mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
      }),
    } as unknown as jest.Mocked<ActionsReactionsRepository>;

    mockGithubService = {
      createAction: jest.fn().mockResolvedValue('github/trigger/123'),
      createReaction: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<GithubService>;

    mockDiscordService = {
      createAction: jest.fn().mockResolvedValue('discord/trigger/456'),
      createReaction: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<DiscordService>;

    mockSpotifyService = {
      createAction: jest.fn().mockResolvedValue('spotify/trigger/789'),
      createReaction: jest.fn().mockResolvedValue(true),
      deleteAction: jest.fn(),
    } as unknown as jest.Mocked<SpotifyService>;

    mockUnsplashService = {
      createAction: jest.fn().mockResolvedValue('unsplash/trigger/abc'),
      deleteAction: jest.fn(),
    } as unknown as jest.Mocked<UnsplashService>;

    mockDropboxService = {
      createAction: jest.fn().mockResolvedValue('dropbox/trigger/def'),
      actionReception: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<DropboxService>;

    mockTwitchService = {
      createAction: jest.fn().mockResolvedValue('twitch/trigger/789'),
      createReaction: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<TwitchService>;

    mockNasaService = {
      createAction: jest.fn().mockResolvedValue('nasa/789'),
    } as unknown as jest.Mocked<NasaService>;

    jest.spyOn(ServiceManager.instance, 'get').mockImplementation((serviceName) => {
      if (serviceName === 'github')
        return {
          name: 'github',
          actions: [{ name: 'star_repo', params: [] }],
          reactions: [],
        };
      if (serviceName === 'discord')
        return {
          name: 'discord',
          actions: [],
          reactions: [{ name: 'send_message', params: [] }],
        };
      if (serviceName === 'unsplash')
        return { name: 'unsplash', actions: [{ name: 'random', params: [] }], reactions: [] };
      if (serviceName === 'dropbox')
        return { name: 'dropbox', actions: [{ name: 'upload_file', params: [] }], reactions: [] };
      if (serviceName === 'twitch')
        return { name: 'twitch', actions: [{ name: 'stream_online', params: [] }], reactions: [] };
      if (serviceName === 'spotify')
        return { name: 'spotify', actions: [{ name: 'listening_to_artist', params: [] }], reactions: [] };

      return undefined;
    });

    service = new ActionsReactionsService(
      mockRepository,
      mockGithubService,
      mockDiscordService,
      mockSpotifyService,
      mockUnsplashService,
      mockDropboxService,
      mockTwitchService,
      mockNasaService,
    );
  });

  describe('handleActions', () => {
    it('should call github service for github actions', async () => {
      const action = { service: 'github', type: 'star_repo', params: {} };
      const actionReactionId = 'action-reaction-123';
      const result = await service.handleActions(actionReactionId, 'user-123', action);

      expect(mockGithubService.createAction).toHaveBeenCalledWith(actionReactionId, 'user-123', action);
      expect(result).toBe('github/trigger/123');
    });

    it('should call discord service for discord actions', async () => {
      const action = { service: 'discord', type: 'message', params: {} };
      const actionReactionId = 'action-reaction-123';
      const result = await service.handleActions(actionReactionId, 'user-123', action);

      expect(mockDiscordService.createAction).toHaveBeenCalledWith(actionReactionId, 'user-123', action);
      expect(result).toBe('discord/trigger/456');
    });

    it('should call spotify service for spotify actions', async () => {
      const action = { service: 'spotify', type: 'play', params: {} };
      const actionReactionId = 'action-reaction-123';
      const result = await service.handleActions(actionReactionId, 'user-123', action);

      expect(mockSpotifyService.createAction).toHaveBeenCalledWith(actionReactionId, 'user-123', action);
      expect(result).toBe('spotify/trigger/789');
    });

    it('should call twitch service for twitch actions', async () => {
      const action = { service: 'twitch', type: 'stream_online', params: {} };
      const actionReactionId = 'action-reaction-123';
      const result = await service.handleActions(actionReactionId, 'user-123', action);

      expect(mockTwitchService.createAction).toHaveBeenCalledWith(actionReactionId, 'user-123', action);
      expect(result).toBe('twitch/trigger/789');
    });
    it('should throw NOT_FOUND for unknown service', async () => {
      const action = { service: 'unknown', type: 'test', params: {} };
      const actionReactionId = 'action-reaction-123';

      await expect(service.handleActions(actionReactionId, 'user-123', action)).rejects.toThrow(
        "Requested service doesn't exist",
      );
    });
  });

  describe('handleActionReception', () => {
    it('should call handleReactions for service without reception function', async () => {
      const action = { service: 'github', trigger: 'github/trigger' };
      const spy = jest.spyOn(service, 'handleReactions').mockResolvedValue(undefined);

      await service.handleActionReception(action as any);

      expect(spy).toHaveBeenCalledWith(action);
    });

    it('should call actionReceptionFunc and process results for service with reception function', async () => {
      const action = { service: 'dropbox', trigger: 'dropbox/update' };
      const newActions = [{ service: 'dropbox', trigger: 'dropbox/file-1' }];
      mockDropboxService.actionReception.mockResolvedValue(newActions as any);
      const spy = jest.spyOn(service, 'handleReactions').mockResolvedValue(undefined);

      await service.handleActionReception(action as any);

      expect(mockDropboxService.actionReception).toHaveBeenCalledWith(action);
      expect(spy).toHaveBeenCalledWith(newActions[0]);
    });
  });

  describe('handleReactions', () => {
    it('should process reactions for matching triggers', async () => {
      const actionPayload = { trigger: 'github/trigger/123', data: {} };
      const mockActionReaction = {
        _id: new ObjectId(),
        userId: 'user-123',
        executionState: true,
        reaction: { service: 'discord', type: 'send_message', params: {} },
      };
      mockRepository.getActionsReactionsByTrigger.mockResolvedValue([mockActionReaction as any]);

      await service.handleReactions(actionPayload as any);

      expect(mockDiscordService.createReaction).toHaveBeenCalled();
      expect(mockRepository.incrementActionReactionExecution).toHaveBeenCalled();
    });

    it('should skip reactions when executionState is false', async () => {
      const actionPayload = { trigger: 'github/trigger/123', data: {} };
      const mockActionReaction = {
        _id: new ObjectId(),
        userId: 'user-123',
        executionState: false,
        reaction: { service: 'discord', type: 'send_message', params: {} },
      };
      mockRepository.getActionsReactionsByTrigger.mockResolvedValue([mockActionReaction as any]);

      await service.handleReactions(actionPayload as any);

      expect(mockDiscordService.createReaction).not.toHaveBeenCalled();
    });

    it('should skip reactions for unknown services', async () => {
      const actionPayload = { trigger: 'github/trigger/123', data: {} };
      const mockActionReaction = {
        _id: new ObjectId(),
        userId: 'user-123',
        executionState: true,
        reaction: { service: 'unknown_service', type: 'test', params: {} },
      };
      mockRepository.getActionsReactionsByTrigger.mockResolvedValue([mockActionReaction as any]);

      await service.handleReactions(actionPayload as any);

      expect(mockRepository.incrementActionReactionExecution).not.toHaveBeenCalled();
    });

    it('should not increment execution when reaction returns false', async () => {
      const actionPayload = { trigger: 'github/trigger/123', data: {} };
      const mockActionReaction = {
        _id: new ObjectId(),
        userId: 'user-123',
        executionState: true,
        reaction: { service: 'discord', type: 'send_message', params: {} },
      };
      mockRepository.getActionsReactionsByTrigger.mockResolvedValue([mockActionReaction as any]);
      mockDiscordService.createReaction.mockResolvedValue(false);

      await service.handleReactions(actionPayload as any);

      expect(mockDiscordService.createReaction).toHaveBeenCalled();
      expect(mockRepository.incrementActionReactionExecution).not.toHaveBeenCalled();
    });
  });

  describe('createActionReaction', () => {
    it('should create action reaction with trigger', async () => {
      const action = { service: 'github', name: 'star_repo', params: {} };
      const reaction = { service: 'discord', name: 'send_message', params: {} };

      await service.createActionReaction('user-123', action, reaction);

      expect(mockGithubService.createAction).toHaveBeenCalled();
      expect(mockRepository.createActionReaction).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-123',
          action,
          reaction,
          trigger: 'github/trigger/123',
          numberOfExecution: 0,
          executionState: true,
        }),
      );
    });
    it('should throw NOT_FOUND if service not found', async () => {
      const action = { service: 'unknown', name: 'test', params: {} };
      const reaction = { service: 'discord', name: 'send_message', params: {} };

      await expect(service.createActionReaction('user-123', action as any, reaction as any)).rejects.toThrow(
        'Service not found',
      );
    });

    it('should throw NOT_FOUND if action not found in service', async () => {
      const action = { service: 'github', name: 'unknown', params: {} };
      const reaction = { service: 'discord', name: 'send_message', params: {} };

      // Mock service returning valid service but no matching action
      jest.spyOn(ServiceManager.instance, 'get').mockImplementation((serviceName) => {
        if (serviceName === 'github') return { name: 'github', actions: [], reactions: [] };
        if (serviceName === 'discord') return { name: 'discord', actions: [], reactions: [] };
        return undefined;
      });

      await expect(service.createActionReaction('user-123', action as any, reaction as any)).rejects.toThrow(
        'Action not found',
      );
    });

    it('should throw NOT_FOUND if reaction not found in service', async () => {
      const action = { service: 'github', name: 'star_repo', params: {} };
      const reaction = { service: 'discord', name: 'unknown', params: {} };

      jest.spyOn(ServiceManager.instance, 'get').mockImplementation((serviceName) => {
        if (serviceName === 'github')
          return { name: 'github', actions: [{ name: 'star_repo', params: [] }], reactions: [] };
        if (serviceName === 'discord') return { name: 'discord', actions: [], reactions: [] };
        return undefined;
      });

      await expect(service.createActionReaction('user-123', action as any, reaction as any)).rejects.toThrow(
        'Reaction not found',
      );
    });

    it('should throw BAD_REQUEST if params are invalid (not object)', async () => {
      const action = { service: 'github', name: 'star_repo', params: 'invalid' };
      const reaction = { service: 'discord', name: 'send_message', params: {} };

      jest.spyOn(ServiceManager.instance, 'get').mockImplementation((serviceName) => {
        if (serviceName === 'github')
          return { name: 'github', actions: [{ name: 'star_repo', params: [] }], reactions: [] };
        if (serviceName === 'discord')
          return { name: 'discord', actions: [], reactions: [{ name: 'send_message', params: [] }] };
        return undefined;
      });

      await expect(service.createActionReaction('user-123', action as any, reaction as any)).rejects.toThrow(
        'Action is invalid',
      );
    });

    it('should throw BAD_REQUEST if param key missing', async () => {
      const action = { service: 'github', name: 'star_repo', params: {} }; // missing required param 'repo'
      const reaction = { service: 'discord', name: 'send_message', params: {} };

      jest.spyOn(ServiceManager.instance, 'get').mockImplementation((serviceName) => {
        if (serviceName === 'github')
          return {
            name: 'github',
            actions: [{ name: 'star_repo', params: [{ key: 'repo', type: 'string', label: 'Repo' }] }],
            reactions: [],
          };
        if (serviceName === 'discord')
          return { name: 'discord', actions: [], reactions: [{ name: 'send_message', params: [] }] };
        return undefined;
      });

      await expect(service.createActionReaction('user-123', action as any, reaction as any)).rejects.toThrow(
        'Action is invalid',
      );
    });

    it('should allow valid select param input', async () => {
      const action = { service: 'github', name: 'star_repo', params: { repo: { id: '1', name: 'test' } } };
      const reaction = { service: 'discord', name: 'send_message', params: {} };

      jest.spyOn(ServiceManager.instance, 'get').mockImplementation((serviceName) => {
        if (serviceName === 'github')
          return {
            name: 'github',
            actions: [{ name: 'star_repo', params: [{ key: 'repo', type: 'select', label: 'Repo', options: [] }] }],
            reactions: [],
          };
        if (serviceName === 'discord')
          return { name: 'discord', actions: [], reactions: [{ name: 'send_message', params: [] }] };
        return undefined;
      });

      await expect(service.createActionReaction('user-123', action as any, reaction as any)).resolves.not.toThrow();
    });

    it('should skip input params validation', async () => {
      const action = { service: 'github', name: 'star_repo', params: { repo: 'some input' } };
      const reaction = { service: 'discord', name: 'send_message', params: {} };

      jest.spyOn(ServiceManager.instance, 'get').mockImplementation((serviceName) => {
        if (serviceName === 'github')
          return {
            name: 'github',
            actions: [{ name: 'star_repo', params: [{ key: 'repo', type: 'input', label: 'Repo' }] }],
            reactions: [],
          };
        if (serviceName === 'discord')
          return { name: 'discord', actions: [], reactions: [{ name: 'send_message', params: [] }] };
        return undefined;
      });

      await expect(service.createActionReaction('user-123', action as any, reaction as any)).resolves.not.toThrow();
    });

    it('should throw BAD_REQUEST if select param is missing id or name', async () => {
      const action = { service: 'github', name: 'star_repo', params: { repo: { id: '1' } } }; // missing name
      const reaction = { service: 'discord', name: 'send_message', params: {} };

      jest.spyOn(ServiceManager.instance, 'get').mockImplementation((serviceName) => {
        if (serviceName === 'github')
          return {
            name: 'github',
            actions: [{ name: 'star_repo', params: [{ key: 'repo', type: 'select', label: 'Repo', options: [] }] }],
            reactions: [],
          };
        if (serviceName === 'discord')
          return { name: 'discord', actions: [], reactions: [{ name: 'send_message', params: [] }] };
        return undefined;
      });

      await expect(service.createActionReaction('user-123', action as any, reaction as any)).rejects.toThrow(ApiError);
    });

    it('should throw BAD_REQUEST if param type is unknown', async () => {
      const action = { service: 'github', name: 'star_repo', params: { repo: 'some val' } };
      const reaction = { service: 'discord', name: 'send_message', params: {} };

      jest.spyOn(ServiceManager.instance, 'get').mockImplementation((serviceName) => {
        if (serviceName === 'github')
          return {
            name: 'github',
            actions: [{ name: 'star_repo', params: [{ key: 'repo', type: 'unknown_type', label: 'Repo' } as any] }],
            reactions: [],
          };
        if (serviceName === 'discord')
          return { name: 'discord', actions: [], reactions: [{ name: 'send_message', params: [] }] };
        return undefined;
      });

      await expect(service.createActionReaction('user-123', action as any, reaction as any)).rejects.toThrow(ApiError);
    });
  });

  describe('getActionsReactionsByTrigger', () => {
    it('should return actions reactions by trigger', async () => {
      const mockData = [{ _id: new ObjectId(), trigger: 'test' }];
      mockRepository.getActionsReactionsByTrigger.mockResolvedValue(mockData as any);

      const result = await service.getActionsReactionsByTrigger('test');

      expect(mockRepository.getActionsReactionsByTrigger).toHaveBeenCalledWith('test');
      expect(result).toEqual(mockData);
    });
  });

  describe('getMeActionsReactions', () => {
    it('should return formatted actions reactions for user', async () => {
      const objectId = new ObjectId();
      const mockData = [
        {
          _id: objectId,
          action: { service: 'github', type: 'star', params: {} },
          reaction: { service: 'discord', type: 'message', params: {} },
          numberOfExecution: 5,
          executionState: true,
        },
      ];
      mockRepository.getMeActionsReactions.mockResolvedValue(mockData as any);

      const result = await service.getMeActionsReactions('user-123');

      expect(result[0]).toEqual({
        _id: objectId.toString(),
        action: mockData[0]!.action,
        reaction: mockData[0]!.reaction,
        numberOfExecution: 5,
        executionState: true,
      });
    });
  });

  describe('updateActionReactionExecutionStateById', () => {
    it('should update execution state successfully', async () => {
      await service.updateActionReactionExecutionStateById('507f1f77bcf86cd799439011', false);

      expect(mockRepository.updateActionReactionExecutionStateById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        false,
      );
    });

    it('should throw error when update is not acknowledged', async () => {
      mockRepository.updateActionReactionExecutionStateById.mockResolvedValue({
        acknowledged: false,
        matchedCount: 0,
      } as any);

      try {
        await service.updateActionReactionExecutionStateById('507f1f77bcf86cd799439011', false);
        fail('Should have thrown ApiError');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
      }
    });

    it('should throw NOT_FOUND when no document matches', async () => {
      mockRepository.updateActionReactionExecutionStateById.mockResolvedValue({
        acknowledged: true,
        matchedCount: 0,
      } as any);

      await expect(service.updateActionReactionExecutionStateById('507f1f77bcf86cd799439011', false)).rejects.toThrow(
        'Action reaction not found',
      );
    });
  });
});
