//
// PUBLIC_INTERFACE
// Safe logging utilities that won't throw in Remotion Studio or when console is unavailable.
//
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const hasConsole = () => {
  try {
    const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    return !!g?.console;
  } catch {
    return false;
  }
};

// Detect if running inside Remotion Studio to avoid excessive logging or side effects.
// Remotion exposes __remotion_studio on the window/global scope.
export const isRemotionStudio = (): boolean => {
  try {
    const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    return Boolean((g as any)?.__remotion_studio);
  } catch {
    return false;
  }
};

// PUBLIC_INTERFACE
export const safeLog = (level: LogLevel, ...args: any[]) => {
  if (!hasConsole()) return;
  try {
    const g: any = (globalThis as any) ?? {};
    const c = g.console;
    const fn = (c && typeof c[level] === 'function') ? c[level].bind(c) : c.log?.bind(c);
    if (!fn) return;
    // Keep logging minimal in Studio to reduce noise and potential perf issues
    if (isRemotionStudio() && level === 'debug') return;
    fn('[OceanNotes]', ...args);
  } catch {
    // ignore logging errors
  }
};
