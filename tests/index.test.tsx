import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import { createStore } from '../src';
import { nextTick } from '../src/utils';

const wrapper = props => <div>{props.children}</div>;

describe('create-store', () => {
  test('success', () => {
    expect(() => createStore({ a: 1 })).not.toThrow();
    expect(() => createStore({ a: [] })).not.toThrow();
    expect(() => createStore({ a: [], b: 1 })).not.toThrow();
  });

  test('error', () => {
    expect(() => createStore(null)).toThrow();
    expect(() => createStore(1)).toThrow();
    expect(() => createStore('a')).toThrow();
  });

  test('no target', () => {
    const useStore = createStore({ a: 1 });
    renderHook(() => useStore(), { wrapper });
    setTimeout(() => {
      renderHook(() => useStore(), { wrapper });
    }, 2000);
  });
});

describe('store value', () => {
  test('equal', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const { result } = renderHook(() => useStore());
    const [store] = result.current;
    expect(store).toEqual({ count: 1, data: [1] });
  });

  test('not equal', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const { result } = renderHook(() => useStore());
    const [store] = result.current;
    expect(store).not.toEqual({ count: 2, data: [1] });
  });
});

describe('change store data', () => {
  test('change store success', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const { result } = renderHook(() => useStore());
    expect(() => {
      act(() => {
        const [store, setStore] = result.current;
        setStore({
          count: store.count + 1,
        });
      });
    }).not.toThrow('[nostore]: ' + 'Store can only be changed by [setStore].');
  });

  test('change store success 2', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const { result } = renderHook(() => useStore());
    expect(() => {
      act(() => {
        const [, setStore] = result.current;
        setStore(prevStore => ({
          count: prevStore.count + 1,
        }));
      });
    }).not.toThrow('[nostore]: ' + 'Store can only be changed by [setStore].');
  });

  test('add newly prop', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const { result } = renderHook(() => useStore());
    expect(() => {
      act(() => {
        const [store, setStore] = result.current;
        setStore({
          count2: store.count + 1,
          a: '1',
        });
      });
    }).toThrow(
      '[nostore]: ' + `cannot add new props: ${['count2', 'a'].join(', ')}`,
    );
  });

  test('Get the correct value：count', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const { result } = renderHook(() => useStore());

    act(() => {
      const [store, setStore] = result.current;
      setStore({
        count: store.count + 1,
      });
    });
    const [store] = result.current;
    expect(store.count).toBe(2);
  });

  test('get the correct value：count：change count with function', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const { result } = renderHook(() => useStore());

    act(() => {
      const [, setStore] = result.current;
      setStore(prevStore => ({
        count: prevStore.count + 1,
      }));
    });
    const [store] = result.current;
    expect(store.count).toBe(2);
  });

  test('get the correct value：data', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const { result } = renderHook(() => useStore());

    act(() => {
      const [store, setStore] = result.current;
      setStore({
        data: store.data.concat([1]),
      });
    });

    const [store] = result.current;
    expect(store.count).toBe(1);
    expect(store.data).toEqual([1, 1]);
  });

  test('change store should use setStore', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const { result } = renderHook(() => useStore());
    expect(() => {
      act(() => {
        const [store] = result.current;
        store.count = 2;
      });
    }).toThrow('[nostore]: ' + 'Store can only be changed by [setStore].');
  });
});

describe('multiple components', () => {
  test('two components', () => {
    const useStore = createStore({ count: 1, data: [1] });
    renderHook(() => useStore());
    renderHook(() => useStore());
  });

  test('two components same value', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const c1 = renderHook(() => useStore());
    const c2 = renderHook(() => useStore());
    expect(c1.result.current[0].count).toBe(1);
    expect(c2.result.current[0].count).toBe(1);
  });

  test('two components same value 2', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const c1 = renderHook(() => useStore());
    const c2 = renderHook(() => useStore());
    act(() => {
      const [, setStore] = c1.result.current;
      setStore(prevStore => ({
        count: prevStore.count + 1,
      }));
    });
    expect(c1.result.current[0].count).toBe(2);
    expect(c2.result.current[0].count).toBe(2);
  });

  test('three components', () => {
    const useStore = createStore({ count: 1, data: [1] });
    renderHook(() => useStore());
    renderHook(() => useStore());
    renderHook(() => useStore());
  });

  test('three components same value', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const c1 = renderHook(() => useStore());
    const c2 = renderHook(() => useStore());
    const c3 = renderHook(() => useStore());
    expect(c1.result.current[0].count).toBe(1);
    expect(c2.result.current[0].count).toBe(1);
    expect(c3.result.current[0].count).toBe(1);
  });

  test('three components same value 2', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const c1 = renderHook(() => useStore());
    const c2 = renderHook(() => useStore());
    const c3 = renderHook(() => useStore());
    act(() => {
      const [, setStore] = c1.result.current;
      setStore(prevStore => ({
        count: prevStore.count + 1,
      }));
    });
    act(() => {
      const [, setStore] = c1.result.current;
      setStore(prevStore => ({
        data: prevStore.data.concat([1]),
      }));
    });
    expect(c1.result.current[0].count).toBe(2);
    expect(c2.result.current[0].count).toBe(2);
    expect(c3.result.current[0].count).toBe(2);
    expect(c3.result.current[0].data).toEqual([1, 1]);
  });

  test('slowly render', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const c1 = renderHook(() => useStore());
    for (let i = 0; i < 1000000000; i += 1) {}
    const c2 = renderHook(() => useStore());
    expect(c1.result.current[0].count).toBe(1);
    expect(c2.result.current[0].count).toBe(1);
  });
});

describe('multiple components use hooks', () => {
  test('two components', () => {
    const useStore = createStore({ count: 1, data: [1] });

    function useDecrease() {
      const [store, setStore] = useStore();
      return () => {
        setStore({
          count: store.count - 1,
        });
      };
    }

    const useIncrease = () => {
      const [store, setStore] = useStore();
      return () => {
        setStore({
          count: store.count + 1,
        });
      };
    };

    const { result } = renderHook(() => useDecrease());
    const { result: result2 } = renderHook(() => useIncrease());

    const c = renderHook(() => useStore());

    act(() => {
      result.current();
      result2.current();
      c.result.current[0].count;
    });

    expect(c.result.current[0].count).toBe(1);
    expect(c.result.current[0].count).toBe(1);
  });
});
