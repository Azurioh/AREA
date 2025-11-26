import { HttpStatusCode } from '@area/shared/enums/http-status';
import ApiError from '@/utils/api-error';
import { environment } from '@/utils/environment';
import { verifyToken } from '@/utils/token';
import { UsersService } from '../users';
import { StateToken } from '@area/shared/types/user.types';
import { GithubRepository } from './github.repository';
import { GithubAccount, GitHubAuthenticationResponse } from '@/types/github';

/**
 * @function listRepositories
 * @description List all repositories for the authenticated user
 *
 * @returns {Promise<string[]>} Array of repository names
 */
export class GithubService {
  private repository: GithubRepository;
  private usersService: UsersService;

  constructor (repository: GithubRepository, usersService: UsersService) {
    this.repository = repository;
    this.usersService = usersService;
  }

  /**
   * @function listRepositories
   * @description List all repositories for the authenticated user
   *
   * @returns {Promise<string[]>} Array of repository names
   */
  async listRepositories(): Promise<string[]> {
    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Failed to list repositories');
    }

    const data = await response.json();
    const repositoryNames = data.map((repo: any) => repo.full_name);
    return repositoryNames;
  }

  /**
   * @function createWebhookOnRepository
   * @description Create a webhook on a specific repository
   *
   * @param {string} repository - The repository name
   * @param {string[]} actions - The actions to trigger the webhook
   * @param {string} discordWebhookUrl - The Discord webhook URL
   *
   * @returns {Promise<void>}
   */
  async createWebhookOnRepository(repository: string, actions: string[], discordWebhookUrl: string): Promise<void> {
    const response = await fetch(`https://api.github.com/repos/${repository}/hooks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({
        name: 'web',
        active: true,
        events: actions,
        config: {
          url: `${discordWebhookUrl}/github`,
          content_type: 'json',
        },
      }),
    });

    if (!response.ok) {
      console.log(response);
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Failed to create webhook on repository');
    }
  }

  async authenticateUser(code: string, state: string): Promise<void> {
    const decoded = verifyToken<StateToken>(state, environment.JWT_STATE_TOKEN_SECRET);

    if (!(await this.usersService.checkIfUserExist(decoded._id))) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'User does not exist');
    }

    console.log("user exists");

    const url = 'https://github.com/login/oauth/access_token?' + new URLSearchParams({
      client_id: environment.GITHUB_CLIENT_ID,
      client_secret: environment.GITHUB_CLIENT_SECRET,
      code: code
    }).toString();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });

    if (response.status != HttpStatusCode.OK) {
      throw new ApiError(response.status, response.statusText);
    }

    const formattedResponse = await response.json() as GitHubAuthenticationResponse;

    const data: GithubAccount = {
      user_id: decoded._id,
      access_token: formattedResponse.access_token,
      refresh_token: formattedResponse.refresh_token,
    }

    const acknowledged = await this.repository.createGithubAccount(data);

    if (!acknowledged) {
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        'Failed to create the github account, please contact an administrator.',
      );
    }
  }
}

// https://github.com/login/oauth/authorize?client_id=Iv23litjn2tGUniPtEBi&redirect_uri=https://area-dev.loca.lt/github/v1/auth&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTI0ODMwOGU2ZjI1Nzg1Y2QwMjMxNzEiLCJpYXQiOjE3NjQxNzg3MDcsImV4cCI6MTc2NDE3OTMwN30.FtbJnkdh09SJo2yTBe6mX2zQV2WQQ-f2qRUS65QqLr8
