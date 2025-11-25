import { User } from "./user.type";

/**
 * @type Tokens
 * @description This type represent the availables token.
 *
 * @property {string} accessToken - The access token.
 * @property {string} refreshToken - The refresh token.
 */
export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

/**
 * @type RegisterUser
 * @description Body required to register a user.
 *
 * @property {string} name - The name of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 */
export type RegisterUserBody = User;

/**
 * @type LoginUser
 * @description Body required to login a user.
 *
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 */
export type LoginUserBody = Omit<User, 'name'>
