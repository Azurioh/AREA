import { AccessTokenPayload, RefreshTokenPayload } from '@/types/token';
import { environment } from './environment';
import jwt from 'jsonwebtoken';
import ApiError from './api-error';
import { HttpStatusCode } from '@area/shared/enums/http-status';

/**
 * @function generateAccessToken
 * @description Generate the access token.
 *
 * @param {AccessTokenPayload} payload - The payload to add in the access token
 * @returns {string} The created access token.
 */
export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, environment.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

/**
 * @function generateRefreshToken
 * @description Generate the refresh token.
 *
 * @param {RefreshTokenPayload} payload - The payload to add in the refresh token
 * @returns {string} The created refresh token.
 */
export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, environment.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

/**
 * @function verifyToken
 * @description Verify the given token.
 *
 * @param {string} token - The token to verify
 * @param {string} secret - The secret to verify the token with
 * @returns {T} The decoded token.
 */
export const verifyToken = <T>(token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    return decoded as T;
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Provided token is invalid')
    }
    throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Token verification failed')
  }
};
