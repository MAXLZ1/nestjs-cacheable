# NestJS Cacheable

![NPM Version](https://img.shields.io/npm/v/%40maxlz%2Fnestjs-cacheable)
[![codecov](https://codecov.io/github/MAXLZ1/nestjs-cacheable/graph/badge.svg?token=JWT2NV0ZNM)](https://codecov.io/github/MAXLZ1/nestjs-cacheable)
[![License](https://img.shields.io/github/license/MAXLZ1/nestjs-cacheable)](LICENSE)

A flexible, powerful caching solution for NestJS applications. Unlike [@nestjs-cache-manager](https://www.npmjs.com/package/@nestjs/cache-manager), it uses [cacheable](https://www.npmjs.com/package/cacheable) as the cache solution.

## Features

- **Cache Decorators**: Simplify caching with decorators like `@Cacheable`, `@CacheEvict`, and `@CachePut`.
- **Backend Flexibility**: Supports multiple cache stores, including:
    - [Redis](https://redis.io/)
    - [Etcd](https://etcd.io/)
    - [Valkey](https://valkey.io/)
    - [Memcached](https://memcached.org/)
    - etc. For more stores, see [Keyv Storage Adapters](https://keyv.org/docs/)

## Installation

```bash
# Using npm
npm install @maxlz/nestjs-cacheable cacheable

# Using yarn
yarn add @maxlz/nestjs-cacheable cacheable

# Using pnpm
pnpm add @maxlz/nestjs-cacheable cacheable
```

## Getting Started

### register module

You can use `CacheModule.register` or `CacheModule.registerAsync` to register a cache module.

- #### CacheModule.register(options?)

```ts
import { Module } from '@nestjs/common';
import { CacheModule } from '@maxlz/nestjs-cacheable';

@Module({
  imports: [CacheModule.register({ ttl: '30m' }) ]
})
export class AppModule {}
```

If you do not set primary and secondary, the memory cache will be used by default.

`CacheModule.register` options:

| options     | type    | default |  description |
|-------------|---------|---------|---|
| `isGlobal?` | `boolean` | `false`  | Set a global module  |

`CacheModule.register` other options refer to [cacheable options](https://cacheable.org/docs/cacheable/#cacheable-options).

- #### CacheModule.registerAsync(options?)

```ts
import { Module } from '@nestjs/common';
import { CacheModule } from '@maxlz/nestjs-cacheable';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        ttl: '30m',
      }),
    }),
  ],
})
export class AppModule {}
```

`CacheModule.registerAsync` options:

| options           | type                             | default | description                                                                                                                                                                                                                                                                                         |
|-------------------|----------------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `isGlobal?`       | `boolean`                        | `false` | Set a global module                                                                                                                                                                                                                                                                                 |
| `extraProviders?` | `Provider[]`                     | `[]`    | Extra providers. Injected into the class as an additional provider. For details, please refer to [async-register-extra-providers test case](https://github.com/MAXLZ1/nestjs-cacheable/blob/main/test/e2e/modules/register/async-register-extra-providers/async-register-extra-providers.module.ts) |
| `useFactory?`     | `() => CacheableOptions`         | /       |                                                                                                                                                                                                                                                                                                     |
| `useClass?`       | implements `CacheOptionsFactory` | /       |                                                                                                                                                                                                                                                                                                     |

[CacheableOptions](https://cacheable.org/docs/cacheable/#cacheable-options).

### Decorators

Decorators can enhance the method, provide the ability to cache the results of the method and delete the cache. You can use decorators in your service.

- #### `@Cacheable` 

Cache method results. Check the cache before executing the method. If the value of the corresponding key can be obtained from the cache, return this value. If there is no value of the corresponding key in the cache, execute the method and store the return result of the method in the cache.

```ts
import { Cacheable } from '@maxlz/nestjs-cacheable';

class ExampleService {
  @Cacheable<typeof ExampleService.prototype.getUser>({
    name: 'users',
    ttl: 60,
    key: ({ args }) => args[0],
    condition: ({ result }) => result !== null,
  })
  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }
}
```

`@Cacheable` options:

| options      | type                         | default | description                                                                                                         |
|--------------|------------------------------|---------|---------------------------------------------------------------------------------------------------------------------|
| `name`       | `string`                     | \       | The cache name.                                                                                                     |
| `key?`       | `string \| (args) => string` | \       | The cache key. It can be generated by method parameters and method name.                                            |
| `ttl?`       | `number \| string`           | \       | The cache time-to-live. [ttl](https://cacheable.org/docs/cacheable/#shorthand-for-time-to-live-ttl)                 |
| `condition?` | `(args) => boolean`          | \       | The caching conditions of the method. The return value of the method will be cached only if the conditions are met. |

`key` function args:

| options  | type     | description           |
|----------|----------|-----------------------|
| `args`   | `Array`  | The method arguments. |
| `method` | `string` | The method name.      |

`condition` function args:

| options  | type                                        | description                      |
|----------|---------------------------------------------|----------------------------------|
| `args`   | `Array`                                     | The method arguments.            |
| `method` | `string \| symbol`                          | The method name.                 |
| `result` | The result type depends on the generic type | The return result of the method. |

If you don't need to use the method parameters and the method return results in the process of using Cacheable, you can not provide a generic type.

```ts
import { Cacheable } from '@maxlz/nestjs-cacheable';

class ExampleService {
  @Cacheable({
    name: 'users',
    ttl: 60,
    key: ({ method }) => String(method)
  })
  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }
}
```

- #### `@CachePut`

Cache method results .Unlike `@Cacheable`, it does not check the cache before the method is executed. 

```ts
import { CachePut } from '@maxlz/nestjs-cacheable';

class ExampleService {
  @CachePut<typeof ExampleService.prototype.setUser>({
    name: 'users',
    ttl: 60,
    key: ({ args }) => args[0],
    condition: ({ result }) => result !== null,
  })
  async setUser(id: number): Promise<User> {
    return await this.userRepository.create(id);
  }
}
```

`@CachePut` and `@Cacheable` have the same options.

- #### `@CacheEvict`

Delete a single cache value by key, or delete cache values in batches by name.

```ts
import { CacheEvict } from '@maxlz/nestjs-cacheable';

class ExampleService {
  @CacheEvict<typeof ExampleService.prototype.removeUser>({
    name: 'users',
    key: ({ args }) => args[0],
  })
  async removeUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  @CacheEvict({
    name: 'users',
    allEntries: true,
    beforeInvocation: true,
  })
  async clearAllUsers(): Promise<void> {
    await this.userRepository.clear();
  }
}
```

`@CacheEvict` options:

| options             | type                         | default | description                                                              |
|---------------------|------------------------------|---------|--------------------------------------------------------------------------|
| `name`              | `string`                     | \       | The cache name.                                                          |
| `key?`              | `string \| (args) => string` | \       | The cache key. It can be generated by method parameters and method name. |
| `allEntries?`       | `boolean`                    | `false` | Delete all cached values prefixed with name.                             |                                                                                                                  
| `beforeInvocation?` | `boolean`                    | `false` | Delete the cache before the method is executed.                          |

`key` function args:

| options   | type                                        | description                                                                          |
|-----------|---------------------------------------------|--------------------------------------------------------------------------------------|
| `args`    | `Array`                                     | The method arguments.                                                                |
| `method`  | `string \| symbol`                          | The method name.                                                                     |
| `result?` | The result type depends on the generic type | The return result of the method. The result can only be used if allEntries is false. |

## License

[MIT license](https://github.com/MAXLZ1/nestjs-cacheable/blob/main/LICENSE)