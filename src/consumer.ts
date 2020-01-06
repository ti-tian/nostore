import { useReducer } from "react";
import { IStore } from "./Store";

export function useStore<S>(store: IStore<S>): [S, IStore<S>["setStore"]] {
  const [, forceUpdate] = useReducer(c => c + 1, 1);
  const { dep, setStore, getStore } = store;
  dep.setTarget(forceUpdate);
  return [getStore(), setStore];
}
