import {
  isPlainObject,
  isFunction,
  nextTick,
  assign,
  invariant,
  getDiffProps,
} from '../src/utils';

describe('isPlainObject', () => {
  it('true', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 'a' })).toBe(true);
    expect(isPlainObject({ foo: 'foo' })).toBe(true);
    expect(isPlainObject({ bar: () => {} })).toBe(true);
  });

  it('false', () => {
    expect(isPlainObject('a')).toBe(false);
    expect(isPlainObject(1)).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
  });
});

describe('isFunction', () => {
  it('true', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function() {})).toBe(true);
  });

  it('false', () => {
    expect(isFunction('a')).toBe(false);
    expect(isFunction(1)).toBe(false);
    expect(isFunction({})).toBe(false);
  });
});

test('nextTick', () => {
  const callback = jest.fn();

  nextTick(callback);

  nextTick(() => {
    // At this point in time, the callback should not have been called yet
    expect(callback).toBeCalled();

    // Fast-forward until all timers have been executed
    jest.useFakeTimers();

    // Now our callback should have been called!
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('assign', () => {
  it('true', () => {
    const obj = { a: '1' };
    assign(obj, {});

    const obj2 = { a: '1' };
    assign(obj2, { b: '2' });

    const obj3 = { a: [] };
    assign(obj3, { a: [1] });

    expect(obj).toEqual({ a: '1' });
    expect(obj2).toEqual({ a: '1', b: '2' });
    expect(obj3).toEqual({ a: [1] });
  });

  it('false', () => {
    const obj = { a: '1' };
    assign(obj, {});

    const obj2 = { a: '1' };
    assign(obj2, { b: '2' });

    const obj3 = { a: [] };
    assign(obj3, { a: [1] });

    expect(obj).not.toEqual({ a: '2' });
    expect(obj2).not.toEqual({ a: '1' });
    expect(obj3).not.toEqual({ a: [] });
  });
});

describe('invariant', () => {
  it('common', () => {
    expect(() => invariant(false, '11')).toThrow('[nostore]: ' + '11');
    expect(() => invariant(true, '11')).not.toThrow('[nostore]: ' + '11');
  });

  it('isFunction', () => {
    const partialStore = () => {};

    let message =
      'setStore(...): takes an object of store variables to update or a ' +
      'function which returns an object of store variables.';

    expect(() =>
      invariant(
        typeof partialStore === 'object' || typeof partialStore === 'function',
        message,
      ),
    ).not.toThrow('[nostore]: ' + message);
  });

  it('isString', () => {
    const partialStore = '';

    let message =
      'setStore(...): takes an object of store variables to update or a ' +
      'function which returns an object of store variables.';

    expect(() =>
      invariant(
        typeof partialStore === 'object' || typeof partialStore === 'function',
        message,
      ),
    ).toThrow('[nostore]: ' + message);
  });
});

describe('getDiffProps', () => {
  it('true', () => {
    expect(getDiffProps({ a: '1' }, { b: 1 })).toEqual(['b']);
    expect(getDiffProps({ a: '1', b: '2' }, { b: 1, c: 2 })).toEqual(['c']);
  });
  it('false', () => {
    expect(
      getDiffProps({ a: '1', c: '2', b: '22' }, { b: 1, c: '22' }),
    ).not.toEqual(['b']);
  });
});
