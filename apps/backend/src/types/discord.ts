import { discordAuthorizationQueryStringSchema } from "@area/shared/schemas/discord.schema";
import z from "zod";

/**
 * @type DiscordAuthorizationQueryString
 * @description Query string required to authenticate with discord.
 *
 * @property {string} code The code provided by github to authenticate the user
 * @property {string} state A state given by the client when making the authorization request
 */
export type DiscordAuthorizationQueryString = z.infer<typeof discordAuthorizationQueryStringSchema>;

/**
 * @type DiscordAuthorization
 * @description DiscordAuthorization type.
 *
 * @property {string} code The code provided by github to authenticate the user
 * @property {string} state A state given by the client when making the authorization request
 */
export type DiscordAuthorization = DiscordAuthorizationQueryString;

/**
 * @type DiscordGuild
 * @description The content of a discord guild.
 *
 * @property {string} id - The id of the guild.
 */
type DiscordGuild = {
    id: string
}

/**
 * @type DiscordAuthorizationResponse
 * @description The content of the discord authorization response.
 *
 * @property {string} access_token - The response access token.
 * @property {string} token_type - The type of the token.
 * @property {number} expires_in - The expiration time of the access token.
 * @property {string} refresh_token - The response refresh token.
 * @property {string} scope - The authorization scope.
 * @property {DiscordGuild} guild - The authorized guild
 */
export type DiscordAuthorizationResponse = {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    guild: DiscordGuild
};

/**
 * @type discrodAccount
 * @description The content of the discord account.
 *
 * @property {string} userId - The id of the user.
 * @property {string} accessToken - The access token related to the user github account.
 * @property {string} refreshToken - The refresh token related to the user discord account.
 * @property {string} guildId - The id of the guild that the user authorize
 */
export type DiscordAccount = {
    userId: string,
    accessToken: string,
    refreshToken: string,
    guildId: string
}
