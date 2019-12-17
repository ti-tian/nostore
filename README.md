[简体中文](./README.zh-cn.md) | English

# nostore

> Global state management based on React Hooks

[![GitHub](https://img.shields.io/github/license/ti-tian/nostore.svg?logo=github)](https://github.com/ti-tian/nostore)
[![codecov](https://img.shields.io/codecov/c/github/ti-tian/nostore/master?logo=codecov)](https://codecov.io/gh/ti-tian/nostore)
[![npm version](https://img.shields.io/npm/v/nostore.svg?logo=npm)](https://www.npmjs.com/package/nostore)
[![npm downloads](https://img.shields.io/npm/dw/nostore.svg?logo=npm)](https://www.npmjs.com/package/nostore)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/nostore@latest.svg?logo=javascript)](https://bundlephobia.com/result?p=nostore@latest)
[![Build Status](https://api.travis-ci.org/ti-tian/nostore.svg?branch=master)](https://travis-ci.org/nostore)
![React](https://img.shields.io/npm/dependency-version/nostore/peer/react?logo=react)

## Features

- One API, Simple but efficient
- Strongly typed with Typescript
- React hooks style
- Minimum granularity update component

## Install

```bash
$ yarn add nostore
# or
$ npm install nostore --save
```

## Try It Online

[![Edit react](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/trusting-saha-g6uuy?fontsize=14)

## use

### create a store

```javascript
// store.js

import { createStore } from "nostore";

const useStore = createStore({ count: 1 });

export default useStore;

// action 
export function useDecrease() {
  const [, setStore] = useStore();
  return () => {
    setStore(prevStore => ({
      count: prevStore.count - 1
    }));
  };
}

// multiple actions
export function useAction() {
  const [store, setStore] = useStore();
  return {
    decrease() {
      setStore({
        count: store.count - 1
      });
    },
    // async action
    async increase() {
      await wait(2000);
      setStore(prevStore => ({
        count: prevStore.count + 1
      }));
    }
  };
}	
```

### use store

```javascript
// Increase.jsx

import useStore, { useAction } from "./store.js";

function Increase() {
  const [store] = useStore();
  const { increase } = useAction();
  return (
    <>
      <h1>{store.count}</h1>
      <button onClick={increase}>increase</button>
    </>
  );
}
```

```javascript
// Decrease.jsx

import useStore, { useDecrease } from "./store.js";

function Decrease() {
  const [store] = useStore();
  const decrease = useDecrease();
  return (
    <>
      <h1>{store.count}</h1>
      <button onClick={decrease} />
    </>
  );
}
```


