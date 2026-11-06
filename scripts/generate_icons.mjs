#!/usr/bin/env node
/**
 * SCOUTBOOK 圖標產生器（G11 標準 · 家族版式）
 *
 * 設計基因（對齊 VSBOOK / ROVERBOOK 實際出街圖標，非只換色）：
 *   圓角布色方塊（radius 0.19）＋ 內嵌金線（inset 0.04 / stroke 0.017）
 *   ＋ 單色金浮雕：上方「水滴環」（家族共用記號）＋ 下方支部圖案。
 *   SCOUTBOOK 的支部圖案＝打開的紀錄冊（VSBOOK 用「V」、ROVERBOOK 用「缽＋橫桿」）。
 *
 * 規格（docs/33-icon-standard.md）：
 *   - 9 個 PNG／ICO，不准 SVG；16×16 手繪；maskable 主體收在中央 66%；
 *   - 顏色 ≥ 4 隻；滿版（full bleed）；扁平色，只有布面一層漸變；
 *   - 檔名帶 `-v2`：/icons/* 設 immutable cache，換圖必換名。
 *
 * 零外部 npm 依賴（node:zlib + 內建 PNG/ICO 編碼器）。
 */
import { mkdirSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'web', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

/* ---------------------------------------------------------------- PNG／ICO */

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function quantize(rgba, step) {
  for (let i = 0; i < rgba.length; i += 4) {
    for (let k = 0; k < 3; k++) rgba[i + k] = Math.round(rgba[i + k] / step) * step;
  }
  return rgba;
}

function encodePng(w, h, rgba) {
  const stride = w * 4;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) {
    const off = y * (stride + 1);
    raw[off] = 1; // Sub filter
    for (let x = 0; x < stride; x++) {
      raw[off + 1 + x] = (rgba[y * stride + x] - (x >= 4 ? rgba[y * stride + x - 4] : 0)) & 0xff;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function encodeIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  const dirs = [];
  let offset = 6 + entries.length * 16;
  for (const { size, png } of entries) {
    const dir = Buffer.alloc(16);
    dir[0] = size >= 256 ? 0 : size;
    dir[1] = size >= 256 ? 0 : size;
    dir.writeUInt16LE(1, 4);
    dir.writeUInt16LE(32, 6);
    dir.writeUInt32LE(png.length, 8);
    dir.writeUInt32LE(offset, 12);
    dirs.push(dir);
    offset += png.length;
  }
  return Buffer.concat([header, ...dirs, ...entries.map((e) => e.png)]);
}

/* ------------------------------------------------------------------- 繪圖 */

const clamp = (v, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

function sdRoundBox(px, py, cx, cy, hw, hh, r) {
  const qx = Math.abs(px - cx) - hw + r;
  const qy = Math.abs(py - cy) - hh + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

function sdSegment(px, py, ax, ay, bx, by) {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const h = clamp((pax * bax + pay * bay) / (bax * bax + bay * bay || 1));
  return Math.hypot(pax - bax * h, pay - bay * h);
}

function sdTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
  const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
  const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  const d = Math.min(sdSegment(px, py, ax, ay, bx, by), sdSegment(px, py, bx, by, cx, cy), sdSegment(px, py, cx, cy, ax, ay));
  return hasNeg && hasPos ? d : -d;
}

/** 凸四邊形（兩種繞向都支援） */
function sdQuad(px, py, ax, ay, bx, by, cx, cy, dx, dy) {
  const pts = [[ax, ay], [bx, by], [cx, cy], [dx, dy]];
  let out = Infinity;
  let allPos = true;
  let allNeg = true;
  for (let i = 0; i < 4; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % 4];
    out = Math.min(out, sdSegment(px, py, x1, y1, x2, y2));
    const cross = (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
    if (cross < 0) allPos = false;
    if (cross > 0) allNeg = false;
  }
  return allPos || allNeg ? -out : out;
}

/* 家族共用記號：水滴環（外尖上、內孔同形） */
const RING = { cx: 0.5, cy: 0.4, r: 0.15, stroke: 0.072 };

function sdTeardrop(px, py, cx, cy, r) {
  const d = Math.hypot(px - cx, py - cy) - r;
  const apex = cy - r * 1.95;
  const t = sdTriangle(px, py, cx - r * 0.54, cy - r * 0.86, cx + r * 0.54, cy - r * 0.86, cx, apex);
  return Math.min(d, t);
}

function dropletRing(x, y) {
  const outer = sdTeardrop(x, y, RING.cx, RING.cy, RING.r);
  const inner = sdTeardrop(x, y, RING.cx, RING.cy + 0.004, RING.r - RING.stroke);
  return Math.max(outer, -inner);
}

/* SCOUTBOOK 支部圖案：打開的紀錄冊（兩頁 + 中縫） */
function openBook(x, y) {
  const left = sdQuad(x, y, 0.272, 0.574, 0.488, 0.618, 0.488, 0.812, 0.272, 0.768);
  const right = sdQuad(x, y, 0.728, 0.574, 0.512, 0.618, 0.512, 0.812, 0.728, 0.768);
  return Math.min(left, right);
}

function glyph(x, y) {
  return Math.min(dropletRing(x, y), openBook(x, y));
}

/** 布面色票：4 色以上（淺綠、中綠、深綠、金、淺金、象牙） */
const C = {
  clothLight: [47, 115, 78],
  clothMid: [28, 82, 54],
  clothDeep: [11, 36, 23],
  gold: [227, 192, 122],
  goldLight: [246, 230, 187],
  goldDeep: [179, 141, 66],
  ivory: [247, 242, 231],
};

function paintTile(u, v) {
  const glow = clamp(1 - Math.hypot((u - 0.3) * 1.15, (v - 0.2) * 1.15));
  const diag = clamp(u * 0.45 + v * 0.55);
  return [
    mix(mix(C.clothMid[0], C.clothDeep[0], diag * 0.85), C.clothLight[0], glow * 0.6),
    mix(mix(C.clothMid[1], C.clothDeep[1], diag * 0.85), C.clothLight[1], glow * 0.6),
    mix(mix(C.clothMid[2], C.clothDeep[2], diag * 0.85), C.clothLight[2], glow * 0.6),
  ];
}

function paintGold(gy) {
  const t = clamp((gy - 0.18) / 0.64);
  return [mix(C.goldLight[0], C.goldDeep[0], t * 0.55), mix(C.goldLight[1], C.goldDeep[1], t * 0.55), mix(C.goldLight[2], C.goldDeep[2], t * 0.55)];
}

/** 方形圖標（maskable：圖案收在中央 66% 安全區，布面照樣滿版） */
function renderSquare(size, { maskable = false, rounded = true } = {}) {
  const rgba = new Uint8Array(size * size * 4);
  const scale = maskable ? 0.665 / 0.82 : 1;
  const px = 1.15 / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x + 0.5) / size;
      const v = (y + 0.5) / size;
      const gx = (u - 0.5) / scale + 0.5;
      const gy = (v - 0.5) / scale + 0.5;

      let [r, g, b] = paintTile(u, v);
      const aTile = rounded ? 1 - smooth(-px, px, sdRoundBox(u, v, 0.5, 0.5, 0.5, 0.5, 0.192)) : 1;

      // 內嵌金線
      let aGold = 0;
      if (rounded) {
        const inset = sdRoundBox(u, v, 0.5, 0.5, 0.5 - 0.04, 0.5 - 0.04, 0.165);
        aGold = (1 - smooth(-0.007, 0.007, Math.abs(inset) - 0.0085)) * 0.95;
      }

      // 金浮雕
      const aG = 1 - smooth(-1.3 / size, 1.3 / size, glyph(gx, gy));
      const [gr, gg, gb] = paintGold(gy);
      aGold = Math.max(aGold, aG);
      r = mix(r, gr, aGold);
      g = mix(g, gg, aGold);
      b = mix(b, gb, aGold);

      const i = (y * size + x) * 4;
      rgba[i] = Math.round(r);
      rgba[i + 1] = Math.round(g);
      rgba[i + 2] = Math.round(b);
      rgba[i + 3] = Math.round(aTile * 255);
    }
  }
  if (size >= 512) quantize(rgba, 3);
  return encodePng(size, size, rgba);
}

