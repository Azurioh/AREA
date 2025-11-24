import { AccessTokenPayload, RefreshTokenPayload } from '@/types/token';
import { environment } from './environment';
import jwt from 'jsonwebtoken';

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
