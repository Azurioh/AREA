import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { CreateAction } from '@area/shared/schemas/actions-reactions.schema';
import ApiError from '@/utils/api-error';
import type { PollingService } from '../polling/polling.service';
import type { ActionReaction } from '@/types/action-reaction';
import type { WithId } from 'mongodb';

/**
 * @class NasaService
 * @description The nasa service.
 */
export class NasaService {
  private pollingService: PollingService;

  constructor(pollingService: PollingService) {
    this.pollingService = pollingService;
  }

  /**
   * @function createAction
   * @description Create an action with the nasa service
   *
   * @param {string} actionReactionId - The id of the action reaction document
   * @param {string} userId - The id of the user creating the action
   * @param {CreateAction} action - The information about the action
   * @returns {Promise<boolean>} If the action was created
   */
  async createAction(actionReactionId: string, userId: string, action: CreateAction): Promise<string> {
    let trigger = '';

    switch (action.name) {
      case 'new_astronomy_picture_of_the_day': {
        trigger = await this.newAstronomyPictureOfTheDay(actionReactionId, userId, action);
        break;
      }
      default: {
        throw new ApiError(HttpStatusCode.NOT_FOUND, 'Action not found');
      }
    }
    return trigger;
  }

  async newAstronomyPictureOfTheDay(actionReactionId: string, userId: string, action: CreateAction): Promise<string> {
    const usersToPoll = await this.pollingService.getUsersToPoll('nasa', ['new_astronomy_picture_of_the_day']);

    if (usersToPoll.find((user) => user.userId === userId)) {
      return `${action.name}/${userId}`;
    }

    this.pollingService.addUserToPoll({
      service: 'nasa',
      actionReactionId,
      userId: userId,
      type: 'new_astronomy_picture_of_the_day',
      trigger: {
        lastPoll: null,
      },
    });
    return `${action.name}/${userId}`;
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
