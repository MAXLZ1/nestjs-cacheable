import { describe, expect, it, vi } from 'vitest';
import { clearHelper } from '../../../src/helper/clear.helper';
import { Keyv } from 'keyv';
import { KeyvCacheableMemory, CacheableMemory } from 'cacheable';
import { LRUCache } from 'lru-cache';
import KeyvMemcache from '@keyv/memcache';

vi.mock('keyv', () => import('../../__mocks__/keyv'));
vi.mock('cacheable', () => import('../../__mocks__/cacheable'));
vi.mock('lru-cache', () => import('../../__mocks__/lru-cache'));
vi.mock('@keyv/memcache', () => import('../../__mocks__/@keyv/memcache'));

describe('clearHelper', () => {
  it('should delete keys from KeyvCacheableMemory store', async () => {
    const keyv = new Keyv({
      store: new KeyvCacheableMemory(),
      namespace: 'namespace',
    });

    vi.spyOn(Keyv.prototype, '_getKeyPrefix').mockReturnValueOnce(
      'namespace:name',
    );
    vi.spyOn(CacheableMemory.prototype, 'keys', 'get').mockImplementationOnce(
      () => ['namespace:name:1', 'namespace:name:2'].values(),
    );
    const deleteManySpy = vi.spyOn(CacheableMemory.prototype, 'deleteMany');
    await clearHelper(keyv, 'name');

    expect(deleteManySpy).toHaveBeenCalledWith([
      'namespace:name:1',
      'namespace:name:2',
    ]);
  });

  it('should delete keys from LRUCache store', async () => {
    const keyv = new Keyv({
      store: new LRUCache({ maxSize: 500 }),
      namespace: 'namespace',
    });

    vi.spyOn(Keyv.prototype, '_getKeyPrefix').mockReturnValueOnce(
      'namespace:name',
    );
    vi.spyOn(LRUCache.prototype, 'keys').mockImplementationOnce(
      () =>
        ['namespace:name:1', 'namespace:name:2'].values() as ReturnType<
          LRUCache<string, string>['keys']
        >,
    );
    const deleteSpy = vi.spyOn(LRUCache.prototype, 'delete');
    await clearHelper(keyv, 'name');

    expect(deleteSpy).toHaveBeenNthCalledWith(1, 'namespace:name:1');
  });

  it('should throw an error if delete keys from KeyvMemcache store', async () => {
    const keyv = new Keyv({
      store: new KeyvMemcache(),
      namespace: 'namespace',
    });

    await expect(clearHelper(keyv, 'name')).rejects.toThrow(Error);
  });
});
