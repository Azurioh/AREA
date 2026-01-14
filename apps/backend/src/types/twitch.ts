/**
 * @type TwitchEventSubscriptionType
 * @description The Twitch event subscription type.
 *
 * @property {string} type - The type of the event subscription.
 * @property {string} version - The version of the event subscription.
 * @property {object} condition - The condition of the event subscription.
 * @property {string} condition.broadcaster_user_id - The broadcaster user id.
 * @property {string} [condition.moderator_user_id] - The moderator user id.
 * @property {object} transport - The transport of the event subscription.
 * @property {string} transport.method - The transport method.
 * @property {string} transport.callback - The transport callback.
 * @property {string} [transport.secret] - The transport secret.
 */
export type TwitchEventSubscription = {
  type: string;
  version: string;
  condition: {
    broadcaster_user_id: string;
    moderator_user_id?: string;
  };
  transport: {
    method: string;
    callback: string;
    secret?: string;
  };
};

/**
 * @type TwitchAppAccessTokenResponse
 * @description The response of the Twitch app access token request.
 *
 * @property {string} access_token - The access token.
 * @property {number} expires_in - The expiration time in seconds.
 */
export type TwitchAppAccessTokenResponse = {
  access_token: string;
  expires_in: number;
};

/**
 * @type TwitchAppAccessToken
 * @description The Twitch app access token.
 *
 * @property {string} accessToken - The access token.
 * @property {number} expiresAt - The expiration time in milliseconds since epoch.
 */
export type TwitchAppAccessToken = {
  accessToken: string;
  expiresAt: number;
};

/**
 * @type FollowedChannel
 * @description The type representing a followed channel.
 *
 * @property {string} broadcaster_id - The id of the broadcaster.
 * @property {string} broadcaster_name - The name of the broadcaster.
 */
export type FollowedChannel = {
  broadcaster_id: string;
  broadcaster_name: string;
};

/**
 * @type FollowedChannelsResponse
 * @description The response of the followed channels request.
 *
 * @property {FollowedChannel[]} data - The list of followed channels.
 * @property {object} pagination - The pagination information.
 * @property {string} pagination.cursor - The cursor for the next page.
 */
export type FollowedChannelsResponse = {
  data: FollowedChannel[];
  pagination: {
    cursor: string | undefined;
  };
};

/**
 * @type TwitchStreamer
 * @description The type representing a twitch streamer.
 *
 * @property {string} name - The name of the streamer.
 * @property {string} id - The id of the streamer.
 */
export type TwitchStreamer = {
  name: string;
  id: string;
};
