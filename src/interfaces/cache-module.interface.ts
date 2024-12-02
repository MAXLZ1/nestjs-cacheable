import { CacheableOptions } from 'cacheable';

export type CacheModuleOptions = CacheableOptions;

export interface CacheOptionsFactory {
  createCacheOptions(): Promise<CacheableOptions> | CacheableOptions;
}
