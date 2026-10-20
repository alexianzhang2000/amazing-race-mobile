import { NAME } from './story.js';
import { drawSticker, PACKS } from './stickers.js';

export { PACKS };
export const COUNT = 9;                                // 3x3 grid, one photo per panel
export const SUB = `Colour matching through ${NAME}'s lens`;

export const load = (src) => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
// small seeded random so stickers stay put until she hits Shuffle
export const rng = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// Most vivid colour in the photo (weights pixels by saturation)
export function vivid(img) {
  const c = document.createElement('canvas'); c.width = c.height = 24;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0, 24, 24);
  const d = x.getImageData(0, 0, 24, 24).data; let r = 0, g = 0, b = 0, w = 0;
  for (let k = 0; k < d.length; k += 4) {
    const mx = Math.max(d[k], d[k + 1], d[k + 2]), mn = Math.min(d[k], d[k + 1], d[k + 2]);
    const s = mx ? (mx - mn) / mx : 0, t = s * s * s + 0.001;
    r += d[k] * t; g += d[k + 1] * t; b += d[k + 2] * t; w += t;
  }
  return `rgb(${(r / w) | 0},${(g / w) | 0},${(b / w) | 0})`;
}

// ───────────── frames ─────────────
// frame: plain (flat tiles: r radius, bw/bc border, sh shadow) | polaroid | film | scrap
// extras: fret (gold key-pattern bands), confetti (gold foil flecks), paper (rice-paper speckle + seal),
//         gingham (check colour), stamp (disposable date), tape (washi colours), dotgrid, card
export const THEMES = [
  { id: 'lunar', name: 'Lunar gold', dots: ['#8a1518', '#f0c36a'], frame: 'plain', fret: '#f0c36a', confetti: true,
    bg: ['#8a1518', '#640e11'], blobs: [[540, 1000, 640, '255,120,60,.10']], hdr: '#f4c95d', ink: '#f4c95d',
    r: 8, bw: 8, bc: '#f0c36a', sh: ['rgba(30,0,0,.45)', 26, 10, 0] },
  { id: 'ink', name: 'Ink wash', dots: ['#f1ebdd', '#2e2a27'], frame: 'plain', paper: true,
    bg: ['#f7f2e7', '#ebe4d4'], hdr: '#2e2a27', ink: '#2e2a27',
    blobs: [[160, 1580, 520, '110,105,100,.10'], [940, 320, 420, '110,105,100,.07'], [600, 1000, 700, '110,105,100,.05']],
    r: 4, bw: 10, bc: '#fcfaf4', sh: ['rgba(60,50,40,.28)', 22, 8, 0] },
  { id: 'moon', name: 'Mid-Autumn', dots: ['#0b2a4a', '#ffe6a3'], frame: 'plain',
    bg: ['#0b2a4a', '#154271'], hdr: '#ffe6a3', ink: '#ffe6a3',
    blobs: [[870, 150, 250, '255,236,170,.16'], [870, 150, 98, '255,244,214,.96'], [120, 1720, 360, '255,236,170,.07']],
    r: 24, bw: 8, bc: '#ffe6a3', sh: ['rgba(255,214,120,.45)', 30, 0, 0] },
  { id: 'sakura', name: 'Blossom pink', dots: ['#ffe9f0', '#ff9fbb'], frame: 'plain',
    bg: ['#ffe9f0', '#ffd0df'], hdr: '#c2456b', ink: '#c2456b',
    blobs: [[950, 220, 320, '255,255,255,.55'], [90, 1700, 380, '255,255,255,.45'], [1000, 1500, 180, '255,159,187,.25']],
    r: 40, bw: 10, bc: '#ffffff', sh: ['rgba(194,69,107,.3)', 26, 10, 0] },
  { id: 'lantern', name: 'Lantern string', dots: ['#5b0d12', '#f0c36a'], frame: 'plain', lanternString: true,
    bg: ['#5b0d12', '#2a0508'], blobs: [[540, 120, 540, '255,150,60,.16']], hdr: '#f4c95d', ink: '#f4c95d',
    r: 10, bw: 8, bc: '#f0c36a', sh: ['rgba(0,0,0,.5)', 24, 10, 0] },
  { id: 'moongate', name: 'Moon gate', dots: ['#173f3a', '#e9d9a6'], frame: 'moongate', fixedShape: true, ts: 'circle', lattice: true,
    bg: ['#173f3a', '#0e2b28'], hdr: '#e9d9a6', ink: '#e9d9a6' },
  { id: 'neon', name: 'Neon night', dots: ['#070b24', '#ff2e93'], frame: 'plain', neon: ['#ff2e93', '#2ee6ff', '#ffe14d'], sign: true,
    bg: ['#070b24', '#1a0836'], hdr: '#2ee6ff', ink: '#ff9ad0', r: 20, bw: 0, bc: '#0a0f2c', sh: null },
  { id: 'mahjong', name: 'Mahjong', dots: ['#17704a', '#fbf5e1'], frame: 'mahjong', fixedShape: true, felt: true,
    bg: ['#17704a', '#0c4a30'], hdr: '#f3e6b3', ink: '#f3e6b3' },
  { id: 'steamer', name: 'Dim sum steamer', dots: ['#d9bd8a', '#d3a266'], frame: 'steamer', fixedShape: true, ts: 'circle', planks: true,
    bg: ['#ead5b0', '#d9bd8a'], hdr: '#7a3b12', ink: '#7a3b12' },
  { id: 'bag', name: 'Thank-you bag', dots: ['#ffffff', '#d7132a'], frame: 'plain', bag: true,
    bg: ['#ffffff', '#eceff3'], hdr: '#d7132a', ink: '#d7132a', r: 6, bw: 8, bc: '#ffffff', sh: ['rgba(0,0,0,.22)', 20, 8, 0] },
  { id: 'stamps', name: 'Postage stamps', dots: ['#e9d8b4', '#1c4a9c'], frame: 'stamp', fixedShape: true, airmail: true,
    bg: ['#efe0c0', '#dcc79a'], hdr: '#7a1b24', ink: '#7a1b24' },
  { id: 'arcade', name: 'Arcade', dots: ['#1a1033', '#5ef2ff'], frame: 'plain', arcade: true,
    bg: ['#1a1033', '#0b0720'], hdr: '#5ef2ff', ink: '#ff4fd8', r: 0, bw: 6, bc: '#5ef2ff', sh: ['rgba(94,242,255,.5)', 14, 0, 0] },
  { id: 'booth', name: 'Photo booth', dots: ['#b3151f', '#f4ece0'], frame: 'plain',
    bg: ['#b3151f', '#8f0f18'], blobs: [], hdr: '#f4ece0', ink: '#b3151f', card: '#f4ece0',
    r: 12, bw: 0, bc: '#f4ece0', sh: null },
  { id: 'instax', name: 'Instax', dots: ['#fff7e8', '#ff6f59'], frame: 'polaroid', fixedShape: true,
    bg: ['#fff7e8', '#ffdcd0'], hdr: '#c8102e', ink: '#7a1b24',
    blobs: [[980, 150, 320, '255,111,89,.22'], [60, 1790, 360, '255,176,46,.26'], [1020, 1480, 200, '147,178,31,.22']] },
  { id: 'gingham', name: 'Gingham', dots: ['#ffffff', '#d7132a'], frame: 'plain', gingham: '215,19,42',
    bg: ['#ffffff'], blobs: [], hdr: '#b3151f', ink: '#b3151f',
    r: 14, bw: 10, bc: '#ffffff', sh: ['rgba(120,20,30,.3)', 20, 8, 0] },
  { id: 'cloud', name: 'Cloud nine', dots: ['#cfe3ff', '#f3d9ff'], frame: 'plain',
    bg: ['#cfe3ff', '#f3d9ff', '#ffe3ef'], hdr: '#6b5bd2', ink: '#6b5bd2',
    r: 44, bw: 10, bc: '#ffffff', sh: ['rgba(120,100,200,.3)', 26, 10, 0],
    blobs: [[120, 230, 90, '255,255,255,.8'], [210, 195, 115, '255,255,255,.8'], [310, 235, 85, '255,255,255,.8'],
            [850, 1670, 100, '255,255,255,.8'], [945, 1630, 120, '255,255,255,.8'], [1030, 1675, 85, '255,255,255,.8']] },
  { id: 'y2k', name: 'Y2K', dots: ['#ff9ad5', '#8ee3ff'], frame: 'plain',
    bg: ['#ff9ad5', '#c6a4ff', '#8ee3ff'], blobs: [], hdr: '#5b2a8c', ink: '#5b2a8c',
    r: 28, bw: 9, bc: '#ffffff', sh: ['rgba(120,40,160,.35)', 24, 10, 0] },
  { id: 'dispo', name: 'Disposable', dots: ['#1b1613', '#ff9d4d'], frame: 'plain', stamp: true,
    bg: ['#1b1613', '#0d0a08'], blobs: [], hdr: '#ff9d4d', ink: '#ff9d4d', r: 0, bw: 0, bc: '#000', sh: null },
  { id: 'film', name: 'Film roll', dots: ['#17110f', '#ff9f43'], frame: 'film', fixedShape: true,
    bg: ['#2a1f1c', '#120c0a'], blobs: [], hdr: '#ff9f43', ink: '#ffb86b', r: 4 },
  { id: 'scrap', name: 'Scrapbook', dots: ['#e8d2a6', '#ffbf34'], frame: 'scrap', fixedShape: true, dotgrid: true,
    bg: ['#f3e3c3', '#e8d2a6'], blobs: [], hdr: '#b3151f', ink: '#5b2a1b',
    tape: ['255,191,52', '255,111,89', '147,178,31', '111,176,230'] },
  { id: 'sunny', name: 'Sunny side', dots: ['#FFBF34', '#004B87'], frame: 'plain',
    bg: ['#FFBF34', '#ffd36b'], hdr: '#004B87', ink: '#004B87',
    r: 40, bw: 8, bc: '#ffffff', sh: ['rgba(0,49,90,.3)', 28, 12, 0],
    blobs: [[960, 160, 300, '255,255,255,.28'], [90, 1740, 340, '0,75,135,.12'], [1010, 1500, 200, '147,178,31,.3']] },
  { id: 'ruby', name: 'Midnight ruby', dots: ['#1a070c', '#ff3b4f'], frame: 'plain',
    bg: ['#1a070c', '#3a0a14'], hdr: '#ff6b7a', ink: '#ffe3e3',
    r: 36, bw: 5, bc: '#ff3b4f', sh: ['rgba(255,59,79,.55)', 36, 0, 0],
    blobs: [[900, 200, 380, '255,59,79,.2'], [100, 1700, 420, '255,59,79,.16']] },
  { id: 'pop', name: 'Pop poster', dots: ['#d7132a', '#fff3df'], frame: 'plain',
    bg: ['#d7132a'], hdr: '#fff3df', ink: '#fff3df', r: 6, bw: 12, bc: '#fff3df', sh: ['#5c0710', 0, 14, 14], blobs: [] },
];

