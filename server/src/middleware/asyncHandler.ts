// Wrap async route handlers with preserved request generics
const asyncHandler = <T extends (...args: any[]) => any>(fn: T): T => {
  return ((...args: Parameters<T>) => {
    const next = args[args.length - 1] as (...args: any[]) => any;
    Promise.resolve(fn(...args as Parameters<T>)).catch(next);
  }) as T;
};

export default asyncHandler;