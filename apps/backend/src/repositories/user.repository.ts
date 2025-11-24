import { HttpStatusCode } from '@area/shared/enums/http-status';
import type { Db, WithId } from 'mongodb';
import ApiError from '@/utils/api-error';
import { User } from '@area/shared/types/user.type';

/**
 * @class UserRepository
 * @description Repository for managing user in the database.
 */
export class UserRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * @function createUser
   * @description Creates a new user in the database.
   *
   * @param {User} data - The user data to be inserted.
   * @returns {Promise<boolean>} If the user was created
   */
  async createUser(data: User): Promise<boolean> {
    await this.db.collection<User>('users').createIndex({ email : 1 }, { unique: true } )

    const { acknowledged } = await this.db.collection<User>('users').insertOne(data);

    return acknowledged;
  }

  /**
   * @function getUserByEmail
   * @description Retrieves a user by its email.
   *
   * @param {string} email - The email of the user to retrieve.
   * @returns The webhook data.
   */
  async getUserByEmail(email: string): Promise<WithId<User> | null > {
    const user = await this.db.collection<User>('users').findOne({ email });

    return user;
  }
}
