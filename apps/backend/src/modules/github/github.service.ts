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
import { decryptString, encryptString } from '@/utils/crypt';
import { CreateAction, CreateReaction } from '@area/shared/schemas/action-reaction.schema';

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
   * @function createAction
   * @description Create an action with the github service
   *
   * @param {string} userId - The id of the user creating the action
   * @param {Omit<CreateAction, 'trigger'>} action - The information about the action
   * @returns {Promise<boolean>} If the action was created
   */
  async createAction(userId: string, action: Omit<CreateAction, 'trigger'>): Promise<string> {
    const githubAccount = await this.getGithubAccountByUserId(userId);

    if (!githubAccount) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Github account not found');
    }
    const userName = await this.getUserName(userId, githubAccount);

    const response = await fetch(`https://api.github.com/repos/${userName}/${action.params.repository}/hooks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${decryptString(githubAccount.accessToken, environment.CRYPT_SECRET_KEY)}`,
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({
        name: 'web',
        active: true,
        events: [action.name],
        config: {
          url: `${environment.BASE_API_URL}/webhook/v1/github`,
          content_type: 'json',
        },
      }),
    });

    const formattedResponse = await response.json()

    const trigger = `${action.name}/${action.params.repository}`

    if (!response.ok) {
      console.log(formattedResponse.errors);
      for (const error of formattedResponse.errors) {
        if (!error) {
          continue;
        }
        if (error.code == 'custom' && error.message == 'Hook already exists on this repository') {
          return trigger;
        }
      }
      console.log(formattedResponse);
      throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Error when creating github webhook');
    }
    return trigger;
  }

  /**
   * @function createReaction
   * @description Create an action with the github service
   *
   * @param {string} userId - The id of the user creating the action
   * @param {CreateReaction} action - The information about the action
   * @returns {Promise<boolean>} If the action was created
   */
  async createReaction(userId: string, reaction: CreateReaction): Promise<boolean> {
    const githubAccount = await this.getGithubAccountByUserId(userId);

    if (!githubAccount) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Github account not found');
    }
    switch (reaction.name) {
      case 'issue': {
        const userName = await this.getUserName(userId, githubAccount);

        const response = await fetch(`https://api.github.com/repos/${userName}/${reaction.params.repository}/issues`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${decryptString(githubAccount.accessToken, environment.CRYPT_SECRET_KEY)}`,
            Accept: 'application/vnd.github+json',
          },
          body: JSON.stringify({
            title: reaction.params.title,
            body: reaction.params.body
          }),
        });
        return response.ok
      }
    }
    return false;
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
   * @function listRepositories
   * @description List all repositories for the authenticated user
   *
   * @returns {Promise<string>} The name of the user
   */
  async getUserName(userId: string, account?: GithubAccount): Promise<string> {
    const githubAccount = account ?? await this.getGithubAccountByUserId(userId);

    if (!githubAccount) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Github account not found');
    }
    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${decryptString(githubAccount.accessToken, environment.CRYPT_SECRET_KEY)}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Failed to get github user information');
    }

    const data = await response.json();

    return data.login || '';
  }
}
