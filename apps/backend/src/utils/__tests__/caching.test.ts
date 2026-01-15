import { getFromCache, removeFromCache, setInCache } from '../caching';

describe('Caching Utils', () => {
  const key = 'test-key';
  const value = { data: 'test-value' };

  beforeEach(() => {
    removeFromCache(key);
  });

  it('should set and get value from cache', () => {
    setInCache(key, value);
    const result = getFromCache(key);
    expect(result).toEqual(value);
  });

  it('should return undefined for non-existent key', () => {
    const result = getFromCache('non-existent');
    expect(result).toBeUndefined();
  });

  it('should remove value from cache', () => {
    setInCache(key, value);
    removeFromCache(key);
    const result = getFromCache(key);
    expect(result).toBeUndefined();
  });
});
