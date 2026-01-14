import type { DiscordService } from '@/modules/discord';
import { createDiscordService } from '../index';

describe('createDiscordService', () => {
  let mockDiscordService: DiscordService;

  beforeEach(() => {
    mockDiscordService = {} as unknown as DiscordService;
  });

  it('should create a service with correct name and components', () => {
    const service = createDiscordService(mockDiscordService);

    expect(service.name).toBe('Discord');
    expect(service.actions.length).toBeGreaterThanOrEqual(0);
    expect(service.reactions.length).toBeGreaterThanOrEqual(0);
  });
});
