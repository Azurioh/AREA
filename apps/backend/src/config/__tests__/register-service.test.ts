import type { FastifyInstance } from 'fastify';
import { ServiceManager } from '@/integrations';
import { registerServices } from '../register-service';

jest.mock('@/modules/users', () => ({
  UsersRepository: jest.fn(() => ({ createIndex: jest.fn() })),
  UsersService: jest.fn(),
}));
jest.mock('@/modules/third-parties', () => ({
  ThirdPartiesRepository: jest.fn(),
  ThirdPartiesService: jest.fn(),
}));
jest.mock('@/modules/polling/polling.repository', () => ({ PollingRepository: jest.fn() }));
jest.mock('@/modules/polling/polling.service', () => ({ PollingService: jest.fn() }));
jest.mock('@/modules/discord', () => ({ DiscordService: jest.fn() }));
jest.mock('@/modules/github', () => ({ GithubService: jest.fn() }));
jest.mock('@/modules/spotify', () => ({ SpotifyService: jest.fn() }));
jest.mock('@/integrations', () => ({
  createDiscordService: jest.fn(),
  createGithubService: jest.fn(),
  createSpotifyService: jest.fn(),
  createUnsplashService: jest.fn(),
  createDropboxService: jest.fn(),
  createTwitchService: jest.fn(),
  createNasaService: jest.fn(),
  ServiceManager: { instance: { register: jest.fn() } },
}));

describe('registerServices', () => {
  let mockApp: FastifyInstance;

  beforeEach(() => {
    mockApp = {
      mongo: { db: {} },
    } as unknown as FastifyInstance;
    jest.clearAllMocks();
  });

  it('should throw error if MongoDB is not initialized', async () => {
    const appWithoutMongo = { mongo: {} } as FastifyInstance;
    await expect(registerServices(appWithoutMongo)).rejects.toThrow('MongoDB not initialized');
  });

  it('should register all services successfully', async () => {
    await registerServices(mockApp);

    expect(ServiceManager.instance.register).toHaveBeenCalledTimes(7);
  });
});
