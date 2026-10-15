import { useEffect, useState } from 'react';
import { shrink } from './util.js';
import { uploadPhoto } from './upload.js';
import { NAME } from './story.js';

const COUNT = 9;                       // 3x3 grid, one photo per panel
let cache = Array(COUNT).fill(null);   // keeps photos if she navigates away and back
let themeCache = 0, packCache = 1, seedCache = 1; // remembers her style / stickers if she navigates away and back
 
// frame: how the nine photos are presented
//   plain    flat tiles (r radius, bw/bc border, sh shadow); optional card behind the grid
//   polaroid Instax-style white cards with a caption strip, slightly crooked
//   film     35mm film strip: dark band, sprocket holes, orange frame numbers
//   scrap    scrapbook prints held down with washi tape
// pal = sticker colours, bg/blobs/hdr/ink = colours
const THEMES = [
  { id: 'booth', name: 'Photo Booth', dots: ['#b3151f', '#f4ece0'], frame: 'plain',
    bg: ['#b3151f', '#8f0f18'], blobs: [], hdr: '#f4ece0', ink: '#b3151f', card: '#f4ece0',
    r: 12, bw: 0, bc: '#f4ece0', sh: null, pal: ['#ffb3c1', '#ffbf34', '#ffffff', '#ff6f59'] },
  { id: 'instax', name: 'Instax', dots: ['#fff7e8', '#ff6f59'], frame: 'polaroid',
    bg: ['#fff7e8', '#ffdcd0'], hdr: '#c8102e', ink: '#7a1b24', card: null,
    pal: ['#ffffff', '#ffb3c1', '#ff6f59', '#ffbf34'],
    blobs: [[980, 150, 320, '255,111,89,.22'], [60, 1790, 360, '255,176,46,.26'], [1020, 1480, 200, '147,178,31,.22']] },
  { id: 'film', name: 'Film Roll', dots: ['#17110f', '#ff9f43'], frame: 'film',
    bg: ['#2a1f1c', '#120c0a'], blobs: [], hdr: '#ff9f43', ink: '#ffb86b', card: null,
    r: 4, pal: ['#ff9f43', '#ffffff', '#ff3b4f', '#ffd98a'] },
  { id: 'scrap', name: 'Scrapbook', dots: ['#e8d2a6', '#ffbf34'], frame: 'scrap', dotgrid: true,
    bg: ['#f3e3c3', '#e8d2a6'], blobs: [], hdr: '#b3151f', ink: '#5b2a1b', card: null,
    tape: ['255,191,52', '255,111,89', '147,178,31', '111,176,230'],
    pal: ['#ffffff', '#ffb3c1', '#ff6f59', '#ffbf34'] },
  { id: 'sunny', name: 'Sunny Side', dots: ['#FFBF34', '#004B87'], frame: 'plain',
    bg: ['#FFBF34', '#ffd36b'], hdr: '#004B87', ink: '#004B87', card: null,
    r: 40, bw: 8, bc: '#ffffff', sh: ['rgba(0,49,90,.3)', 28, 12, 0],
    pal: ['#ffffff', '#004B87', '#93B21F', '#ff6f59'],
    blobs: [[960, 160, 300, '255,255,255,.28'], [90, 1740, 340, '0,75,135,.12'], [1010, 1500, 200, '147,178,31,.3']] },
  { id: 'ruby', name: 'Midnight Ruby', dots: ['#1a070c', '#ff3b4f'], frame: 'plain',
    bg: ['#1a070c', '#3a0a14'], hdr: '#ff6b7a', ink: '#ffe3e3', card: null,
    r: 36, bw: 5, bc: '#ff3b4f', sh: ['rgba(255,59,79,.55)', 36, 0, 0],
    pal: ['#ff3b4f', '#ff6b7a', '#ffe3e3', '#ffbf34'],
    blobs: [[900, 200, 380, '255,59,79,.2'], [100, 1700, 420, '255,59,79,.16']] },
  { id: 'pop', name: 'Pop Poster', dots: ['#d7132a', '#fff3df'], frame: 'plain',
    bg: ['#d7132a'], hdr: '#fff3df', ink: '#fff3df', card: null,
    r: 6, bw: 12, bc: '#fff3df', sh: ['#5c0710', 0, 14, 14],
    pal: ['#fff3df', '#ffbf34', '#5c0710', '#ffffff'], blobs: [] },
];
 
