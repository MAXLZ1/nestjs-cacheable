import { Module } from '@nestjs/common';
import { CacheModule } from '../../../../../src';
import { AppController } from './app.controller';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          ttl: '30m',
        };
      },
    }),
    TestModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