/* ---------------------------------------------------------- 16×16 手繪（不縮圖） */

const PAL16 = {
  d: [11, 36, 23, 255], // 深綠布
  m: [28, 82, 54, 255], // 中綠布
  l: [47, 115, 78, 255], // 淺綠布（左上受光）
  g: [227, 192, 122, 255], // 金
  G: [246, 230, 187, 255], // 淺金
  i: [247, 242, 231, 255], // 象牙（內線）
};

function renderHandcrafted16() {
  // 手繪 16×16（唔准由 512 縮落嚟）：3 層＝布面／金水滴環／金書頁
  const GRID = [
    'ddmmmmggggmmmmdd',
    'dmmmmmmggmmmmmmd',
    'mllmmmggggmmmmmm',
    'mllmmggggggmmmmm',
    'mllmmggmmggmmmmm',
    'mllmmggmmggmmmmm',
    'lmmmmggggggmmmmm',
    'mmmmmmggggmmmmmm',
    'mmmmmmmmmmmmmmmm',
    'mmmmggggmggggmmm',
    'mmmgggggmgggggmm',
    'mmmgggggmgggggmm',
    'mmmgggggmgggggmm',
    'mmmgggggmgggggmm',
    'dmmmmmmmmmmmmmmd',
    'ddmmmmmmmmmmmmdd',
  ];
  const rgba = new Uint8Array(16 * 16 * 4);
  for (let y = 0; y < 16; y++) {
    const row = GRID[y];
    if (row.length !== 16) throw new Error(`16px 第 ${y} 行長度 ${row.length}，必須 16`);
    for (let x = 0; x < 16; x++) {
      const c = PAL16[row[x]] || PAL16.m;
      const i = (y * 16 + x) * 4;
      rgba[i] = c[0];
      rgba[i + 1] = c[1];
      rgba[i + 2] = c[2];
      rgba[i + 3] = c[3];
    }
  }
  return encodePng(16, 16, rgba);
}

