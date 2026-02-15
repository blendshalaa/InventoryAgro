/**
 * Generates blue placeholder PNG icons 192x192 and 512x512.
 * Run: node scripts/generate-icons.js
 * Requires: npm install canvas (optional; if not available, icons can be added manually)
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public');
const blue = '#2563eb';

try {
  const { createCanvas } = require('canvas');
  [192, 512].forEach((size) => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = blue;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = `bold ${size / 4}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('I', size / 2, size / 2);
    const buf = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(dir, `icon-${size}.png`), buf);
    console.log(`Wrote icon-${size}.png`);
  });
} catch (e) {
  console.log('Canvas not installed. Creating SVG placeholders instead.');
  [192, 512].forEach((size) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="100%" height="100%" fill="${blue}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="${size/4}" font-family="sans-serif">I</text></svg>`;
    fs.writeFileSync(path.join(dir, `icon-${size}.svg`), svg);
  });
  console.log('Add icon-192.png and icon-512.png to public/ for PWA (e.g. convert SVG to PNG).');
}
