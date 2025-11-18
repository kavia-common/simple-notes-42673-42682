import { useCallback, useEffect, useMemo, useState } from "react";
import { createEmptyNote, filterNotes, Note, NotesState, sortNotesByUpdated, updateNote } from "../utils/notes";
import { loadState, saveState } from "../utils/storage";

type UseNotesResult = {
  notes: Note[];
  filtered: Note[];
  selected: Note | null;
  query: string;
  setQuery: (q: string) => void;
  select: (id: string | null) => void;
  create: () => void;
  remove: (id: string) => void;
  patchSelected: (patch: Partial<Note>) => void;
};

const bootstrapState = (): NotesState => {
  const persisted = loadState();
  if (persisted) {
    return {
      notes: sortNotesByUpdated(persisted.notes),
      selectedId: persisted.selectedId ?? (persisted.notes[0]?.id ?? null),
    };
  }
  // Seed with example note for first run
  const n = createEmptyNote();
  n.title = "Welcome to Ocean Notes";
  n.body =
    "This is your first note.\n\n- Use the Add Note button to create new notes\n- Click a note to select it\n- Edit the title and body on the right\n- Use the search bar to filter\n\nYour notes are saved in your browser (localStorage).";
  return { notes: [n], selectedId: n.id };
};

export const useNotes = (): UseNotesResult => {
  const [state, setState] = useState<NotesState>(() => bootstrapState());
  const [query, setQuery] = useState("");

  // Persist (debounced to avoid thrashing and Strict Mode double-effect)
  useEffect(() => {
    const g: any = typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
    const setT = g?.setTimeout;
    const clearT = g?.clearTimeout;
    let t: any = null;
    if (setT) {
      t = setT(() => {
        saveState(state);
      }, 100);
    } else {
      // Fallback: immediate save if timers are not available
      saveState(state);
    }
    return () => {
      if (t && clearT) {
        clearT(t);
      }
    };
  }, [state]);

  const filtered = useMemo(() => filterNotes(state.notes, query), [state.notes, query]);

  const selected = useMemo(
    () => state.notes.find((n) => n.id === state.selectedId) ?? null,
    [state.notes, state.selectedId],
  );

  const select = useCallback((id: string | null) => {
    setState((s) => ({ ...s, selectedId: id }));
  }, []);

  const create = useCallback(() => {
    setState((s) => {
      const n = createEmptyNote();
      const notes = sortNotesByUpdated([n, ...s.notes]);
      return { notes, selectedId: n.id };
    });
  }, []);

  const remove = useCallback((id: string) => {
    setState((s) => {
      const nextNotes = s.notes.filter((n) => n.id !== id);
      const nextSelected = s.selectedId === id ? nextNotes[0]?.id ?? null : s.selectedId;
      return { notes: nextNotes, selectedId: nextSelected };
    });
  }, []);

  const patchSelected = useCallback((patch: Partial<Note>) => {
    setState((s) => {
      if (!s.selectedId) return s;
      const notes = s.notes.map((n) => (n.id === s.selectedId ? updateNote(n, patch) : n));
      return { ...s, notes: sortNotesByUpdated(notes) };
    });
  }, []);

  return { notes: state.notes, filtered, selected, query, setQuery, select, create, remove, patchSelected };
};
