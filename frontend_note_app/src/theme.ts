export const Theme = {
  name: "Ocean Professional",
  colors: {
    primary: "#2563EB",
    secondary: "#F59E0B",
    success: "#F59E0B",
    error: "#EF4444",
    background: "#f9fafb",
    surface: "#ffffff",
    text: "#111827",
    textMuted: "#6B7280",
    border: "#E5E7EB",
    shadow: "rgba(0,0,0,0.06)",
    gradientFrom: "rgba(59, 130, 246, 0.10)", // blue-500/10
    gradientTo: "rgba(249, 250, 251, 1.0)", // gray-50
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
  },
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.06)",
    md: "0 4px 12px rgba(0, 0, 0, 0.08)",
    lg: "0 8px 24px rgba(0, 0, 0, 0.10)",
  },
  transition: {
    fast: "150ms ease",
    base: "240ms ease",
    slow: "420ms ease",
  },
} as const;

export type ThemeType = typeof Theme;
