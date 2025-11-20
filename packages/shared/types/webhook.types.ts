/**
 * @type Webhook
 * @description This type represents a webhook configuration.
 *
 * @property {string} uuid - The UUID of the webhook.
 * @property {string} githubUrl - The URL of the GitHub repository.
 * @property {string[]} actions - The actions to trigger the webhook.
 * @property {string} discordWebhookUrl - The Discord webhook URL.
 */
export type Webhook = {
  uuid: string;
  githubUrl: string;
  actions: string[];
  discordWebhookUrl: string;
};

/**
 * @type GetWebhookByUuidParams
 * @description Parameters required to get a webhook by its UUID.
 *
 * @property {string} uuid - The UUID of the webhook.
 */
export type GetWebhookByUuidParams = {
  uuid: string;
};

/**
 * @type DeleteWebhookParams
 * @description Parameters required to delete a webhook by its UUID.
 *
 * @property {string} uuid - The UUID of the webhook.
 */
export type DeleteWebhookParams = {
  uuid: string;
};

/**
 * @type CreateWebhookBody
 * @description Parameters required to create a webhook.
 *
 * @property {string} githubUrl - The URL of the GitHub repository.
 * @property {string} discordWebhookUrl - The Discord webhook URL.
 */
export type CreateWebhookBody = Omit<Webhook, 'uuid'>;
