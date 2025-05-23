import { CacheableHelper } from '../helper/cacheable.helper';
import { CacheableOptions } from '../interfaces';

/**
 * `CachePut` decorator is used to store the result of a method in the cache.
 * It don't check cache before call method.
 *
 * @template T - The type of the target method (including parameters and return type)
 * @template This - The type of `this` for the method
 * @template P - The type of the method's parameters
 * @template R - The type of the method's return value
 *
 * @param {CacheableOptions<This, P, R>} options - Configuration options for caching behavior
 * @param {string} options.name - The name of the cache, typically related to the method name or class name
 * @param {number} [options.ttl] - The time-to-live (TTL) in milliseconds for the cache entry
 * @param {boolean | ((options: { args: P, method: string | symbol, result: R }) => boolean)} [options.condition] - A condition that determines whether the method's result should be cached. If not provided, caching is done unconditionally
 * @param {string | ((args: P, method: string | symbol) => string) | undefined} [options.key] - The cache key. If not provided, defaults to the method name and its arguments
 *
 * @returns {MethodDecorator} - Returns a method decorator
 *
 * @example
 * class ExampleService {
 *   ⁣@CachePut<typeof ExampleService.prototype.setUser>({
 *     name: 'users',
 *     ttl: 60,
 *     key: ({ args }) => args[0],
 *     condition: ({ result }) => result !== null,
 *   })
 *   async setUser(id: number): Promise<User> {
 *     return await this.userRepository.create(id);
 *   }
 * }
 */
export function CachePut<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any) => any,
  This = ThisParameterType<T>,
  P extends unknown[] = Parameters<T>,
  R = Awaited<ReturnType<T>>,
>(options: CacheableOptions<This, P, R>): MethodDecorator {
  return function (
    _target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const { name, ttl, condition, key } = options;
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: This, ...args: P) {
      const cacheable = CacheableHelper.getCacheable();

      if (!cacheable) return originalMethod.apply(this, args);

      const buildKey = (name: string, key: string) => `${name}:${key}`;
      let strKey: string = '';

      if (typeof key === 'string') {
        strKey = key;
      } else if (typeof key === 'function') {
        strKey = await key.call(this, { args, method: propertyKey });
      } else if (key === undefined) {
        strKey = `${String(propertyKey)}:${JSON.stringify(args)}`;
      }

      const cacheKey = buildKey(name, strKey);
      const result = await originalMethod.apply(this, args);

      if (!condition || condition({ args, method: propertyKey, result })) {
        await cacheable.set(cacheKey, result, ttl);
      }

      return result;
    };
  };
}
