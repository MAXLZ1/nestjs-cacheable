import { afterAll, beforeAll, describe, it } from 'vitest';
import { Test } from '@nestjs/testing';
import { AsyncRegisterWithFactoryModule } from './modules/register/async-register-with-factory/async-register-with-factory.module';
import { Server } from 'net';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

describe('Async Register With Factory', () => {
  let server: Server;
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AsyncRegisterWithFactoryModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not found', async () => {
    await request(server).get('/').expect(200, 'Not found');
  });

  it(`should return data`, async () => {
    await request(server).get('/').expect(200, 'value');
  });
});
