import React from "react";
import { Theme } from "../theme";
import { Note, formatDate } from "../utils/notes";
import { cn } from "../utils/helpers";

type Props = {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

export const NotesList: React.FC<Props> = ({ notes, selectedId, onSelect, onDelete }) => {
  return (
    <div
      role="list"
      aria-label="Notes"
      style={{
        overflowY: "auto",
        height: "100%",
      }}
    >
      {notes.length === 0 ? (
        <div style={{ padding: 16, color: Theme.colors.textMuted, fontSize: 14 }}>
          No notes found. Try a different search.
        </div>
      ) : (
        notes.map((n) => (
          <button
            key={n.id}
            onClick={() => onSelect(n.id)}
            className="note-row"
            style={{
              width: "100%",
              textAlign: "left",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "12px 14px",
              borderBottom: `1px solid ${Theme.colors.border}`,
              transition: `background ${Theme.transition.base}`,
              backgroundColor:
                selectedId === n.id ? "rgba(37, 99, 235, 0.07)" : "transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div>
                <div
                  className={cn("note-title")}
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: Theme.colors.text,
                    marginBottom: 6,
                    lineHeight: 1.2,
                  }}
                >
                  {n.title || "Untitled note"}
                </div>
                <div
                  className="note-snippet"
                  style={{
                    fontSize: 12,
                    color: Theme.colors.textMuted,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    maxHeight: 34,
                  }}
                >
                  {n.body || "No content yet."}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  title="Last updated"
                  style={{
                    fontSize: 11,
                    color: Theme.colors.textMuted,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatDate(n.updatedAt)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(n.id);
                  }}
                  aria-label={`Delete note ${n.title || ""}`}
                  title="Delete note"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: Theme.colors.error,
                    cursor: "pointer",
                    padding: 6,
                    borderRadius: 8,
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );
};
