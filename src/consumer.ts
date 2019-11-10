import { useState } from 'react';
import { StoreInterface } from './Store';
import { nextTick } from './utils';

export function useStore<S>(
  store: StoreInterface<S>,
): [S, StoreInterface<S>['setStore']] {
  const [, updater] = useState();
  const { dep, setStore } = store;
  dep.setTarget(updater);
  nextTick(() => dep.removeTarget());
  return [store.getStore(), setStore];
}
