import bcrypt from 'bcrypt';
import ApiError from '../api-error';
import { comparePasswords, decryptString, encryptString, hashPassword, safeEqualCheck } from '../crypt';

jest.mock('bcrypt');

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

afterAll(() => {
  mockConsoleError.mockRestore();
});

describe('Crypt Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const result = await hashPassword('password');
      expect(result).toBe('hashed_password');
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 'salt');
    });

    it('should throw ApiError if hashing fails', async () => {
      (bcrypt.genSalt as jest.Mock).mockRejectedValue(new Error('Bcrypt error'));
      await expect(hashPassword('password')).rejects.toThrow(ApiError);
    });
  });

  describe('comparePasswords', () => {
    it('should return true if passwords match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await comparePasswords('password', 'hashed');
      expect(result).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await comparePasswords('password', 'hashed');
      expect(result).toBe(false);
    });

    it('should throw ApiError if comparison fails', async () => {
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error('Bcrypt error'));
      await expect(comparePasswords('password', 'hashed')).rejects.toThrow(ApiError);
    });
  });

  describe('encryptString & decryptString', () => {
    const secret = '0'.repeat(64);

    it('should encrypt and decrypt a string correctly', () => {
      const original = 'my secret message';
      const encrypted = encryptString(original, secret);
      const decrypted = decryptString(encrypted, secret);
      expect(decrypted).toBe(original);
    });

    it('should throw error if secret is invalid length during encryption', () => {
      const invalidSecret = '123';
      expect(() => encryptString('test', invalidSecret)).toThrow(ApiError);
    });

    it('should throw error if secret is invalid length during decryption', () => {
      const validEncrypted = encryptString('test', secret);
      const invalidSecret = '123';
      expect(() => decryptString(validEncrypted, invalidSecret)).toThrow(ApiError);
    });

    it('should throw error if encrypted string format is invalid', () => {
      expect(() => decryptString('invalid-format', secret)).toThrow(ApiError);
    });
  });

  describe('safeEqualCheck', () => {
    it('should return true for equal strings', () => {
      expect(safeEqualCheck('abc', 'abc')).toBe(true);
    });

    it('should return false for different strings', () => {
      expect(safeEqualCheck('abc', 'def')).toBe(false);
    });

    it('should return false if lengths differ', () => {
      expect(safeEqualCheck('abc', 'abcd')).toBe(false);
    });

    it('should return false if inputs are empty/null', () => {
      expect(safeEqualCheck('', 'abc')).toBe(false);
      expect(safeEqualCheck('abc', '')).toBe(false);
    });
  });
});
