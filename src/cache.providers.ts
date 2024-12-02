import { CACHEABLE } from './cache.constants';
import { MODULE_OPTIONS_TOKEN } from './cache.module-definition';
import { Cacheable, CacheableOptions } from 'cacheable';
import { Provider } from '@nestjs/common';

export function createCacheable(): Provider {
  return {
    provide: CACHEABLE,
    inject: [MODULE_OPTIONS_TOKEN],
    useFactory: (options: CacheableOptions) => {
      return new Cacheable(options);
    },
  };
}
