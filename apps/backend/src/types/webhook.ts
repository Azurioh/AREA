/**
 * @type DiscordAuthorizationQueryString
 * @description Query string required to authenticate with discord.
 *
 * @property {Object} repository The information about the repository
 * @property {string} repository.name The name of the repository
 */
export type GithubWebhookPayload = {
  repository: {
    name: string;
  };
};
