import { CacheEvictOptions } from '../interfaces';
import { CacheableHelper } from '../helper/cacheable.helper';
import { Cacheable } from 'cacheable';
import { clearHelper } from '../helper/clear.helper';

/**
 * `CacheEvict` decorator is used to invalidate (delete) cached entries associated with a method's execution.
 * It supports invalidating specific cache entries or clearing all cache entries related to a method.
 *
 * @template T - The type of the target method (including parameters and return type)
 * @template This - The type of `this` for the method
 * @template P - The type of the method's parameters
 * @template R - The type of the method's return value
 * @template B - Type indicating whether the eviction should occur before (true) or after (false) the method invocation
 *
 * @param {CacheEvictOptions<This, P, R, B>} options - Configuration options for the eviction behavior
 * @param {string} options.name - The name of the cache, typically related to the method name or class name
 * @param {boolean} [options.allEntries=false] - Flag indicating whether to clear all cache entries related to the method (defaults to `false`, only deletes specific cache entries)
 * @param {boolean} [options.beforeInvocation=false] - Flag indicating whether to perform eviction before or after method invocation (defaults to `false`, which means after method execution)
 * @param {string | ((args: P, method: string | symbol, result: R) => string) | undefined} [options.key] - Cache key to delete. If not provided, defaults to the method name and arguments
 *
 * @returns {MethodDecorator} - Returns a method decorator
 *
 * @example
 * class ExampleService {
 *   // Evict a specific cache key after the method is executed.
 *   ⁣@CacheEvict<typeof ExampleService.prototype.removeUser>({
 *     name: 'users',
 *     key: ({ args }) => args[0],
 *   })
 *   async removeUser(id: number): Promise<void> {
 *     await this.userRepository.delete(id);
 *   }
 *
 *   // Evict all cache entries under the 'users' namespace before the method is executed.
 *   ⁣@CacheEvict({
 *     name: 'users',
 *     allEntries: true,
 *     beforeInvocation: true,
 *   })
 *   async clearAllUsers(): Promise<void> {
 *     await this.userRepository.clear();
 *   }
 * }
 */
export function CacheEvict<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any) => any,
  This = ThisParameterType<T>,
  P extends unknown[] = Parameters<T>,
  R = Awaited<ReturnType<T>>,
  B extends boolean = boolean,
>(options: CacheEvictOptions<This, P, R, B>): MethodDecorator {
  return function (
    _target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const { name, allEntries = false, beforeInvocation = false, key } = options;
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: This, ...args: P) {
      const cacheable = CacheableHelper.getCacheable();

      if (!cacheable) return originalMethod.apply(this, args);

      const buildKey = (name: string, key: string) => `${name}:${key}`;
      const delKey = async (result?: R) => {
        if (allEntries) {
          await clearAllEntries(cacheable, name);
        } else {
          let cacheKey: string | undefined;

          if (typeof key === 'function') {
            cacheKey = await key.call(this, {
              args,
              method: propertyKey,
              result: result!,
            });
          } else if (typeof key === 'string') {
            cacheKey = key;
          }

          await cacheable.delete(cacheKey ? buildKey(name, cacheKey) : name);
        }
      };

      if (beforeInvocation) {
        await delKey();
      }

      const result = await originalMethod.apply(this, args);

      if (!beforeInvocation) {
        await delKey(result);
      }

      return result;
    };
  };
}

async function clearAllEntries(cacheable: Cacheable, name: string) {
  const { primary, secondary } = cacheable;
  const promises = [clearHelper(primary, name)];

  if (secondary) promises.push(clearHelper(secondary, name));

  await (cacheable.nonBlocking
    ? Promise.race(promises)
    : Promise.all(promises));
}
