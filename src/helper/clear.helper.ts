import { Keyv } from 'keyv';
import { KeyvCacheableMemory } from 'cacheable';
import { LRUCache } from 'lru-cache';
import KeyvEtcd from '@keyv/etcd';
import KeyvMemcache from '@keyv/memcache';

export async function clearHelper(keyv: Keyv, name: string) {
  const { store, namespace } = keyv;
  const keyPrefix = keyv._getKeyPrefix(name);
  const delKeys = [];

  // TODO should pull request to keyv
  // https://github.com/jaredwray/keyv/pull/1228
  if (store instanceof KeyvEtcd) {
    keyv.iterator = keyv.generateIterator(store.iterator.bind(store));
  }

  if (keyv.iterator) {
    for await (const [key] of keyv.iterator(namespace)) {
      if ((key as string).startsWith(name)) {
        delKeys.push(key);
      }
    }

    await keyv.delete(delKeys);
  } else if (store instanceof KeyvCacheableMemory) {
    const memory = store.getStore(store.namespace);

    for (const key of memory.keys) {
      if (key.startsWith(keyPrefix)) {
        delKeys.push(key);
      }
    }

    memory.deleteMany(delKeys);
  } else if (store instanceof LRUCache) {
    for (const key of store.keys()) {
      if ((key as string).startsWith(keyPrefix)) {
        store.delete(key);
      }
    }
  } else if (store instanceof KeyvMemcache) {
    throw new Error('The memcache does not support allEntries!');
  }
}
