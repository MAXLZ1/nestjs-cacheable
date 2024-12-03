import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CacheableOptions } from 'cacheable';
import { CacheOptionsFactory } from '../../../../../../src';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheableOptions {
    const ttl = this.configService.getTtl();
    return { ttl };
  }
}
