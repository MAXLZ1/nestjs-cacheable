import { describe, expect, expectTypeOf, it } from 'vitest';
import { createCacheable } from '../../src/cache.providers';
import { CACHEABLE } from '../../src';
import { MODULE_OPTIONS_TOKEN } from '@nestjs/common/cache/cache.module-definition';
import { FactoryProvider, Provider } from '@nestjs/common';
import { Cacheable } from 'cacheable';

describe('createCacheable', () => {
  it('should return a provider', () => {
    const result = createCacheable();

    expect(result).toStrictEqual({
      provide: CACHEABLE,
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: expect.any(Function),
    });
    expectTypeOf(result).toEqualTypeOf<Provider>();
  });

  it('should return a Cacheable from the createCacheable factory function', () => {
    const provider = createCacheable();

    const result = (provider as FactoryProvider).useFactory();

    expect(result).toBeInstanceOf(Cacheable);
  });
});
