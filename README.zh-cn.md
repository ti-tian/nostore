[English](./README.md) | 简体中文

# nostore

> 基于 React hooks 实现的全局状态管理库

[![GitHub](https://img.shields.io/github/license/ti-tian/nostore.svg?logo=github)](https://github.com/ti-tian/nostore)
[![codecov](https://img.shields.io/codecov/c/github/ti-tian/nostore/master?logo=codecov)](https://codecov.io/gh/ti-tian/nostore)
[![npm version](https://img.shields.io/npm/v/nostore.svg?logo=npm)](https://www.npmjs.com/package/nostore)
[![npm downloads](https://img.shields.io/npm/dw/nostore.svg?logo=npm)](https://www.npmjs.com/package/nostore)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/nostore@latest.svg?logo=javascript)](https://bundlephobia.com/result?p=nostore@latest)
[![Build Status](https://api.travis-ci.org/ti-tian/nostore.svg?branch=master)](https://travis-ci.org/nostore)
![React](https://img.shields.io/npm/dependency-version/nostore/peer/react?logo=react)

## 特性

- 只有一个 API ，简单高效
- Typescript 支持
- React hooks 风格
- 最小粒度更新组件

> 你可以当成全局状态下的 useState

## 安装

```bash
$ yarn add nostore
# or
$ npm install nostore --save
```

## 在线尝试

[![Edit react](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/trusting-saha-g6uuy?fontsize=14)

## 使用方式

### 新建一个 store

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

### 使用 store

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
