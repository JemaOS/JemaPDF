<div align="center">

<img src="public/pwa-192x192.png" width="96" height="96" alt="JemaPDF logo" />

# JemaPDF

### Fast, private, installation-free PDF tools — 100% in your browser

[![Made by Jema Technology](https://img.shields.io/badge/Made%20by-Jema%20Technology-8286ef)](https://www.jematechnology.fr)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-Ghostscript-654ff0?logo=webassembly&logoColor=white)](https://webassembly.org)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-8286ef)](#-install-as-a-pwa)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-contributing)

**Compress · Merge · Split · Extract · Grayscale · Resize** — no upload, no cookies, no tracking.

[Features](#-features) · [Screenshots](#-screenshots) · [Install as a PWA](#-install-as-a-pwa) · [Tech stack](#-tech-stack) · [License](#-license)

<br>

<sub>**Keywords:** PDF tools · merge PDF · combine PDF · split PDF · compress PDF · reduce PDF size · extract PDF pages · delete PDF pages · grayscale PDF · resize PDF · A4 · Letter · PDF editor · browser PDF tools · offline PDF · WebAssembly Ghostscript · no upload · private PDF · no tracking · PWA · React</sub>

</div>

![JemaPDF — tools](screenshots/main.png)

---

## ✨ Features

| Tool             | Description                                   |
| ---------------- | --------------------------------------------- |
| 🗜️ **Compress**  | Reduce PDF size with multiple quality presets |
| 🔗 **Merge**     | Combine multiple PDFs in a custom order       |
| ✂️ **Split**     | Extract every page into separate files        |
| 📑 **Extract**   | Extract a specific range of pages             |
| ⚫ **Grayscale** | Convert a color PDF to black & white          |
| 📐 **Resize**    | Change page format (A4, Letter, …)            |

## 💡 Why JemaPDF?

- **🔒 100% private** — files never leave your device; all processing is local
- **📶 Offline** — works without a connection once installed (PWA)
- **⚡ Fast** — local WebAssembly processing (Ghostscript), no server round-trip
- **🧩 Open source** — transparent code, AGPL-3.0
- **🚫 No ads, no trackers, no cookies**

---

## 📸 Screenshots

### Interface

|                          Light                           |                             Dark                             |
| :------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="screenshots/main.png" alt="JemaPDF — light" /> | <img src="screenshots/main-dark.png" alt="JemaPDF — dark" /> |

### 📱 Mobile

| Dark | Light |
| :---: | :---: |
| <img src="screenshots/mobile-dark.png" alt="JemaPDF — mobile, dark" width="300" /> | <img src="screenshots/mobile-light.png" alt="JemaPDF — mobile, light" width="300" /> |

### Tools

| 🗜️ Compress | 🔗 Merge |
| :---: | :---: |
| <img src="screenshots/tool-compress.png" alt="JemaPDF — compress PDF" /> | <img src="screenshots/tool-merge.png" alt="JemaPDF — merge PDFs" /> |

| ✂️ Split | 📑 Extract pages |
| :---: | :---: |
| <img src="screenshots/tool-split.png" alt="JemaPDF — split PDF" /> | <img src="screenshots/tool-extract.png" alt="JemaPDF — extract pages" /> |

| ⚫ Grayscale | 📐 Resize |
| :---: | :---: |
| <img src="screenshots/tool-grayscale.png" alt="JemaPDF — grayscale PDF" /> | <img src="screenshots/tool-resize.png" alt="JemaPDF — resize PDF" /> |

---

## 🚀 Development

```bash
git clone https://github.com/JemaOS/JemaPDF.git
cd JemaPDF
npm install
npm run dev        # dev server
npm test           # unit tests (Vitest)
npm run build      # production build
```

### Regenerate icons

```bash
npm run icons      # regenerate PNG icons from the SVG sources
```

---

## 📲 Install as a PWA

| Browser                   | How                                       |
| ------------------------- | ----------------------------------------- |
| **Chrome / Edge / Brave** | Click the install icon in the address bar |
| **Safari (iOS / macOS)**  | Share → _Add to Home Screen_              |
| **Firefox**               | Menu → _Install_                          |

---

## 🛠️ Tech stack

- **React 18** + **Vite**
- **Ghostscript → WebAssembly** (local PDF engine)
- **JSZip** for archive output
- **vite-plugin-pwa** for offline support
- **Vitest** for tests

---

## 🤝 Contributing

Contributions are welcome! Fork, branch, and open a pull request.

```bash
git checkout -b feat/my-feature
git commit -m "feat: my feature"
git push origin feat/my-feature
```

---

## 📄 License

Released under the **GNU AGPL-3.0** — see [LICENSE](LICENSE).

<div align="center">
Made with ❤️ by <a href="https://www.jematechnology.fr">Jema Technology</a>
</div>
