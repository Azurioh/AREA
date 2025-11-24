import z from 'zod';

export const webhookField = {
  uuid: z.uuidv4().meta({
    description: 'The UUID of the webhook',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  githubUrl: z.url().meta({
    description: 'The URL of the GitHub repository',
    example: 'https://github.com/username/repository',
  }),
  actions: z.array(z.string()).meta({
    description: 'The actions to trigger the webhook',
    example: ['push', 'pull_request'],
  }),
  discordWebhookUrl: z.url().meta({
    description: 'The Discord webhook URL',
    example: 'https://discord.com/api/webhooks/1234567890',
  }),
};

export const webhookSchema = z.object(webhookField);

/**
 * @type Webhook
 * @description This type represents a webhook configuration.
 *
 * @property {string} uuid - The UUID of the webhook.
 * @property {string} githubUrl - The URL of the GitHub repository.
 * @property {string[]} actions - The actions to trigger the webhook.
 * @property {string} discordWebhookUrl - The Discord webhook URL.
 */
export type Webhook = z.infer<typeof webhookSchema>;
