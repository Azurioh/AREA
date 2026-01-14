import { DropboxFolderCreatedAction } from '../folder-created.action';

describe('DropboxFolderCreatedAction', () => {
  it('should be initialized correctly', () => {
    const action = new DropboxFolderCreatedAction();
    expect(action.name).toBe('folder_created');
  });

  it('should resolve refreshParams', async () => {
    const action = new DropboxFolderCreatedAction();
    await expect(action.refreshParams('user-id')).resolves.toBeUndefined();
  });
});
