/**
 * @type ServiceToPoll
 * @description The name of the different service to poll
 */
export type ServiceToPoll = 'spotify';

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
