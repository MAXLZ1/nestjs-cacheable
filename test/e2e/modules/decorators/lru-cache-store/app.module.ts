import { Module } from '@nestjs/common';
import { CacheModule } from '../../../../../src';
import { AppController } from './app.controller';
import { TestModule } from './test/test.module';
import { LRUCache } from 'lru-cache';
import { Keyv } from 'keyv';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          primary: new Keyv({
            store: new LRUCache({
              maxSize: 500,
              sizeCalculation: () => {
                return 1;
              },
            }),
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
