export const debounceTime = (ms: number = 300, fn: Function) => {
  let timer;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, ms);
  };
};
