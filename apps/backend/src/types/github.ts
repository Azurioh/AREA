// import type { githubAuthorizationQueryStringSchema } from '@area/shared/schemas/github.schema';
// import type z from 'zod';

// /**
//  * @type githubAuthorizationQueryStringSchema
//  * @description Query string required to authenticate with github.
//  *
//  * @property {string} code The code provided by github to authenticate the user
//  * @property {string} state A state given by the client when making the authorization request
//  */
// export type GitHubAuthorizationQueryString = z.infer<typeof githubAuthorizationQueryStringSchema>;

// /**
//  * @type GitHubAuthorization
//  * @description GitHubAuthorization type.
//  *
//  * @property {string} code The code provided by github to authenticate the user
//  * @property {string} state A state given by the client when making the authorization request
//  */
// export type GitHubAuthorization = GitHubAuthorizationQueryString;

// /**
//  * @type GithubAccount
//  * @description The content of the github account.
//  *
//  * @property {string} userId - The id of the user.
//  * @property {string} accessToken - The access token related to the user github account.
//  */
// export type GithubAccount = {
//   userId: string;
//   accessToken: string;
// };

//TODO: change this to GithubRepository (alan met moi un commentaire si le commentaire est encore la)
/**
 * @type GithubRepositories
 * @description The type representing a github repository.
 *
 * @property {string} name - The name of the repository.
 * @property {string} id - The id of the repository.
 */
export type GithubRepositories = [
  {
    name: string;
    id: string;
  },
];
