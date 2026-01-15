import { MongoCollections } from '@/enums/mongo-collection';
import type { ActionReaction } from '@/types/action-reaction';
import { type DeleteResult, ObjectId, type Db, type UpdateResult, type WithId } from 'mongodb';

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
   * @param {WithId<ActionReaction>} data The action reaction to add
   * @returns {Promise<boolean>} If the action reaction was added
   */
  async createActionReaction(data: WithId<ActionReaction>): Promise<boolean> {
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
   * @returns {Promise<WithId<ActionReaction>[]>} The matched actions reactions
   */
  async getActionsReactionsByTrigger(trigger: string): Promise<WithId<ActionReaction>[]> {
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
   * @returns {Promise<WithId<ActionReaction>[]>} The matched actions reactions
   */
  async getMeActionsReactions(userId: string): Promise<WithId<ActionReaction>[]> {
    return await this.db
      .collection<ActionReaction>(MongoCollections.ACTIONS_REACTIONS)
      .find({ userId: userId })
      .toArray();
  }

  /**
   * @function getActionsReactionsById
   * @description Get an action reaction by its id
   *
   * @param {string} id The id of the action reaction
   * @returns {Promise<WithId<ActionReaction> | null>} The matched action reaction
   */
  async getActionsReactionsById(id: string): Promise<WithId<ActionReaction> | null> {
    return await this.db
      .collection<ActionReaction>(MongoCollections.ACTIONS_REACTIONS)
      .findOne({ _id: new ObjectId(id) });
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
      .collection<ActionReaction>(MongoCollections.ACTIONS_REACTIONS)
      .updateOne({ _id: new ObjectId(id) }, { $inc: { numberOfExecution: 1 } });
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

  async deleteActionReactionById(id: string): Promise<DeleteResult> {
    return await this.db
      .collection<ActionReaction>(MongoCollections.ACTIONS_REACTIONS)
      .deleteOne({ _id: new ObjectId(id) });
  }
}
