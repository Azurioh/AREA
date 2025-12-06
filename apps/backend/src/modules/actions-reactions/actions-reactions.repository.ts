import { MongoCollections } from '@/enums/mongo-collection';
import type { ActionsReactions } from '@/types/action-reaction';
import type { Db } from 'mongodb';

/**
 * @class ActionsReactionsRepository
 * @description The actions reactions repository.
 */
export class ActionsReactionsRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * @function createActionReaction
   * @description Create a new action reaction
   *
   * @param {ActionsReactions} data The action reaction to add
   * @returns {Promise<boolean>} If the action reaction was added
   */
  async createActionReaction(data: ActionsReactions): Promise<boolean> {
    const { acknowledged } = await this.db
      .collection<ActionsReactions>(MongoCollections.ACTIONS_REACTIONS)
      .insertOne(data);

    return acknowledged;
  }

  /**
   * @function getActionsReactionsByTrigger
   * @description Get the list of actions reactions matching the action trigger
   *
   * @param {string} trigger The trigger of the action
   * @returns {Promise<ActionsReactions[]>} The matched actions reactions
   */
  async getActionsReactionsByTrigger(trigger: string): Promise<ActionsReactions[]> {
    return await this.db
      .collection<ActionsReactions>(MongoCollections.ACTIONS_REACTIONS)
      .find({ 'action.trigger': trigger })
      .toArray();
  }

  /**
   * @function getMeActionsReactions
   * @description Get the list of actions reactions matching the user id
   *
   * @param {string} userId The id of the user
   * @returns {Promise<ActionsReactions[]>} The matched actions reactions
   */
  async getMeActionsReactions(userId: string): Promise<ActionsReactions[]> {
    return await this.db
      .collection<ActionsReactions>(MongoCollections.ACTIONS_REACTIONS)
      .find({ userId: userId })
      .toArray();
  }
}
