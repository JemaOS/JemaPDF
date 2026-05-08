# JemaPDF

[![Jema Technology](https://img.shields.io/badge/Made%20by-Jema%20Technology-8286ef)](https://www.jematechnology.fr)
[![License](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-8286ef)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

> **Fast, private, and installation-free PDF tools.**

JemaPDF is a suite of PDF tools running entirely in your browser. No files are ever uploaded to a server — all processing happens locally thanks to Ghostscript compiled to WebAssembly.

---

## Features

| Tool | Description |
|------|-------------|
| **Compress** | Reduce PDF file size with multiple quality presets |
| **Merge** | Combine multiple PDFs in a customizable order |
| **Split** | Extract each page of a PDF into separate files |
| **Extract** | Extract a specific range of pages |
| **Grayscale** | Convert a color PDF to black and white |
| **Resize** | Change page format (A4, Letter, etc.) |

---

## Why JemaPDF?

- **100% Private** — No server uploads. Your files stay on your device.
- **Offline** — Works without an Internet connection once installed (PWA).
- **Fast** — Local processing via WebAssembly, no server wait time.
- **Open Source** — Transparent source code, licensed under AGPL-3.0.
- **Ad-free** — No trackers, no cookies.

---

## Installation (PWA)

### Chrome / Edge / Brave
1. Open [JemaPDF](https://www.jematechnology.fr) in your browser
2. Click the **Install** icon in the address bar (on the right)
3. Or via the ⋮ menu → **Install JemaPDF**

### Safari (iOS / macOS)
1. Open the site in Safari
2. Tap the **Share** button → **Add to Home Screen**

### Firefox
1. Open the site
2. Click the **⊕** icon in the address bar → **Install**

Once installed, JemaPDF runs like a native application and remains usable **offline**.

---

## Tech Stack

- [React](https://react.dev/) — User interface
- [Vite](https://vitejs.dev/) — Build and development
- [Ghostscript WASM](https://github.com/ArtifexSoftware/ghostpdl) — PDF engine compiled to WebAssembly
- [Workbox](https://developer.chrome.com/docs/workbox/) — Service Worker and caching
- [Vitest](https://vitest.dev/) — Unit testing

---

## Development

```bash
# Clone the repository
git clone https://github.com/jematechnology/jemapdf.git
cd jemapdf

# Install dependencies
npm install

# Start the development server
npm run dev

# Run tests
npm run test:run

# Build for production
npm run build

# Regenerate icon PNGs from SVG sources
npm run icons
```

---

## Architecture

```
src/
├── components/       # Reusable components
├── pages/            # Feature pages (Compress, Merge, Split...)
├── lib/              # Web Workers and WASM logic
├── constants/        # Themes and configuration
├── i18n.js           # Internationalization (fr/en)
└── App.jsx           # Entry point and routing
```

---

## License

Distributed under the [AGPL-3.0](LICENSE) license.

Copyright © 2026 [Jema Technology](https://www.jematechnology.fr)

---

<p align="center">
  <a href="https://www.jematechnology.fr">
    <strong>Developed by Jema Technology</strong>
  </a>
</p>