// Sticker packs: drawn ones (petals/hearts/sparkles) take the theme's colours, emoji packs use glyphs
const PACKS = [
  { id: 'none', name: 'None', icon: '🚫' },
  { id: 'petals', name: 'Petals', icon: '🌸' },
  { id: 'hearts', name: 'Hearts', icon: '💖' },
  { id: 'sparkle', name: 'Sparkles', icon: '✨' },
  { id: 'cherry', name: 'Cherries', icon: '🍒', glyphs: ['🍒', '🍓', '🌶️', '❤️'] },
  { id: 'tropic', name: 'Tropical', icon: '🥭', glyphs: ['🥭', '🥥', '🌴', '🌺'] },
  { id: 'bows', name: 'Bows', icon: '🎀', glyphs: ['🎀', '💌', '🧸', '💗'] },
  { id: 'silly', name: 'Silly', icon: '😎', glyphs: ['😎', '👀', '💅', '🤪', '🔥'] },
];
 
const SUB = `Colour matching through ${NAME}'s lens`;
const load = (src) => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
// small seeded random so stickers stay put until she hits Shuffle
const rng = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
 
// Most vivid colour in the photo (weights pixels by saturation)
function vivid(img) {
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
 
// ---- 1080x1920 Instagram story export ----
const W = 1080, H = 1920, G = 22, T = 298, L = (W - 3 * T - 2 * G) / 2, TOP = 440;
const xy = (p) => [L + (p % 3) * (T + G), TOP + Math.floor(p / 3) * (T + G)];
function rr(x, a, b, w, h, r) {
  x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r);
  x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath();
}
function cover(x, im, a, b, w, h) {
  const s = Math.max(w / im.width, h / im.height), dw = im.width * s, dh = im.height * s;
  x.drawImage(im, a + (w - dw) / 2, b + (h - dh) / 2, dw, dh);
}
// shrink the font until the text fits maxW
function fit(x, text, size, weight, maxW, F) {
  let s = size; x.font = `${weight} ${s}px ${F}`;
  while (x.measureText(text).width > maxW && s > 20) { s -= 3; x.font = `${weight} ${s}px ${F}`; }
}
 
