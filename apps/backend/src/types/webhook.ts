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
 * @type UnsplashWebhookPayload
 * @description The payload of the unsplash webhook.
 *
 * @property {Object} image The information about the image
 * @property {string} image.url The url of the image
 * @property {string} image.topic The topic of the image
 * @property {number} image.likes The number of likes of the image
 * @property {Object} user The user information
 * @property {string} user.username The username of the user
 * @property {string} user.bio The bio of the user
 */
export type UnsplashWebhookPayload = {
  image: {
    url: string;
    topic: string;
    likes: number;
  };
  user: {
    username: string;
    bio: string;
  };
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
