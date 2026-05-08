import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { execSync } from "child_process";

// Get version from git describe
const getGitVersion = () => {
  try {
    return execSync("git describe --tags --always --dirty").toString().trim();
  } catch {
    return "unknown version";
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(getGitVersion()),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
        type: "module",
      },
      includeAssets: [
        "pdf-file.svg",
        "favicon.png",
        "apple-touch-icon.png",
        "pwa-192x192.svg",
        "pwa-512x512.svg",
        "gs-worker.wasm",
      ],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,wasm,data,woff2}"],
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB for WASM files
        navigateFallback: "index.html",
      },
      manifest: {
        name: "JemaPDF",
        short_name: "JemaPDF",
        description:
          "Outils PDF rapides, privés et hors ligne. Compresser, fusionner, diviser, extraire et convertir vos PDF directement dans votre navigateur.",
        theme_color: "#8286ef",
        background_color: "#0a0a0f",
        display: "standalone",
        orientation: "any",
        scope: "./",
        start_url: "./",
        lang: "fr",
        categories: ["productivity", "utilities"],
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  build: { target: "esnext" },
  base: "./",
  worker: { format: "es" },
});
