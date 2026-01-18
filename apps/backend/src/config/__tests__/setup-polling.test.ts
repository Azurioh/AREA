import type { FastifyInstance } from 'fastify';
import { setupPolling } from '../setup-polling';

jest.mock('@/modules/polling/polling.repository', () => ({ PollingRepository: jest.fn() }));
jest.mock('@/modules/polling/polling.service', () => ({ PollingService: jest.fn() }));
jest.mock('@/modules/polling/spotify-polling.service', () => ({
  SpotifyPollingService: jest.fn(() => ({
    pollCurrentlyPlayingTrack: jest.fn(),
  })),
}));
jest.mock('@/modules/polling/unsplash-polling.service', () => ({
  UnsplashPollingService: jest.fn(() => ({
    pollDailyRandomImage: jest.fn(),
  })),
}));
jest.mock('@/modules/polling/nasa-polling.service', () => ({
  NasaPollingService: jest.fn(() => ({
    pollNewAstronomyPictureOfTheDay: jest.fn(),
  })),
}));
jest.mock('@/modules/spotify', () => ({ SpotifyService: jest.fn() }));
jest.mock('@/modules/third-parties', () => ({
  ThirdPartiesRepository: jest.fn(),
  ThirdPartiesService: jest.fn(),
}));
jest.mock('@/modules/users', () => ({
  UsersRepository: jest.fn(() => ({ createIndex: jest.fn() })),
  UsersService: jest.fn(),
}));

describe('setupPolling', () => {
  let mockApp: FastifyInstance;

  beforeEach(() => {
    mockApp = {
      mongo: { db: {} },
      addHook: jest.fn(),
    } as unknown as FastifyInstance;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should throw error if MongoDB is not initialized', async () => {
    const appWithoutMongo = { mongo: {} } as FastifyInstance;
    await expect(setupPolling(appWithoutMongo)).rejects.toThrow('MongoDB not initialized');
  });

  it('should setup polling interval if not in test env', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    await setupPolling(mockApp);

    expect(mockApp.addHook).toHaveBeenCalledWith('onClose', expect.any(Function));

    jest.advanceTimersByTime(40000);

    const { SpotifyPollingService } = require('@/modules/polling/spotify-polling.service');
    const mockInstance = SpotifyPollingService.mock.results[0].value;
    expect(mockInstance.pollCurrentlyPlayingTrack).toHaveBeenCalled();

    const onCloseHook = (mockApp.addHook as jest.Mock).mock.calls[0][1];
    const doneCallback = jest.fn();

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    onCloseHook({}, doneCallback);

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(doneCallback).toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it('should log error if polling fails', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const { SpotifyPollingService } = require('@/modules/polling/spotify-polling.service');
    const { UnsplashPollingService } = require('@/modules/polling/unsplash-polling.service');

    const spotifyMockInstance = { pollCurrentlyPlayingTrack: jest.fn().mockRejectedValue(new Error('Spotify error')) };
    const unsplashMockInstance = { pollDailyRandomImage: jest.fn().mockRejectedValue(new Error('Unsplash error')) };

    SpotifyPollingService.mockImplementation(() => spotifyMockInstance);
    UnsplashPollingService.mockImplementation(() => unsplashMockInstance);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await setupPolling(mockApp);

    jest.advanceTimersByTime(60 * 60 * 1000);

    // Give time for the promises in the interval to resolve/reject
    await Promise.resolve();
    await Promise.resolve();

    expect(spotifyMockInstance.pollCurrentlyPlayingTrack).toHaveBeenCalled();
    expect(unsplashMockInstance.pollDailyRandomImage).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Error polling Spotify:', expect.any(Error));
    expect(consoleSpy).toHaveBeenCalledWith('Error polling Unsplash:', expect.any(Error));

    consoleSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });
});
