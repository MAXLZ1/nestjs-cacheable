import { describe, expect, it, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { CACHEABLE, CacheModule } from '../../src';
import { CacheableHelper } from '../../src/helper/cacheable.helper';

vi.mock(
  '../../../src/helper/cacheable.helper',
  () => import('../__mocks__/cacheable.helper'),
);

describe('CacheModule', () => {
  it('should register a cache module by register', async () => {
    const module = await Test.createTestingModule({
      imports: [CacheModule.register()],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should register a cache module by async register', async () => {
    const module = await Test.createTestingModule({
      imports: [CacheModule.registerAsync({ useFactory: () => ({}) })],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should set cacheable when the cache module is initialized', async () => {
    const setCacheableSpy = vi.spyOn(CacheableHelper, 'setCacheable');
    const module = await Test.createTestingModule({
      imports: [CacheModule.register()],
    }).compile();
    await module.init();

    expect(setCacheableSpy).toHaveBeenCalledWith(module.get(CACHEABLE));
  });

  it('should clear cacheable when the cache module is destroyed', async () => {
    const clearCacheableSpy = vi.spyOn(CacheableHelper, 'clearCacheable');
    const module = await Test.createTestingModule({
      imports: [CacheModule.register()],
    }).compile();
    await module.close();

    expect(clearCacheableSpy).toHaveBeenCalled();
  });
});
