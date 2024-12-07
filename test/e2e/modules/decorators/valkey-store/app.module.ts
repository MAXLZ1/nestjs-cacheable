import { Module } from '@nestjs/common';
import { CacheModule } from '../../../../../src';
import { AppController } from './app.controller';
import { TestModule } from './test/test.module';
import KeyvValkey from '@keyv/valkey';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          primary: new KeyvValkey(`redis://${process.env.HOST}:6370`),
          ttl: '10m',
        };
      },
    }),
    TestModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
