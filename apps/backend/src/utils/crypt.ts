import bcrypt from 'bcrypt';
import ApiError from './api-error';
import { HttpStatusCode } from '@area/shared/enums/http-status';

/**
 * @function hashPassword
 * @description Hashes a given password.
 *
 * @param password The password to hash.
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
 * @param password The password in plain text
 * @param hashedPassword The hashed password
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
