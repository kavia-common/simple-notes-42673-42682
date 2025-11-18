export const throttle = <T extends (...args: any[]) => void>(fn: T, wait = 200) => {
  let last = 0;
  let timer: any = null;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    } else {
      const w: any = typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
      if (w && timer && w.clearTimeout) {
        w.clearTimeout(timer);
      }
      if (w && w.setTimeout) {
        timer = w.setTimeout(() => {
          last = Date.now();
          fn(...args);
        }, wait);
      }
    }
  };
};

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const isMac = () => {
  const g: any = typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
  const nav = g?.navigator;
  if (!nav || !nav.platform) return false;
  try {
    return String(nav.platform).toUpperCase().includes("MAC");
  } catch {
    return false;
  }
};

export const cmdKeyLabel = () => (isMac() ? "⌘" : "Ctrl");
