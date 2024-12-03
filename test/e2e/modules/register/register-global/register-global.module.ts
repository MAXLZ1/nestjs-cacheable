import { Module } from '@nestjs/common';
import { RegisterGlobalController } from './register-global.controller';
import { CacheModule } from '../../../../../src';
import { OtherModule } from './other/other.module';

@Module({
  imports: [CacheModule.register({ isGlobal: true }), OtherModule],
  controllers: [RegisterGlobalController],
})
export class RegisterGlobalModule {}
