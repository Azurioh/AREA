import type { Db, InsertOneResult, WithId } from 'mongodb';
import { User } from '@area/shared/types/user.type';

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
   * @function createIndex
   * @description Creates an index to avoid user duplication.
   *
   */
  private async createIndex(): Promise<void> {
    if (!await this.db.collection<User>('users').indexExists('no_duplicate_user')) {
      await this.db.collection<User>('users').createIndex({ email : 1 }, { unique: true, name: 'no_duplicate_user' } )
    }
  };

  /**
   * @function createUser
   * @description Creates a new user in the database.
   *
   * @param {User} data - The user data to be inserted.
   * @returns {Promise<boolean>} If the user was created
   */
  async createUser(data: User): Promise<InsertOneResult<User>> {
    const result = await this.db.collection<User>('users').insertOne(data);

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
    const user = await this.db.collection<User>('users').findOne({ email });

    return user;
  }
}
