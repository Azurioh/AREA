import { MongoCollections } from '@/enums/mongo-collection';
import type { DropboxResource } from '@/types/dropbox';
import type { Db } from 'mongodb';

/**
 * @class DropboxRepository
 * @description The Dropbox repository.
 */
export class DropboxRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * @function createDropboxResource
   * @description Create a new Dropbox resource in the database.
   *
   * @param {DropboxResource} data The Dropbox resource to add
   * @returns {Promise<boolean>} If the Dropbox resource was added
   */
  async createDropboxResource(data: DropboxResource): Promise<boolean> {
    const { acknowledged } = await this.db
      .collection<DropboxResource>(MongoCollections.DROPBOX_RESOURCES)
      .insertOne(data);

    return acknowledged;
  }

  /**
   * @function getDropboxResourceById
   * @description Get a Dropbox resource from the database.
   *
   * @param {string} id The id of the Dropbox resource to get
   * @returns {Promise<DropboxResource | null>} The Dropbox resource
   */
  async getDropboxResourceById(id: string): Promise<DropboxResource | null> {
    return await this.db.collection<DropboxResource>(MongoCollections.DROPBOX_RESOURCES).findOne({ id: id });
  }

  /**
   * @function deleteDropboxResource
   * @description Delete a Dropbox resource from the database.
   *
   * @param {string} id The id of the Dropbox resource to delete
   * @returns {Promise<boolean>} If the Dropbox resource was deleted
   */
  async deleteDropboxResource(id: string): Promise<boolean> {
    const { acknowledged } = await this.db
      .collection<DropboxResource>(MongoCollections.DROPBOX_RESOURCES)
      .deleteOne({ id: id });

    return acknowledged;
  }
}
