import { useState, useEffect } from 'react';
import { StoreInterface } from './Store';
import { nextTick } from './utils';

export function useStore<S>(
  store: StoreInterface<S>,
): [S, StoreInterface<S>['setStore']] {
  const [, updater] = useState();
  const { dep, setStore, getStore } = store;
  useEffect(() => {
    dep.targetMount(updater);
    return () => {
      dep.targetUnmount(updater);
    };
  }, [dep]);
  dep.setTarget(updater);
  nextTick(() => dep.removeTarget());
  return [getStore(), setStore];
}
