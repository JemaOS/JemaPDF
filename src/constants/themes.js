/* Copyright (c) 2026 Jema Technology.
   Distributed under the license specified in the root directory of this project. */

// Theme configuration for PDF Tools app
// Jema Technology theme: #8286ef + white/black only

export const THEMES = {
  dark: {
    id: "dark",
    name: "Dark",
    preview: "#0a0a0f",
    colors: {
      // Background colors - near black with slight tint
      "--bg-primary": "#0a0a0f",
      "--bg-secondary": "#12121a",
      "--bg-tertiary": "#1a1a25",
      "--bg-card": "#12121a",
      // Accent - Jema purple #8286ef
      "--accent-primary": "#8286ef",
      "--accent-secondary": "#9ea1f2",
      "--accent-gradient": "#8286ef",
      "--accent-glow": "rgba(130, 134, 239, 0.15)",
      // Text colors - white scale
      "--text-primary": "#ffffff",
      "--text-secondary": "#a0a0b0",
      "--text-muted": "#606070",
      // Feature colors - all use Jema purple
      "--compress-color": "#8286ef",
      "--merge-color": "#8286ef",
      "--split-color": "#8286ef",
      // Borders
      "--border-color": "rgba(255, 255, 255, 0.1)",
    },
  },
  light: {
    id: "light",
    name: "Light",
    preview: "#ffffff",
    colors: {
      // Background colors - white scale
      "--bg-primary": "#f8f8fb",
      "--bg-secondary": "#ffffff",
      "--bg-tertiary": "#f0f0f5",
      "--bg-card": "#ffffff",
      // Accent - Jema purple #8286ef
      "--accent-primary": "#8286ef",
      "--accent-secondary": "#5a5fd4",
      "--accent-gradient": "#8286ef",
      "--accent-glow": "rgba(130, 134, 239, 0.1)",
      // Text colors - black scale
      "--text-primary": "#1a1a2e",
      "--text-secondary": "#4a4a5a",
      "--text-muted": "#8a8a9a",
      // Feature colors - all use Jema purple
      "--compress-color": "#8286ef",
      "--merge-color": "#8286ef",
      "--split-color": "#8286ef",
      // Borders
      "--border-color": "rgba(0, 0, 0, 0.1)",
    },
  },
};

// Apply theme to document root
export function applyTheme(theme) {
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}
