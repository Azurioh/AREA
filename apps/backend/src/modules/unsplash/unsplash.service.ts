import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { CreateAction } from '@area/shared/schemas/actions-reactions.schema';
import ApiError from '@/utils/api-error';
import type { PollingService } from '../polling/polling.service';
import type { ActionReaction } from '@/types/action-reaction';
import type { WithId } from 'mongodb';

/**
 * @class UnsplashService
 * @description The unsplash service.
 */
export class UnsplashService {
  private pollingService: PollingService;

  constructor(pollingService: PollingService) {
    this.pollingService = pollingService;
  }

  /**
   * @function createAction
   * @description Create an action with the unsplash service
   *
   * @param {string} actionReactionId - The id of the action reaction document
   * @param {string} userId - The id of the user creating the action
   * @param {CreateAction} action - The information about the action
   * @returns {Promise<boolean>} If the action was created
   */
  async createAction(actionReactionId: string, userId: string, action: CreateAction): Promise<string> {
    let trigger = '';

    switch (action.name) {
      case 'daily_random_image': {
        this.pollingService.addUserToPoll({
          service: 'unsplash',
          actionReactionId,
          userId: userId,
          type: 'daily_random_image',
          trigger: {
            topic: action.params.topic.id,
            lastPoll: null,
          },
        });
        trigger = `${action.name}/${action.params.topic.id}/${userId}`;
        break;
      }
      default: {
        throw new ApiError(HttpStatusCode.NOT_FOUND, 'Action not found');
      }
    }
    return trigger;
  }

  /**
   * @function deleteAction
   * @description Delete an action reaction
   *
   * @param {WithId<ActionReaction>} actionReaction - The action reaction to delete
   * @returns {Promise<void>} Nothing
   */
  async deleteAction(actionReaction: WithId<ActionReaction>): Promise<void> {
    await this.pollingService.deleteUserToPollByActionReactionId(actionReaction._id.toString());
  }
}
