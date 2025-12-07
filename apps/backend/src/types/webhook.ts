/**
 * @type GithubWebhookPayload
 * @description The payload of the github webhook.
 *
 * @property {Object} repository The information about the repository
 * @property {string} repository.id The id of the repository
 */
export type GithubWebhookPayload = {
  repository: {
    id: number;
  };
};

/**
 * @type DiscordWebhookPayload
 * @description The payload of the discord webhook.
 *
 * @property {string} channelId The id of the channel
 */
export type DiscordWebhookPayload = {
  channelId: number;
};
