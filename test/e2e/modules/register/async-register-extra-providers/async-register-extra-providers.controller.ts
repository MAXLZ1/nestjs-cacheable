import { Controller, Get, Inject } from '@nestjs/common';
import { CACHEABLE, Cache } from '../../../../../src';

@Controller()
export class AsyncRegisterExtraProvidersController {
  constructor(@Inject(CACHEABLE) private readonly cacheable: Cache) {}

  @Get()
  async getFromCache(): Promise<string> {
    const value: string | undefined = await this.cacheable.get('key');
    if (!value) {
      await this.cacheable.set('key', 'value');
    }
    return value ?? 'Not found';
  }
}
