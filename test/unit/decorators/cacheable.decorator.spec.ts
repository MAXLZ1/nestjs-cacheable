import { describe, expect, it, vi } from 'vitest';
import { CacheableHelper } from '../../../src/helper/cacheable.helper';
import { Cacheable as CacheableDecorator } from '../../../src';

vi.mock(
  '../../../src/helper/cacheable.helper',
  () => import('../../__mocks__/cacheable.helper'),
);

describe('Cacheable', () => {
  it('should not set cache if there is no a cacheable', async () => {
    class TestService {
      @CacheableDecorator<typeof TestService.prototype.getValue>({
        name: 'test',
        key: ({ args }) => `item:${args[0]}`,
      })
      getValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    vi.spyOn(CacheableHelper, 'getCacheable').mockReturnValueOnce(undefined);
    const result = await testService.getValue(1);

    expect(result).toBe(1);
  });

  it('should check cache before call method', async () => {
    class TestService {
      checkMethodCall() {}

      @CacheableDecorator<typeof TestService.prototype.getValue>({
        name: 'test',
        key: ({ args }) => `item:${args[0]}`,
      })
      getValue(id: number) {
        this.checkMethodCall();
        return id;
      }
    }
    const testService = new TestService();
    const checkMethodCallSpy = vi.spyOn(testService, 'checkMethodCall');
    const getSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'get');
    const result = await testService.getValue(1);

    expect(result).toBe(1);
    expect(getSpy).toHaveBeenCalledWith('test:item:1');
    expect(getSpy).toHaveBeenCalledBefore(checkMethodCallSpy);
  });

  it('should set cache', async () => {
    class TestService {
      @CacheableDecorator<typeof TestService.prototype.getValue>({
        name: 'test',
        key: ({ args }) => `item:${args[0]}`,
      })
      getValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    const setSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'set');
    const result = await testService.getValue(1);

    expect(result).toBe(1);
    expect(setSpy).toHaveBeenCalledWith('test:item:1', 1, undefined);
  });

  it('should set cache by a string key', async () => {
    class TestService {
      @CacheableDecorator({ name: 'test', key: 'value' })
      getValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    const setSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'set');
    const result = await testService.getValue(1);

    expect(result).toBe(1);
    expect(setSpy).toHaveBeenCalledWith('test:value', 1, undefined);
  });

  it('should set cache if the key is undefined', async () => {
    class TestService {
      @CacheableDecorator({ name: 'test' })
      getValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    const setSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'set');
    const result = await testService.getValue(1);

    expect(result).toBe(1);
    expect(setSpy).toHaveBeenCalledWith('test:getValue:[1]', 1, undefined);
  });

  it('should return result from cache', async () => {
    class TestService {
      @CacheableDecorator({ name: 'test' })
      getValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    vi.spyOn(CacheableHelper.getCacheable()!, 'get').mockResolvedValueOnce(2);
    const result = await testService.getValue(1);

    expect(result).toBe(2);
  });

  it('should set cache when the condition is met', async () => {
    class TestService {
      @CacheableDecorator<typeof TestService.prototype.getValue>({
        name: 'test',
        key: ({ args }) => `item:${args[0]}`,
        condition: ({ result }) => result !== 0,
      })
      getValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    const setSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'set');
    const result = await testService.getValue(1);

    expect(result).toBe(1);
    expect(setSpy).toHaveBeenCalledWith('test:item:1', 1, undefined);
  });

  it('should not set cache when the condition is not met', async () => {
    class TestService {
      @CacheableDecorator<typeof TestService.prototype.getValue>({
        name: 'test',
        key: ({ args }) => `item:${args[0]}`,
        condition: ({ result }) => result !== 0,
      })
      getValue(id: number) {
        return id;
      }
    }
    const testService = new TestService();
    const setSpy = vi.spyOn(CacheableHelper.getCacheable()!, 'set');
    const result = await testService.getValue(0);

    expect(result).toBe(0);
    expect(setSpy).not.toHaveBeenCalled();
  });
});
