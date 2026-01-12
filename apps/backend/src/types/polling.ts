/**
 * @type ServiceToPoll
 * @description The name of the different service to poll
 */
export type ServiceToPoll = 'spotify' | 'unsplash';

/**
 * @type Polling
 * @description A polling document.
 *
 * @property {PollingService} service - The name of the service for which to poll.
 * @property {string} userId - The id of the user for which to poll.
 * @property {string} type - The type of the poll.
 * @property {string} trigger - What will trigger the polling and send call the api.
 */
export type Polling = {
  service: ServiceToPoll;
  userId: string;
  type: string;
  trigger: any;
};

/**
 * @type SpotifyCurrentlyPlayingTrack
 * @description The return of the currently playing track.
 *
 * @property {Object} item - The informations about the currently playing song.
 * @property {Object[]} item.artists - The informations about the artists.
 * @property {string} item.artists.id - The id of the artist.
 * @property {string} item.artists.name - The name of the artist.
 */
export type SpotifyCurrentlyPlayingTrack = {
  item: {
    artists: [
      {
        id: string;
        name: string;
      },
    ];
  };
};

/**
 * @type UnsplashDailyRandomImage
 * @description The return of the daily random image.
 *
 * @property {Object} urls - The urls of the image.
 * @property {string} urls.regular - The regular url of the image.
 * @property {number} likes - The number of likes of the image.
 * @property {Object} user - The user information.
 * @property {string} user.username - The username of the user.
 * @property {string} user.bio - The bio of the user.
 */
export type UnsplashDailyRandomImage = {
  urls: {
    regular: string;
  };
  likes: number;
  user: {
    username: string;
    bio: string;
  };
};
