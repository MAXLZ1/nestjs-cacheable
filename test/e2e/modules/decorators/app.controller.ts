import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TestService } from './test/test.service';

@Controller()
export class AppController {
  constructor(private readonly cacheableService: TestService) {}

  @Get('/value/:id')
  getValue(@Param('id') id: string) {
    return this.cacheableService.getValue(id);
  }

  @Post('/value/:id')
  setValue(@Param('id') id: string) {
    return this.cacheableService.setValue(id);
  }

  @Delete('/value/:id')
  delValue(@Param('id') id: string) {
    return this.cacheableService.delValue(id);
  }

  @Delete('/value')
  delAll() {
    return this.cacheableService.delAll();
  }
}
