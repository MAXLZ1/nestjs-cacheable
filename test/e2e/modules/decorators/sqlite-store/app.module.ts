import { Module } from '@nestjs/common';
import { CacheModule } from '../../../../../src';
import { AppController } from './app.controller';
import { TestModule } from './test/test.module';
import KeyvSqlite from '@keyv/sqlite';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          primary: new KeyvSqlite({ uri: 'sqlite://test/testdb.sqlite' }),
          ttl: '10m',
        };
      },
    }),
    TestModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
