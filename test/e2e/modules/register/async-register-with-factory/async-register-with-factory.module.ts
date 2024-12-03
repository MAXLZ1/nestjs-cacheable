import { Module } from '@nestjs/common';
import { AsyncRegisterWithFactoryController } from './async-register-with-factory.controller';
import { CacheModule } from '../../../../../src';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        ttl: '1m',
      }),
    }),
  ],
  controllers: [AsyncRegisterWithFactoryController],
})
export class AsyncRegisterWithFactoryModule {}
