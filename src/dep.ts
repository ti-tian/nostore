import { nextTick } from "./utils";

export default class Dep {
  target: any;
  subs: any;
  buffer: string[];

  constructor() {
    this.subs = new Map<string, any[]>();
    this.buffer = [];
  }

  setTarget(target: any): void {
    this.target = target;
    nextTick(() => this.removeTarget());
  }

  removeTarget(): void {
    this.target = null;
  }

  addBuffer(key: string): void {
    if (this.buffer.indexOf(key) === -1) {
      this.buffer.push(key);
    }
  }

  clearBuffer(): void {
    this.buffer = [];
  }

  clearSub(key: string): void {
    this.subs.set(key, []);
  }

  notify(): void {
    this.buffer.forEach((key: string) => {
      const updates = this.subs.get(key);
      updates.forEach((update: any) => update({}));
      this.clearSub(key);
    });
  }

  addSub(key: string): void {
    const updates = this.subs.get(key) || [];
    if (updates.indexOf(this.target) === -1 && this.target) {
      updates.push(this.target);
    }
    this.subs.set(key, updates);
  }
}
