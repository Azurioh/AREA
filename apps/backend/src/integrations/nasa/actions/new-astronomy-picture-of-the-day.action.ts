import { Action } from '@/integrations/_definitions/action.interface';

export class NasaNewAstronomyPictureOfTheDayAction extends Action {
  constructor() {
    super(
      'new_astronomy_picture_of_the_day',
      'Action triggered to get the new astronomy picture of the day from NASA',
      [],
      [
        {
          key: 'imageUrl',
          description: 'The actual image',
          type: 'string',
          path: 'image.url',
        },
      ],
    );
  }

  /**
   * @function refreshParams
   * @description Refresh the parameters of the action
   *
   * @param {string} userId The id of the user
   * @returns {Promise<void>} Nothing
   */
  override async refreshParams(_userId: string): Promise<void> {
    return Promise.resolve();
  }
}
