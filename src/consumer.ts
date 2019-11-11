import { useState, useEffect } from 'react';
import { StoreInterface } from './Store';

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
  return [getStore(), setStore];
}
