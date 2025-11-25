import { HttpStatusCode } from '@area/shared/enums/http-status';
import ApiError from '@/utils/api-error';

/**
 * @function listRepositories
 * @description List all repositories for the authenticated user
 *
 * @returns {Promise<string[]>} Array of repository names
 */
export class GithubService {
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
}
