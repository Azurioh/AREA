import { UnsplashDailyRandomImageAction } from '../daily-random-image.action';

describe('UnsplashDailyRandomImageAction', () => {
  let action: UnsplashDailyRandomImageAction;

  beforeEach(() => {
    action = new UnsplashDailyRandomImageAction();
  });

  it('should have correct name and description', () => {
    expect(action.name).toBe('daily_random_image');
    expect(action.description).toBe('Action triggered to get a daily random image from Unsplash');
  });

  it('should refreshParams and resolve', async () => {
    await expect(action.refreshParams('user-123')).resolves.toBeUndefined();
  });
});
