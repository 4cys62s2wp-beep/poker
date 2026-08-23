// Generiert die PNG-App-Icons (ohne externe Abhängigkeiten).
// Zeichnet den PokerMentor-Pik auf dunkelgrünem Verlauf per Pixel-Rendering
// mit 2x-Supersampling und schreibt minimale, valide PNG-Dateien.

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

// ---------- PNG-Encoder ----------

const CRC_TABLE = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bittiefe
  ihdr[9] = 6; // RGBA
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // Filter: None
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// ---------- Zeichnen ----------

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Herz-Kurve (Punkt oben), genutzt als gespiegelter Pik-Körper. */
function insideHeart(x, y) {
  const a = x * x + y * y - 1;
  return a * a * a - x * x * y * y * y <= 0;
}

/** true, wenn der (normierte) Punkt im Pik-Symbol liegt. y zeigt nach oben. */
function insideSpade(x, y) {
  // Körper: Herz um 180° gedreht, leicht nach oben geschoben
  const bx = x / 1.15;
  const by = -(y - 0.18) / 1.15;
  if (insideHeart(bx * 1.25, by * 1.25 - 0.25)) return true;
  // Stiel: nach unten öffnender Trapez-Fuß
  if (y < -0.62 && y > -1.28) {
    const t = (-0.62 - y) / 0.66; // 0 oben, 1 unten
    const halfW = 0.1 + 0.3 * t * t;
    if (Math.abs(x) <= halfW) return true;
  }
  return false;
}

/**
 * Rendert das Icon mit 2x-Supersampling.
 * padding: 0 = randlos (normal), z. B. 0.12 für maskable Safe-Zone.
 */
function renderIcon(size, padding) {
  const ss = 2;
  const big = size * ss;
  const px = new Float64Array(big * big * 4);
  const cx = big / 2;
  const cy = big / 2;
  const scale = (big / 3.4) * (1 - padding * 2);
  const cornerR = big * 0.2;

  for (let j = 0; j < big; j++) {
    for (let i = 0; i < big; i++) {
      // Abgerundete Ecken (Alpha 0 außerhalb)
      const dx = Math.max(cornerR - i, i - (big - 1 - cornerR), 0);
      const dy = Math.max(cornerR - j, j - (big - 1 - cornerR), 0);
      const outside = dx * dx + dy * dy > cornerR * cornerR;

      const idx = (j * big + i) * 4;
      if (outside && padding === 0) {
        px[idx + 3] = 0;
        continue;
      }

      // Hintergrund: radialer Verlauf
      const rx = (i - cx) / big;
      const ry = (j - cy * 0.84) / big;
      const dist = Math.min(1, Math.sqrt(rx * rx + ry * ry) * 2.1);
      let r = lerp(0x1a, 0x0b, dist);
      let g = lerp(0x4a, 0x10, dist);
      let b = lerp(0x37, 0x0d, dist);

      // Pik
      const nx = (i - cx) / scale;
      const ny = (cy - j) / scale + 0.06;
      if (insideSpade(nx, ny)) {
        const t = Math.min(1, Math.max(0, (0.95 - ny) / 2.1));
        r = lerp(0xf0, 0xb5, t);
        g = lerp(0xcf, 0x8f, t);
        b = lerp(0x7d, 0x3e, t);
      }

      px[idx] = r;
      px[idx + 1] = g;
      px[idx + 2] = b;
      px[idx + 3] = 255;
    }
  }

  // Downsampling (2x2-Box)
  const out = Buffer.alloc(size * size * 4);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const o = (j * size + i) * 4;
      for (let c = 0; c < 4; c++) {
        let sum = 0;
        for (let sy = 0; sy < ss; sy++) {
          for (let sx = 0; sx < ss; sx++) {
            sum += px[((j * ss + sy) * big + (i * ss + sx)) * 4 + c];
          }
        }
        out[o + c] = Math.round(sum / (ss * ss));
      }
    }
  }
  return out;
}

const targets = [
  { file: 'icon-512.png', size: 512, padding: 0 },
  { file: 'icon-192.png', size: 192, padding: 0 },
  { file: 'icon-180.png', size: 180, padding: 0 },
  { file: 'icon-maskable-512.png', size: 512, padding: 0.12 },
];

for (const t of targets) {
  const rgba = renderIcon(t.size, t.padding);
  writeFileSync(join(outDir, t.file), encodePng(t.size, t.size, rgba));
  console.log(`✓ ${t.file}`);
}
