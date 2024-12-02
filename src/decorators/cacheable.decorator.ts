import { CacheableHelper } from '../helper/cacheable.helper';
import { CacheableOptions } from '../interfaces';

/**
 * `Cacheable` decorator applies caching functionality to a method, allowing the method's return value to be cached and reducing repeated computation.
 *
 * @template T - The type of the target method (including parameters and return type)
 * @template This - The type of the `this` context in the method
 * @template P - The type of the method's parameters
 * @template R - The type of the method's return value
 *
 * @param {CacheableOptions<This, P, R>} options - Configuration options for the decorator
 * @param {string} options.name - The name of the cache, typically the class name or a feature identifier
 * @param {number} [options.ttl] - The Time-To-Live (TTL) for the cache in seconds
 * @param {(args: P, method: string | symbol) => boolean} [options.condition] - A condition function to decide whether the result should be cached. Default is `true` (i.e., cache the result)
 * @param {string | ((args: P, method: string | symbol) => string) | undefined} [options.key] - The cache key, can be a string or a function that generates a key. If not provided, the default is generated based on the method name and arguments
 *
 * @returns {MethodDecorator} - Returns a method decorator
 *
 * @example
 * class ExampleService {
 *   @Cacheable<(id: number) => Promise<User>>({
 *     name: 'users',
 *     ttl: 60,
 *     key: ({ args }) => args[0],
 *     condition: ({ result }) => result !== null,
 *   })
 *   async getUser(id: number): Promise<User> {
 *     return await this.userRepository.findOne(id);
 *   }
 * }
 */
export function Cacheable<
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
      const cachedData = await cacheable.get(cacheKey);

      if (cachedData) return cachedData;

      const result = await originalMethod.apply(this, args);

      if (!condition || condition({ args, method: propertyKey, result })) {
        await cacheable.set(cacheKey, result, ttl);
      }

      return result;
    };
  };
}
