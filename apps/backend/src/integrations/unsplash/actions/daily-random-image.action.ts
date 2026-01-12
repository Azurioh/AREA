import { Action } from '@/integrations/_definitions/action.interface';

export class UnsplashDailyRandomImageAction extends Action {
  constructor() {
    super(
      'daily_random_image',
      'Action triggered to get a daily random image from Unsplash',
      [
        {
          type: 'input',
          key: 'topic',
          label: 'Topic',
          placeholder: 'Enter the topic of the image',
        },
      ],
      [
        {
          key: 'image',
          description: 'The actual image',
          type: 'string',
          path: 'image.url',
        },
        {
          key: 'likes',
          description: 'The number of likes the image has received',
          type: 'number',
          path: 'image.likes',
        },
        {
          key: 'username',
          description: 'The username of the photographer',
          type: 'string',
          path: 'user.username',
        },
        {
          key: 'bio',
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
