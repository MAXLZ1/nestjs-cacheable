export class KeyvCacheableMemory {
  getStore() {
    return new CacheableMemory();
  }
}

export class CacheableMemory {
  get keys() {
    return [];
  }
  deleteMany() {}
}
