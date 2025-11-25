import { User } from '@area/shared/types/user.type';
import type { Db, MongoClient } from 'mongodb';

declare module 'fastify' {
  /**
   * @interface FastifyRequest
   * @description Extends FastifyRequest to include MongoDB client and database
   *
   * @property {MongoClient} mongoClient - The MongoDB client
   * @property {Db} db - The MongoDB database
   */
  interface FastifyRequest {
    mongoClient: MongoClient;
    db: Db;
    user?: User
  }
}
