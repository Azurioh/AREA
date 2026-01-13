import { MongoCollections } from '@/enums/mongo-collection';
import type { Polling, ServiceToPoll } from '@/types/polling';
import type { WithId, Db, UpdateResult } from 'mongodb';

/**
 * @class PollingRepository
 * @description The polling repository.
 */
export class PollingRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * @function addUserToPoll
   * @description Add a user that will be polled
   *
   * @param {Polling} data The polling to add
   * @returns {Promise<boolean>} If the user to poll was added
   */
  async addUserToPoll(data: Polling): Promise<boolean> {
    const { acknowledged } = await this.db.collection<Polling>(MongoCollections.POLLING).insertOne(data);

    return acknowledged;
  }

  /**
   * @function getUsersToPoll
   * @description Get the users to poll
   *
   * @param {ServiceToPoll} service The service polling
   * @param {string[]} type The type of the polling
   * @returns {Promise<WithId<Polling>[]>} If the user to poll was added
   */
  async getUsersToPoll(service: ServiceToPoll, type: string[]): Promise<WithId<Polling>[]> {
    return await this.db
      .collection<Polling>(MongoCollections.POLLING)
      .find({ service: service, type: { $in: type } })
      .toArray();
  }

  /**
   * @function updateUserToPoll
   * @description Update a user that is being polled
   *
   * @param {ServiceToPoll} service The service polling
   * @param {Partial<Polling>} data The data to update
   * @returns {Promise<boolean>} If the user to poll was updated
   */
  async updateUserToPoll(
    service: ServiceToPoll,
    userId: string,
    type: string,
    data: Partial<Omit<Polling, 'service' | 'userId' | 'type'>>,
  ): Promise<UpdateResult<Polling>> {
    return await this.db
      .collection<Polling>(MongoCollections.POLLING)
      .updateOne({ service: service, userId: userId, type: type }, { $set: data });
  }
}
