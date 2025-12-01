import { githubAuthorizationQueryStringSchema } from "@area/shared/schemas/github.schema";
import z from "zod";

/**
 * @type githubAuthorizationQueryStringSchema
 * @description Query string required to authenticate with github.
 *
 * @property {string} code The code provided by github to authenticate the user
 * @property {string} state A state given by the client when making the authorization request
 */
export type GitHubAuthorizationQueryString = z.infer<typeof githubAuthorizationQueryStringSchema>;

/**
 * @type GitHubAuthorization
 * @description GitHubAuthorization type.
 *
 * @property {string} code The code provided by github to authenticate the user
 * @property {string} state A state given by the client when making the authorization request
 */
export type GitHubAuthorization = GitHubAuthorizationQueryString;

/**
 * @type GithubAccount
 * @description The content of the github account.
 *
 * @property {string} access_token - The response access token.
 * @property {string} token_type - The type of the token.
 * @property {string} scope - The authorization scope.
 */
export type GitHubAuthorizationResponse = {
    access_token: string,
    token_type: string,
    scope: string
};

/**
 * @type GithubAccount
 * @description The content of the github account.
 *
 * @property {string} userId - The id of the user.
 * @property {string} accessToken - The access token related to the user github account.
 */
export type GithubAccount = {
    userId: string,
    accessToken: string,
}
