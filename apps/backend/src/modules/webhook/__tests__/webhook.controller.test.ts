import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { FastifyReply, FastifyRequest } from 'fastify';
import ApiError from '@/utils/api-error';
import { WebhookController } from '../webhook.controller';
import type { WebhookService } from '../webhook.service';

describe('WebhookController', () => {
  let webhookController: WebhookController;
  let mockWebhookService: WebhookService;
  let mockRequest: FastifyRequest;
  let mockReply: FastifyReply;

  beforeEach(() => {
    mockWebhookService = {
      githubCallback: jest.fn(),
      discordCallback: jest.fn(),
      spotifyCallback: jest.fn(),
      dropboxCallback: jest.fn(),
      unsplashCallback: jest.fn(),
      twitchCallback: jest.fn(),
    } as unknown as WebhookService;

    webhookController = new WebhookController(mockWebhookService);

    mockRequest = {
      headers: {},
      body: {},
    } as unknown as FastifyRequest;

    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply;
  });

  describe('githubCallback', () => {
    it('should throw ApiError if x-github-event header is missing', async () => {
      mockRequest.headers = {};

      await expect(webhookController.githubCallback(mockRequest, mockReply)).rejects.toThrow(ApiError);
    });

    it('should call service.githubCallback and send 204 on success', async () => {
      mockRequest.headers = { 'x-github-event': 'push' };
      mockRequest.body = { some: 'data' };

      await webhookController.githubCallback(mockRequest, mockReply);

      expect(mockWebhookService.githubCallback).toHaveBeenCalledWith('push', mockRequest.body);
      expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.NO_CONTENT);
      expect(mockReply.send).toHaveBeenCalled();
    });
  });

  describe('discordCallback', () => {
    it('should throw ApiError if x-discord-event header is missing', async () => {
      mockRequest.headers = {};

      await expect(webhookController.discordCallback(mockRequest, mockReply)).rejects.toThrow(ApiError);
    });

    it('should call service.discordCallback and send 204 on success', async () => {
      mockRequest.headers = { 'x-discord-event': 'message' };
      mockRequest.body = { some: 'data' };

      await webhookController.discordCallback(mockRequest, mockReply);

      expect(mockWebhookService.discordCallback).toHaveBeenCalledWith('message', mockRequest.body);
      expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.NO_CONTENT);
      expect(mockReply.send).toHaveBeenCalled();
    });
  });

  describe('spotifyCallback', () => {
    it('should throw ApiError if x-spotify-event header is missing', async () => {
      mockRequest.headers = {};

      await expect(webhookController.spotifyCallback(mockRequest, mockReply)).rejects.toThrow(ApiError);
    });

    it('should call service.spotifyCallback and send 204 on success', async () => {
      mockRequest.headers = { 'x-spotify-event': 'track_played' };
      mockRequest.body = { some: 'data' };

      await webhookController.spotifyCallback(mockRequest, mockReply);

      expect(mockWebhookService.spotifyCallback).toHaveBeenCalledWith('track_played', mockRequest.body);
      expect(mockReply.send).toHaveBeenCalled();
    });
  });

  describe('dropboxWebhookValidator', () => {
    it('should return challenge and 200 on success', async () => {
      mockRequest.query = { challenge: 'test-challenge' };

      await webhookController.dropboxWebhookValidator(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(mockReply.send).toHaveBeenCalledWith('test-challenge');
    });
  });

  describe('dropboxCallback', () => {
    it('should call service.dropboxCallback and send 200 on success', async () => {
      mockRequest.body = { list_folder: { accounts: ['acc1'] } };

      await webhookController.dropboxCallback(mockRequest, mockReply);

      expect(mockWebhookService.dropboxCallback).toHaveBeenCalledWith(mockRequest.body);
      expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(mockReply.send).toHaveBeenCalled();
    });
  });

  describe('unsplashCallback', () => {
    it('should throw ApiError if headers are missing', async () => {
      mockRequest.headers = { 'x-unsplash-event': 'event' };
      await expect(webhookController.unsplashCallback(mockRequest, mockReply)).rejects.toThrow(ApiError);

      mockRequest.headers = { 'x-user-id': 'uid' };
      await expect(webhookController.unsplashCallback(mockRequest, mockReply)).rejects.toThrow(ApiError);
    });

    it('should call service.unsplashCallback and send 204 on success', async () => {
      mockRequest.headers = { 'x-unsplash-event': 'event', 'x-user-id': 'uid' };
      mockRequest.body = { some: 'data' };

      await webhookController.unsplashCallback(mockRequest, mockReply);

      expect(mockWebhookService.unsplashCallback).toHaveBeenCalledWith('uid', 'event', mockRequest.body);
      expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.NO_CONTENT);
      expect(mockReply.send).toHaveBeenCalled();
    });
  });

  describe('twitchCallback', () => {
    it('should return challenge if present', async () => {
      mockRequest.body = { challenge: 'challenge-token' };

      await webhookController.twitchCallback(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(mockReply.send).toHaveBeenCalledWith('challenge-token');
    });

    it('should throw ApiError if header is missing', async () => {
      mockRequest.body = {};
      mockRequest.headers = {};

      await expect(webhookController.twitchCallback(mockRequest, mockReply)).rejects.toThrow(ApiError);
    });

    it('should call service.twitchCallback and send 204 on success', async () => {
      mockRequest.body = { some: 'data' };
      mockRequest.headers = { 'twitch-eventsub-subscription-type': 'channel.follow' };

      await webhookController.twitchCallback(mockRequest, mockReply);

      expect(mockWebhookService.twitchCallback).toHaveBeenCalledWith('channel.follow', mockRequest.body);
      expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.NO_CONTENT);
      expect(mockReply.send).toHaveBeenCalled();
    });
  });
});
