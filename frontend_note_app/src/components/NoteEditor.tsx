import React, { useEffect, useRef, useState } from "react";
import { Theme } from "../theme";
import type { Note } from "../utils/notes";
import { throttle } from "../utils/helpers";

type Props = {
  note: Note | null;
  onChange: (patch: Partial<Note>) => void;
};

export const NoteEditor: React.FC<Props> = ({ note, onChange }) => {
  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [tagsInput, setTagsInput] = useState((note?.tags ?? []).join(", "));

  const titleRef = useRef<null | any>(null);

  useEffect(() => {
    setTitle(note?.title ?? "");
    setBody(note?.body ?? "");
    setTagsInput((note?.tags ?? []).join(", "));
  }, [note?.id]);

  useEffect(() => {
    // Throttle updates to avoid excessive renders
    const push = throttle(onChange, 150);
    push({ title });
  }, [title, onChange]);

  useEffect(() => {
    const push = throttle(onChange, 150);
    push({ body });
  }, [body, onChange]);

  useEffect(() => {
    const push = throttle(onChange, 200);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    push({ tags });
  }, [tagsInput, onChange]);

  if (!note) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: Theme.colors.textMuted,
        }}
      >
        Select or create a note to get started.
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "16px 18px",
          borderBottom: `1px solid ${Theme.colors.border}`,
          background: `linear-gradient(180deg, ${Theme.colors.gradientFrom}, ${Theme.colors.surface})`,
        }}
      >
        <input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: 20,
            fontWeight: 700,
            background: "transparent",
            color: Theme.colors.text,
          }}
        />
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: Theme.colors.textMuted }}>Tags:</span>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="comma, separated, tags"
            style={{
              flex: 1,
              border: `1px solid ${Theme.colors.border}`,
              background: Theme.colors.background,
              borderRadius: 8,
              outline: "none",
              padding: "6px 8px",
              color: Theme.colors.text,
              fontSize: 12,
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start typing your note..."
          style={{
            position: "absolute",
            inset: 0,
            resize: "none",
            border: "none",
            outline: "none",
            padding: 18,
            background: Theme.colors.surface,
            color: Theme.colors.text,
            fontSize: 14,
            lineHeight: 1.6,
          }}
        />
      </div>
    </div>
  );
};
