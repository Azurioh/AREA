import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { CreateAction, CreateReaction } from '@area/shared/schemas/actions-reactions.schema';
import { Reaction } from '@/integrations';
import type { PollingService } from '@/modules/polling/polling.service';
import type { ThirdPartiesService } from '@/modules/third-parties';
import type { ActionPayload, ActionReaction } from '@/types/action-reaction';
import type { SpotifyPlaylist } from '@/types/spotify';
import type { SpotifyAccount, SpotifyAuthorizationResponse } from '@/types/third-parties';
import ApiError from '@/utils/api-error';
import { decryptString, encryptString } from '@/utils/crypt';
import { environment } from '@/utils/environment';
import type { WithId } from 'mongodb';

/**
 * @class SpotifyService
 * @description The spotify service.
 */
export class SpotifyService {
  private thirdPartiesService: ThirdPartiesService;
  private pollingService: PollingService;

  constructor(thirdPartiesService: ThirdPartiesService, pollingService: PollingService) {
    this.thirdPartiesService = thirdPartiesService;
    this.pollingService = pollingService;
  }

  /**
   * @function createAction
   * @description Create an action with the spotify service
   *
   * @param {string} actionReactionId - The id of the action reaction document
   * @param {string} userId - The id of the user creating the action
   * @param {CreateAction} action - The information about the action
   * @returns {Promise<string>} The trigger of the created action
   */
  async createAction(actionReactionId: string, userId: string, action: CreateAction): Promise<string> {
    const spotifyAccount = await this.thirdPartiesService.getThirdPartyAccountByUserId<SpotifyAccount>(
      'spotify',
      userId,
    );
    let trigger = '';

    switch (action.name) {
      case 'listening_to_artist': {
        trigger = await this.listeningToArtist(actionReactionId, spotifyAccount, action);
        break;
      }
      default: {
        throw new ApiError(HttpStatusCode.NOT_FOUND, `Action not found: ${action.name}`);
      }
    }
    return trigger;
  }

  /**
   * @function listeningToArtist
   * @description Create a listening to artist action
   *
   * @param {string} actionReactionId - The id of the action reaction document
   * @param {SpotifyAccount} spotifyAccount - The spotify account of the user
   * @param {CreateAction} action - The information about the action
   * @returns {Promise<string>} The trigger action to store in the db
   */
  async listeningToArtist(
    actionReactionId: string,
    spotifyAccount: SpotifyAccount,
    action: CreateAction,
  ): Promise<string> {
    const { artist } = action.params;
    const match = artist.match('/artist/([a-zA-Z0-9]+)?');
    let spotifyArtistId = '';

    if (!match) {
      let response = await this.search(
        decryptString(spotifyAccount.accessToken, environment.CRYPT_SECRET_KEY),
        artist,
        'artist',
      );

      if (response.status === HttpStatusCode.UNAUTHORIZED) {
        const accessToken = await this.refreshTokens(
          spotifyAccount.userId,
          decryptString(spotifyAccount.refreshToken || '', environment.CRYPT_SECRET_KEY),
        );

        response = await this.search(accessToken, artist, 'artist');
      }
      spotifyArtistId = response.search.artists.items[0].id || '';
    } else {
      spotifyArtistId = match[1] || '';
    }
    this.pollingService.addUserToPoll({
      service: 'spotify',
      actionReactionId,
      userId: spotifyAccount.userId,
      type: 'listening_to_artist',
      trigger: {
        artistId: spotifyArtistId,
        lastTrackId: null,
      },
    });
    return `listening_to_artist/${spotifyAccount.userId}/${spotifyArtistId}`;
  }

  /**
   * @function createReaction
   * @description Create an action with the github service
   *
   * @param {string} userId - The id of the user creating the action
   * @param {CreateReaction} reaction - The information about the reaction
   * @param {ActionPayload} action - The information about the issued action
   * @returns {Promise<boolean>} If the reaction was created
   */
  async createReaction(userId: string, reaction: CreateReaction, action: ActionPayload): Promise<boolean> {
    const spotifyAccount = await this.thirdPartiesService.getThirdPartyAccountByUserId<SpotifyAccount>(
      'spotify',
      userId,
    );

    switch (reaction.name) {
      case 'save_track_to_playlist':
        return this.saveTrackToPlayList(spotifyAccount, reaction, action);
      case 'save_episode':
        return this.saveEpisode(spotifyAccount, reaction, action);
      case 'save_show':
        return this.saveShow(spotifyAccount, reaction, action);
    }
    return false;
  }

