import { Module } from '@nestjs/common';
import { AsyncRegisterGlobalController } from './async-register-global.controller';
import { CacheModule } from '../../../../src';
import { OtherModule } from './other/other.module';

@Module({
  imports: [
    CacheModule.registerAsync({ isGlobal: true, useFactory: () => ({}) }),
    OtherModule,
  ],
  controllers: [AsyncRegisterGlobalController],
})
export class AsyncRegisterGlobalModule {}
