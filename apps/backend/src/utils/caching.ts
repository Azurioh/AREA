const cache = new Map<string, any>();

/**
 * @function getFromCache
 * @description Get a value from the cache.
 *
 * @param {string} key The key of the value to get.
 * @returns {T | undefined} The value from the cache or undefined if not found.
 */
export const getFromCache = <T>(key: string): T | undefined => {
  return cache.get(key);
};

/**
 * @function setInCache
 * @description Set a value in the cache.
 *
 * @param {string} key The key of the value to set.
 * @param {T} value The value to set.
 */
export const setInCache = <T>(key: string, value: T): void => {
  cache.set(key, value);
};

/**
 * @function removeFromCache
 * @description Remove a value from the cache.
 *
 * @param {string} key The key of the value to remove.
 */
export const removeFromCache = (key: string): void => {
  cache.delete(key);
};
