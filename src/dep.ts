import * as ReactDOM from 'react-dom';
import { nextTick } from './utils';

export default class Dep {
  target: any;
  subs: any;

  constructor() {
    this.subs = new Map<string, any[]>();
  }

  setTarget(target: any) {
    this.target = target;
    nextTick(() => {
      this.target = null;
    });
  }

  clearSub(key: string) {
    this.subs.set(key, []);
  }

  notify(key: string) {
    ReactDOM.unstable_batchedUpdates(() => {
      const updates = this.subs.get(key) || [];
      for (const update of updates) {
        update({});
      }
    });
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
