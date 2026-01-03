import type { SpotifyAccount, SpotifyAuthorizationResponse } from '@/types/third-parties';
import type { ThirdPartiesService } from '../third-parties';
import { HttpStatusCode } from '@area/shared/enums/http-status';
import { environment } from '@/utils/environment';
import ApiError from '@/utils/api-error';
import { decryptString, encryptString } from '@/utils/crypt';
import type { CreateAction, CreateReaction } from '@area/shared/schemas/actions-reactions.schema';
import type { ActionPayload } from '@/types/action-reaction';
import { Reaction } from '@/integrations';
import type { WithId } from 'mongodb';

/**
 * @class SpotifyService
 * @description The spotify service.
 */
export class SpotifyService {
  private thirdPartiesService: ThirdPartiesService;

  constructor(thirdPartiesService: ThirdPartiesService) {
    this.thirdPartiesService = thirdPartiesService;
  }

  /**
   * @function createAction
   * @description Create an action with the github service
   *
   * @param {string} userId - The id of the user creating the action
   * @param {CreateAction} action - The information about the action
   * @returns {Promise<boolean>} If the action was created
   */
  async createAction(userId: string, action: CreateAction): Promise<string> {
    const spotifyAccount = await this.thirdPartiesService.getThirdPartyAccountByUserId<SpotifyAccount>(
      'spotify',
      userId,
    );
    const trigger = '';

    action;
    spotifyAccount;
    return trigger;
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
      case 'add_track_to_playlist':
        return this.addTrackToPlayList(spotifyAccount, reaction, action);
      case 'save_episode':
        return this.saveEpisode(spotifyAccount, reaction, action);
    }
    return false;
  }

  /**
   * @function addTrackToPlayList
   * @description Add a track to a playlist
   *
   * @param {WithId<SpotifyAccount>} spotifyAccount - The spotify account of the user
   * @param {CreateReaction} reaction - The information about the reaction
   * @param {ActionPayload} action - The information about the issued action
   * @returns {Promise<boolean>} If the reaction was created
   */
  async addTrackToPlayList(
    spotifyAccount: WithId<SpotifyAccount>,
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
        spotifyAccount._id.toString(),
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
  async saveEpisode(
    spotifyAccount: WithId<SpotifyAccount>,
    reaction: CreateReaction,
    action: ActionPayload,
  ): Promise<boolean> {
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
      console.log(spotifyEpisodeId);
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
      console.log(response);
      return response;
    };

    let response = await tryToSaveEpisode(decryptString(spotifyAccount.accessToken, environment.CRYPT_SECRET_KEY));

    if (response.status === HttpStatusCode.UNAUTHORIZED) {
      const accessToken = await this.refreshTokens(
        spotifyAccount._id.toString(),
        decryptString(spotifyAccount.refreshToken || '', environment.CRYPT_SECRET_KEY),
      );

      response = await tryToSaveEpisode(accessToken);
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
   * @param {state} accountId - The id of the account
   * @param {state} refreshToken - The refresh token
   * @returns {Promise<string>} The refreshed token
   */
  async refreshTokens(accountId: string, refreshToken: string): Promise<string> {
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

    this.thirdPartiesService.updateThirdPartyAccount('spotify', accountId, account);
    return accessToken;
  }
}
