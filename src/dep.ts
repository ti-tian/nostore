import { nextTick } from './utils';

export default class Dep {
  target: any;
  subs: any;

  constructor() {
    this.subs = new Map<string, any[]>();
  }

  setTarget(target: any) {
    this.target = target;
    nextTick(() => this.removeTarget());
  }

  removeTarget(): void {
    this.target = null;
  }

  targetUnmount(target: any): void {
    target._NOSTORE_UNMOUNT_ = true;
  }

  targetMount(target: any): void {
    target._NOSTORE_UNMOUNT_ = false;
  }

  clearSub(key: string) {
    this.subs.set(key, []);
  }

  notify(key: string) {
    const updates = this.subs.get(key) || [];
    for (const update of updates) {
      if (!update._NOSTORE_UNMOUNT_) update({});
    }
    this.clearSub(key);
  }

  addSub(key: string): void {
    if (!this.target) return;
    const updates = this.subs.get(key) || [];
    if (updates.indexOf(this.target) === -1) {
      updates.push(this.target);
    }
    this.subs.set(key, updates);
  }
}
