import React, { useEffect } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-test-renderer';
import { createStore } from '../src';

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
});

describe('store value', () => {
  test('equal', () => {
    const useStore = createStore({ count: 1, data: [1] });
    const { result } = renderHook(() => useStore());
    const [store] = result.current;
    expect(store).toEqual({ count: 1, data: [1] });
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
  test('two components: with react hooks', () => {
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
    const { result: result3 } = renderHook(() => useStore());

    act(() => {
      result.current();
      result2.current();
      result3.current[0].count;
    });

    expect(result3.current[0].count).toBe(1);
    expect(result3.current[0].count).toBe(1);
  });

  test('render', () => {
    const useStore = createStore({ count: 1, data: [1] });

    const useIncrease = () => {
      const [store, setStore] = useStore();
      return () => {
        setStore({
          count: store.count + 1,
        });
      };
    };

    function Increase() {
      const [store] = useStore();
      const increase = useIncrease();
      return (
        <div>
          <h1 data-testid='increase-count'>{store.count}</h1>
          <button data-testid='increase' onClick={increase}></button>
        </div>
      );
    }

    function Decrease() {
      const [store, setStore] = useStore();
      return (
        <div>
          <h1 data-testid='decrease-count'>{store.count}</h1>
          <button
            onClick={() => {
              setStore(prevStore => {
                return {
                  count: prevStore.count + 1,
                };
              });
            }}
          ></button>
        </div>
      );
    }

    const Container = () => {
      return (
        <div>
          <Increase></Increase>
          <Decrease></Decrease>
        </div>
      );
    };

    const { getByTestId } = render(<Container />);
    fireEvent.click(getByTestId('increase'));
    expect(getByTestId('decrease-count').innerHTML).toBe('2');
  });

  test('no target', () => {
    const useStore = createStore({ count: 1, data: [1] });

    const useIncrease = () => {
      const [, setStore] = useStore();
      return () => {
        setStore(prevStore => {
          return {
            count: prevStore.count + 1,
          };
        });
      };
    };

    const useDecrease = () => {
      const [, setStore] = useStore();
      return () => {
        setStore(prevStore => {
          return {
            count: prevStore.count - 1,
          };
        });
      };
    };

    function Increase() {
      const [store] = useStore();
      const increase = useIncrease();
      return (
        <div>
          <h1 data-testid='increase-count'>{store.count}</h1>
          <div>{store.data}</div>
          <button data-testid='increase' onClick={increase}></button>
        </div>
      );
    }

    function Decrease() {
      const [store] = useStore();
      const decrease = useDecrease();

      useEffect(() => {
        decrease();
      }, []);

      return (
        <div>
          <h1 data-testid='decrease-count'>{store.count}</h1>
          <button data-testid='decrease' onClick={decrease}></button>
        </div>
      );
    }

    const Container = () => {
      return (
        <div>
          <Increase></Increase>
          <Decrease></Decrease>
        </div>
      );
    };

    const { getByTestId } = render(<Container />);
    // fireEvent.click(getByTestId('decrease'));
    expect(getByTestId('decrease-count').innerHTML).toBe('0');
    expect(getByTestId('increase-count').innerHTML).toBe('0');
  });
});
