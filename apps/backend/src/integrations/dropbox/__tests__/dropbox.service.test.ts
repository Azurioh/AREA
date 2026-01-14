import { createDropboxService } from '../index';

describe('createDropboxService', () => {
  it('should create a service with correct name and components', () => {
    const service = createDropboxService();

    expect(service.name).toBe('Dropbox');
    expect(service.actions.length).toBeGreaterThanOrEqual(0);
    expect(service.reactions.length).toBeGreaterThanOrEqual(0);
  });
});
