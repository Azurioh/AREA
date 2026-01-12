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

/**
 * @type SpotifyWebhookPayload
 * @description The payload of the spotify webhook.
 *
 * @property {string} ids the ids relative to the triggered webhook
 */
export type SpotifyWebhookPayload = {
  ids: string;
};

/**
 * @type DropboxWebhookPayload
 * @description The payload of the dropbox webhook.
 *
 * @property {Object} list_folder The information about who got changes
 * @property {string[]} list_folder.accounts The accounts who were changed
 */
export type DropboxWebhookPayload = {
  list_folder: {
    accounts: string[];
  };
};
