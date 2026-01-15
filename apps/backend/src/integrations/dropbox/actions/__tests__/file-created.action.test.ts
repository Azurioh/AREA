import { DropboxFileCreatedAction } from '../file-created.action';

describe('DropboxFileCreatedAction', () => {
  it('should be initialized correctly', () => {
    const action = new DropboxFileCreatedAction();
    expect(action.name).toBe('file_created');
  });

  it('should resolve refreshParams', async () => {
    const action = new DropboxFileCreatedAction();
    await expect(action.refreshParams('user-id')).resolves.toBeUndefined();
  });
});