  /**
   * @function saveTrackToPlayList
   * @description Save a track to a playlist
   *
   * @param {WithId<SpotifyAccount>} spotifyAccount - The spotify account of the user
   * @param {CreateReaction} reaction - The information about the reaction
   * @param {ActionPayload} action - The information about the issued action
   * @returns {Promise<boolean>} If the reaction was created
   */
  async saveTrackToPlayList(
    spotifyAccount: SpotifyAccount,
    reaction: CreateReaction,
    action: ActionPayload,
  ): Promise<boolean> {
    const [track] = Reaction.parseActionVariables(action, [reaction.params.track]);

    if (!track) {
      return false;
    }
    const tryToAddTrackToPlayList = async (accessToken: string) => {
      let spotifyTrack = '';
      const match = track.match('/track/([a-zA-Z0-9]+)?');

      if (!match) {
        const search = await this.search(accessToken, track, 'track');

        if (search.status === HttpStatusCode.UNAUTHORIZED) {
          return { status: HttpStatusCode.UNAUTHORIZED, ok: false };
        }
        spotifyTrack = search.search.tracks.items[0].uri;
      } else {
        spotifyTrack = `spotify:track:${match[1] || ''}`;
      }
      const response = await fetch(`https://api.spotify.com/v1/playlists/${reaction.params.playlist.id}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [spotifyTrack],
        }),
      });
      return response;
    };

    let response = await tryToAddTrackToPlayList(
      decryptString(spotifyAccount.accessToken, environment.CRYPT_SECRET_KEY),
    );

    if (response.status === HttpStatusCode.UNAUTHORIZED) {
      const accessToken = await this.refreshTokens(
        spotifyAccount.userId,
        decryptString(spotifyAccount.refreshToken || '', environment.CRYPT_SECRET_KEY),
      );

      response = await tryToAddTrackToPlayList(accessToken);
    }
    return response.ok;
  }

  /**
   * @function saveEpisode
   * @description Save an episode
   *
   * @param {WithId<SpotifyAccount>} spotifyAccount - The spotify account of the user
   * @param {CreateReaction} reaction - The information about the reaction
   * @param {ActionPayload} action - The information about the issued action
   * @returns {Promise<boolean>} If the reaction was created
   */
  async saveEpisode(spotifyAccount: SpotifyAccount, reaction: CreateReaction, action: ActionPayload): Promise<boolean> {
    const [episode] = Reaction.parseActionVariables(action, [reaction.params.episode]);

    if (!episode) {
      return false;
    }
    const tryToSaveEpisode = async (accessToken: string) => {
      let spotifyEpisodeId = '';
      const match = episode.match('/episode/([a-zA-Z0-9]+)?');

      if (!match) {
        const search = await this.search(accessToken, episode, 'episode');

        if (search.status === HttpStatusCode.UNAUTHORIZED) {
          return { status: HttpStatusCode.UNAUTHORIZED, ok: false };
        }
        spotifyEpisodeId = search.search.episodes.items[0].id;
      } else {
        spotifyEpisodeId = `${match[1] || ''}`;
      }
      const response = await fetch(`https://api.spotify.com/v1/me/episodes`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: [spotifyEpisodeId],
        }),
      });
      return response;
    };

    let response = await tryToSaveEpisode(decryptString(spotifyAccount.accessToken, environment.CRYPT_SECRET_KEY));

    if (response.status === HttpStatusCode.UNAUTHORIZED) {
      const accessToken = await this.refreshTokens(
        spotifyAccount.userId,
        decryptString(spotifyAccount.refreshToken || '', environment.CRYPT_SECRET_KEY),
      );

      response = await tryToSaveEpisode(accessToken);
    }
    return response.ok;
  }

  /**
   * @function saveShow
   * @description Save a show
   *
   * @param {WithId<SpotifyAccount>} spotifyAccount - The spotify account of the user
   * @param {CreateReaction} reaction - The information about the reaction
   * @param {ActionPayload} action - The information about the issued action
   * @returns {Promise<boolean>} If the reaction was created
   */
  async saveShow(spotifyAccount: SpotifyAccount, reaction: CreateReaction, action: ActionPayload): Promise<boolean> {
    const [show] = Reaction.parseActionVariables(action, [reaction.params.show]);

    if (!show) {
      return false;
    }
    const tryToSaveShow = async (accessToken: string) => {
      let spotifyShowId = '';
      const match = show.match('/show/([a-zA-Z0-9]+)?');

      if (!match) {
        const search = await this.search(accessToken, show, 'show');

        if (search.status === HttpStatusCode.UNAUTHORIZED) {
          return { status: HttpStatusCode.UNAUTHORIZED, ok: false };
        }
        spotifyShowId = search.search.shows.items[0].id;
      } else {
        spotifyShowId = `${match[1] || ''}`;
      }
      const response = await fetch(`https://api.spotify.com/v1/me/shows?ids=${spotifyShowId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    };

    let response = await tryToSaveShow(decryptString(spotifyAccount.accessToken, environment.CRYPT_SECRET_KEY));

    if (response.status === HttpStatusCode.UNAUTHORIZED) {
      const accessToken = await this.refreshTokens(
        spotifyAccount.userId,
        decryptString(spotifyAccount.refreshToken || '', environment.CRYPT_SECRET_KEY),
      );

      response = await tryToSaveShow(accessToken);
    }
    return response.ok;
  }

  /**
   * @functionget searchUri
   * @description Search the uri of a given query
   *
   * @param {string} accessToken The access token of the user
   * @param {string} q The search query
   * @param {string} type The types to search (separated by comma)
   * @returns {Promise<string>} The id of the track
   */
  async search(accessToken: string, q: string, type: string): Promise<{ status: number; search: any }> {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=${type}&limit=1`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { status: response.status, search: await response.json() };
  }

  /**
   * @function refreshDiscordTokens
   * @description Refresh a user spotify tokens
   *
   * @param {state} userId - The id of the user
   * @param {state} refreshToken - The refresh token
   * @returns {Promise<string>} The refreshed token
   */
  async refreshTokens(userId: string, refreshToken: string): Promise<string> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${environment.SPOTIFY_CLIENT_ID}:${environment.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    if (response.status !== HttpStatusCode.OK) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Error when refreshing Spotify tokens');
    }

    const formattedResponse = (await response.json()) as SpotifyAuthorizationResponse;

    const accessToken = formattedResponse.access_token;

    const account: Partial<SpotifyAccount> = {
      accessToken: encryptString(accessToken, environment.CRYPT_SECRET_KEY),
    };

    this.thirdPartiesService.updateThirdPartyAccount('spotify', userId, account);
    return accessToken;
  }

  /**
   * @function listPlaylisst
   * @description List all repositories for the given user
   *
   * @param {string} userId The id of the user
   * @returns {Promise<GithubRepositories>} Array of repository names
   */
  async listPlaylist(userId: string): Promise<SpotifyPlaylist[]> {
    const spotifyAccount = await this.thirdPartiesService.getThirdPartyAccountByUserId<SpotifyAccount>(
      'spotify',
      userId,
    );

    const tryToListPlaylists = async (accessToken: string) => {
      const response = await fetch(`https://api.spotify.com/v1/users/${spotifyAccount.id}/playlists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
        },
      });
      return response;
    };
    let response = await tryToListPlaylists(decryptString(spotifyAccount.accessToken, environment.CRYPT_SECRET_KEY));

    if (response.status === HttpStatusCode.UNAUTHORIZED) {
      const accessToken = await this.refreshTokens(
        spotifyAccount.userId,
        decryptString(spotifyAccount.refreshToken || '', environment.CRYPT_SECRET_KEY),
      );

      response = await tryToListPlaylists(accessToken);
    }

    if (!response.ok) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Failed to list playlists');
    }

    const data = await response.json();

    const playlists: SpotifyPlaylist[] = data.items
      .filter((playlist: any) => playlist.owner?.id === spotifyAccount.id || false)
      .map((playlist: any) => {
        return {
          name: playlist.name,
          id: `${playlist.id}`,
        };
      });
    return playlists;
  }

  /**
   * @function deleteAction
   * @description Delete an action reaction
   *
   * @param {WithId<ActionReaction>} actionReaction - The action reaction to delete
   * @returns {Promise<void>} Nothing
   */
  async deleteAction(actionReaction: WithId<ActionReaction>): Promise<void> {
    await this.pollingService.deleteUserToPollByActionReactionId(actionReaction._id.toString());
  }
}
