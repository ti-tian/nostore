import { useState } from "react";
import { IStore } from "./Store";

export function useStore<S>(store: IStore<S>): [S, IStore<S>["setStore"]] {
  const [, forceUpdate] = useState();
  const { dep, setStore, getStore } = store;
  dep.setTarget(forceUpdate);
  return [getStore(), setStore];
}
