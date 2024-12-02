import { afterAll, beforeAll, describe, it } from 'vitest';
import { Test } from '@nestjs/testing';
import { Server } from 'net';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AsyncRegisterGlobalModule } from '../src/register/async-register-global/async-register-global.module';

describe('Async Register Global', () => {
  let server: Server;
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AsyncRegisterGlobalModule],
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
