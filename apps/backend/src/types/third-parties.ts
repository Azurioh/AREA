import type {
  thirdPartyAuthorizationParamsSchema,
  thirdPartyAuthorizationQueryStringSchema,
} from '@area/shared/schemas/third-parties.schema';
import type z from 'zod';

export type ClientType = 'web' | 'client';

/**
 * @type ThirdPartyAuthorizationQueryString
 * @description Query string required to authenticate with github.
 *
 * @property {string} code The code provided by github to authenticate the user
 * @property {string} state A state given by the client when making the authorization request
 */
export type ThirdPartyAuthorizationQueryString = z.infer<typeof thirdPartyAuthorizationQueryStringSchema>;

/**
 * @type ThirdPartyAuthorizationParams
 * @description Params required for the service name.
 *
 * @property {ServiceType} service The service authorizing
 */
export type ThirdPartyAuthorizationParams = z.infer<typeof thirdPartyAuthorizationParamsSchema>;

/**
 * @type ThirdPartyAuthorization
 * @description ThirdPartyAuthorization type.
 *
 * @property {string} code The code provided by the service to authenticate the user
 * @property {string} state A state given by the client when making the authorization request
 */
export type ThirdPartyAuthorization = ThirdPartyAuthorizationQueryString;

export type ServiceType = 'github' | 'discord' | 'spotify' | 'dropbox' | 'unsplash';
export type OAuthServiceType = Omit<ServiceType, 'unsplash'>;

/**
 * @type BaseAccount
 * @description BaseAccount type.
 *
 * @property {string} userId The id of the user linked to the account
 * @property {string} service The name of the service
 * @property {string} accessToken The access token
 * @property {string | null} refreshToken The refresh token
 */
export type BaseAccount = {
  userId: string;
  service: OAuthServiceType;
  accessToken: string;
  refreshToken: string | null;
};

/**
 * @type GithubAccount
 * @description GithubAccount type.
 *
 * @property {'github'} service The name of the service
 * @property {string} username The name of the github usr
 */
export type GithubAccount = BaseAccount & {
  service: 'github';
  username: string;
};

/**
 * @type DiscordAccount
 * @description DiscordAccount type.
 *
 * @property {'discord'} service The name of the service
 * @property {string} guildId The if of the guild the bot has been authorize into
 */
export type DiscordAccount = BaseAccount & {
  service: 'discord';
  guildId: string;
};

/**
 * @type SpotifyAccount
 * @description SpotifyAccount type.
 *
 * @property {'spotify'} service The name of the service
 */
export type SpotifyAccount = BaseAccount & {
  service: 'spotify';
  id: string;
};

/**
 * @type DropboxAccount
 * @description DropboxAccount type.
 *
 * @property {'dropbox'} service The name of the service
 * @property {string} id The account id of the user
 * @property {Object[]} cursors An array of the user cursors
 * @property {string} cursors[].cursor The tag of the cursor
 * @property {string} cursors[].tag The type of the cursor
 */
export type DropboxAccount = BaseAccount & {
  service: 'dropbox';
  id: string;
  cursor: {
    ref: string;
    paths: string[];
  };
};

export type ThirdPartyAccount = GithubAccount | DiscordAccount | SpotifyAccount | DropboxAccount;

/**********************************
 * SERVICE AUTHORIZATION RESPONSE *
 **********************************/

/**
 * @type GitHubAuthorizationResponse
 * @description The content of the github authorization response.
 *
 * @property {string} access_token - The response access token.
 */
export type GitHubAuthorizationResponse = {
  access_token: string;
};

/**
 * @type DiscordGuild
 * @description The content of a discord guild.
 *
 * @property {string} id - The id of the guild.
 */
type DiscordGuild = {
  id: string;
};

/**
 * @type DiscordAuthorizationResponse
 * @description The content of the discord authorization response.
 *
 * @property {string} access_token - The response access token.
 * @property {string} refresh_token - The response refresh token.
 * @property {DiscordGuild} guild - The authorized guild
 */
export type DiscordAuthorizationResponse = {
  access_token: string;
  refresh_token: string;
  guild: DiscordGuild;
};

/**
 * @type SpotifyAuthorizationResponse
 * @description The content of the spotify authorization response.
 *
 * @property {string} access_token - The response access token.
 * @property {string} refresh_token - The response refresh token.
 */
export type SpotifyAuthorizationResponse = {
  access_token: string;
  refresh_token: string;
};

/**
 * @type DropboxAuthorizationResponse
 * @description The content of the dropbox authorization response.
 *
 * @property {string} access_token - The response access token.
 * @property {string} refresh_token - The response refresh token.
 */
export type DropboxAuthorizationResponse = {
  access_token: string;
  refresh_token: string;
  account_id: string;
};
