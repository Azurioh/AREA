import { MongoCollections } from '@/enums/mongo-collection';
import type { OAuthServiceType, ThirdPartyAccount } from '@/types/third-parties';
import type { MaybeNull } from '@area/shared/utils/common';
import { ObjectId, type UpdateResult, type Db, type WithId } from 'mongodb';

/**
 * @class ThirdPartiesRepository
 * @description The third parties repository.
 */
export class ThirdPartiesRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * @function createThirdPartyAccount
   * @description Creates a new third party account in the database.
   *
   * @param {ThirdPartyAccount} data The github account to be inserted.
   * @returns {Promise<boolean>} If the data was inserted.
   */
  async createThirdPartyAccount(data: ThirdPartyAccount): Promise<boolean> {
    const { acknowledged } = await this.db
      .collection<ThirdPartyAccount>(MongoCollections.THIRD_PARTIES_ACCOUNT)
      .insertOne(data);

    return acknowledged;
  }

  /**
   * @function getThirdPartyAccountByUserId
   * @description Get a third party account from the databse.
   *
   * @param {string} userId The user id related to the third party account.
   * @param {ServiceType} service The service type.
   * @returns {Promise<MaybeNull<WithId<T>>>} The third party account.
   */
  async getThirdPartyAccountByUserId<T extends ThirdPartyAccount>(
    userId: string,
    service: OAuthServiceType,
  ): Promise<MaybeNull<WithId<T>>> {
    return (await this.db
      .collection<ThirdPartyAccount>(MongoCollections.THIRD_PARTIES_ACCOUNT)
      .findOne({ userId: userId, service: service })) as WithId<T> | null;
  }

  /**
   * @function updateThirdPartyAccount
   * @description Updates a third party account in the database.
   *
   * @param {string} id The if of the document.
   * @param {ServiceType} service The service type.
   * @param {Partial<GithubAccount>} account The github account data.
   * @returns {Promise<UpdateResult<GithubAccount>>} The result of the update.
   */
  async updateThirdPartyAccount(
    id: string,
    service: OAuthServiceType,
    account: Partial<ThirdPartyAccount>,
  ): Promise<UpdateResult<ThirdPartyAccount>> {
    return await this.db
      .collection<ThirdPartyAccount>(MongoCollections.THIRD_PARTIES_ACCOUNT)
      .updateOne({ _id: new ObjectId(id), service: service }, { $set: account });
  }
}
