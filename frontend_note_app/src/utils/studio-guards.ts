import { useEffect, useRef, useState } from "react";
import { isRemotionStudio, safeLog } from "./logger";

/**
 * PUBLIC_INTERFACE
 * Detects rapid remounts/unmounts (a "preview loop") that may occur in Remotion Studio.
 * Returns a boolean that can be used to suspend heavy effects until the preview stabilizes.
 * The guard is a no-op outside Studio.
 */
export const useStudioHeartbeatGuard = (opts?: {
  windowMs?: number; // sliding window duration to observe mounts
  threshold?: number; // number of mounts inside window to consider unstable
  coolDownMs?: number; // time to wait in stable state before clearing unstable flag
}): { unstable: boolean } => {
  const windowMs = opts?.windowMs ?? 2000;
  const threshold = opts?.threshold ?? 3;
  const coolDownMs = opts?.coolDownMs ?? 1000;

  const [unstable, setUnstable] = useState(false);
  const mountsRef = useRef<number[]>([]);
  const coolDownTimer = useRef<any>(null);

  useEffect(() => {
    if (!isRemotionStudio()) {
      // Outside Studio, always stable
      return;
    }
    const now = Date.now();
    mountsRef.current.push(now);

    // keep only recent timestamps
    mountsRef.current = mountsRef.current.filter((t) => now - t <= windowMs);

    if (mountsRef.current.length >= threshold) {
      if (!unstable) {
        setUnstable(true);
        safeLog("warn", "Studio heartbeat marked unstable - suspending heavy effects temporarily.");
      }
      if (coolDownTimer.current) {
        try {
          const g: any = (globalThis as any) ?? {};
          g.clearTimeout?.(coolDownTimer.current);
        } catch {
          // ignore
        }
      }
    }

    // attempt to clear unstable after coolDownMs if no further mounts
    try {
      const g: any = (globalThis as any) ?? {};
      coolDownTimer.current = g.setTimeout?.(() => {
        const latest = Date.now();
        // Re-check density
        mountsRef.current = mountsRef.current.filter((t) => latest - t <= windowMs);
        if (mountsRef.current.length < threshold) {
          if (unstable) {
            safeLog("info", "Studio heartbeat stabilized - resuming effects.");
          }
          setUnstable(false);
        }
      }, coolDownMs);
    } catch {
      // ignore
    }

    return () => {
      if (coolDownTimer.current) {
        try {
          const g: any = (globalThis as any) ?? {};
          g.clearTimeout?.(coolDownTimer.current);
        } catch {
          // ignore
        }
      }
    };
    // We intentionally don't include deps; we want this to run on each mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { unstable };
};

/**
 * PUBLIC_INTERFACE
 * Wrap a function in a try/catch that swallows synchronous errors
 * and logs safely. Useful for initialization blocks that must not
 * throw and cause Studio to crash or re-mount repeatedly.
 */
export const swallowSync = <T extends (...args: any[]) => any>(fn: T, label = "init"): T => {
  return ((...args: any[]) => {
    try {
      return fn(...args);
    } catch (err) {
      safeLog("error", `Swallowed error in ${label}:`, err);
      return undefined;
    }
  }) as T;
};
