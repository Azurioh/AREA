import { HttpStatusCode } from '@area/shared/enums/http-status';
import ApiError from '@/utils/api-error';
import { environment } from '@/utils/environment';
import { verifyToken } from '@/utils/token';
import { UsersService } from '../users';
import { StateToken } from '@area/shared/types/user.types';
import { GithubRepository } from './github.repository';
import { GithubAccount, GitHubAuthorizationResponse } from '@/types/github';
import { MaybeNull } from '@area/shared/utils/common';
import { WithId } from 'mongodb';
import { encryptString } from '@/utils/crypt';

/**
 * @class GithubService
 * @description The github service.
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

  /**
   * @function authorizeUser
   * @description Authorize a user to a github account
   *
   * @param {string} code - The code provided by github to get the tokens
   * @param {state} state - A string to protect against threats
   * @returns {Promise<boolean>} If the autorization was succesful
   */
  async authorizeUser(code: string, state: string): Promise<boolean> {
    const decoded = verifyToken<StateToken>(state, environment.JWT_STATE_TOKEN_SECRET);

    if (!(await this.usersService.checkIfUserExist(decoded._id))) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'User does not exist');
    }

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "application/json",
      },
      body: new URLSearchParams({
        client_id: environment.GITHUB_CLIENT_ID,
        client_secret: environment.GITHUB_CLIENT_SECRET,
        code: code
      })
    });

    if (response.status != HttpStatusCode.OK) {
      return false;
    }

    const formattedResponse = await response.json() as GitHubAuthorizationResponse;

    const data: GithubAccount = {
      userId: decoded._id,
      accessToken: encryptString(formattedResponse.access_token, environment.CRYPT_SECRET_KEY),
    }

    let success = false;
    const account = await this.getGithubAccountByUserId(decoded._id);

    if (account) {
      const update = await this.repository.updateGithubAccount(account._id.toString(), data);

      success = update.acknowledged && (update.matchedCount > 0);
    } else {
      success = await this.repository.createGithubAccount(data);
    }
    return success;
  }

  /**
   * @function getGithubAccountByUserId
   * @description Get a gtihub account by a user id
   *
   * @param {string} userId - The user id
   * @returns {Promise<MaybeNull<WithId<GithubAccount>>>} The github account
   */
  async getGithubAccountByUserId(userId: string): Promise<MaybeNull<WithId<GithubAccount>>> {
    return await this.repository.getGithubAccountByUserId(userId);
  }
}
