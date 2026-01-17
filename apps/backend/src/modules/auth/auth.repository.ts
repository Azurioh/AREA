import type { Db, InsertOneResult } from 'mongodb';
import { MongoCollections } from '@/enums/mongo-collection';
import type { RefreshTokenValidator } from '@/types/auth';

export class AuthRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async storeRefreshToken(
    userId: string,
    hashedToken: string,
    expiresAt: Date,
  ): Promise<InsertOneResult<RefreshTokenValidator>> {
    return await this.db.collection<RefreshTokenValidator>(MongoCollections.REFRESH_TOKENS).insertOne({
      userId,
      hashedToken,
      expiresAt,
    });
  }

  async isRefreshTokenValid(hashedToken: string): Promise<boolean> {
    const token = await this.db
      .collection<RefreshTokenValidator>(MongoCollections.REFRESH_TOKENS)
      .findOne({ hashedToken, expiresAt: { $gt: new Date() } });
    return !!token;
  }

  async deleteRefreshToken(hashedToken: string): Promise<void> {
    await this.db.collection<RefreshTokenValidator>(MongoCollections.REFRESH_TOKENS).deleteOne({ hashedToken });
  }
}
