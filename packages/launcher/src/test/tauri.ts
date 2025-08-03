import { vi } from 'vitest';

class TauriInvokeMock {
  private static impls: Record<string, (...args: unknown[]) => unknown> = {};

  static set(method: string, fn: (...args: unknown[]) => unknown) {
    this.impls[method] = fn;
  }

  static remove(method: string) {
    delete this.impls[method];
  }

  static reset() {
    this.impls = {};
  }

  static invoke(method: string, ...args: unknown[]) {
    if (this.impls[method]) {
      return this.impls[method](...args);
    }
    throw new Error(`No mock implementation for method: ${method}`);
  }
}

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn((method: string, ...args: unknown[]) =>
    TauriInvokeMock.invoke(method, ...args),
  ),
}));

export const setInvoke = TauriInvokeMock.set.bind(TauriInvokeMock);
export const removeInvoke = TauriInvokeMock.remove.bind(TauriInvokeMock);
export const resetInvoke = TauriInvokeMock.reset.bind(TauriInvokeMock);
