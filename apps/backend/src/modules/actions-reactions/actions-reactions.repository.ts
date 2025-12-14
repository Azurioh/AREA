import { MongoCollections } from '@/enums/mongo-collection';
import type { ActionReaction } from '@/types/action-reaction';
import { ObjectId, type Db, type UpdateResult, type WithId } from 'mongodb';

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
   * @param {ActionReaction} data The action reaction to add
   * @returns {Promise<boolean>} If the action reaction was added
   */
  async createActionReaction(data: ActionReaction): Promise<boolean> {
    const { acknowledged } = await this.db
      .collection<ActionReaction>(MongoCollections.ACTIONS_REACTIONS)
      .insertOne(data);

    return acknowledged;
  }

  /**
   * @function getActionsReactionsByTrigger
   * @description Get the list of actions reactions matching the action trigger
   *
   * @param {string} trigger The trigger of the action
   * @returns {Promise<ActionReaction[]>} The matched actions reactions
   */
  async getActionsReactionsByTrigger(trigger: string): Promise<ActionReaction[]> {
    return await this.db
      .collection<ActionReaction>(MongoCollections.ACTIONS_REACTIONS)
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
  async getMeActionsReactions(userId: string): Promise<WithId<ActionReaction>[]> {
    return await this.db
      .collection<ActionReaction>(MongoCollections.ACTIONS_REACTIONS)
      .find({ userId: userId })
      .toArray();
  }

  /**
   * @function updateActionReactionExecutionStateById
   * @description Update the execution state of an action reaction
   *
   * @param {string} id The id of the action reaction
   * @param {string} executionState The execution state
   * @returns {Promise<UpdateResult<ActionReaction>>} The result of the update
   */
  async updateActionReactionExecutionStateById(
    id: string,
    executionState: boolean,
  ): Promise<UpdateResult<ActionReaction>> {
    return await this.db
      .collection<ActionReaction>(MongoCollections.ACTIONS_REACTIONS)
      .updateOne({ _id: new ObjectId(id) }, { $set: { executionState: executionState } });
  }
}
