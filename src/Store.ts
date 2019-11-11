import { isFunction, isPlainObject } from './utils';
import Dep from './dep';
import { invariant, assign, getDiffProps, nextTick } from './utils';
import { unstable_batchedUpdates } from 'react-dom';

export interface StoreInterface<S> {
  store: S;
  initialStore: any;
  dep: Dep;
  setStore(partialStore: ((prevStore: S) => Partial<S>) | Partial<S>): void;
  getStore(): S;
}

export default class Store<S> implements StoreInterface<S> {
  initialStore: any;
  store: S;
  dep: Dep;
  setStoreCalled: boolean;

  constructor(initialStore: S) {
    this.store = initialStore;
    this.dep = new Dep();
    this.setStoreCalled = false;
    this.setStore = this.setStore.bind(this);
    this.getStore = this.getStore.bind(this);
    this.reative();
  }

  getStore(): S {
    return this.store;
  }

  reative() {
    const handler = {
      get: (target: any, key: string, receiver: any) => {
        this.dep.addSub(key);
        return Reflect.get(target, key, receiver);
      },
      set: (target: any, key: string, value: any, receiver: any) => {
        invariant(
          this.setStoreCalled,
          'Store can only be changed by [setStore].',
        );
        this.setStoreCalled = false;
        nextTick(() => {
          unstable_batchedUpdates(() => {
            this.dep.notify(key);
          });
        });
        return Reflect.set(target, key, value, receiver);
      },
    };
    this.store = new Proxy(this.store, handler);
  }

  setStore(partialStore: ((prevStore: S) => Partial<S>) | Partial<S>) {
    invariant(
      isPlainObject(partialStore) || isFunction(partialStore),
      'setStore(...): takes an object of store variables to update or a ' +
        'function which returns an object of store variables.',
    );

    this.setStoreCalled = true;

    let newStore: S | object = {};
    if (isFunction(partialStore)) {
      newStore = (partialStore as Function)(this.store);
    } else if (isPlainObject(partialStore)) {
      newStore = partialStore;
    }

    // cannot add new property
    const diffProps = getDiffProps(this.store, newStore);

    invariant(
      diffProps.length === 0,
      `cannot add new props: ${diffProps.join(', ')}`,
    );

    assign(this.store, newStore);
  }
}
