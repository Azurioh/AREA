import { MongoCollections } from '@/enums/mongo-collection';
import { GithubAccount } from '@/types/github';
import { MaybeNull } from '@area/shared/utils/common';
import { WithId, type Db } from 'mongodb';

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
    const { acknowledged } =  await this.db.collection<GithubAccount>(MongoCollections.GITHUB_ACCOUNT).insertOne(data);

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
    return await this.db.collection<GithubAccount>(MongoCollections.GITHUB_ACCOUNT).findOne({ userId: userId })
  }
}
