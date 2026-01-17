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

// Mock environment to allow mutation in tests
jest.mock('@/utils/environment', () => ({
  environment: {
    NODE_ENV: 'test',
    CRYPT_SECRET_KEY: 'secret',
    ADMIN_SECRET: 'admin_secret',
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
      expect(mockReply.setCookie).toHaveBeenCalledWith(
        'refresh-token',
        'encrypted_refresh_token_123',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
        }),
      );
      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({
        accessToken: 'encrypted_access_token_123',
      });
    });

    it('should register user with development cookie settings when NODE_ENV is development', async () => {
      // Mock environment as development
      const originalEnv = environment.NODE_ENV;
      (environment as any).NODE_ENV = 'development';

      const tokens = {
        accessToken: 'access_token_dev',
        refreshToken: 'refresh_token_dev',
      };

      mockService.registerUser.mockResolvedValueOnce(tokens);

      try {
        await controller.registerUser(
          mockRequest as FastifyRequest<{ Body: any; Headers: any }>,
          mockReply as FastifyReply,
        );

        expect(mockReply.setCookie).toHaveBeenCalledWith(
          'refresh-token',
          'encrypted_refresh_token_dev',
          expect.objectContaining({
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          }),
        );
      } finally {
        (environment as any).NODE_ENV = originalEnv;
      }
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
      expect(mockReply.setCookie).toHaveBeenCalledWith(
        'refresh-token',
        'encrypted_refresh_token_123',
        expect.any(Object),
      );
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        accessToken: 'encrypted_access_token_123',
      });
    });

    it('should login user with development cookie settings when NODE_ENV is development', async () => {
      const originalEnv = environment.NODE_ENV;
      (environment as any).NODE_ENV = 'development';

      const tokens = {
        accessToken: 'access_token_dev',
        refreshToken: 'refresh_token_dev',
      };

      mockService.loginUser.mockResolvedValueOnce(tokens);

      try {
        await controller.loginUser(mockRequest as FastifyRequest<{ Body: any }>, mockReply as FastifyReply);

        expect(mockReply.setCookie).toHaveBeenCalledWith(
          'refresh-token',
          'encrypted_refresh_token_dev',
          expect.objectContaining({
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          }),
        );
      } finally {
        (environment as any).NODE_ENV = originalEnv;
      }
    });
  });

  describe('refreshToken', () => {
    it('should refresh token when valid cookie is present', async () => {
      mockRequest.cookies = {
        'refresh-token': 'encrypted_valid_refresh_token',
      };

      mockService.refreshToken.mockResolvedValueOnce({
        accessToken: 'new_access_token',
      });

      await controller.refreshToken(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockService.refreshToken).toHaveBeenCalledWith('valid_refresh_token');
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        accessToken: 'encrypted_new_access_token',
      });
    });

    it('should return 401 if refresh token cookie is missing', async () => {
      mockRequest.cookies = {};

      await controller.refreshToken(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockService.refreshToken).not.toHaveBeenCalled();
      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({ message: 'Refresh token is missing' });
    });
  });
});
