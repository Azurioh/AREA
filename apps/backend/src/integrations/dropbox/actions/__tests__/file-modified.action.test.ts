import { DropboxFileModifiedAction } from '../file-modified.action';

describe('DropboxFileModifiedAction', () => {
  it('should be initialized correctly', () => {
    const action = new DropboxFileModifiedAction();
    expect(action.name).toBe('file_modified');
  });

  it('should resolve refreshParams', async () => {
    const action = new DropboxFileModifiedAction();
    await expect(action.refreshParams('user-id')).resolves.toBeUndefined();
  });
});
