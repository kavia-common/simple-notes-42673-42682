import type { NotesState } from "./notes";

const STORAGE_KEY = "ocean-notes-state-v1";

export const loadState = (): NotesState | null => {
  try {
    const g: any = typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
    const ls = g?.localStorage;
    if (!ls || !ls.getItem) return null;
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NotesState;
    // Basic validation
    if (!parsed || !Array.isArray(parsed.notes)) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveState = (state: NotesState) => {
  try {
    const g: any = typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
    const ls = g?.localStorage;
    if (!ls || !ls.setItem) return;
    ls.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors etc.
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
