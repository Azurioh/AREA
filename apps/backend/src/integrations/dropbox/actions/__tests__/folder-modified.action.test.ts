import { DropboxFolderModifiedAction } from '../folder-modified.action';

describe('DropboxFolderModifiedAction', () => {
  it('should be initialized correctly', () => {
    const action = new DropboxFolderModifiedAction();
    expect(action.name).toBe('folder_modified');
  });

  it('should resolve refreshParams', async () => {
    const action = new DropboxFolderModifiedAction();
    await expect(action.refreshParams('user-id')).resolves.toBeUndefined();
  });
});
