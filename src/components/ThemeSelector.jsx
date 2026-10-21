/* Copyright (c) 2026 Jema Technology.
   Distributed under the license specified in the root directory of this project. */

import { THEMES } from "../constants/themes.js";

const LABELS = {
  system: "Système",
  light: "Clair",
  dark: "Sombre",
};

// Theme selector: system, light and dark.
function ThemeSelector({ currentTheme, onThemeChange }) {
  return (
    <div className="theme-selector" role="group" aria-label="Thème">
      <button
        type="button"
        className={`theme-dot theme-dot-system ${currentTheme === "system" ? "active" : ""}`}
        onClick={() => onThemeChange("system")}
        title={LABELS.system}
        aria-label={`Thème : ${LABELS.system}`}
        aria-pressed={currentTheme === "system"}
      />
      {Object.values(THEMES).map((theme) => (
        <button
          type="button"
          key={theme.id}
          className={`theme-dot ${currentTheme === theme.id ? "active" : ""}`}
          style={{ background: theme.preview }}
          onClick={() => onThemeChange(theme.id)}
          title={LABELS[theme.id]}
          aria-label={`Thème : ${LABELS[theme.id]}`}
          aria-pressed={currentTheme === theme.id}
        />
      ))}
    </div>
  );
}

export default ThemeSelector;
