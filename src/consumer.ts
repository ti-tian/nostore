import { useState } from 'react';
import { IStore } from './Store';

export function useStore<S>(store: IStore<S>): [S, IStore<S>['setStore']] {
  const [, updater] = useState();
  store.dep.setTarget(updater);
  return [store.getStore(), store.setStore];
}
