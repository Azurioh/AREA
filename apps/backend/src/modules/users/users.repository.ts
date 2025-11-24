import type { User } from '@area/shared/types/user.types';
import type { MaybeNull } from '@area/shared/utils/common';
import { type Db, type DeleteResult, type InsertOneResult, ObjectId, type UpdateResult, type WithId } from 'mongodb';

/**
 * @class UserRepository
 * @description The user repository.
 */
export class UsersRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * @function createUser
   * @description Creates a new user in the database.
   *
   * @param {User} user The user data to be inserted.
   * @returns {Promise<InsertOneResult<User>>} The created user data.
   */
  async createUser(user: User): Promise<InsertOneResult<User>> {
    return await this.db.collection<User>('users').insertOne(user);
  }

  /**
   * @function getUserById
   * @description Retrieves a user by its id.
   *
   * @param {string} id The id of the user to retrieve.
   * @returns {Promise<MaybeNull<WithId<User>>>} The user data.
   */
  async getUserById(id: string): Promise<MaybeNull<WithId<User>>> {
    return await this.db.collection<User>('users').findOne({ _id: new ObjectId(id) });
  }

  /**
   * @function getUserByEmail
   * @description Retrieves a user by its email.
   *
   * @param {string} email The email of the user to retrieve.
   * @returns {Promise<MaybeNull<WithId<User>>>} The user data.
   */
  async getUserByEmail(email: string): Promise<MaybeNull<WithId<User>>> {
    return await this.db.collection<User>('users').findOne({ email });
  }

  /**
   * @function updateUser
   * @description Updates a user in the database.
   *
   * @param {string} id The id of the user to update.
   * @param {Partial<User>} user The user data to be updated.
   * @returns {Promise<UpdateResult<User>>} The updated user data.
   */
  async updateUser(id: string, user: Partial<User>): Promise<UpdateResult<User>> {
    return await this.db.collection<User>('users').updateOne({ _id: new ObjectId(id) }, { $set: user });
  }

  /**
   * @function deleteUser
   * @description Deletes a user from the database.
   *
   * @param {string} id The id of the user to delete.
   * @returns {Promise<DeleteResult>} The result of the deletion.
   */
  async deleteUser(id: string): Promise<DeleteResult> {
    return await this.db.collection<User>('users').deleteOne({ _id: new ObjectId(id) });
  }
}
