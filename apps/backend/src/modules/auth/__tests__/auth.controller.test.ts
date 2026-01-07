import type { FastifyReply, FastifyRequest } from 'fastify';
import { AuthController } from '../auth.controller';
import type { AuthService } from '../auth.service';

jest.mock('@/utils/crypt', () => ({
  encryptString: jest.fn((toEncrypt: string, _secret: string) => `encrypted_${toEncrypt}`),
  safeEqualCheck: jest.fn(() => false),
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
    } as any;

    mockReply = {
      setCookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe('registerUser', () => {
    it('should register user and set refresh token cookie', async () => {
      const tokens = {
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_123',
      };

      mockService.registerUser.mockResolvedValueOnce(tokens);

      await controller.registerUser(
        mockRequest as FastifyRequest<{ Body: any; Headers: any }>,
        mockReply as FastifyReply,
      );

      expect(mockReply.setCookie).toHaveBeenCalledWith(
        'refresh-token',
        'encrypted_refresh_token_123',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        }),
      );
      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({
        accessToken: 'encrypted_access_token_123',
      });
    });
  });
});
