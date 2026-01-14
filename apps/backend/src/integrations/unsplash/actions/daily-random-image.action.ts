import { Action } from '@/integrations/_definitions/action.interface';

export class UnsplashDailyRandomImageAction extends Action {
  constructor() {
    super(
      'daily_random_image',
      'Action triggered to get a daily random image from Unsplash',
      [
        {
          type: 'select',
          key: 'topic',
          label: 'Topic',
          placeholder: 'Select the topic of the image',
          options: [
            { name: 'Nature', id: 'nature' },
            { name: 'Technology', id: 'technology' },
            { name: 'People', id: 'people' },
            { name: 'Architecture', id: 'architecture' },
            { name: 'Food', id: 'food' },
            { name: 'Travel', id: 'travel' },
          ],
        },
      ],
      [
        {
          key: 'imageUrl',
          description: 'The actual image',
          type: 'string',
          path: 'image.url',
        },
        {
          key: 'imageLikes',
          description: 'The number of likes the image has received',
          type: 'number',
          path: 'image.likes',
        },
        {
          key: 'photographerName',
          description: 'The username of the photographer',
          type: 'string',
          path: 'user.username',
        },
        {
          key: 'photographerBio',
          description: 'The bio of the photographer',
          type: 'string',
          path: 'user.bio',
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
