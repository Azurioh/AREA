import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { AccessToken, RefreshToken, StateToken } from '@area/shared/types/user.types';
import jwt from 'jsonwebtoken';
import ApiError from './api-error';
import { environment } from './environment';

/**
 * @function generateAccessToken
 * @description Generate the access token.
 *
 * @param {AccessToken} payload - The payload to add in the access token
 * @returns {string} The created access token.
 */
export const generateAccessToken = (payload: AccessToken): string => {
  // return jwt.sign(payload, environment.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  return jwt.sign(payload, environment.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

/**
 * @function generateRefreshToken
 * @description Generate the refresh token.
 *
 * @param {RefreshToken} payload - The payload to add in the refresh token
 * @returns {string} The created refresh token.
 */
export const generateRefreshToken = (payload: RefreshToken, rememberMe: boolean = false): string => {
  return jwt.sign(payload, environment.JWT_REFRESH_TOKEN_SECRET, { expiresIn: rememberMe ? '30d' : '1d' });
};

/**
 * @function generateAccessToken
 * @description Generate the access token.
 *
 * @param {AccessToken} payload - The payload to add in the access token
 * @returns {string} The created access token.
 */
export const generateStateToken = (payload: StateToken): string => {
  return jwt.sign(payload, environment.JWT_STATE_TOKEN_SECRET, { expiresIn: '10m' });
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
    console.log(`verifying token: [${token}] `);
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    return decoded as T;
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Provided token is invalid');
    }
    throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Token verification failed');
  }
};
