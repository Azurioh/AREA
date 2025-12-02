import { MongoCollections } from '@/enums/mongo-collection';
import type { GithubAccount } from '@/types/github';
import type { MaybeNull } from '@area/shared/utils/common';
import { ObjectId, type UpdateResult, type WithId, type Db } from 'mongodb';

/**
 * @class GithubRepository
 * @description The github repository.
 */
export class GithubRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * @function createGithubAccount
   * @description Creates a new github account in the database.
   *
   * @param {GithubAccount} data The github account to be inserted.
   * @returns {Promise<boolean>} If the data was inserted.
   */
  async createGithubAccount(data: GithubAccount): Promise<boolean> {
    const { acknowledged } = await this.db.collection<GithubAccount>(MongoCollections.GITHUB_ACCOUNT).insertOne(data);

    return acknowledged;
  }

  /**
   * @function getGithubAccountByUserId
   * @description Get a github account from the databse.
   *
   * @param {string} userId The user id related to the github account.
   * @returns {Promise<MaybeNull<WithId<GithubAccount>>>} The github account.
   */
  async getGithubAccountByUserId(userId: string): Promise<MaybeNull<WithId<GithubAccount>>> {
    return await this.db.collection<GithubAccount>(MongoCollections.GITHUB_ACCOUNT).findOne({ userId: userId });
  }

  /**
   * @function updateGithubAccount
   * @description Updates a github account in the database.
   *
   * @param {string} id The if of the document.
   * @param {Partial<GithubAccount>} account The github account data.
   * @returns {Promise<UpdateResult<GithubAccount>>} The result of the update.
   */
  async updateGithubAccount(id: string, account: Partial<GithubAccount>): Promise<UpdateResult<GithubAccount>> {
    return await this.db
      .collection<GithubAccount>(MongoCollections.GITHUB_ACCOUNT)
      .updateOne({ _id: new ObjectId(id) }, { $set: account });
  }
}
