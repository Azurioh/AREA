import { NasaNewAstronomyPictureOfTheDayAction } from '../new-astronomy-picture-of-the-day.action';

describe('NasaNewAstronomyPictureOfTheDayAction', () => {
  let action: NasaNewAstronomyPictureOfTheDayAction;

  beforeEach(() => {
    action = new NasaNewAstronomyPictureOfTheDayAction();
  });

  it('should have correct name and description', () => {
    expect(action.name).toBe('new_astronomy_picture_of_the_day');
    expect(action.description).toBe('Action triggered to get the new astronomy picture of the day from NASA');
  });

  it('should refreshParams and resolve', async () => {
    await expect(action.refreshParams('user-123')).resolves.toBeUndefined();
  });
});
