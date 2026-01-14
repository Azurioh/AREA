import {
  Action,
  createDiscordService,
  createGithubService,
  createSpotifyService,
  Reaction,
  ServiceManager,
} from '../index';

describe('Integrations Index', () => {
  it('should export all services and types', () => {
    expect(createGithubService).toBeDefined();
    expect(createDiscordService).toBeDefined();
    expect(createSpotifyService).toBeDefined();
    expect(ServiceManager).toBeDefined();
    expect(Action).toBeDefined();
    expect(Reaction).toBeDefined();
  });
});
