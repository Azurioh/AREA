import type { Db } from 'mongodb';

/**
 * @function removeValueFromDatabase
 * @description Remove all documents from a collection where a specific field has a specific value.
 * @param {Db} db The database connection.
 * @param {string} collection The name of the collection.
 * @param {string} field The name of the field to check.
 * @param {string} value The value to match.
 */
export const removeValueFromDatabase = async (db: Db, collection: string, field: string, value: string) => {
  await db.collection(collection).deleteMany({ [field]: value });
};
