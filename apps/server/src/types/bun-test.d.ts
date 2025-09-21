declare module "bun:test" {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
  export function expect<T>(actual: T): {
    [x: string]: any;
    toBe(expected: T): void;
    toEqual(expected: T): void;
    toBeInstanceOf(expected: any): void;
    toBeDefined(): void;
    toBeNull(): void;
    toBeUndefined(): void;
    toBeGreaterThan(expected: number): void;
    toHaveLength(expected: number): void;
    toThrow(expected?: string | RegExp): void;
    toHaveBeenCalled(): void;
    toHaveBeenCalledWith(...args: any[]): void;
    toHaveBeenCalledTimes(times: number): void;
    not: {
      toBe(expected: T): void;
      toEqual(expected: T): void;
    };
    rejects: {
      toThrow(expected?: string | RegExp): Promise<void>;
    };
  };
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
  export function mock<T extends (...args: any[]) => any>(
    fn?: T
  ): T & {
    toHaveBeenCalled(): void;
    toHaveBeenCalledWith(...args: Parameters<T>): void;
    toHaveBeenCalledTimes(times: number): void;
  };
}
