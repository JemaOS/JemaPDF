/* Copyright (c) 2026 Jema Technology.
   Distributed under the license specified in the root directory of this project. */

// Generate PNG icons from SVG sources for PWA installability.
// Chrome/Edge require PNG icons to show the install prompt.

import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "..", "public");

const targets = [
  { src: "pwa-192x192.svg", out: "pwa-192x192.png", size: 192 },
  { src: "pwa-512x512.svg", out: "pwa-512x512.png", size: 512 },
  { src: "pwa-192x192.svg", out: "apple-touch-icon.png", size: 180 },
  { src: "pdf-file.svg", out: "favicon.png", size: 64 },
];

for (const { src, out, size } of targets) {
  const svg = readFileSync(resolve(publicDir, src));
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(resolve(publicDir, out));
  console.log(`Generated ${out} (${size}x${size})`);
}