/* ------------------------------------------------------------- OG 分享卡 1200×630 */

function renderOg() {
  const W = 1200;
  const H = 630;
  const rgba = new Uint8Array(W * H * 4);
  const tile = 340; // 左側圖標尺寸
  for (let y = 0; y < H; y++) {
    const v = y / (H - 1);
    for (let x = 0; x < W; x++) {
      const u = x / (W - 1);
      let [r, g, b] = paintTile(u * 0.8, v);
      // 外金線
      const dOuter = Math.abs(sdRoundBox(x, y, W / 2, H / 2, W / 2 - 26, H / 2 - 26, 16)) - 1.6;
      const aOuter = (1 - smooth(-1, 1, dOuter)) * 0.5;
      r = mix(r, C.gold[0], aOuter);
      g = mix(g, C.gold[1], aOuter);
      b = mix(b, C.gold[2], aOuter);

      // 左：SCOUTBOOK 圖標（縮小版同一設計）
      const cx = 300;
      const cy = H / 2;
      const half = tile / 2;
      if (Math.abs(x - cx) < half + 2 && Math.abs(y - cy) < half + 2) {
        const lu = (x - (cx - half)) / tile;
        const lv = (y - (cy - half)) / tile;
        const aTile = 1 - smooth(-1.4, 1.4, sdRoundBox(lu, lv, 0.5, 0.5, 0.5, 0.5, 0.192) * tile);
        let [tr, tg, tb] = paintTile(lu, lv);
        const inset = sdRoundBox(lu, lv, 0.5, 0.5, 0.46, 0.46, 0.165);
        let aGold = (1 - smooth(-0.7, 0.7, Math.abs(inset) * tile - 3)) * 0.95;
        const aG = 1 - smooth(-0.8, 0.8, glyph(lu, lv) * tile);
        const [gr, gg, gb] = paintGold(lv);
        aGold = Math.max(aGold, aG);
        tr = mix(tr, gr, aGold);
        tg = mix(tg, gg, aGold);
        tb = mix(tb, gb, aGold);
        r = mix(r, tr, aTile);
        g = mix(g, tg, aTile);
        b = mix(b, tb, aTile);
      }

      // 右：象牙紀錄頁（深綠標題帶 + 金線 + 綠剔選框）
      const cardX = 880;
      const cardY = H / 2;
      const dCard = sdRoundBox(x, y, cardX, cardY, 268, 196, 10);
      const aCard = 1 - smooth(-1.2, 1.2, dCard);
      if (aCard > 0) {
        let cr = C.ivory[0];
        let cg = C.ivory[1];
        let cb = C.ivory[2];
        const aHead = 1 - smooth(-1, 1, sdRoundBox(x, y, cardX, cardY - 150, 236, 26, 4));
        cr = mix(cr, C.clothMid[0], aHead);
        cg = mix(cg, C.clothMid[1], aHead);
        cb = mix(cb, C.clothMid[2], aHead);
        // 標題帶內金點
        const aDot = 1 - smooth(-1, 1, Math.hypot(x - (cardX - 214), y - (cardY - 150)) - 6);
        cr = mix(cr, C.gold[0], aDot);
        cg = mix(cg, C.gold[1], aDot);
        cb = mix(cb, C.gold[2], aDot);
        // 三條金線 + 三行綠底線
        for (let k = 0; k < 3; k++) {
          const yy = cardY - 78 + k * 62;
          const aRule = 1 - smooth(-1, 1, sdRoundBox(x, y, cardX - 40, yy, 170, 3, 1.5));
          cr = mix(cr, C.goldDeep[0], aRule * 0.85);
          cg = mix(cg, C.goldDeep[1], aRule * 0.85);
          cb = mix(cb, C.goldDeep[2], aRule * 0.85);
          const aLine = 1 - smooth(-1, 1, sdRoundBox(x, y, cardX + 20, yy + 22, 190, 1.6, 1));
          cr = mix(cr, C.clothMid[0], aLine * 0.5);
          cg = mix(cg, C.clothMid[1], aLine * 0.5);
          cb = mix(cb, C.clothMid[2], aLine * 0.5);
        }
        r = mix(r, cr, aCard);
        g = mix(g, cg, aCard);
        b = mix(b, cb, aCard);
      }

      const i = (y * W + x) * 4;
      rgba[i] = Math.round(r);
      rgba[i + 1] = Math.round(g);
      rgba[i + 2] = Math.round(b);
      rgba[i + 3] = 255;
    }
  }
  quantize(rgba, 3);
  return encodePng(W, H, rgba);
}

