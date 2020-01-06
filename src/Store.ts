import ReactDOM from "react-dom";
import Dep from "./dep";
import {
  merge,
  invariant,
  nextTick,
  isFunction,
  getDiffProps,
  isPlainObject
} from "./utils";

type PartialStore<S> = ((prevStore: S) => Partial<S>) | Partial<S>;

export interface IStore<S> {
  store: S;
  initialStore: any;
  dep: Dep;
  writable: boolean;
  setStore(partial: PartialStore<S>): void;
  getStore(): S;
  reactive(): void;
}

export default class Store<S> implements IStore<S> {
  initialStore: any;
  store: S;
  dep: Dep;
  writable: boolean;

  constructor(initialStore: S) {
    this.store = initialStore;
    this.dep = new Dep();
    this.writable = false;
    this.setStore = this.setStore.bind(this);
    this.getStore = this.getStore.bind(this);
    this.reactive();
  }

  getStore(): S {
    return this.store;
  }

  reactive() {
    const handler = {
      get: (target: any, key: string, receiver: any) => {
        this.dep.addSub(key);
        return Reflect.get(target, key, receiver);
      },
      set: (target: any, key: string, value: any, receiver: any) => {
        invariant(this.writable, "Store can only be changed by [setStore].");

        this.dep.addBuffer(key);

        nextTick(() => {
          this.writable = false;
          ReactDOM.unstable_batchedUpdates(() => {
            this.dep.notify();
            this.dep.clearBuffer();
          });
        });
        return Reflect.set(target, key, value, receiver);
      }
    };
    this.store = new Proxy(this.store, handler);
  }

  setStore(partial: PartialStore<S>) {
    invariant(
      isPlainObject(partial) || isFunction(partial),
      "setStore(...): takes an object of store variables to update or a " +
        "function which returns an object of store variables."
    );

    this.writable = true;

    const partialStore = isFunction(partial)
      ? (partial as Function)(this.store)
      : partial;

    // cannot add new props
    const diffProps = getDiffProps(this.store, partialStore);

    invariant(
      diffProps.length === 0,
      `cannot add new props: ${diffProps.join(", ")}`
    );

    merge(this.store, partialStore);
  }
}
