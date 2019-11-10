import { useState } from 'react';
import { StoreInterface } from './Store';

export function useStore<S>(store: StoreInterface<S>): [S, StoreInterface<S>['setStore']] {
  const [, updater] = useState();
  store.dep.setTarget(updater);
  return [store.getStore(), store.setStore];
}
