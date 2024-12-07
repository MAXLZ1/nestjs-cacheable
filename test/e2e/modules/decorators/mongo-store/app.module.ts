import { Module } from '@nestjs/common';
import { CacheModule } from '../../../../../src';
import { AppController } from './app.controller';
import { TestModule } from './test/test.module';
import KeyvMongo from '@keyv/mongo';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          primary: new KeyvMongo(`mongodb://${process.env.HOST}:27017`),
          ttl: '10m',
        };
      },
    }),
    TestModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