/* ------------------------------------------------------------------ 輸出 */

const written = [];
function write(name, buf) {
  const p = path.join(outDir, name);
  writeFileSync(p, buf);
  written.push([name, statSync(p).size]);
}

write('icon-192-v2.png', renderSquare(192));
write('icon-512-v2.png', renderSquare(512));
write('icon-maskable-192-v2.png', renderSquare(192, { maskable: true }));
write('icon-maskable-512-v2.png', renderSquare(512, { maskable: true }));
write('apple-touch-icon-v2.png', renderSquare(180, { rounded: false }));
write('favicon-16-v2.png', renderHandcrafted16());
write('favicon-32-v2.png', renderSquare(32));
write('favicon-48-v2.png', renderSquare(48));
write(
  'favicon-v2.ico',
  encodeIco([
    { size: 16, png: renderHandcrafted16() },
    { size: 32, png: renderSquare(32) },
    { size: 48, png: renderSquare(48) },
  ]),
);
write('og-image-v2.png', renderOg());

const total = written.reduce((n, [, s]) => n + s, 0);
for (const [name, size] of written) console.log(`  ${name.padEnd(26)} ${(size / 1024).toFixed(1)} KB`);
console.log(`  ${'TOTAL'.padEnd(26)} ${(total / 1024).toFixed(1)} KB ${total <= 260 * 1024 ? '(≤ 260 KB ✓)' : '(超出 260 KB ✗)'}`);

const stale = readdirSync(outDir).filter((f) => !written.some(([n]) => n === f));
if (stale.length) console.log(`\n  未使用（可刪）：${stale.join(', ')}`);
