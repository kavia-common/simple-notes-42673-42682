import type { NotesState } from "./notes";
import { isRemotionStudio, safeLog } from "./logger";

const STORAGE_KEY = "ocean-notes-state-v1";

// In-memory fallback store used when localStorage is unavailable or disabled (e.g., in Studio)
let inMemoryState: NotesState | null = null;

// PUBLIC_INTERFACE
export const loadState = (): NotesState | null => {
  try {
    const g: any = typeof globalThis !== "undefined" ? (globalThis as any) : undefined;

    // Disable persistence in Remotion Studio to prevent preview reload loops
    if (isRemotionStudio()) {
      safeLog("info", "Persistence disabled in Remotion Studio; using in-memory state.");
      return inMemoryState;
    }

    const ls = g?.localStorage;
    if (!ls || !ls.getItem) return inMemoryState;
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return inMemoryState;
    const parsed = JSON.parse(raw) as NotesState;
    // Basic validation
    if (!parsed || !Array.isArray(parsed.notes)) return inMemoryState;
    return parsed;
  } catch (err) {
    safeLog("warn", "Failed to load state, using memory fallback.", err);
    return inMemoryState;
  }
};

// Debounce guard shared across calls to reduce write frequency
let saveTimer: any = null;

// PUBLIC_INTERFACE
export const saveState = (state: NotesState) => {
  try {
    const g: any = typeof globalThis !== "undefined" ? (globalThis as any) : undefined;

    // Always keep the in-memory mirror updated
    inMemoryState = state;

    // Short-circuit in Studio to completely avoid touching localStorage
    if (isRemotionStudio()) {
      return;
    }

    const ls = g?.localStorage;
    if (!ls || !ls.setItem) return;

    // Debounced write to avoid thrashing and potential event feedback
    const clearT = g?.clearTimeout?.bind(g);
    const setT = g?.setTimeout?.bind(g);
    if (saveTimer && clearT) clearT(saveTimer);
    if (setT) {
      saveTimer = setT(() => {
        try {
          ls.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (err) {
          safeLog("warn", "Failed to persist state to localStorage.", err);
        }
      }, 150);
    } else {
      // Fallback immediate write
      ls.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (err) {
    // ignore quota errors etc.
    safeLog("warn", "Persistence error ignored.", err);
  }
};

export const migrateIfNeeded = (state: unknown): NotesState | null => {
  // In case future migrations are needed
  try {
    const s = state as NotesState;
    if (s && Array.isArray(s.notes)) return s;
    return null;
  } catch {
    return null;
  }
};
