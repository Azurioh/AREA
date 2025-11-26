import { MongoCollections } from '@/enums/mongo-collection';
import { GithubAccount } from '@/types/github';
import { type Db } from 'mongodb';

/**
 * @class GithubRepository
 * @description The user repository.
 */
export class GithubRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async createGithubAccount(data: GithubAccount): Promise<boolean> {
    const { acknowledged } =  await this.db.collection<GithubAccount>(MongoCollections.GITHUB_ACCOUNT).insertOne(data);

    return acknowledged;
  }
}