// Scatter stickers along the border of `box`, plus a few in the empty bands above and below
function paint(x, pack, th, seed, box, topMax) {
  if (pack.id === 'none') return;
  const r = rng(seed * 7919 + pack.id.charCodeAt(0) * 31 + pack.id.length);
  const [bx, by, bw, bh] = box, P = 2 * (bw + bh);
  const N = Math.round(P / (pack.id === 'petals' ? 85 : 105));
  const pts = [];
  for (let i = 0; i < N; i++) {
    const s = ((i + r() * 0.7) / N) * P, o = (r() - 0.35) * 44;   // o: how far outside the edge
    if (s < bw) pts.push([bx + s, by - o]);
    else if (s < bw + bh) pts.push([bx + bw + o, by + (s - bw)]);
    else if (s < 2 * bw + bh) pts.push([bx + bw - (s - bw - bh), by + bh + o]);
    else pts.push([bx - o, by + bh - (s - 2 * bw - bh)]);
  }
  for (let i = 0; i < 5; i++) pts.push([70 + r() * (W - 140), 60 + r() * (topMax - 60)]);
  for (let i = 0; i < 6; i++) pts.push([70 + r() * (W - 140), 1690 + r() * 170]);
 
  pts.forEach(([px, py]) => {
    const s = 34 + r() * 30, col = th.pal[(r() * th.pal.length) | 0];
    x.save(); x.translate(px, py); x.rotate((r() - 0.5) * 1.4);
    x.shadowColor = 'rgba(0,0,0,.22)'; x.shadowBlur = 8; x.shadowOffsetY = 3; x.fillStyle = col;
    if (pack.glyphs) {
      x.font = `${s * 1.05}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText(pack.glyphs[(r() * pack.glyphs.length) | 0], 0, 0);
    } else if (pack.id === 'petals') {
      if (r() < 0.6) {                                   // mini five-petal flower
        for (let k = 0; k < 5; k++) { x.save(); x.rotate(k * 1.2566); x.beginPath(); x.ellipse(0, -s * 0.3, s * 0.17, s * 0.3, 0, 0, 6.283); x.fill(); x.restore(); }
        x.shadowColor = 'transparent'; x.fillStyle = col.toLowerCase() === '#ffbf34' ? '#ffffff' : '#ffbf34';
        x.beginPath(); x.arc(0, 0, s * 0.12, 0, 6.283); x.fill();
      } else { x.beginPath(); x.ellipse(0, 0, s * 0.16, s * 0.3, 0, 0, 6.283); x.fill(); }   // loose petal
    } else if (pack.id === 'hearts') {
      x.beginPath(); x.moveTo(0, s * 0.42);
      x.bezierCurveTo(-s * 0.62, s * 0.02, -s * 0.42, -s * 0.42, 0, -s * 0.12);
      x.bezierCurveTo(s * 0.42, -s * 0.42, s * 0.62, s * 0.02, 0, s * 0.42); x.fill();
    } else {                                              // sparkle
      const h = s * 0.55;
      x.beginPath(); x.moveTo(0, -h); x.quadraticCurveTo(0, 0, h, 0); x.quadraticCurveTo(0, 0, 0, h);
      x.quadraticCurveTo(0, 0, -h, 0); x.quadraticCurveTo(0, 0, 0, -h); x.fill();
    }
    x.restore();
  });
}
 
async function render(tiles, th, pack, seed) {
  try { await document.fonts.load('700 100px Fredoka'); } catch {}
  const imgs = await Promise.all(tiles.map((t) => load(t.url)));
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); const F = 'Fredoka, sans-serif';
  const pw = 3 * T + 2 * G, gridBottom = TOP + pw, rnd = rng(seed * 977 + 13);
  const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
 
  // background
  const bg = x.createLinearGradient(0, 0, 0, H);
  th.bg.forEach((col, n) => bg.addColorStop(n / Math.max(th.bg.length - 1, 1), col));
  x.fillStyle = bg; x.fillRect(0, 0, W, H);
  th.blobs?.forEach(([a, b, r, col]) => { x.fillStyle = `rgba(${col})`; x.beginPath(); x.arc(a, b, r, 0, 6.283); x.fill(); });
  if (th.dotgrid) {
    x.fillStyle = 'rgba(91,42,27,.13)';
    for (let yy = 40; yy < H; yy += 54) for (let xx = 40; xx < W; xx += 54) { x.beginPath(); x.arc(xx, yy, 3, 0, 6.283); x.fill(); }
  }
 
  // headline + header
  x.textAlign = 'center'; x.fillStyle = th.hdr;
  x.font = `600 30px ${F}`; if ('letterSpacing' in x) x.letterSpacing = '8px';
  x.fillText(`CHINATOWN, SYDNEY, ${date}`, W / 2, TOP - 70);
  if ('letterSpacing' in x) x.letterSpacing = '0px';
 
  // what sits behind the grid
  let box = [L, TOP, pw, pw];
  if (th.card) { box = [L - 40, TOP - 40, pw + 80, pw + 150]; rr(x, ...box, 44); x.fillStyle = th.card; x.fill(); }
  if (th.frame === 'film') {
    box = [L - 52, TOP - 34, pw + 104, pw + 68];
    rr(x, ...box, 28); x.fillStyle = '#0c0807'; x.fill();
    x.fillStyle = th.bg[0];                                       // sprocket holes
    for (let yy = TOP - 12; yy < gridBottom + 6; yy += 52) for (const hx of [L - 36, L + pw + 14]) { rr(x, hx, yy, 22, 32, 6); x.fill(); }
    x.fillStyle = '#ff9f43'; x.font = `600 18px ${F}`; if ('letterSpacing' in x) x.letterSpacing = '6px';
    x.fillText('SAFETY FILM 400', W / 2, gridBottom + 26);
    if ('letterSpacing' in x) x.letterSpacing = '0px';
  }
 
  // the nine photos
  tiles.forEach((_, k) => {
    const [a, b] = xy(k);
    if (th.frame === 'polaroid' || th.frame === 'scrap') {
      const pol = th.frame === 'polaroid', m = pol ? 14 : 12, bot = pol ? 58 : 12;
      x.save(); x.translate(a + T / 2, b + T / 2); x.rotate((rnd() - 0.5) * (pol ? 0.07 : 0.1)); x.translate(-T / 2, -T / 2);
      x.shadowColor = 'rgba(40,10,10,.3)'; x.shadowBlur = 18; x.shadowOffsetY = 8;
      rr(x, 0, 0, T, T, pol ? 6 : 4); x.fillStyle = '#fffdf8'; x.fill();
      x.shadowColor = 'rgba(0,0,0,0)';
      x.save(); x.beginPath(); x.rect(m, m, T - 2 * m, T - m - bot); x.clip(); cover(x, imgs[k], m, m, T - 2 * m, T - m - bot); x.restore();
      if (pol) { x.fillStyle = th.ink; x.font = `500 25px ${F}`; x.fillText(`red no.${k + 1} ♥`, T / 2, T - 20); }
      else {
        x.save(); x.translate(T / 2 + (rnd() - 0.5) * 60, 4); x.rotate((rnd() - 0.5) * 0.5);
        x.fillStyle = `rgba(${th.tape[k % th.tape.length]},.78)`; x.fillRect(-48, -15, 96, 30); x.restore();
      }
      x.restore();
      return;
    }
    x.save();
    if (th.sh) { x.shadowColor = th.sh[0]; x.shadowBlur = th.sh[1]; x.shadowOffsetY = th.sh[2]; x.shadowOffsetX = th.sh[3]; }
    rr(x, a, b, T, T, th.r); x.fillStyle = th.bc || '#fff'; x.fill(); x.restore();
    x.save(); rr(x, a, b, T, T, th.r); x.clip(); cover(x, imgs[k], a, b, T, T); x.restore();
    if (th.bw) { rr(x, a + th.bw / 2, b + th.bw / 2, T - th.bw, T - th.bw, Math.max(th.r - th.bw / 2, 0)); x.lineWidth = th.bw; x.strokeStyle = th.bc; x.stroke(); }
    if (th.frame === 'film') {
      x.save(); x.textAlign = 'left'; x.font = `600 22px ${F}`; x.fillStyle = '#ff9f43';
      x.shadowColor = 'rgba(0,0,0,.75)'; x.shadowBlur = 4; x.fillText(`${k + 1}A`, a + 14, b + T - 14); x.restore();
    }
  });
 
  // caption + colour sheet
  let py;
  if (th.card) {                                    // caption sits inside the card
    x.fillStyle = th.ink; fit(x, SUB, 36, 600, 940, F); x.fillText(SUB, W / 2, gridBottom + 76);
    py = TOP - 40 + pw + 150 + 40;
  } else py = (th.frame === 'film' ? gridBottom + 34 : gridBottom) + 52;
 
  x.save(); rr(x, L, py, pw, 48, 24); x.clip();
  tiles.forEach((t, k) => { x.fillStyle = t.color; x.fillRect(L + (k * pw) / COUNT, py, pw / COUNT + 1, 48); }); x.restore();
 
  if (!th.card) { x.fillStyle = th.ink; fit(x, SUB, 40, 600, 940, F); x.fillText(SUB, W / 2, py + 138); }
 
  paint(x, pack, th, seed, box, 320);
 
  const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
  return { blob, url: URL.createObjectURL(blob) };
}
 
export default function Collage({ onDone }) {
  const [tiles, setTiles] = useState(cache);
  const [out, setOut] = useState(null);
  const [err, setErr] = useState('');
  const [theme, setTheme] = useState(themeCache);
  const [pack, setPack] = useState(packCache);
  const [seed, setSeed] = useState(seedCache);
  const [making, setMaking] = useState(false);
  const [lost, setLost] = useState(0);
  const count = tiles.filter(Boolean).length, all = count === COUNT;
 
  useEffect(() => {
    if (!all) { setOut(null); return; }
    let live = true; setMaking(true);
    render(tiles, THEMES[theme], PACKS[pack], seed).then((o) => { if (live) { setOut(o); setMaking(false); onDone(); } });
    return () => { live = false; };
  }, [tiles, theme, pack, seed]);
 
  async function pick(k, file) {
    if (!file) return;
    setErr('');
    try {
      const blob = await shrink(file), url = URL.createObjectURL(blob);
      const color = vivid(await load(url));
      setTiles((t) => { const n = [...t]; n[k] = { url, color }; cache = n; return n; });
      uploadPhoto('red-' + (k + 1), blob).catch(() => setLost((n) => n + 1));
    } catch { setErr("Couldn't read that photo, try another."); }
  }
 
  async function save() {
    const file = new File([out.blob], 'colour-story.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'Colour story' }); return; }
      catch (e) { if (e.name === 'AbortError') return; }
    }
    const a = document.createElement('a'); a.href = out.url; a.download = 'colour-story.png'; a.click();
  }
 
  function choose(n) { themeCache = n; setTheme(n); }
  function choosePack(n) { packCache = n; setPack(n); }
  function shuffle() { seedCache += 1; setSeed(seedCache); }
 
  return (
    <div className="collage">
      <div className="cgrid">
        {tiles.map((t, k) => (
          <label key={k} className={'ct' + (t ? ' has' : '')} style={{ '--i': k }}>
            {t ? <img key={t.url} src={t.url} alt={`Photo ${k + 1}`} /> : <span className="plus" aria-hidden="true">+</span>}
            <input type="file" accept="image/*" aria-label={`Add photo ${k + 1}`}
              onChange={(e) => { const f = e.target.files[0]; e.target.value = ''; pick(k, f); }} />
          </label>
        ))}
      </div>
      {lost > 0 && <p className="cmeta">{lost} photo{lost > 1 ? 's' : ''} didn't back up (weak signal). Your collage is fine.</p>}
      <p className="cmeta">{err || (all ? (out ? 'Your story is ready!' : 'Making your story...') : `${count}/${COUNT} found. Tap a panel to add a photo.`)}</p>
      {out && (
        <>
          <p className="cmeta">Pick a style</p>
          <div className="themes" role="radiogroup" aria-label="Collage style">
            {THEMES.map((t, n) => (
              <button key={t.id} role="radio" aria-checked={n === theme} className={'tchip' + (n === theme ? ' on' : '')} onClick={() => choose(n)}>
                <span className="dots"><i style={{ background: t.dots[0] }} /><i style={{ background: t.dots[1] }} /></span>{t.name}
              </button>
            ))}
          </div>
          <p className="cmeta">Add stickers</p>
          <div className="themes" role="radiogroup" aria-label="Sticker pack">
            {PACKS.map((p, n) => (
              <button key={p.id} role="radio" aria-checked={n === pack} className={'tchip' + (n === pack ? ' on' : '')} onClick={() => choosePack(n)}>
                <span className="ico" aria-hidden="true">{p.icon}</span>{p.name}
              </button>
            ))}
            {pack > 0 && <button className="tchip shuffle" onClick={shuffle}><span className="ico" aria-hidden="true">🎲</span>Shuffle</button>}
          </div>
          <img className={'final' + (making ? ' dim' : '')} src={out.url} alt="Your colour story" />
          <button className="btn go csave" onClick={save}>Save / share to Instagram</button>
          <p className="cmeta">Or long-press the picture to save it.</p>
        </>
      )}
    </div>
  );
}
