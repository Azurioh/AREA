import type { MaybeNull } from '@area/shared/utils/common';
import { type Db, ObjectId, type UpdateResult, type WithId } from 'mongodb';
import { MongoCollections } from '@/enums/mongo-collection';
import type { DiscordAccount } from '@/types/discord';

/**
 * @class DiscordRepository
 * @description The discord repository.
 */
export class DiscordRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * @function createDiscordAccount
   * @description Creates a new discord account in the database.
   *
   * @param {DiscordAccount} data The discord account to be inserted.
   * @returns {Promise<boolean>} If the data was inserted.
   */
  async createDiscordAccount(data: DiscordAccount): Promise<boolean> {
    const { acknowledged } = await this.db.collection<DiscordAccount>(MongoCollections.DISCORD_ACCOUNT).insertOne(data);

    return acknowledged;
  }

  /**
   * @function getDiscordAccountByUserId
   * @description Get a discord account from the databse.
   *
   * @param {string} userId The user id related to the discord account.
   * @returns {Promise<MaybeNull<WithId<DiscordAccount>>>} The discord account.
   */
  async getDiscordAccountByUserId(userId: string): Promise<MaybeNull<WithId<DiscordAccount>>> {
    return await this.db.collection<DiscordAccount>(MongoCollections.DISCORD_ACCOUNT).findOne({ userId: userId });
  }

  /**
   * @function updateDiscordAccount
   * @description Updates a discord account in the database.
   *
   * @param {string} id The if of the document.
   * @param {Partial<DiscordAccount>} account The discord account data.
   * @returns {Promise<UpdateResult<DiscordAccount>>} The result of the update.
   */
  async updateDiscordAccount(id: string, account: Partial<DiscordAccount>): Promise<UpdateResult<DiscordAccount>> {
    return await this.db
      .collection<DiscordAccount>(MongoCollections.DISCORD_ACCOUNT)
      .updateOne({ _id: new ObjectId(id) }, { $set: account });
  }
}
