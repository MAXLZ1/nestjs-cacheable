import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from './cache.module-definition';
import { CACHEABLE } from './cache.constants';
import { createCacheable } from './cache.providers';
import { Cacheable } from 'cacheable';
import { ModuleRef } from '@nestjs/core';
import { CacheableHelper } from './helper/cacheable.helper';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type,@typescript-eslint/no-unsafe-declaration-merging
export interface Cache extends Cacheable {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export abstract class Cache {}

@Module({
  providers: [
    createCacheable(),
    {
      provide: Cache,
      useExisting: CACHEABLE,
    },
  ],
  exports: [CACHEABLE, Cache],
})
export class CacheModule
  extends ConfigurableModuleClass
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private moduleRef: ModuleRef) {
    super();
  }

  static register(options: typeof OPTIONS_TYPE = {}) {
    return super.register(options);
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE) {
    return super.registerAsync(options);
  }

  onModuleInit() {
    CacheableHelper.setCacheable(this.moduleRef.get<Cache>(CACHEABLE));
  }

  onModuleDestroy() {
    CacheableHelper.clearCacheable();
  }
}
