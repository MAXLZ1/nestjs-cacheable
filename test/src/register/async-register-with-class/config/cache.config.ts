import { Injectable } from '@nestjs/common';
import { CacheOptionsFactory } from '../../../../../src';
import { CacheableOptions } from 'cacheable';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  createCacheOptions(): CacheableOptions {
    return { ttl: '1m' };
  }
}
