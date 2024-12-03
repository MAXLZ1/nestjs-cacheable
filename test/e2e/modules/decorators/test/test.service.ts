import { Cacheable, CacheEvict, CachePut } from '../../../../../src';
import { Injectable } from '@nestjs/common';

const CACHE_NAME = 'value';

@Injectable()
export class TestService {
  checkMethodCall() {}

  @Cacheable<(id: string) => string>({
    name: CACHE_NAME,
    key: ({ args }) => args[0],
  })
  getValue(id: string) {
    this.checkMethodCall();
    return id;
  }

  @CachePut<(id: string) => string>({
    name: CACHE_NAME,
    key: ({ args }) => args[0],
  })
  setValue(id: string) {
    this.checkMethodCall();
    return id;
  }

  @CacheEvict<(id: string) => string>({
    name: CACHE_NAME,
    key: ({ args }) => args[0],
  })
  delValue(id: string) {
    this.checkMethodCall();
    return id;
  }

  @CacheEvict({ name: CACHE_NAME, allEntries: true })
  delAll() {
    this.checkMethodCall();
  }
}
