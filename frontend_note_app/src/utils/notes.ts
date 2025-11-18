export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
  archived?: boolean;
  tags?: string[];
};

export type NotesState = {
  notes: Note[];
  selectedId: string | null;
};

const fallbackRandomId = () =>
  `id_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;

const safeUuid = () => {
  try {
    const g: any = typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
    const c = g?.crypto;
    if (c && typeof c.randomUUID === "function") {
      return c.randomUUID();
    }
  } catch {}
  return fallbackRandomId();
};

export const createEmptyNote = (): Note => {
  const now = Date.now();
  return {
    id: safeUuid(),
    title: "Untitled note",
    body: "",
    createdAt: now,
    updatedAt: now,
    tags: [],
  };
};

export const updateNote = (note: Note, patch: Partial<Note>): Note => {
  return { ...note, ...patch, updatedAt: Date.now() };
};

export const sortNotesByUpdated = (notes: Note[]) =>
  [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

export const filterNotes = (notes: Note[], query: string) => {
  if (!query.trim()) return sortNotesByUpdated(notes);
  const q = query.toLowerCase();
  const scored = notes.map((n) => {
    const titleScore = n.title.toLowerCase().includes(q) ? 2 : 0;
    const bodyScore = n.body.toLowerCase().includes(q) ? 1 : 0;
    let tagScore = 0;
    if (n.tags && n.tags.length) {
      tagScore = n.tags.some((t) => t.toLowerCase().includes(q)) ? 1 : 0;
    }
    return { note: n, score: titleScore + bodyScore + tagScore };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return b.note.updatedAt - a.note.updatedAt;
    })
    .map((s) => s.note);
};

export const formatDate = (ts: number) => {
  try {
    const d = new Date(ts);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  } catch {
    return "";
  }
};
