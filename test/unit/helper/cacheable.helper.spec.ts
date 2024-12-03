import { describe, expect, it } from 'vitest';
import { CacheableHelper } from '../../../src/helper/cacheable.helper';
import { Cacheable } from 'cacheable';

describe('CacheableHelper', () => {
  it('should set a cacheable', () => {
    const cacheable = {} as Cacheable;
    CacheableHelper.setCacheable(cacheable);

    expect(CacheableHelper.getCacheable()).toStrictEqual(cacheable);
  });

  it('should get a cacheable', () => {
    const cacheable = {} as Cacheable;
    CacheableHelper.setCacheable(cacheable);

    expect(CacheableHelper.getCacheable()).toStrictEqual(cacheable);
  });

  it('should clear a cacheable', () => {
    const cacheable = {} as Cacheable;
    CacheableHelper.setCacheable(cacheable);
    CacheableHelper.clearCacheable();

    expect(CacheableHelper.getCacheable()).toBeUndefined();
  });
});
