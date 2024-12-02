import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { CacheModule } from '../../../../src';

@Module({
  imports: [CacheModule.register()],
  controllers: [RegisterController],
})
export class RegisterModule {}
