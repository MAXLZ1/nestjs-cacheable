import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { Server } from 'net';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './modules/decorators/postgres-store/app.module';
import { CACHEABLE, Cache } from '../../src';
import { TestService } from './modules/decorators/postgres-store/test/test.service';

describe('Decorator For Postgres Store', () => {
  let server: Server;
  let app: INestApplication;
  let cacheable: Cache;
  let cacheableService: TestService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    cacheable = app.get<Cache>(CACHEABLE);
    cacheableService = app.get<TestService>(TestService);
    // https://github.com/ladjs/supertest/issues/709
    server.listen(0);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Cacheable Decorator', () => {
    beforeAll(async () => {
      await cacheable.clear();
    });

    it('should cache result', async () => {
      const checkMethodCallSpy = vi.spyOn(cacheableService, 'checkMethodCall');

      await request(server).get('/value/1').expect(200, '1');
      await expect(cacheable.get('value:1')).resolves.toBe('1');
      expect(checkMethodCallSpy).toHaveBeenCalled();
    });

    it(`should get result from cache`, async () => {
      const checkMethodCallSpy = vi.spyOn(cacheableService, 'checkMethodCall');

      await request(server).get('/value/1').expect(200, '1');
      expect(checkMethodCallSpy).not.toHaveBeenCalled();
    });
  });

  describe('CachePut Decorator', () => {
    beforeAll(async () => {
      await cacheable.clear();
    });

    it('should cache result', async () => {
      const checkMethodCallSpy = vi.spyOn(cacheableService, 'checkMethodCall');

      await request(server).post('/value/1').expect(201, '1');
      await expect(cacheable.get('value:1')).resolves.toBe('1');
      expect(checkMethodCallSpy).toHaveBeenCalled();
    });

    it(`should cache result again`, async () => {
      const checkMethodCallSpy = vi.spyOn(cacheableService, 'checkMethodCall');

      await request(server).post('/value/1').expect(201, '1');
      await expect(cacheable.get('value:1')).resolves.toBe('1');
      expect(checkMethodCallSpy).toHaveBeenCalled();
    });
  });

  describe('CacheEvict Decorator', () => {
    beforeAll(async () => {
      await cacheable.clear();
    });

    it('should delete result from cache', async () => {
      await request(server).post('/value/1').expect(201, '1');
      await request(server).delete('/value/1').expect(200, '1');
      await expect(cacheable.get('value:1')).resolves.toBeUndefined();
    });

    it('should delete all results', async () => {
      const numbers = [];
      for (let i = 1; i <= 10; i++) {
        numbers.push(i);
      }
      await Promise.all([
        ...numbers.map((num) => request(server).post(`/value/${num}`)),
        cacheable.set('test', 'this key does not be deleted'),
      ]);
      for (const num of numbers) {
        await expect(cacheable.get(`value:${num}`)).resolves.toBe(`${num}`);
      }

      await request(server).delete('/value').expect(200);

      for (const num of numbers) {
        await expect(cacheable.get(`value:${num}`)).resolves.toBeUndefined();
      }
      await expect(cacheable.get('test')).resolves.toBe(
        'this key does not be deleted',
      );
    });
  });
});
