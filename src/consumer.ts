import { useState } from "react";
import { StoreInterface } from "./Store";

export function useStore<S>(
  store: StoreInterface<S>
): [S, StoreInterface<S>["setStore"]] {
  const [, forceUpdate] = useState();
  const { dep, setStore, getStore } = store;
  dep.setTarget(forceUpdate);
  return [getStore(), setStore];
}
