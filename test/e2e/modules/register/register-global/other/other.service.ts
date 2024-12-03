import { Cache, CACHEABLE } from '../../../../../../src';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class OtherService {
  constructor(@Inject(CACHEABLE) private readonly cacheable: Cache) {}

  async getFromCache(): Promise<string> {
    const value: string | undefined = await this.cacheable.get('key');
    if (!value) {
      await this.cacheable.set('key', 'value');
    }
    return value ?? 'Not found';
  }
}
