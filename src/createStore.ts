import Store from './Store';
import { useStore } from './consumer';
import { isPlainObject, invariant } from './utils';
import { IStore } from './Store';

export function createStore<S>(
  initialStore: S,
): () => [S, IStore<S>['setStore']] {
  invariant(isPlainObject(initialStore), `initialStore is not plain object.`);
  const store = new Store(initialStore);
  return () => useStore<S>(store);
}
