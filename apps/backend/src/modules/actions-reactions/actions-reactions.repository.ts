import { MongoCollections } from '@/enums/mongo-collection';
import type { ActionsReactions } from '@/types/action-reaction';
import { ObjectId, type WithId, type Db } from 'mongodb';

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
   * @returns {Promise<WithId<ActionsReactions>[]>} The matched actions reactions
   */
  async getActionsReactionsByTrigger(trigger: string): Promise<WithId<ActionsReactions>[]> {
    return await this.db
      .collection<ActionsReactions>(MongoCollections.ACTIONS_REACTIONS)
      .find({ trigger: trigger })
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

  /**
   * @function incrementActionReactionExecution
   * @description Increment by one the number of execution of an action reaction
   *
   * @param {string} id The id of the action reaction
   * @returns {Promise<void>} Nothing
   */
  async incrementActionReactionExecution(id: string): Promise<void> {
    await this.db
      .collection<ActionsReactions>(MongoCollections.ACTIONS_REACTIONS)
      .updateOne({ _id: new ObjectId(id) }, { $inc: { numberOfExecution: 1 } });
  }
}
