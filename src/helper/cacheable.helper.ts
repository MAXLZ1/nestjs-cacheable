import { Cache } from '../cache.module';

export class CacheableHelper {
  private static cacheable: Cache | undefined;

  static setCacheable(cacheable: Cache) {
    this.cacheable = cacheable;
  }

  static getCacheable() {
    return this.cacheable;
  }

  static clearCacheable() {
    this.cacheable = undefined;
  }
}
