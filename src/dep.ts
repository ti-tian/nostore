import { nextTick } from "./utils";

export default class Dep {
  target: any;
  subs: any;
  buffer: string[];

  constructor() {
    this.subs = new Map<string, any[]>();
    this.buffer = [];
  }

  setTarget(target: any) {
    this.target = target;
    nextTick(() => this.removeTarget());
  }

  removeTarget() {
    this.target = null;
  }

  addBuffer(key: string) {
    if (this.buffer.indexOf(key) === -1) {
      this.buffer.push(key);
    }
  }

  clearBuffer() {
    this.buffer = [];
  }

  clearSub(key: string) {
    this.subs.set(key, []);
  }

  notify() {
    this.buffer.forEach((key: string) => {
      const updates = this.subs.get(key);
      if (Array.isArray(updates)) {
        updates.forEach((update: any) => update());
        this.clearSub(key);
      }
    });
  }

  addSub(key: string) {
    const updates = this.subs.get(key) || [];
    if (updates.indexOf(this.target) === -1 && this.target) {
      updates.push(this.target);
    }
    this.subs.set(key, updates);
  }
}
