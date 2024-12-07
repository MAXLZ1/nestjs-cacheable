import { Module } from '@nestjs/common';
import { CacheModule } from '../../../../../src';
import { AppController } from './app.controller';
import { TestModule } from './test/test.module';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          primary: new KeyvRedis({
            socket: {
              host: process.env.HOST,
              port: 6381,
            },
          }),
          ttl: '10m',
        };
      },
    }),
    TestModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
