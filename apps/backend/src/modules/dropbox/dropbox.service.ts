import type { DropboxAccount, DropboxAuthorizationResponse } from '@/types/third-parties';
import type { ThirdPartiesService } from '../third-parties';
import { HttpStatusCode } from '@area/shared/enums/http-status';
import { environment } from '@/utils/environment';
import ApiError from '@/utils/api-error';
import { decryptString, encryptString } from '@/utils/crypt';
import type { CreateAction } from '@area/shared/schemas/actions-reactions.schema';
import type { ActionPayload } from '@/types/action-reaction';

/**
 * @class DropboxService
 * @description The dropbox service.
 */
export class DropboxService {
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
    const dropboxAccount = await this.thirdPartiesService.getThirdPartyAccountByUserId<DropboxAccount>(
      'dropbox',
      userId,
    );

    return `${action.name}/(${action.params.path})/${dropboxAccount.id}`;
  }

  /**
   * @function createCursor
   * @description Create a cusor for the given user
   *
   * @param {DropboxAccount} dropboxAccount - The information about the user dropbox account
   * @returns {string} The newly created cursor
   */
  async createCursor(dropboxAccount: DropboxAccount): Promise<string | null> {
    const tryToCreateCursor = async (accessToken: string) => {
      const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: '',
          recursive: true,
        }),
      });
      let cursor = '';

      if (response.ok) {
        cursor = (await response.json()).cursor;
      }
      return { status: response.status, ok: response.ok, cursor: cursor };
    };

    let response = await tryToCreateCursor(decryptString(dropboxAccount.accessToken, environment.CRYPT_SECRET_KEY));

    if (response.status === HttpStatusCode.UNAUTHORIZED) {
      const accessToken = await this.refreshTokens(
        dropboxAccount.userId,
        decryptString(dropboxAccount.refreshToken || '', environment.CRYPT_SECRET_KEY),
      );

      response = await tryToCreateCursor(accessToken);
    }
    if (!response.ok) {
      return null;
    }
    return response.cursor;
  }

  /**
   * @function actionMiddleware
   * @description The action middleware of the dropbox service
   *
   * @param {ActionPayload} action - The payload of the action
   * @returns {Promise<string[]>} A list of trigger
   */
  async actionMiddleware(action: ActionPayload): Promise<string[]> {
    for (const id of action.content.ids) {
      const dropboxAccount = await this.thirdPartiesService.getThirdPartyAccountByServiceAccountId<DropboxAccount>(
        'dropbox',
        id,
      );

      if (dropboxAccount.cursor == null) {
        continue;
      }
      const tryToAccessCursors = async (accessToken: string, cursor: string) => {
        const response = await fetch('https://api.dropboxapi.com/2/files/list_folder/continue', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cursor: cursor,
          }),
        });
        return response;
      };

      let response = await tryToAccessCursors(
        decryptString(dropboxAccount.accessToken, environment.CRYPT_SECRET_KEY),
        dropboxAccount.cursor.ref,
      );

      if (response.status === HttpStatusCode.UNAUTHORIZED) {
        const accessToken = await this.refreshTokens(
          dropboxAccount.userId,
          decryptString(dropboxAccount.refreshToken || '', environment.CRYPT_SECRET_KEY),
        );

        response = await tryToAccessCursors(accessToken, dropboxAccount.cursor.ref);
      }
      if (response.ok) {
        const formattedResponse = await response.json();

        this.thirdPartiesService.updateThirdPartyAccount('dropbox', dropboxAccount.userId, {
          cursor: {
            ref: formattedResponse.cursor,
            paths: dropboxAccount.cursor.paths,
          },
        });
      }
    }
    return [];
  }

  /**
   * @function refreshDiscordTokens
   * @description Refresh a user dropbox tokens
   *
   * @param {state} userId - The id of the user
   * @param {state} refreshToken - The refresh token
   * @returns {Promise<string>} The refreshed token
   */
  async refreshTokens(userId: string, refreshToken: string): Promise<string> {
    const response = await fetch('https://www.dropbox.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: environment.DROPBOX_CLIENT_ID,
        client_secret: environment.DROPBOX_CLIENT_SECRET,
      }).toString(),
    });

    if (response.status !== HttpStatusCode.OK) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Error when refreshing Dropbox tokens');
    }

    const formattedResponse = (await response.json()) as DropboxAuthorizationResponse;

    const accessToken = formattedResponse.access_token;

    const account: Partial<DropboxAccount> = {
      accessToken: encryptString(accessToken, environment.CRYPT_SECRET_KEY),
    };

    this.thirdPartiesService.updateThirdPartyAccount('dropbox', userId, account);
    return accessToken;
  }
}
