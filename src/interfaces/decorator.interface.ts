type Args<P, R, B> = B extends true
  ? {
      args: P;
      method: string | symbol;
    }
  : {
      args: P;
      result: R;
      method: string | symbol;
    };
type KeyFn<T, P, R, B> = (
  this: T,
  args: Args<P, R, B>,
) => string | Promise<string>;
type Key<T, P, R, B> = string | KeyFn<T, P, R, B>;
type Condition<P, R> = (args: Args<P, R, false>) => boolean;

type CacheEvictOptionsBefore<T, P, R> = {
  name: string;
  key?: Key<T, P, R, true>;
  allEntries?: boolean;
  beforeInvocation: true;
};
type CacheEvictOptionsAfter<T, P, R> = {
  name: string;
  key?: Key<T, P, R, false>;
  allEntries?: boolean;
  beforeInvocation?: false;
};

export type CacheableOptions<T, P, R> = {
  name: string;
  key?: Key<T, P, R, true>;
  ttl?: number | string;
  condition?: Condition<P, R>;
};

export type CacheEvictOptions<T, P, R, B> = B extends true
  ? CacheEvictOptionsBefore<T, P, R>
  : CacheEvictOptionsAfter<T, P, R>;
