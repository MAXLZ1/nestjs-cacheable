import { describe, expect, it, vi } from 'vitest';
import { CacheableHelper } from '../../../src/helper/cacheable.helper';
import { CacheEvict } from '../../../src';
import { clearHelper } from '../../../src/helper/clear.helper';
import { Keyv } from 'keyv';
import { Cacheable } from 'cacheable';
import KeyvMemcache from '@keyv/memcache';

vi.mock(
  '../../../src/helper/cacheable.helper',
  () => import('../../__mocks__/cacheable.helper'),
);
vi.mock('../../../src/helper/clear.helper');

describe('CacheEvict', () => {
  it('should not delete cache if there is no a cacheable', async () => {
    class TestService {
      @CacheEvict<typeof TestService.prototype.delValue>({
        name: 'test',
        key: ({ args }) => `item:${args[0]}`,
        beforeInvocation: true,
      })
      delValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    vi.spyOn(CacheableHelper, 'getCacheable').mockReturnValueOnce(undefined);
    const result = await testService.delValue(1);

    expect(result).toBe(1);
  });

  it('should delete cache before call method', async () => {
    class TestService {
      checkMethodCall() {}

      @CacheEvict<typeof TestService.prototype.delValue>({
        name: 'test',
        key: ({ args }) => `item:${args[0]}`,
        beforeInvocation: true,
      })
      delValue(id: number) {
        this.checkMethodCall();
        return id;
      }
    }

    const testService = new TestService();
    const checkMethodCallSpy = vi.spyOn(testService, 'checkMethodCall');
    const deleteSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'delete');
    const result = await testService.delValue(1);

    expect(result).toBe(1);
    expect(deleteSpy).toHaveBeenCalledWith('test:item:1');
    expect(deleteSpy).toHaveBeenCalledBefore(checkMethodCallSpy);
  });

  it('should delete cache after call method', async () => {
    class TestService {
      checkMethodCall() {}

      @CacheEvict<typeof TestService.prototype.delValue>({
        name: 'test',
        key: ({ args }) => `item:${args[0]}`,
        beforeInvocation: false,
      })
      delValue(id: number) {
        this.checkMethodCall();
        return id;
      }
    }

    const testService = new TestService();
    const checkMethodCallSpy = vi.spyOn(testService, 'checkMethodCall');
    const deleteSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'delete');
    const result = await testService.delValue(1);

    expect(result).toBe(1);
    expect(deleteSpy).toHaveBeenCalledWith('test:item:1');
    expect(deleteSpy).toHaveBeenCalledAfter(checkMethodCallSpy);
  });

  it('should delete cache by string key', async () => {
    class TestService {
      @CacheEvict({ name: 'test', key: 'value' })
      delValue(id: number) {
        return id;
      }
    }

    const testService = new TestService();
    const deleteSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'delete');
    const result = await testService.delValue(1);

    expect(result).toBe(1);
    expect(deleteSpy).toHaveBeenCalledWith('test:value');
  });

  it('should delete all cache in the primary', async () => {
    class TestService {
      @CacheEvict({ name: 'test', allEntries: true })
      delValue(id: number) {
        return id;
      }
    }

    vi.spyOn(CacheableHelper, 'getCacheable').mockReturnValueOnce(
      new Cacheable({ nonBlocking: true }),
    );
    const raceSpy = vi.spyOn(Promise, 'race');
    const testService = new TestService();
    const result = await testService.delValue(1);

    expect(result).toBe(1);
    expect(clearHelper).toHaveBeenNthCalledWith(1, expect.any(Keyv), 'test');
    expect(clearHelper).not.toHaveBeenNthCalledWith(2);
    expect(raceSpy).toHaveBeenCalled();
  });

  it('should delete all cache in the primary and secondary', async () => {
    class TestService {
      @CacheEvict({ name: 'test', allEntries: true })
      delValue(id: number) {
        return id;
      }
    }

    vi.spyOn(CacheableHelper, 'getCacheable').mockReturnValueOnce(
      new Cacheable({ secondary: new KeyvMemcache(), nonBlocking: false }),
    );
    const allSpy = vi.spyOn(Promise, 'all');
    const testService = new TestService();
    const result = await testService.delValue(1);

    expect(result).toBe(1);
    expect(clearHelper).toHaveBeenNthCalledWith(1, expect.any(Keyv), 'test');
    expect(clearHelper).toHaveBeenNthCalledWith(2, expect.any(Keyv), 'test');
    expect(allSpy).toHaveBeenCalled();
  });

  it('should delete cache by name if the key is missing', async () => {
    class TestService {
      @CacheEvict({ name: 'test' })
      delValue(id: number) {
        return id;
      }
    }

    const deleteSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'delete');
    const testService = new TestService();
    const result = await testService.delValue(1);

    expect(result).toBe(1);
    expect(deleteSpy).toHaveBeenCalledWith('test');
  });
});