// ───────────── photo filters (pixel maths, so it works on iPhone Safari too) ─────────────
const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
// c contrast, lift raises blacks, gain brightness, rgb per-channel multiply, add per-channel offset, sat saturation,
// grain noise, mono black & white, tone {sh,hi} tints shadows/highlights, gmap gradient-map colours, quant = flat tones
function grade(d, o, rnd) {
  const { c = 1, lift = 0, gain = 1, rgb = [1, 1, 1], add = [0, 0, 0], sat = 1, grain = 0, mono = false, tone = null, gmap = null, quant = 0, gamma = 1 } = o;
  const keep = 1 - lift / 255;
  let lut = null;
  if (gmap) {
    lut = new Uint8Array(768);
    for (let i = 0; i < 256; i++) {
      let t = (i / 255) ** gamma; if (quant) t = Math.min(quant - 1, Math.floor(t * quant)) / (quant - 1);
      let s = 0; while (s < gmap.length - 2 && t > gmap[s + 1][0]) s++;
      const [t0, c0] = gmap[s], [t1, c1] = gmap[s + 1], f = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
      for (let q = 0; q < 3; q++) lut[i * 3 + q] = c0[q] + (c1[q] - c0[q]) * f;
    }
  }
  for (let k = 0; k < d.length; k += 4) {
    let r = d[k], g = d[k + 1], b = d[k + 2];
    const l = 0.3 * r + 0.59 * g + 0.11 * b, n = grain ? (rnd() - 0.5) * grain : 0;
    if (lut) { const li = (l | 0) * 3; d[k] = clamp(lut[li] + n); d[k + 1] = clamp(lut[li + 1] + n); d[k + 2] = clamp(lut[li + 2] + n); continue; }
    if (mono) { r = g = b = l; } else if (sat !== 1) { r = l + (r - l) * sat; g = l + (g - l) * sat; b = l + (b - l) * sat; }
    let tr = 0, tg = 0, tb = 0;
    if (tone) { const lu = l / 255, ld = 1 - lu; tr = tone.sh[0] * ld + tone.hi[0] * lu; tg = tone.sh[1] * ld + tone.hi[1] * lu; tb = tone.sh[2] * ld + tone.hi[2] * lu; }
    d[k] = clamp((((r - 128) * c + 128) * gain * rgb[0]) * keep + lift + add[0] + n + tr);
    d[k + 1] = clamp((((g - 128) * c + 128) * gain * rgb[1]) * keep + lift + add[1] + n + tg);
    d[k + 2] = clamp((((b - 128) * c + 128) * gain * rgb[2]) * keep + lift + add[2] + n + tb);
  }
}
const vignette = (x, S, a) => {
  const g = x.createRadialGradient(S / 2, S / 2, S * 0.35, S / 2, S / 2, S * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`);
  x.fillStyle = g; x.fillRect(0, 0, S, S);
};
const screen = (x, draw) => { x.save(); x.globalCompositeOperation = 'screen'; draw(); x.restore(); };
const glow = (x, S, a = 0.45) => {            // cheap soft-focus: shrink, then stretch back over the photo
  const t = document.createElement('canvas'); t.width = t.height = Math.max(4, Math.round(S / 10));
  t.getContext('2d').drawImage(x.canvas, 0, 0, t.width, t.height);
  screen(x, () => { x.globalAlpha = a; x.imageSmoothingQuality = 'high'; x.drawImage(t, 0, 0, S, S); });
};
const leak = (x, S) => screen(x, () => {      // warm light leak from the corners
  let g = x.createRadialGradient(S, S * 0.1, 0, S, S * 0.1, S * 0.85);
  g.addColorStop(0, 'rgba(255,90,40,.75)'); g.addColorStop(0.45, 'rgba(255,170,60,.3)'); g.addColorStop(1, 'rgba(255,170,60,0)');
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  g = x.createRadialGradient(0, S, 0, 0, S, S * 0.6);
  g.addColorStop(0, 'rgba(255,90,170,.4)'); g.addColorStop(1, 'rgba(255,90,170,0)');
  x.fillStyle = g; x.fillRect(0, 0, S, S);
});
const lantern = (x, S) => {                    // red-gold lantern light rising from the bottom
  screen(x, () => {
    const g = x.createRadialGradient(S / 2, S, 0, S / 2, S, S * 0.95);
    g.addColorStop(0, 'rgba(255,120,40,.5)'); g.addColorStop(0.5, 'rgba(255,70,50,.2)'); g.addColorStop(1, 'rgba(255,70,50,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
  });
  vignette(x, S, 0.3);
};

// pixel: levels = colours per channel after shrinking to a chunky grid; soften: blur first (flat paper-cut shapes)
export const FILTERS = [
  { id: 'none', name: 'Original' },
  { id: 'pixel', name: 'Pixel art', pixel: 5 },
  { id: 'film', name: 'Film', o: { c: 1.1, lift: 14, rgb: [1.05, 1, 0.93], add: [0, 2, 6], sat: 0.92, grain: 30 }, post: (x, S) => vignette(x, S, 0.35) },
  { id: 'hk90', name: 'HK 90s', o: { c: 1.16, lift: 12, rgb: [1.05, 1, 0.95], sat: 1.05, grain: 40, tone: { sh: [-10, 8, 16], hi: [22, 4, -14] } }, post: (x, S) => { glow(x, S, 0.25); vignette(x, S, 0.4); } },
  { id: 'neon', name: 'Neon night', o: { c: 1.35, gain: 0.85, sat: 1.7, rgb: [1.05, 0.92, 1.2] }, post: (x, S) => { glow(x, S, 0.7); vignette(x, S, 0.5); } },
  { id: 'cut', name: 'Paper-cut', soften: true, o: { gmap: [[0, [125, 18, 20]], [0.5, [215, 19, 42]], [1, [251, 236, 208]]], quant: 3, gamma: 1.8 } },
  { id: 'riso', name: 'Riso print', o: { gmap: [[0, [92, 12, 22]], [0.5, [222, 52, 48]], [1, [255, 228, 166]]], grain: 26 } },
  { id: 'glow', name: 'Lantern glow', o: { c: 1.06, rgb: [1.12, 0.95, 0.8], sat: 1.15 }, post: lantern },
  { id: 'ink', name: 'Ink wash', o: { mono: true, c: 1.15, lift: 24, rgb: [1, 0.97, 0.9], grain: 16 }, post: (x, S) => vignette(x, S, 0.25) },
  { id: 'golden', name: 'Golden hour', o: { c: 1.05, gain: 1.03, rgb: [1.1, 1.02, 0.82], sat: 1.2 }, post: (x, S) => screen(x, () => { x.fillStyle = 'rgba(255,170,60,.16)'; x.fillRect(0, 0, S, S); }) },
  { id: 'matte', name: 'Matte', o: { c: 0.86, lift: 30, sat: 0.82 } },
  { id: 'pastel', name: 'Pastel', o: { c: 0.8, lift: 42, gain: 1.04, rgb: [1.03, 0.99, 1.03], add: [6, 0, 4], sat: 0.9 } },
  { id: 'dreamy', name: 'Dreamy', o: { c: 0.94, lift: 10, gain: 1.04, sat: 1.05 }, post: (x, S) => glow(x, S) },
  { id: 'leak', name: 'Light leak', o: { c: 1.04, lift: 6, rgb: [1.03, 1, 0.97] }, post: leak },
  { id: 'noir', name: 'Noir', o: { mono: true, c: 1.25, grain: 22 }, post: (x, S) => vignette(x, S, 0.4) },
];
export const hasFx = (f) => !!(f.o || f.pixel);

export const SQ = 420; // filtered photos are cropped square at this size
export function prep(im, f, seed, size = SQ) {
  if (!hasFx(f)) return im;
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d', { willReadFrequently: true });
  cover(x, im, 0, 0, size, size);
  if (f.soften) {                                        // blur by shrinking and stretching back
    const t = document.createElement('canvas'); t.width = t.height = Math.round(size / 3);
    t.getContext('2d').drawImage(c, 0, 0, t.width, t.height);
    x.imageSmoothingQuality = 'high'; x.drawImage(t, 0, 0, size, size);
  }
  if (f.pixel) {                                         // chunky grid + limited colours
    const px = Math.max(12, Math.round(size / 7.5)), t = document.createElement('canvas'); t.width = t.height = px;
    const tx = t.getContext('2d', { willReadFrequently: true });
    tx.imageSmoothingQuality = 'high'; tx.drawImage(c, 0, 0, px, px);
    const id = tx.getImageData(0, 0, px, px); grade(id.data, { c: 1.12, sat: 1.35 }, rng(seed));
    const lv = f.pixel - 1;
    for (let k = 0; k < id.data.length; k++) if (k % 4 !== 3) id.data[k] = Math.round((id.data[k] / 255) * lv) * (255 / lv);
    tx.putImageData(id, 0, 0);
    x.imageSmoothingEnabled = false; x.drawImage(t, 0, 0, px, px, 0, 0, size, size);
  }
  if (f.o) {
    const id = x.getImageData(0, 0, size, size);
    grade(id.data, f.o, rng(seed));
    x.putImageData(id, 0, 0);
  }
  f.post?.(x, size);
  return c;
}

// ───────────── 1080x1920 Instagram story export ─────────────
const W = 1080, H = 1920, G = 22, T = 298, L = (W - 3 * T - 2 * G) / 2, TOP = 440;
const xy = (p) => [L + (p % 3) * (T + G), TOP + Math.floor(p / 3) * (T + G)];
function rr(x, a, b, w, h, r) {
  x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r);
  x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath();
}
export function cover(x, im, a, b, w, h) {
  const s = Math.max(w / im.width, h / im.height), dw = im.width * s, dh = im.height * s;
  x.drawImage(im, a + (w - dw) / 2, b + (h - dh) / 2, dw, dh);
}
function fit(x, text, size, weight, maxW, F) {           // shrink the font until the text fits
  let s = size; x.font = `${weight} ${s}px ${F}`;
  while (x.measureText(text).width > maxW && s > 20) { s -= 3; x.font = `${weight} ${s}px ${F}`; }
}

// Greek-key (meander) band, like the gold borders on Lunar New Year designs
function fret(x, y, w, h, col) {
  x.save(); x.strokeStyle = col; x.lineWidth = h * 0.1; x.lineCap = 'butt'; x.lineJoin = 'miter';
  x.beginPath(); x.moveTo(0, y); x.lineTo(w, y); x.moveTo(0, y + h); x.lineTo(w, y + h); x.stroke();
  x.beginPath();
  for (let ox = 4; ox < w; ox += h) {
    const px = (a, b) => [ox + a * h, y + b * h];
    x.moveTo(...px(0.12, 0.88)); x.lineTo(...px(0.12, 0.14)); x.lineTo(...px(0.88, 0.14)); x.lineTo(...px(0.88, 0.7));
    x.lineTo(...px(0.38, 0.7)); x.lineTo(...px(0.38, 0.4)); x.lineTo(...px(0.62, 0.4));
  }
  x.stroke(); x.restore();
}

const TAU = Math.PI * 2;

// Photo outline for the chosen shape (auto = the frame's own corner radius)
function shapePath(x, a, b, w, h, shape, r) {
  if (shape === 'circle') { x.beginPath(); x.arc(a + w / 2, b + h / 2, Math.min(w, h) / 2, 0, TAU); return; }
  if (shape === 'arch') {
    const R = w / 2, br = Math.min(14, R * 0.2);
    x.beginPath(); x.moveTo(a, b + R); x.arc(a + R, b + R, R, Math.PI, 0);
    x.lineTo(a + w, b + h - br); x.arcTo(a + w, b + h, a + w - br, b + h, br);
    x.lineTo(a + br, b + h); x.arcTo(a, b + h, a, b + h - br, br); x.closePath(); return;
  }
  rr(x, a, b, w, h, shape === 'square' ? 0 : shape === 'round' ? Math.min(w, h) * 0.16 : r);
}

// Postage-stamp outline: a rectangle with semicircle bites cut along every edge
function stampPath(x, a, b, w, h, n, r) {
  x.beginPath(); x.moveTo(a, b);
  const edge = (px, py, ux, uy, nx, ny, len) => {
    const step = len / n;
    for (let i = 0; i < n; i++) {
      const cx = px + ux * step * (i + 0.5), cy = py + uy * step * (i + 0.5);
      for (let t = 0; t <= 12; t++) {
        const g = (Math.PI * t) / 12;
        x.lineTo(cx - ux * Math.cos(g) * r + nx * Math.sin(g) * r, cy - uy * Math.cos(g) * r + ny * Math.sin(g) * r);
      }
    }
    x.lineTo(px + ux * len, py + uy * len);
  };
  edge(a, b, 1, 0, 0, 1, w); edge(a + w, b, 0, 1, -1, 0, h); edge(a + w, b + h, -1, 0, 0, -1, w); edge(a, b + h, 0, -1, 1, 0, h);
  x.closePath();
}

// Stickers only sit around the edge of the photo grid. sz scales their size (and thins them out when big)
function paint(x, pack, seed, box, sz) {
  if (!pack.kinds) return;
  const r = rng(seed * 7919 + pack.id.charCodeAt(0) * 31 + pack.id.length);
  const [bx, by, bw, bh] = box, P = 2 * (bw + bh), N = Math.round(P / (165 * sz));
  let last = '';
  for (let i = 0; i < N; i++) {
    const s = ((i + 0.15 + r() * 0.7) / N) * P, o = (r() - 0.4) * 44;   // o: how far outside the edge
    let px, py;
    if (s < bw) { px = bx + s; py = by - o; }
    else if (s < bw + bh) { px = bx + bw + o; py = by + (s - bw); }
    else if (s < 2 * bw + bh) { px = bx + bw - (s - bw - bh); py = by + bh + o; }
    else { px = bx - o; py = by + bh - (s - 2 * bw - bh); }
    let kind; do { kind = pack.kinds[(r() * pack.kinds.length) | 0]; } while (kind === last && pack.kinds.length > 1);
    last = kind;
    x.save(); x.translate(px, py); x.rotate((r() - 0.5) * 0.9);
    drawSticker(x, kind, (74 + r() * 34) * sz, (r() * 4) | 0, true);
    x.restore();
  }
}

// o = { pack, seed, flt, shape, size, caption }
export async function render(tiles, th, o) {
  const { pack, seed = 1, flt = 0, shape: wanted = 'auto', size = 1, caption } = o;
  const shape = th.fixedShape ? 'auto' : wanted;
  const SUBTEXT = (caption || '').trim() || SUB;
  try { await document.fonts.load('700 100px Fredoka'); } catch {}
  const srcs = await Promise.all(tiles.map((t) => load(t.url)));
  const imgs = srcs.map((im, k) => prep(im, FILTERS[flt], k + 7));
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); const F = 'Fredoka, sans-serif';
  const pw = 3 * T + 2 * G, gridBottom = TOP + pw, rnd = rng(seed * 977 + 13);
  const now = new Date();
  const date = now.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
  const stamp = `'${String(now.getFullYear()).slice(2)} ${now.getMonth() + 1} ${now.getDate()}`;
  const spaced = (v) => { if ('letterSpacing' in x) x.letterSpacing = v; };

  // ── background ──
  const bg = x.createLinearGradient(0, 0, 0, H);
  th.bg.forEach((col, n) => bg.addColorStop(n / Math.max(th.bg.length - 1, 1), col));
  x.fillStyle = bg; x.fillRect(0, 0, W, H);
  th.blobs?.forEach(([a, b, r, col]) => { x.fillStyle = `rgba(${col})`; x.beginPath(); x.arc(a, b, r, 0, TAU); x.fill(); });
  if (th.dotgrid) {
    x.fillStyle = 'rgba(91,42,27,.13)';
    for (let yy = 40; yy < H; yy += 54) for (let xx = 40; xx < W; xx += 54) { x.beginPath(); x.arc(xx, yy, 3, 0, TAU); x.fill(); }
  }
  if (th.gingham) {
    x.fillStyle = `rgba(${th.gingham},.22)`;
    for (let xx = 0; xx < W; xx += 110) x.fillRect(xx, 0, 55, H);
    for (let yy = 0; yy < H; yy += 110) x.fillRect(0, yy, W, 55);
  }
  if (th.paper || th.felt) {                              // rice-paper / felt speckle
    const pr = rng(99);
    for (let i = 0; i < 900; i++) { x.fillStyle = th.felt ? `rgba(255,255,255,${0.02 + pr() * 0.05})` : `rgba(90,75,60,${0.05 + pr() * 0.12})`; x.beginPath(); x.arc(pr() * W, pr() * H, 0.6 + pr() * 1.8, 0, TAU); x.fill(); }
  }
  if (th.planks) {                                        // wooden table boards
    x.strokeStyle = 'rgba(120,80,30,.2)'; x.lineWidth = 4;
    for (let yy = 150; yy < H; yy += 210) { x.beginPath(); x.moveTo(0, yy); x.lineTo(W, yy); x.stroke(); }
    x.strokeStyle = 'rgba(120,80,30,.08)'; x.lineWidth = 2;
    for (let i = 0; i < 40; i++) { const px = rnd() * W, py = rnd() * H; x.beginPath(); x.moveTo(px, py); x.lineTo(px + 120 + rnd() * 160, py + (rnd() - 0.5) * 6); x.stroke(); }
  }
  if (th.lattice) {                                       // window-lattice diamonds + big moon-gate ring
    x.strokeStyle = 'rgba(233,217,166,.08)'; x.lineWidth = 2; x.beginPath();
    for (let d = -H; d < W + H; d += 72) { x.moveTo(d, 0); x.lineTo(d + H, H); x.moveTo(d + H, 0); x.lineTo(d, H); }
    x.stroke();
    x.strokeStyle = 'rgba(233,217,166,.4)'; x.lineWidth = 7; x.beginPath(); x.arc(W / 2, TOP + pw / 2, 690, 0, TAU); x.stroke();
    x.lineWidth = 2; x.beginPath(); x.arc(W / 2, TOP + pw / 2, 712, 0, TAU); x.stroke();
  }
  if (th.confetti) {
    const cr = rng(31);
    for (let i = 0; i < 70; i++) {
      const fx = cr() * W, fy = cr() * H, a = cr() * TAU, z = 10 + cr() * 14;
      if (fy > TOP - 30 && fy < gridBottom + 30 && fx > L - 30 && fx < L + pw + 30) continue;
      x.save(); x.translate(fx, fy); x.rotate(a); x.globalAlpha = 0.35 + cr() * 0.3; x.fillStyle = '#e8b84f';
      x.beginPath(); x.moveTo(-z, z * 0.3); x.quadraticCurveTo(-z * 0.2, -z * 0.9, z, -z * 0.3); x.quadraticCurveTo(z * 0.2, z * 0.8, -z, z * 0.3); x.fill(); x.restore();
    }
  }
  if (th.fret) { fret(x, 64, W, 40, th.fret); fret(x, H - 104, W, 40, th.fret); }
  if (th.airmail) {                                       // red-white-blue airmail border
    const cols = ['#c8102e', '#ffffff', '#1c4a9c', '#ffffff'];
    const bar = (len) => { for (let i = -1, xx = -40; xx < len + 40; i++, xx += 40) { x.fillStyle = cols[((i % 4) + 4) % 4]; x.beginPath(); x.moveTo(xx, 26); x.lineTo(xx + 18, 0); x.lineTo(xx + 58, 0); x.lineTo(xx + 40, 26); x.fill(); } };
    [[0, 0, 0, W], [W, 0, Math.PI / 2, H], [W, H, Math.PI, W], [0, H, -Math.PI / 2, H]].forEach(([tx, ty, ang, len]) => {
      x.save(); x.translate(tx, ty); x.rotate(ang); x.beginPath(); x.rect(0, 0, len, 26); x.clip(); bar(len); x.restore();
    });
  }
  if (th.lanternString) {                                 // paper lanterns hanging from a string
    const sy = (t) => (1 - t) ** 2 * 70 + 2 * (1 - t) * t * 150 + t * t * 70, sx = (t) => (1 - t) ** 2 * -10 + 2 * (1 - t) * t * (W / 2) + t * t * (W + 10);
    x.strokeStyle = '#f0c36a'; x.lineWidth = 5; x.beginPath();
    for (let t = 0; t <= 1.001; t += 0.02) (t === 0 ? x.moveTo(sx(t), sy(t)) : x.lineTo(sx(t), sy(t))); x.stroke();
    for (let i = 0; i < 7; i++) {
      const t = (i + 0.5) / 7, sz2 = 140 + (i % 3) * 12;
      x.save(); x.translate(sx(t), sy(t) + sz2 * 0.5); x.rotate(Math.sin(i * 2.1) * 0.06);
      drawSticker(x, i === 3 ? 'sky' : 'lantern', sz2, 0, false, true); x.restore();
    }
  }
  if (th.sign) {                                          // glowing OPEN sign
    x.save(); x.textAlign = 'center'; x.shadowColor = '#ff2e93'; x.shadowBlur = 26; x.strokeStyle = '#ff2e93'; x.lineWidth = 7;
    rr(x, W / 2 - 190, 120, 380, 120, 30); x.stroke(); x.stroke();
    x.shadowColor = '#2ee6ff'; x.fillStyle = '#d9fbff'; x.font = `700 78px ${F}`; spaced('12px'); x.fillText('OPEN', W / 2 + 6, 203); x.restore();
  }
  if (th.arcade) {                                        // score line + pixel-heart lives
    x.save(); x.textAlign = 'center'; x.font = '700 34px "Courier New", monospace'; x.fillStyle = '#ff4fd8'; spaced('3px');
    x.fillText('1UP  000900   HI-SCORE  999999', W / 2, 150); x.restore();
    const HE = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'], ox0 = W / 2 - (9 * 35 + 8 * 12) / 2;
    for (let h = 0; h < 9; h++) HE.forEach((row, ry) => [...row].forEach((ch, cx) => {
      if (ch === 'X') { x.fillStyle = ry < 2 && cx < 3 && (ry === 0 || cx === 1) ? '#ff9aa8' : '#ff3b4f'; x.fillRect(ox0 + h * 47 + cx * 5, 195 + ry * 5, 5, 5); }
    }));
    const sr = rng(5); x.fillStyle = 'rgba(255,255,255,.55)';
    for (let i = 0; i < 40; i++) { const sz3 = sr() > 0.8 ? 6 : 4; x.fillRect(Math.round(sr() * W / 4) * 4, Math.round(sr() * H / 4) * 4, sz3, sz3); }
  }
  if (th.bag) {                                           // takeaway bag: crinkles, handles, red THANK YOU
    const br = rng(7); x.lineWidth = 2;
    for (let i = 0; i < 18; i++) {
      x.strokeStyle = br() > 0.5 ? `rgba(255,255,255,${0.35 + br() * 0.4})` : `rgba(140,150,165,${0.15 + br() * 0.2})`;
      const px = br() * W, py = br() * H; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (br() - 0.5) * 360, py + (br() - 0.3) * 300); x.stroke();
    }
    x.lineCap = 'round';
    for (const hx of [230, 680]) {
      x.beginPath(); x.moveTo(hx, 156); x.bezierCurveTo(hx, 0, hx + 170, 0, hx + 170, 156);
      x.strokeStyle = 'rgba(120,130,145,.35)'; x.lineWidth = 17; x.stroke(); x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 9; x.stroke();
    }
    x.strokeStyle = 'rgba(120,130,145,.25)'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, 162); x.lineTo(W, 162); x.stroke();
    x.textAlign = 'center'; x.fillStyle = th.hdr; fit(x, 'THANK YOU', 92, 700, 860, F); x.fillText('THANK YOU', W / 2, 246);
  }

  // ── header ──
  x.textAlign = 'center'; x.fillStyle = th.hdr;
  x.font = `600 34px ${F}`; spaced('8px');
  x.fillText(`CHINATOWN, SYDNEY, ${date}`, W / 2, TOP - 130);
  spaced('0px');

  // ── what sits behind the grid ──
  let box = [L, TOP, pw, pw];
  if (th.card) { box = [L - 40, TOP - 40, pw + 80, pw + 150]; rr(x, ...box, 44); x.fillStyle = th.card; x.fill(); }
  if (th.frame === 'film') {
    box = [L - 52, TOP - 34, pw + 104, pw + 68];
    rr(x, ...box, 28); x.fillStyle = '#0c0807'; x.fill();
    x.fillStyle = th.bg[0];
    for (let yy = TOP - 12; yy < gridBottom + 6; yy += 52) for (const hx of [L - 36, L + pw + 14]) { rr(x, hx, yy, 22, 32, 6); x.fill(); }
    x.fillStyle = '#ff9f43'; x.font = `600 18px ${F}`; spaced('6px');
    x.fillText('SAFETY FILM 400', W / 2, gridBottom + 26); spaced('0px');
  }

  // ── the nine photos ──
  tiles.forEach((_, k) => {
    const [a, b] = xy(k), cx = a + T / 2, cy = b + T / 2;
    if (th.frame === 'polaroid' || th.frame === 'scrap') {
      const pol = th.frame === 'polaroid', m = pol ? 14 : 12, bot = pol ? 58 : 12;
      x.save(); x.translate(cx, cy); x.rotate((rnd() - 0.5) * (pol ? 0.07 : 0.1)); x.translate(-T / 2, -T / 2);
      x.shadowColor = 'rgba(40,10,10,.3)'; x.shadowBlur = 18; x.shadowOffsetY = 8;
      rr(x, 0, 0, T, T, pol ? 6 : 4); x.fillStyle = '#fffdf8'; x.fill();
      x.shadowColor = 'rgba(0,0,0,0)';
      x.save(); x.beginPath(); x.rect(m, m, T - 2 * m, T - m - bot); x.clip(); cover(x, imgs[k], m, m, T - 2 * m, T - m - bot); x.restore();
      if (pol) { x.fillStyle = th.ink; x.font = `500 25px ${F}`; x.fillText(`red no.${k + 1} ♥`, T / 2, T - 20); }
      else {
        x.save(); x.translate(T / 2 + (rnd() - 0.5) * 60, 4); x.rotate((rnd() - 0.5) * 0.5);
        x.fillStyle = `rgba(${th.tape[k % th.tape.length]},.78)`; x.fillRect(-48, -15, 96, 30); x.restore();
      }
      x.restore(); return;
    }
    if (th.frame === 'mahjong') {                         // ivory tile with a green back edge
      x.save(); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 16; x.shadowOffsetY = 8;
      rr(x, a, b + 16, T, T - 16, 24); x.fillStyle = '#38c286'; x.fill(); x.restore();
      rr(x, a, b + 16, T, T - 16, 24); x.save(); x.clip(); x.fillStyle = '#23996a'; x.fillRect(a, b + T - 24, T, 24); x.restore();
      rr(x, a, b, T, T - 18, 24); x.fillStyle = '#fbf5e1'; x.fill(); x.strokeStyle = '#e2d6b0'; x.lineWidth = 3; x.stroke();
      x.save(); rr(x, a + 16, b + 16, T - 32, T - 18 - 32, 12); x.clip(); cover(x, imgs[k], a + 16, b + 16, T - 32, T - 50); x.restore();
      return;
    }
    if (th.frame === 'steamer') {                         // bamboo steamer basket
      const R = T / 2;
      x.save(); x.shadowColor = 'rgba(60,30,10,.4)'; x.shadowBlur = 16; x.shadowOffsetY = 8;
      x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.fillStyle = '#d3a266'; x.fill(); x.restore();
      x.strokeStyle = '#a8742f'; x.lineWidth = 4; x.beginPath(); x.arc(cx, cy, R - 7, 0, TAU); x.stroke();
      x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, R - 19, 0, TAU); x.stroke();
      x.strokeStyle = '#e8c28a'; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, R - 2, Math.PI * 0.9, Math.PI * 1.55); x.stroke();
      x.save(); x.beginPath(); x.arc(cx, cy, R - 26, 0, TAU); x.clip(); cover(x, imgs[k], cx - R + 26, cy - R + 26, T - 52, T - 52); x.restore();
      x.strokeStyle = '#fff6e0'; x.lineWidth = 4; x.beginPath(); x.arc(cx, cy, R - 26, 0, TAU); x.stroke();
      return;
    }
    if (th.frame === 'stamp') {                           // postage stamp
      x.save(); x.shadowColor = 'rgba(60,40,20,.35)'; x.shadowBlur = 14; x.shadowOffsetY = 6;
      stampPath(x, a, b, T, T, 12, 6); x.fillStyle = '#fffaf0'; x.fill(); x.restore();
      x.save(); x.beginPath(); x.rect(a + 20, b + 20, T - 40, T - 64); x.clip(); cover(x, imgs[k], a + 20, b + 20, T - 40, T - 64); x.restore();
      x.strokeStyle = 'rgba(0,0,0,.18)'; x.lineWidth = 2; x.strokeRect(a + 20, b + 20, T - 40, T - 64);
      x.fillStyle = '#b3151f'; x.font = `600 20px ${F}`; x.textAlign = 'left'; x.fillText('CHINATOWN', a + 22, b + T - 16);
      x.textAlign = 'right'; x.fillText('90c', a + T - 22, b + T - 16); x.textAlign = 'center';
      return;
    }
    if (th.frame === 'moongate') {                        // round photos with a gold ring
      const R = T / 2;
      x.save(); x.shadowColor = 'rgba(233,217,166,.45)'; x.shadowBlur = 22;
      x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.fillStyle = '#e9d9a6'; x.fill(); x.restore();
      x.save(); x.beginPath(); x.arc(cx, cy, R - 8, 0, TAU); x.clip(); cover(x, imgs[k], a + 8, b + 8, T - 16, T - 16); x.restore();
      return;
    }
    // plain tiles (can take a different photo shape)
    x.save();
    if (th.sh) { x.shadowColor = th.sh[0]; x.shadowBlur = th.sh[1]; x.shadowOffsetY = th.sh[2]; x.shadowOffsetX = th.sh[3]; }
    shapePath(x, a, b, T, T, shape, th.r); x.fillStyle = th.bc || '#fff'; x.fill(); x.restore();
    x.save(); shapePath(x, a, b, T, T, shape, th.r); x.clip(); cover(x, imgs[k], a, b, T, T); x.restore();
    if (th.bw) { shapePath(x, a + th.bw / 2, b + th.bw / 2, T - th.bw, T - th.bw, shape, Math.max(th.r - th.bw / 2, 0)); x.lineWidth = th.bw; x.strokeStyle = th.bc; x.stroke(); }
    if (th.neon) {                                        // glowing neon outline, colour changes tile to tile
      const col = th.neon[k % th.neon.length];
      x.save(); x.shadowColor = col; x.shadowBlur = 24; x.strokeStyle = col; x.lineWidth = 6;
      shapePath(x, a + 3, b + 3, T - 6, T - 6, shape, Math.max(th.r - 3, 0)); x.stroke(); x.stroke(); x.restore();
    }
    if (th.frame === 'film') {
      x.save(); x.textAlign = 'left'; x.font = `600 22px ${F}`; x.fillStyle = '#ff9f43';
      x.shadowColor = 'rgba(0,0,0,.75)'; x.shadowBlur = 4; x.fillText(`${k + 1}A`, a + 14, b + T - 14); x.restore();
    }
    if (th.stamp) {
      x.save(); x.textAlign = 'right'; x.font = '600 24px "Courier New", monospace'; x.fillStyle = '#ff9d4d';
      x.shadowColor = 'rgba(255,140,60,.9)'; x.shadowBlur = 8; x.fillText(stamp, a + T - 14, b + T - 14); x.restore();
    }
  });

  if (th.frame === 'stamp') {                             // postmark with wavy cancel lines
    x.save(); const px = L + pw - 30, py2 = TOP + 10; x.strokeStyle = 'rgba(50,35,30,.55)'; x.fillStyle = 'rgba(50,35,30,.62)'; x.textAlign = 'center';
    x.lineWidth = 4; x.beginPath(); x.arc(px, py2, 58, 0, TAU); x.stroke(); x.lineWidth = 2; x.beginPath(); x.arc(px, py2, 46, 0, TAU); x.stroke();
    x.font = `700 20px ${F}`; x.fillText('SYDNEY', px, py2 + 2); x.font = `600 15px ${F}`; x.fillText(date.split(' ').slice(0, 2).join(' '), px, py2 + 22);
    x.lineWidth = 3;
    for (let j = 0; j < 4; j++) { x.beginPath(); for (let t = 0; t <= 260; t += 8) { const yy = py2 - 26 + j * 17 + Math.sin(t / 14) * 5; (t ? x.lineTo : x.moveTo).call(x, px - 70 - t, yy); } x.stroke(); }
    x.restore();
  }

  // ── caption + colour sheet (leave room underneath for stickers hanging off the grid) ──
  let py;
  if (th.card) {
    x.fillStyle = th.ink; fit(x, SUBTEXT, 36, 600, 940, F); x.fillText(SUBTEXT, W / 2, gridBottom + 76);
    py = TOP - 40 + pw + 150 + 84;
  } else py = (th.frame === 'film' ? gridBottom + 34 : gridBottom) + 84;

  x.save(); x.beginPath(); x.rect(L, py, pw, 48); x.clip();               // straight ends, no rounding
  tiles.forEach((t, k) => { x.fillStyle = t.color; x.fillRect(L + (k * pw) / COUNT, py, pw / COUNT + 1, 48); }); x.restore();

  if (!th.card) { x.fillStyle = th.ink; fit(x, SUBTEXT, 40, 600, 940, F); x.fillText(SUBTEXT, W / 2, py + 138); }
  if (th.bag) { x.fillStyle = th.hdr; x.font = `600 32px ${F}`; spaced('8px'); x.fillText('HAVE A NICE DAY', W / 2, py + 220); spaced('0px'); }

  if (th.paper) {                                         // red seal stamp, like a signed ink painting
    x.save(); x.translate(W - 130, py + 250); x.rotate(-0.05);
    x.fillStyle = '#c8102e'; rr(x, -44, -44, 88, 88, 8); x.fill();
    x.strokeStyle = '#f7efe2'; x.lineWidth = 5; x.lineCap = 'square';
    x.strokeRect(-30, -30, 60, 60);
    x.beginPath(); x.moveTo(0, -30); x.lineTo(0, -6); x.moveTo(-30, 0); x.lineTo(30, 0); x.moveTo(0, 8); x.lineTo(0, 30); x.moveTo(-14, 16); x.lineTo(14, 16); x.stroke();
    x.restore();
  }
  if (th.arcade) {                                        // CRT scanlines over everything but the stickers
    x.fillStyle = 'rgba(0,0,0,.16)'; for (let yy = 0; yy < H; yy += 4) x.fillRect(0, yy, W, 1.6);
  }

  paint(x, pack, seed, box, size);

  const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
  return { blob, url: URL.createObjectURL(blob) };
}