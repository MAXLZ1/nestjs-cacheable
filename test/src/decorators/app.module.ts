import { Module } from '@nestjs/common';
import { CacheModule } from '../../../src';
import { AppController } from './app.controller';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({ ttl: '1m', namespace: 'test' }),
    }),
    TestModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
