import { githubAuthenticationQueryStringSchema } from "@area/shared/schemas/github.schema";
import z from "zod";

/**
 * @type githubAuthenticationQueryStringSchema
 * @description Query string required to authenticate with github.
 *
 * @property {string} code The code provided by github to authenticate the user
 * @property {string} state A state given by the client when making the authentication request
 */
export type GitHubAuthenticationQueryString = z.infer<typeof githubAuthenticationQueryStringSchema>;

/**
 * @type GitHubAuthentication
 * @description GitHubAuthentication type.
 *
 * @property {string} code The code provided by github to authenticate the user
 * @property {string} state A state given by the client when making the authentication request
 */
export type GitHubAuthentication = GitHubAuthenticationQueryString;

/**
 * @type GithubAccount
 * @description The content of the github account.
 *
 * @property {string} access_token - The response access token.
 * @property {string} token_type - The type of the token.
 * @property {string} scope - The authentication scope.
 */
export type GitHubAuthenticationResponse = {
    access_token: string,
    token_type: string,
    scope: string
};

/**
 * @type GithubAccount
 * @description The content of the github account.
 *
 * @property {string} user_id - The id of the user.
 * @property {string} access_token - The access token related to the user github account.
 */
export type GithubAccount = {
    user_id: string,
    access_token: string,
}
