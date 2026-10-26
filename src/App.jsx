/* Copyright (c) 2026 Jema Technology.
   Distributed under the license specified in the root directory of this project. */

import { useState, useEffect } from "react";
import MainPage from "./pages/MainPage.jsx";
import CompressPage from "./pages/CompressPage.jsx";
import MergePage from "./pages/MergePage.jsx";
import SplitPage from "./pages/SplitPage.jsx";
import ExtractPagesPage from "./pages/ExtractPagesPage.jsx";
import GrayscalePage from "./pages/GrayscalePage.jsx";
import ResizePage from "./pages/ResizePage.jsx";
import CreditsPage from "./pages/CreditsPage.jsx";
import LicensePage from "./pages/LicensePage.jsx";
import SubscriptionGuard from "./SubscriptionGuard.jsx";
import "./App.css";

// ============ APP ============
const THEME_STORAGE_KEY = "jemapdf-theme";

const getSystemTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getStoredMode = () => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    /* storage unavailable */
  }
  return "system";
};

const LANG_STORAGE_KEY = "jemaos_lang";

// Langue initiale : choix persisté de l'utilisateur, sinon langue du
// navigateur/système (en ou fr), sinon anglais. Les PWA suivent donc la
// langue du système/navigateur par défaut.
function detectInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "en" || saved === "fr") return saved;
  } catch {
    /* stockage indisponible */
  }
  try {
    const candidates =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language];
    for (const candidate of candidates) {
      const short = (candidate || "").toLowerCase().split("-")[0];
      if (short === "en" || short === "fr") return short;
    }
  } catch {
    /* navigator indisponible */
  }
  return "en";
}

function App() {
  const [currentPage, setCurrentPage] = useState("main");
  const [themeMode, setThemeMode] = useState(getStoredMode);
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    themeMode === "system" ? getSystemTheme() : themeMode
  );
  const [lang, setLangState] = useState(detectInitialLang);

  // Apply the resolved theme and follow the OS while in "system" mode.
  useEffect(() => {
    const apply = (next) => {
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.style.colorScheme = next;
      const themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) {
        themeColor.setAttribute("content", next === "dark" ? "#0a0a0f" : "#f8f8fb");
      }
      setResolvedTheme(next);
    };

    apply(themeMode === "system" ? getSystemTheme() : themeMode);

    if (themeMode !== "system" || !window.matchMedia) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => apply(event.matches ? "dark" : "light");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [themeMode]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const handleThemeChange = (nextMode) => {
    setThemeMode(nextMode);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch {
      /* storage unavailable */
    }
  };

  const handleLangChange = (langCode) => {
    setLangState(langCode);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, langCode);
    } catch {
      /* stockage indisponible */
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "compress":
        return <CompressPage onBack={() => setCurrentPage("main")} lang={lang} />;
      case "merge":
        return <MergePage onBack={() => setCurrentPage("main")} lang={lang} />;
      case "split":
        return <SplitPage onBack={() => setCurrentPage("main")} lang={lang} />;
      case "extractPages":
        return (
          <ExtractPagesPage
            onBack={() => setCurrentPage("main")}
            lang={lang}
            setPage={setCurrentPage}
          />
        );
      case "grayscale":
        return <GrayscalePage onBack={() => setCurrentPage("main")} lang={lang} />;
      case "resize":
        return <ResizePage onBack={() => setCurrentPage("main")} lang={lang} />;
      case "credits":
        return <CreditsPage onBack={() => setCurrentPage("main")} lang={lang} />;
      case "license":
        return <LicensePage onBack={() => setCurrentPage("main")} lang={lang} />;
      default:
        return (
          <MainPage
            onSelectFeature={setCurrentPage}
            currentTheme={themeMode}
            resolvedTheme={resolvedTheme}
            onThemeChange={handleThemeChange}
            lang={lang}
            onLangChange={handleLangChange}
          />
        );
    }
  };

  return (
    <SubscriptionGuard appName="JemaPDF" lang={lang}>
      <div className="app">{renderPage()}</div>
    </SubscriptionGuard>
  );
}

export default App;
