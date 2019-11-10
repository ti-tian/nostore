import Store from './Store';
import { useStore } from './consumer';
import { isPlainObject, invariant } from './utils';
import { StoreInterface } from './Store';

export function createStore<S>(
  initialStore: S,
): () => [S, StoreInterface<S>['setStore']] {
  invariant(isPlainObject(initialStore), `initialStore is not plain object.`);
  const store = new Store(initialStore);
  return () => useStore<S>(store);
}
