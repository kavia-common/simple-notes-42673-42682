import React, { useEffect, useRef } from "react";
import { AbsoluteFill } from "remotion";
import { Theme } from "./theme";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { NotesList } from "./components/NotesList";
import { NoteEditor } from "./components/NoteEditor";
import { useNotes } from "./hooks/useNotes";
import type { Note } from "./utils/notes";
import { cmdKeyLabel, isMac } from "./utils/helpers";

// PUBLIC_INTERFACE
export const NotesApp: React.FC = () => {
  /**
   * This component renders the notes UI with:
   * - Header with app title and Add Note button
   * - Left sidebar with search and notes list
   * - Right editor pane for the selected note
   * Local state persists to localStorage.
   */
  const { filtered, notes, selected, setQuery, query, select, create, remove, patchSelected } = useNotes();

  // Keyboard shortcuts (guarding for non-browser environments)
  const keyHandlerRef = useRef<(e: any) => void>(() => {});
  keyHandlerRef.current = (e: any) => {
    const isCmdPressed = isMac() ? !!e.metaKey : !!e.ctrlKey;
    if (isCmdPressed && String(e.key || "").toLowerCase() === "n") {
      e.preventDefault?.();
      create();
      return;
    }
    if ((e.key === "Delete" || e.key === "Backspace") && selected) {
      const g: any = typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
      const doc = g?.document;
      const activeTag = doc?.activeElement?.tagName;
      if (activeTag && ["INPUT", "TEXTAREA"].includes(String(activeTag).toUpperCase())) {
        // If typing in a field, don't intercept delete
        return;
      }
      e.preventDefault?.();
      remove(selected.id);
    }
  };

  useEffect(() => {
    const g: any = typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
    const w = g?.window;
    if (!w || !w.addEventListener) {
      return;
    }
    const wrapped = (e: any) => keyHandlerRef.current?.(e);
    w.addEventListener("keydown", wrapped, { passive: true } as any);
    return () => {
      try {
        w.removeEventListener("keydown", wrapped as any);
      } catch {
        // ignore
      }
    };
    // Empty deps so we add/remove exactly once on mount/unmount.
    // We rely on ref to always have the latest handler.
  }, []);

  // Env-safe usage note: Respect known frontend env vars without requiring them
  // They could be used for future feature flags or logging, but are optional.
  // Prefer globalThis for safer access; may be undefined values which is fine.
  const g: any = typeof globalThis !== "undefined" ? (globalThis as any) : {};
  const procEnv = (g?.process && g?.process?.env) ? g.process.env : undefined;
  const _env = {
    API_BASE: procEnv?.REMOTION_API_BASE,
    FRONTEND_URL: procEnv?.REMOTION_FRONTEND_URL,
    NODE_ENV: procEnv?.REMOTION_NODE_ENV,
  };
  void _env; // avoid unused var lint

  return (
    <AbsoluteFill
      style={{
        background: Theme.colors.background,
        color: Theme.colors.text,
        fontFamily: "Inter, SF Pro Text, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header onAdd={create} appTitle="Ocean Notes" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(240px, 420px) 1fr",
            gap: 0,
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Sidebar */}
          <aside
            style={{
              borderRight: `1px solid ${Theme.colors.border}`,
              background: Theme.colors.surface,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <SearchBar value={query} onChange={setQuery} />
            <NotesList
              notes={filtered}
              selectedId={selected?.id ?? null}
              onSelect={(id) => select(id)}
              onDelete={(id) => remove(id)}
            />
          </aside>

          {/* Editor */}
          <main style={{ minWidth: 0, minHeight: 0, background: Theme.colors.surface }}>
            <NoteEditor note={selected as Note | null} onChange={patchSelected} />
          </main>
        </div>

        <footer
          style={{
            borderTop: `1px solid ${Theme.colors.border}`,
            padding: "8px 14px",
            fontSize: 12,
            color: Theme.colors.textMuted,
            background: Theme.colors.surface,
          }}
        >
          {notes.length} {notes.length === 1 ? "note" : "notes"} • Add: {cmdKeyLabel()}+N • Delete: Del
        </footer>
      </div>
    </AbsoluteFill>
  );
};
