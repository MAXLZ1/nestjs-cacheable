import { Module } from '@nestjs/common';
import { AsyncRegisterExtraProvidersController } from './async-register-extra-providers.controller';
import { CacheModule } from '../../../../src';
import { CacheConfig } from './config/cache.config';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      extraProviders: [ConfigService],
      useClass: CacheConfig,
    }),
  ],
  controllers: [AsyncRegisterExtraProvidersController],
})
export class AsyncRegisterExtraProvidersModule {}
