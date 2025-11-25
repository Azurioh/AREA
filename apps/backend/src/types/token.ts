/**
 * @type AccessTokenPayload
 * @description The payload of the access token.
 *
 * @property {string} id - The id of the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email of the user.
 * @property {string} role - The role of the user.
 */
export type AccessTokenPayload = {
  id: string;
  name: string;
  email: string;
  role: string;
};

/**
 * @type RefreshTokenPayload
 * @description The payload of the refresh token.
 *
 * @property {string} id - The id of the user.
 */
export type RefreshTokenPayload = {
  id: string;
};
