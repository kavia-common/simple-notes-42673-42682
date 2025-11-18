import React from "react";
import { Theme } from "../theme";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export const SearchBar: React.FC<Props> = ({ value, onChange, placeholder = "Search notes..." }) => {
  return (
    <div
      style={{
        padding: 12,
        borderBottom: `1px solid ${Theme.colors.border}`,
        background: Theme.colors.surface,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          borderRadius: 10,
          border: `1px solid ${Theme.colors.border}`,
          background: Theme.colors.background,
          boxShadow: Theme.shadow.sm,
          transition: `box-shadow ${Theme.transition.base}`,
        }}
      >
        <span aria-hidden style={{ color: Theme.colors.textMuted }}>🔎</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            outline: "none",
            border: "none",
            background: "transparent",
            color: Theme.colors.text,
            fontSize: 14,
          }}
        />
      </div>
    </div>
  );
};
