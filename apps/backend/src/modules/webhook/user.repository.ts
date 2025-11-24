import type { User } from '@area/shared/types/user.type';
import type { Db, InsertOneResult, WithId } from 'mongodb';
import { MongoCollections } from '@/enums/mongo-collection';

/**
 * @class UserRepository
 * @description Repository for managing user in the database.
 */
export class UserRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;

    this.createIndex();
  }

  /**
   * @function createUser
   * @description Creates a new user in the database.
   *
   * @param {User} data - The user data to be inserted.
   * @returns {Promise<boolean>} If the user was created
   */
  async createUser(data: User): Promise<InsertOneResult<User>> {
    const result = await this.db.collection<User>(MongoCollections.USERS).insertOne(data);

    return result;
  }

  /**
   * @function getUserByEmail
   * @description Retrieves a user by its email.
   *
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<WithId<User> | null>} The use data.
   */
  async getUserByEmail(email: string): Promise<WithId<User> | null> {
    const user = await this.db.collection<User>(MongoCollections.USERS).findOne({ email });

    return user;
  }
}
