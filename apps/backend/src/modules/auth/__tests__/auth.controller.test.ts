import { UserRoles } from '@area/shared/enums/user-enums';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { safeEqualCheck } from '@/utils/crypt';
import { environment } from '@/utils/environment';
import { AuthController } from '../auth.controller';
import type { AuthService } from '../auth.service';

jest.mock('@/utils/crypt', () => ({
  encryptString: jest.fn((toEncrypt: string, _secret: string) => `encrypted_${toEncrypt}`),
  decryptString: jest.fn((toDecrypt: string, _secret: string) => toDecrypt.replace('encrypted_', '')),
  safeEqualCheck: jest.fn(() => false),
}));

jest.mock('@/utils/token', () => ({
  verifyToken: jest.fn(() => ({ _id: '507f1f77bcf86cd799439011' })),
}));

jest.mock('@/utils/environment', () => ({
  environment: {
    NODE_ENV: 'test',
    CRYPT_SECRET_KEY: 'secret',
    ADMIN_SECRET: 'admin_secret',
    JWT_ACCESS_TOKEN_SECRET: 'access_secret',
  },
}));

describe('AuthController', () => {
  let controller: AuthController;
  let mockService: jest.Mocked<AuthService>;
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockService = {
      registerUser: jest.fn(),
      loginUser: jest.fn(),
      refreshToken: jest.fn(),
      sendTokensToUser: jest.fn(),
      getRefreshToken: jest.fn(),
      checkIfRefreshTokenIsValid: jest.fn().mockResolvedValue(true),
      storeRefreshTokenInDatabase: jest.fn(),
      invalidateAccessToken: jest.fn(),
      invalidateRefreshToken: jest.fn(),
    } as any;

    controller = new AuthController(mockService);

    mockRequest = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
      headers: {
        'Content-Type': 'application/json',
      },
      cookies: {},
    } as any;

    mockReply = {
      setCookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    (safeEqualCheck as jest.Mock).mockReturnValue(false);
    // Reset environment to test by default
    (environment as any).NODE_ENV = 'test';
  });

  describe('registerUser', () => {
    it('should register user and set refresh token cookie (production/test settings)', async () => {
      const tokens = {
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_123',
      };

      mockService.registerUser.mockResolvedValueOnce(tokens);

      await controller.registerUser(
        mockRequest as FastifyRequest<{ Body: any; Headers: any }>,
        mockReply as FastifyReply,
      );

      expect(mockService.registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          role: UserRoles.USER,
        }),
      );
      expect(mockService.sendTokensToUser).toHaveBeenCalledWith(
        'encrypted_access_token_123',
        'encrypted_refresh_token_123',
        mockRequest,
        mockReply,
        true,
      );
    });

    it('should register user with development cookie settings when NODE_ENV is development', async () => {
      const tokens = {
        accessToken: 'access_token_dev',
        refreshToken: 'refresh_token_dev',
      };

      mockService.registerUser.mockResolvedValueOnce(tokens);

      await controller.registerUser(
        mockRequest as FastifyRequest<{ Body: any; Headers: any }>,
        mockReply as FastifyReply,
      );

      expect(mockService.sendTokensToUser).toHaveBeenCalledWith(
        'encrypted_access_token_dev',
        'encrypted_refresh_token_dev',
        mockRequest,
        mockReply,
        true,
      );
    });

    it('should register admin user if admin secret matches', async () => {
      (safeEqualCheck as jest.Mock).mockReturnValue(true);
      mockRequest.headers!['x-admin-secret'] = 'admin_secret';

      mockService.registerUser.mockResolvedValueOnce({
        accessToken: 'token',
        refreshToken: 'refresh',
      });

      await controller.registerUser(
        mockRequest as FastifyRequest<{ Body: any; Headers: any }>,
        mockReply as FastifyReply,
      );

      expect(mockService.registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          role: UserRoles.ADMIN,
        }),
      );
      expect(mockService.sendTokensToUser).toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should login user and set refresh token cookie', async () => {
      const tokens = {
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_123',
      };

      mockService.loginUser.mockResolvedValueOnce(tokens);

      mockRequest.body = {
        email: 'john@example.com',
        password: 'password123',
      };

      await controller.loginUser(mockRequest as FastifyRequest<{ Body: any }>, mockReply as FastifyReply);

      expect(mockService.loginUser).toHaveBeenCalledWith(mockRequest.body);
      expect(mockService.storeRefreshTokenInDatabase).toHaveBeenCalled();
      expect(mockService.sendTokensToUser).toHaveBeenCalledWith(
        'encrypted_access_token_123',
        'encrypted_refresh_token_123',
        mockRequest,
        mockReply,
        false,
      );
    });

    it('should login user with development cookie settings when NODE_ENV is development', async () => {
      const tokens = {
        accessToken: 'access_token_dev',
        refreshToken: 'refresh_token_dev',
      };

      mockService.loginUser.mockResolvedValueOnce(tokens);

      await controller.loginUser(mockRequest as FastifyRequest<{ Body: any }>, mockReply as FastifyReply);

      expect(mockService.sendTokensToUser).toHaveBeenCalledWith(
        'encrypted_access_token_dev',
        'encrypted_refresh_token_dev',
        mockRequest,
        mockReply,
        false,
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh token when valid cookie is present', async () => {
      mockRequest.cookies = {
        'refresh-token': 'encrypted_valid_refresh_token',
      };
      mockRequest.headers = {
        ...mockRequest.headers,
        authorization: 'Bearer old_access_token',
      };

      mockService.getRefreshToken.mockReturnValueOnce('encrypted_valid_refresh_token');
      mockService.refreshToken.mockResolvedValueOnce({
        newAccessToken: 'new_access_token',
        newRefreshToken: 'new_refresh_token',
      });

      await controller.refreshToken(mockRequest as FastifyRequest<{ Headers: any }>, mockReply as FastifyReply);

      expect(mockService.getRefreshToken).toHaveBeenCalledWith(mockRequest);
      expect(mockService.checkIfRefreshTokenIsValid).toHaveBeenCalledWith('encrypted_valid_refresh_token');
      expect(mockService.refreshToken).toHaveBeenCalledWith('valid_refresh_token');
      expect(mockService.invalidateAccessToken).toHaveBeenCalled();
      expect(mockService.invalidateRefreshToken).toHaveBeenCalled();
      expect(mockService.sendTokensToUser).toHaveBeenCalledWith(
        'encrypted_new_access_token',
        'encrypted_new_refresh_token',
        mockRequest,
        mockReply,
        false,
      );
    });

    it('should return 401 if refresh token cookie is missing', async () => {
      mockRequest.cookies = {};
      mockService.getRefreshToken.mockReturnValueOnce(undefined);

      await expect(
        controller.refreshToken(mockRequest as FastifyRequest<{ Headers: any }>, mockReply as FastifyReply),
      ).rejects.toThrow('Refresh token is missing');
    });
  });

  describe('logout', () => {
    it('should invalidate both tokens when present', async () => {
      mockRequest.headers = {
        ...mockRequest.headers,
        authorization: 'Bearer access_token_123',
      };
      mockService.getRefreshToken.mockReturnValueOnce('refresh_token_123');

      await controller.logout(mockRequest as FastifyRequest<{ Body: any }>, mockReply as FastifyReply);

      expect(mockService.invalidateAccessToken).toHaveBeenCalledWith(mockRequest, 'access_token_123');
      expect(mockService.invalidateRefreshToken).toHaveBeenCalledWith('refresh_token_123');
      expect(mockReply.status).toHaveBeenCalledWith(204);
      expect(mockReply.send).toHaveBeenCalled();
    });

    it('should handle logout when refresh token is missing', async () => {
      mockRequest.headers = {
        ...mockRequest.headers,
        authorization: 'Bearer access_token_123',
      };
      mockService.getRefreshToken.mockReturnValueOnce(undefined);

      await controller.logout(mockRequest as FastifyRequest<{ Body: any }>, mockReply as FastifyReply);

      expect(mockService.invalidateAccessToken).toHaveBeenCalledWith(mockRequest, 'access_token_123');
      expect(mockService.invalidateRefreshToken).not.toHaveBeenCalled();
      expect(mockReply.status).toHaveBeenCalledWith(204);
    });

    it('should handle logout when access token is missing', async () => {
      mockRequest.headers = {};
      mockService.getRefreshToken.mockReturnValueOnce('refresh_token_123');

      await controller.logout(mockRequest as FastifyRequest<{ Body: any }>, mockReply as FastifyReply);

      expect(mockService.invalidateAccessToken).not.toHaveBeenCalled();
      expect(mockService.invalidateRefreshToken).toHaveBeenCalledWith('refresh_token_123');
      expect(mockReply.status).toHaveBeenCalledWith(204);
    });

    it('should handle logout when both tokens are missing', async () => {
      mockRequest.headers = {};
      mockService.getRefreshToken.mockReturnValueOnce(undefined);

      await controller.logout(mockRequest as FastifyRequest<{ Body: any }>, mockReply as FastifyReply);

      expect(mockService.invalidateAccessToken).not.toHaveBeenCalled();
      expect(mockService.invalidateRefreshToken).not.toHaveBeenCalled();
      expect(mockReply.status).toHaveBeenCalledWith(204);
    });
  });
});
