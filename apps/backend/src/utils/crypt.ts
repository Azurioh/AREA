import bcrypt from 'bcrypt';
import ApiError from './api-error';
import { HttpStatusCode } from '@area/shared/enums/http-status';
import crypto from 'node:crypto';

/**
 * @function hashPassword
 * @description Hashes a given password.
 *
 * @param {string} password The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (err: unknown) {
    console.error(`\r\x1b[31mError:\x1b[0m Password hashing went wrong.\n${err}`);
    throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Unknow error occured');
  }
}

/**
 * @function comparePasswords
 * @description Compares a plain text password with a hashed password.
 *
 * @param {string} password The password in plain text
 * @param {string} hashedPassword The hashed password
 * @returns {Promise<boolean>} If both password match.
 */
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const result = await bcrypt.compare(password, hashedPassword);

    return result;
  } catch (err: unknown) {
    console.error(`\r\x1b[31mError:\x1b[0m Passwords comparaison went wrong.\n${err}`);
    throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Unknow error occured');
  }
}

/**
 * @description The algorithm used to encrypt and decrypt the string
 */
const ALGORITHM = 'aes-256-gcm';

/**
 * @function encryptString
 * @description Encrypt a plain string.
 *
 * @param {string} toEncrypt The plain string to encrypt
 * @param {string} secret The secret to use to encrypt the string
 * @returns {string} The encrypted string.
 */
export function encryptString(toEncrypt: string, secret: string): string {
  const iv = crypto.randomBytes(12);
  const key = Buffer.from(secret, 'hex');

  if (key.length !== 32) {
    console.error(
      `\r\x1b[31mError:\x1b[0m The given secret is not 32 bytes long (a length of 32 is required to encrypt).`,
    );
    throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Unknow error occured');
  }

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(toEncrypt, 'utf8'), cipher.final()]);

  return [iv.toString('hex'), cipher.getAuthTag().toString('hex'), encrypted.toString('hex')].join(':');
}

/**
 * @function decryptString
 * @description Decrypt an encrypted string.
 *
 * @param {string} toDecrypt The string to decrypt
 * @param {string} secret The secret to use to decrypt the string
 * @returns {string} The decrypted string.
 */
export function decryptString(toDecrypt: string, secret: string): string {
  const [ivHex, tagHex, encryptedHex] = toDecrypt.split(':');

  if (!ivHex || !tagHex || !encryptedHex) {
    console.error(`\r\x1b[31mError:\x1b[0m The given string to decrypt doesnt contain 'iv', 'tag' and 'encrypted'.`);
    throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Unknow error occured');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const key = Buffer.from(secret, 'hex');

  if (key.length !== 32) {
    console.error(
      `\r\x1b[31mError:\x1b[0m The given secret is not 32 bytes long (a length of 32 is required to encrypt).`,
    );
    throw new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Unknow error occured');
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv).setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

  return decrypted.toString('utf8');
}
