type Store = {
  opts: {
    dialect?: string;
  };
};

const iterableAdapters = [
  'sqlite',
  'postgres',
  'mysql',
  'mongo',
  'redis',
  'valkey',
  'etcd',
];

export class Keyv {
  private store: Store;
  private namespace: unknown;
  public iterator;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options: any) {
    this.store = options.store;
    this.namespace = options.namespace;

    if (
      this.store.opts?.dialect &&
      iterableAdapters.includes(this.store.opts.dialect)
    ) {
      this.iterator = this.generateIterator();
    }
  }

  _getKeyPrefix() {}
  delete() {}
  generateIterator() {
    return function* () {
      yield [];
    };
  }
}
