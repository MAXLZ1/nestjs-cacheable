import { Module } from '@nestjs/common';
import { AsyncRegisterWithClassController } from './async-register-with-class.controller';
import { CacheModule } from '../../../../../src';
import { CacheConfig } from './config/cache.config';

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfig,
    }),
  ],
  controllers: [AsyncRegisterWithClassController],
})
export class AsyncRegisterWithClassModule {}
