/**
 * @type Tokens
 * @description Tokens returned by the authentication service.
 *
 * @property {string} accessToken - The access token.
 * @property {string} refreshToken - The refresh token.
 */
export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
