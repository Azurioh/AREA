import { HttpStatusCode } from '@area/shared/enums/http-status';
import { environment } from '@/utils/environment';
import { ThirdPartiesController } from '../third-parties.controller';
import type { ThirdPartiesService } from '../third-parties.service';

describe('ThirdPartiesController', () => {
  let controller: ThirdPartiesController;
  let service: jest.Mocked<ThirdPartiesService>;
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    service = {
      getThirdPartyAuthorizationUrlService: jest.fn(),
      authorizeTo: jest.fn(),
      getThirdPartyStatus: jest.fn(),
    } as any;

    controller = new ThirdPartiesController(service);

    mockRequest = {
      params: {},
      query: {},
      headers: {},
      user: { _id: 'user-id' },
    };

    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
    };
  });

  describe('getThirdPartyAuthorizationUrlService', () => {
    it('should send authorization url and 200 status', async () => {
      mockRequest.params.service = 'GITHUB'; // Test toLowerCase()
      mockRequest.headers['x-client-type'] = 'web';
      service.getThirdPartyAuthorizationUrlService.mockResolvedValue('http://auth.url');

      await controller.getThirdPartyAuthorizationUrlService(mockRequest, mockReply);

      expect(service.getThirdPartyAuthorizationUrlService).toHaveBeenCalledWith('github', 'user-id', 'web');
      expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(mockReply.send).toHaveBeenCalledWith({ url: 'http://auth.url' });
    });

    it('should default client type to web if missing or invalid', async () => {
      mockRequest.params.service = 'github';
      await controller.getThirdPartyAuthorizationUrlService(mockRequest, mockReply);
      expect(service.getThirdPartyAuthorizationUrlService).toHaveBeenCalledWith('github', 'user-id', 'web');
    });
  });

  describe('authorizeToService', () => {
    it('should redirect back with success status on successful authorization', async () => {
      mockRequest.params.service = 'github';
      mockRequest.query.code = 'code123';
      service.authorizeTo.mockResolvedValue({
        redirect: {
          url: `${environment.WEB_OAUTH_CALLBACK_URL}/service`,
          status: 'success',
          clientType: 'web',
        },
        type: 'service',
      });

      await controller.authorizeTo(mockRequest, mockReply);

      expect(service.authorizeTo).toHaveBeenCalledWith('github', 'code123', undefined);
      expect(mockReply.redirect).toHaveBeenCalledWith(`${environment.WEB_OAUTH_CALLBACK_URL}/service?status=success`);
    });

    it('should redirect back with error status on failed authorization', async () => {
      mockRequest.params.service = 'github';
      mockRequest.query.code = 'code123';

      service.authorizeTo.mockResolvedValue({
        redirect: {
          url: `${environment.WEB_OAUTH_CALLBACK_URL}/service`,
          status: 'error',
          clientType: 'web',
        },
        type: 'service',
      });

      await controller.authorizeTo(mockRequest, mockReply);

      expect(mockReply.redirect).toHaveBeenCalledWith(`${environment.WEB_OAUTH_CALLBACK_URL}/service?status=error`);
    });

    it('should use mobile callback URL for mobile client type', async () => {
      mockRequest.params.service = 'github';
      mockRequest.query.code = 'code123';
      service.authorizeTo.mockResolvedValue({
        redirect: {
          url: `${environment.MOBILE_OAUTH_CALLBACK_URL}/service`,
          status: 'success',
          clientType: 'mobile',
        },
        type: 'service',
      });

      await controller.authorizeTo(mockRequest, mockReply);

      expect(mockReply.redirect).toHaveBeenCalledWith(
        `${environment.MOBILE_OAUTH_CALLBACK_URL}/service?status=success`,
      );
    });
  });

  describe('getThirdPartyStatus', () => {
    it('should return connected status', async () => {
      mockRequest.params.service = 'GITHUB';
      service.getThirdPartyStatus.mockResolvedValue(true);

      await controller.getThirdPartyStatus(mockRequest, mockReply);

      expect(service.getThirdPartyStatus).toHaveBeenCalledWith('github', 'user-id');
      expect(mockReply.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(mockReply.send).toHaveBeenCalledWith({ connected: true });
    });
  });
});
