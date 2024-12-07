export class Keyv {
  private store: unknown;
  private namespace: unknown;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options: any) {
    this.store = options.store;
    this.namespace = options.namespace;
  }

  _getKeyPrefix() {}
  delete() {}
  generateIterator() {
    return function* () {
      yield [];
    };
  }
}
