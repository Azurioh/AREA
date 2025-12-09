import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { CreateAction, CreateReaction } from '@area/shared/schemas/actions-reactions.schema';
import type { GithubRepository } from '@/types/github';
import ApiError from '@/utils/api-error';
import { decryptString } from '@/utils/crypt';
import { environment } from '@/utils/environment';
import type { ThirdPartiesService } from '../third-parties';
import type { GithubAccount } from '@/types/third-parties';

/**
 * @class GithubService
 * @description The github service.
 */
export class GithubService {
  private thirdPartiesService: ThirdPartiesService;

  constructor(thirdPartiesService: ThirdPartiesService) {
    this.thirdPartiesService = thirdPartiesService;
  }

  /**
   * @function createAction
   * @description Create an action with the github service
   *
   * @param {string} userId - The id of the user creating the action
   * @param {CreateAction} action - The information about the action
   * @returns {Promise<boolean>} If the action was created
   */
  async createAction(userId: string, action: CreateAction): Promise<string> {
    const githubAccount = await this.thirdPartiesService.getThirdPartyAccountByUserId<GithubAccount>('github', userId);

    const response = await fetch(
      `https://api.github.com/repos/${githubAccount.username}/${action.params.repository.name}/hooks`,
      {
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
      },
    );

    const formattedResponse = await response.json();

    const trigger = `${action.name}/${action.params.repository.id}`;

    if (!response.ok) {
      for (const error of formattedResponse.errors || []) {
        if (!error) {
          continue;
        }
        if (error.code === 'custom' && error.message === 'Hook already exists on this repository') {
          return trigger;
        }
      }
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
    const githubAccount = await this.thirdPartiesService.getThirdPartyAccountByUserId<GithubAccount>('github', userId);

    switch (reaction.name) {
      case 'create_issue': {
        const response = await fetch(
          `https://api.github.com/repos/${githubAccount.username}/${reaction.params.repository.name}/issues`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${decryptString(githubAccount.accessToken, environment.CRYPT_SECRET_KEY)}`,
              Accept: 'application/vnd.github+json',
            },
            body: JSON.stringify({
              title: reaction.params.title,
              body: reaction.params.body,
            }),
          },
        );
        return response.ok;
      }
    }
    return false;
  }

  /**
   * @function listRepositories
   * @description List all repositories for the given user
   *
   * @param {string} userId The id of the user
   * @returns {Promise<GithubRepositories>} Array of repository names
   */
  async listRepositories(userId: string): Promise<GithubRepository[]> {
    const githubAccount = await this.thirdPartiesService.getThirdPartyAccountByUserId<GithubAccount>('github', userId);

    const response = await fetch(`https://api.github.com/user/repos`, {
      headers: {
        Authorization: `Bearer ${decryptString(githubAccount.accessToken, environment.CRYPT_SECRET_KEY)}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Failed to list repositories');
    }

    const data = await response.json();

    const repositories: GithubRepository[] = data
      .filter((repo: any) => repo.permissions?.admin || false)
      .map((repo: any) => {
        return {
          name: repo.name,
          id: `${repo.id}`,
        };
      });
    return repositories;
  }
}
