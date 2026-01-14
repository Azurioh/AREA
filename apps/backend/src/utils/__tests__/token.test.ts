import { HttpStatusCode } from '@area/shared/enums/http-status';
import jwt from 'jsonwebtoken';
import ApiError from '../api-error';
import { generateAccessToken, generateRefreshToken, generateStateToken, verifyToken } from '../token';

jest.mock('../environment', () => ({
  environment: {
    JWT_ACCESS_TOKEN_SECRET: 'access_secret',
    JWT_REFRESH_TOKEN_SECRET: 'refresh_secret',
    JWT_STATE_TOKEN_SECRET: 'state_secret',
  },
}));

describe('Token Utils', () => {
  const payload = { _id: 'user1', role: 'user' } as any;

  describe('Generators', () => {
    it('should generate access token', () => {
      const token = generateAccessToken(payload);
      const decoded = jwt.verify(token, 'access_secret');
      expect(decoded).toMatchObject(payload);
    });

    it('should generate refresh token (default expiracy)', () => {
      const token = generateRefreshToken(payload);
      const decoded = jwt.verify(token, 'refresh_secret');
      expect(decoded).toMatchObject(payload);
    });

    it('should generate refresh token (remember me)', () => {
      const token = generateRefreshToken(payload, true);
      const decoded = jwt.verify(token, 'refresh_secret');
      expect(decoded).toMatchObject(payload);
    });

    it('should generate state token', () => {
      const token = generateStateToken({ some: 'state' } as any);
      const decoded = jwt.verify(token, 'state_secret');
      expect(decoded).toMatchObject({ some: 'state' });
    });
  });

  describe('verifyToken', () => {
    it('should return decoded payload if valid', () => {
      const token = jwt.sign(payload, 'access_secret');
      const decoded = verifyToken(token, 'access_secret');
      expect(decoded).toMatchObject(payload);
    });

    it('should throw ApiError if token is invalid (JsonWebTokenError)', () => {
      expect(() => verifyToken('invalid-token', 'access_secret')).toThrow(ApiError);
      try {
        verifyToken('invalid-token', 'access_secret');
      } catch (e: any) {
        expect(e.httpCode).toBe(HttpStatusCode.UNAUTHORIZED);
        expect(e.message).toBe('Provided token is invalid');
      }
    });

    it('should throw ApiError if verification throws other error', () => {
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error('Generic error');
      });

      expect(() => verifyToken('token', 'secret')).toThrow(ApiError);
      try {
        verifyToken('token', 'secret');
      } catch (e: any) {
        expect(e.httpCode).toBe(HttpStatusCode.UNAUTHORIZED);
        expect(e.message).toBe('Provided token is invalid');
      }
    });
  });
});
