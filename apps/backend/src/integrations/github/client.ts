import { Octokit } from '@octokit/rest';

/**
 * @function getGithubClient
 * @description Get a github client
 *
 * @param {string} accessToken The access token to use
 * @returns {Octokit} The github client
 */
export const getGithubClient = (accessToken: string): Octokit =>
  new Octokit({
    auth: accessToken,
    userAgent: 'AREA/1.0.0',
    timeZone: 'Europe/Paris',
  });
