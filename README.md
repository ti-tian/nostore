# nostore

> Global state management based on React Hooks

# Reto

[![codecov](https://img.shields.io/codecov/c/github/nostore/master?logo=codecov)](https://codecov.io/gh/nostore)
[![npm version](https://img.shields.io/npm/v/nostore.svg?logo=npm)](https://www.npmjs.com/package/nostore)
[![npm downloads](https://img.shields.io/npm/dw/nostore.svg?logo=npm)](https://www.npmjs.com/package/nostore)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/nostore.svg?logo=javascript)](https://www.npmjs.com/package/nostore)
[![Build Status](https://img.shields.io/travis/nostore/master?logo=travis-ci)](https://travis-ci.org/nostore)
[![codacy](https://img.shields.io/codacy/grade/2d15789ec7b1424092ed472f449a0a70?logo=codacy)](https://app.codacy.com/app/nostore)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/nostore?logo=snyk)](https://app.snyk.io/test/github/nostore?targetFile=package.json)
![React](https://img.shields.io/npm/dependency-version/nostore/peer/react?logo=react)

## Features

- One API, Simple but efficient
- Strongly typed with Typescript

## Install

```bash
$ yarn add notion
# or
$ npm install notion --save
```

## Try It Online

[![Edit react](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/quirky-butterfly-8e7kr?fontsize=14)

## use

### create a store

```javascript
import { createStore } from 'nostore';

const useStore = createStore({ count: 1 });

export default useStore;

export function useDecrease() {
  const [, setStore] = useStore();
  return () => {
    setStore(prevStore => ({
      count: prevStore.count - 1,
    }));
  };
}
```

### use store

```javascript
// Increase.jsx

import useStore from './store.js';

function Increase() {
  const [store, setStore] = useStore();
  return (
    <>
      <h1>{store.count}</h1>
      <button
        onClick={() => {
          setStore({
            count: (store.count += 1),
          });
        }}
      />
    </>
  );
}
```

```javascript
// Decrease.jsx

import useStore, { useDecrease } from './store.js';

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
