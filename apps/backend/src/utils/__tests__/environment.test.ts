jest.unmock('../environment');

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation((() => {}) as never);

import {
  environment as envProxy,
  getEnv,
  getEnvironment,
  initEnvironment,
  loadEnvironment,
  resetEnvironmentCache,
  validatePort,
} from '../environment';

afterAll(() => {
  mockConsoleError.mockRestore();
  mockProcessExit.mockRestore();
});

beforeEach(() => {
  mockConsoleError.mockClear();
  mockProcessExit.mockClear();
  resetEnvironmentCache();
});

describe('Environment Utils', () => {
  describe('getEnv', () => {
    it('should return the value when the environment variable is defined', () => {
      process.env.TEST_VAR = 'test_value';
      expect(getEnv('TEST_VAR')).toBe('test_value');
      delete process.env.TEST_VAR;
    });

    it('should call process.exit(1) when the variable is undefined', () => {
      delete process.env.UNDEFINED_VAR;
      getEnv('UNDEFINED_VAR');

      expect(mockProcessExit).toHaveBeenCalledWith(1);
      expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('UNDEFINED_VAR is not defined'));
    });

    it('should call process.exit(1) when the variable is empty', () => {
      process.env.EMPTY_VAR = '';
      getEnv('EMPTY_VAR');

      expect(mockProcessExit).toHaveBeenCalledWith(1);
      expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('EMPTY_VAR is empty'));
      delete process.env.EMPTY_VAR;
    });
  });

  describe('validatePort', () => {
    it('should return the port number when PORT is valid', () => {
      const originalPort = process.env.PORT;
      process.env.PORT = '4000';
      expect(validatePort()).toBe(4000);
      process.env.PORT = originalPort;
    });

    it('should call process.exit(1) when PORT is undefined', () => {
      const originalPort = process.env.PORT;
      delete process.env.PORT;
      validatePort();

      expect(mockProcessExit).toHaveBeenCalledWith(1);
      expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('PORT is not defined or empty'));
      process.env.PORT = originalPort;
    });

    it('should call process.exit(1) when PORT is empty', () => {
      const originalPort = process.env.PORT;
      process.env.PORT = '';
      validatePort();

      expect(mockProcessExit).toHaveBeenCalledWith(1);
      expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('PORT is not defined or empty'));
      process.env.PORT = originalPort;
    });

    it('should call process.exit(1) when PORT is not a number', () => {
      const originalPort = process.env.PORT;
      process.env.PORT = 'invalid';
      validatePort();

      expect(mockProcessExit).toHaveBeenCalledWith(1);
      expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('PORT is not a number'));
      process.env.PORT = originalPort;
    });
  });

  describe('loadEnvironment', () => {
    it('should return a valid Environment object when all vars are present', () => {
      const result = loadEnvironment();

      expect(result).toHaveProperty('NODE_ENV');
      expect(result).toHaveProperty('PORT');
      expect(typeof result.PORT).toBe('number');
    });
  });

  describe('initEnvironment', () => {
    it('should initialize and return environment object', () => {
      const result = initEnvironment();

      expect(result).toHaveProperty('NODE_ENV');
      expect(result).toHaveProperty('PORT');
    });

    it('should return the same object on subsequent calls', () => {
      const result1 = initEnvironment();
      const result2 = initEnvironment();

      expect(result1).toBe(result2);
    });
  });

  describe('getEnvironment', () => {
    it('should throw if initEnvironment was not called', () => {
      expect(() => getEnvironment()).toThrow('Environment not initialized');
    });

    it('should return environment after initEnvironment is called', () => {
      initEnvironment();
      const result = getEnvironment();

      expect(result).toHaveProperty('NODE_ENV');
    });
  });

  describe('resetEnvironmentCache', () => {
    it('should reset the environment cache', () => {
      initEnvironment();
      resetEnvironmentCache();

      expect(() => getEnvironment()).toThrow('Environment not initialized');
    });
  });

  describe('environment proxy export', () => {
    it('should work after initEnvironment is called', () => {
      initEnvironment();

      expect(envProxy.NODE_ENV).toBeDefined();
      expect(envProxy.PORT).toBeDefined();
    });
  });
});
