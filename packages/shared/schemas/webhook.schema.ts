import { webhookField } from '@area/shared/types/webhook.types';
import { z } from 'zod';

/************************
 * LIST WEBHOOK BY UUID *
 ************************/

export const listWebhooksResponseSchema = z.array(
  z.object({
    uuid: webhookField.uuid,
    githubUrl: webhookField.githubUrl,
    actions: webhookField.actions,
    discordWebhookUrl: webhookField.discordWebhookUrl,
  }),
);

/**
 * @type ListWebhooksResponse
 * @description List of webhooks.
 *
 * @property {Webhook[]} webhooks - The list of webhooks.
 */
export type ListWebhooksResponse = z.infer<typeof listWebhooksResponseSchema>;

/***********************
 * GET WEBHOOK BY UUID *
 ***********************/

export const getWebhookByUuidParamsSchema = z.object({
  uuid: webhookField.uuid,
});

/**
 * @type GetWebhookByUuidParams
 * @description Parameters required to get a webhook by its UUID.
 *
 * @property {string} uuid - The UUID of the webhook.
 */
export type GetWebhookByUuidParams = z.infer<typeof getWebhookByUuidParamsSchema>;

export const getWebhookByUuidResponseSchema = z.object({
  uuid: webhookField.uuid,
  githubUrl: webhookField.githubUrl,
  actions: webhookField.actions,
  discordWebhookUrl: webhookField.discordWebhookUrl,
});

/************************
 * CREATE WEBHOOK *
 ************************/

export const createWebhookBodySchema = z.object({
  githubUrl: webhookField.githubUrl,
  actions: webhookField.actions,
  discordWebhookUrl: webhookField.discordWebhookUrl,
});

/**
 * @type CreateWebhookBody
 * @description Parameters required to create a webhook.
 *
 * @property {string} githubUrl - The URL of the GitHub repository.
 * @property {string[]} actions - The actions to trigger the webhook.
 * @property {string} discordWebhookUrl - The Discord webhook URL.
 */
export type CreateWebhookBody = z.infer<typeof createWebhookBodySchema>;

export const createWebhookResponseSchema = z.object({
  message: z.string().meta({
    description: 'A message indicating the success of the operation.',
    example: 'Webhook created successfully',
  }),
});

/**************************
 * DELETE WEBHOOK BY UUID *
 **************************/

export const deleteWebhookParamsSchema = z.object({
  uuid: webhookField.uuid,
});

/**
 * @type DeleteWebhookParams
 * @description Parameters required to delete a webhook by its UUID.
 *
 * @property {string} uuid - The UUID of the webhook.
 */
export type DeleteWebhookParams = z.infer<typeof deleteWebhookParamsSchema>;
