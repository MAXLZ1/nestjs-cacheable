import { describe, expect, it, vi } from 'vitest';
import { CacheableHelper } from '../../../src/helper/cacheable.helper';
import { CachePut } from '../../../src';

vi.mock(
  '../../../src/helper/cacheable.helper',
  () => import('../../__mocks__/cacheable.helper'),
);

describe('CachePut', () => {
  it('should not set cache if there is no a cacheable', async () => {
    class TestService {
      @CachePut<typeof TestService.prototype.setValue>({
        name: 'test',
        key: ({ args }) => `item:${args[0]}`,
      })
      setValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    vi.spyOn(CacheableHelper, 'getCacheable').mockReturnValueOnce(undefined);
    const result = await testService.setValue(1);

    expect(result).toBe(1);
  });

  it('should set cache', async () => {
    class TestService {
      @CachePut<typeof TestService.prototype.setValue>({
        name: 'test',
        key: ({ args }) => `item:${args[0]}`,
      })
      setValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    const setSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'set');
    const result = await testService.setValue(1);

    expect(result).toBe(1);
    expect(setSpy).toHaveBeenCalledWith('test:item:1', 1, undefined);
  });

  it('should set cache by a string key', async () => {
    class TestService {
      @CachePut({ name: 'test', key: 'item' })
      setValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    const setSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'set');
    const result = await testService.setValue(1);

    expect(result).toBe(1);
    expect(setSpy).toHaveBeenCalledWith('test:item', 1, undefined);
  });

  it('should set cache if the key is undefined', async () => {
    class TestService {
      @CachePut({ name: 'test' })
      setValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    const setSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'set');
    const result = await testService.setValue(1);

    expect(result).toBe(1);
    expect(setSpy).toHaveBeenCalledWith('test:setValue:[1]', 1, undefined);
  });

  it('should set cache when the condition is met', async () => {
    class TestService {
      @CachePut<typeof TestService.prototype.setValue>({
        name: 'test',
        key: 'item',
        condition: ({ result }) => result !== 0,
      })
      setValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    const setSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'set');
    const result = await testService.setValue(1);

    expect(result).toBe(1);
    expect(setSpy).toHaveBeenCalledWith('test:item', 1, undefined);
  });

  it('should not set cache when the condition is not met', async () => {
    class TestService {
      @CachePut<typeof TestService.prototype.setValue>({
        name: 'test',
        key: 'item',
        condition: ({ result }) => result !== 0,
      })
      setValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    const setSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'set');
    const result = await testService.setValue(0);

    expect(result).toBe(0);
    expect(setSpy).not.toHaveBeenCalled();
  });
});
