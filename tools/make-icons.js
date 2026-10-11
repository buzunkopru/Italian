// Generates simple PNG icons (no dependencies): dark rounded tile with a blue "M".
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'icons');
const BG = [15, 23, 42], FG = [59, 130, 246], WHITE = [255, 255, 255];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
// Full-bleed square (iOS/maskable crop it themselves): blue disc on dark background, white "M" strokes.
function draw(size) {
  const px = Buffer.alloc(size * (size * 3 + 1));
  const cx = size / 2, r = size * 0.38, w = size * 0.07;
  const L = size * 0.30, R = size * 0.70, T = size * 0.30, B = size * 0.70, mid = size * 0.52;
  const seg = (x, y, x1, y1, x2, y2) => {
    const dx = x2 - x1, dy = y2 - y1, t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)) <= w;
  };
  for (let y = 0; y < size; y++) {
    px[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let c = Math.hypot(x - cx, y - cx) <= r ? FG : BG;
      if (seg(x, y, L, B, L, T) || seg(x, y, L, T, cx, mid) || seg(x, y, cx, mid, R, T) || seg(x, y, R, T, R, B)) c = WHITE;
      px.set(c, y * (size * 3 + 1) + 1 + x * 3);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(px)), chunk('IEND', Buffer.alloc(0))]);
}
for (const s of [180, 192, 512]) writeFileSync(join(out, `icon-${s}.png`), draw(s));
console.log('icons written');
