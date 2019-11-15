export function isPlainObject(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null) return false;
  return (
    obj.constructor === Object &&
    Object.getPrototypeOf(obj) === Object.prototype
  );
}

export function isFunction(fn: any): boolean {
  return fn instanceof Function;
}

const promise = Promise.resolve();
export function nextTick(fn?: () => void): Promise<void> {
  return fn ? promise.then(fn) : promise;
}

export function invariant(condition: boolean, message?: string | boolean) {
  if (!condition) throw new Error('[nostore]: ' + message);
}

export function merge(prev: any, next: any): void {
  Object.assign(prev, next);
}

export function getDiffProps(prev: any, current: any): string[] {
  return Object.keys(current).filter(prop => typeof prev[prop] === 'undefined');
}
