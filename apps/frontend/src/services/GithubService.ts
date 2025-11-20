import { ApiService } from './ApiService';

/**
 * @class GithubService
 * @description Github service
 */
export class GithubService extends ApiService {
  /**
   * @function listRepositories
   * @description List repositories
   *
   * @returns {Promise<string[]>} The list of repositories
   */
  async listRepositories(): Promise<string[]> {
    const response = await this.fetch<string[]>('/v1/repositories', {
      method: 'GET',
      skipAuth: true,
    });

    return response;
  }
}
