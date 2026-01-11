import { Action } from '@/integrations/_definitions/action.interface';

export class DropboxFileModifiedAction extends Action {
  constructor() {
    super(
      'file_modified',
      'Action triggered when a file is modified in a specified path',
      [
        {
          type: 'input',
          key: 'path',
          label: 'Path',
          placeholder: 'Enter a path',
        },
      ],
      [
        {
          key: 'name',
          description: 'The name of the file that triggered the action',
          type: 'string',
          path: 'name',
        },
        {
          key: 'path',
          description: 'The path in which the file was created',
          type: 'string',
          path: 'path',
        },
      ],
    );
  }

  /**
   * @function refreshParams
   * @description Refresh the parameters of the action
   *
   * @param {string} userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  override async refreshParams(_userId: string): Promise<void> {
    return Promise.resolve();
  }
}
