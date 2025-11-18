import React from "react";
import { Theme } from "../theme";
import { cmdKeyLabel } from "../utils/helpers";

type HeaderProps = {
  onAdd: () => void;
  appTitle?: string;
};

export const Header: React.FC<HeaderProps> = ({ onAdd, appTitle = "Ocean Notes" }) => {
  return (
    <header
      style={{
        background: `linear-gradient(180deg, ${Theme.colors.gradientFrom} 0%, ${Theme.colors.gradientTo} 100%)`,
        borderBottom: `1px solid ${Theme.colors.border}`,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          aria-hidden
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${Theme.colors.primary}, ${Theme.colors.secondary})`,
            boxShadow: Theme.shadow.sm,
          }}
        />
        <h1
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: Theme.colors.text,
            letterSpacing: 0.2,
          }}
        >
          {appTitle}
        </h1>
      </div>

      <button
        onClick={onAdd}
        title={`Add note (${cmdKeyLabel()} + N)`}
        style={{
          background: Theme.colors.primary,
          color: "white",
          border: "none",
          padding: "10px 14px",
          borderRadius: 10,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: Theme.shadow.sm,
          transition: `transform ${Theme.transition.fast}, box-shadow ${Theme.transition.fast}, opacity ${Theme.transition.fast}`,
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = "translateY(1px)"}
        onMouseUp={(e) => e.currentTarget.style.transform = "translateY(0)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
      >
        + Add Note
      </button>
    </header>
  );
};
