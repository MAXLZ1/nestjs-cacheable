import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  getTtl(): string {
    return '1m';
  }
}
