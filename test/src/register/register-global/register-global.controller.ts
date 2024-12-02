import { Controller, Get } from '@nestjs/common';
import { OtherService } from './other/other.service';

@Controller()
export class RegisterGlobalController {
  constructor(private readonly otherService: OtherService) {}

  @Get()
  async getFromCache() {
    return this.otherService.getFromCache();
  }
}
