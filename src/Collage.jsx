import { useEffect, useState } from 'react';
import { shrink } from './util.js';
import { NAME } from './story.js';

const COUNT = 9;                       // 3x3 grid, one photo per panel
let cache = Array(COUNT).fill(null);   // keeps photos if she navigates away and back
let themeCache = 0; // remembers her chosen style if she navigates away and back

// hdr = header text colour, ink = caption/wordmark colour, card = optional panel behind the grid,
// r = tile corner radius, bw/bc = tile border width/colour, sh = [colour, blur, offsetY, offsetX]
const THEMES = [
  { id: 'booth', name: 'Photo Booth', dots: ['#b3151f', '#f4ece0'],
    bg: ['#b3151f', '#8f0f18'], blobs: [], hdr: '#f4ece0', ink: '#b3151f',
    card: '#f4ece0', word: 'RED ROOM', r: 12, bw: 0, bc: '#f4ece0', sh: null },
  { id: 'blush', name: 'Blush', dots: ['#fff7e8', '#ff6f59'],
    bg: ['#fff7e8', '#ffdcd0'], hdr: '#c8102e', ink: '#10282c', card: null, r: 40, bw: 8, bc: '#ffffff',
    sh: ['rgba(120,20,30,.28)', 30, 12, 0],
    blobs: [[980, 150, 320, '255,111,89,.22'], [60, 1790, 360, '255,176,46,.26'], [1020, 1480, 200, '126,224,192,.25']] },
  { id: 'ruby', name: 'Midnight Ruby', dots: ['#1a070c', '#ff3b4f'],
    bg: ['#1a070c', '#3a0a14'], hdr: '#ff6b7a', ink: '#ffe3e3', card: null, r: 36, bw: 5, bc: '#ff3b4f',
    sh: ['rgba(255,59,79,.55)', 36, 0, 0],
    blobs: [[900, 200, 380, '255,59,79,.2'], [100, 1700, 420, '255,59,79,.16']] },
  { id: 'mango', name: 'Mango Sunset', dots: ['#e0243b', '#ff9f43'],
    bg: ['#e0243b', '#ff6f59', '#ff9f43'], hdr: '#fff7e8', ink: '#3d0710', card: null, r: 40, bw: 8, bc: '#fff7e8',
    sh: ['rgba(90,10,20,.35)', 30, 12, 0],
    blobs: [[950, 1500, 300, '255,247,232,.18'], [80, 250, 240, '255,247,232,.14']] },
  { id: 'pop', name: 'Pop Poster', dots: ['#d7132a', '#fff3df'],
    bg: ['#d7132a'], hdr: '#fff3df', ink: '#fff3df', card: null, r: 6, bw: 12, bc: '#fff3df',
    sh: ['#5c0710', 0, 14, 14], blobs: [] },
];
const load = (src) => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });

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

async function render(tiles, th) {
  try { await document.fonts.load('700 100px Fredoka'); } catch {}
  const imgs = await Promise.all(tiles.map((t) => load(t.url)));
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); const F = 'Fredoka, sans-serif';
  const pw = 3 * T + 2 * G, gridBottom = TOP + pw;

  const bg = x.createLinearGradient(0, 0, 0, H);
  th.bg.forEach((col, n) => bg.addColorStop(n / Math.max(th.bg.length - 1, 1), col));
  x.fillStyle = bg; x.fillRect(0, 0, W, H);
  th.blobs.forEach(([a, b, r, col]) => { x.fillStyle = `rgba(${col})`; x.beginPath(); x.arc(a, b, r, 0, 6.283); x.fill(); });

  x.textAlign = 'center';
  x.fillStyle = th.hdr; x.font = `600 34px ${F}`; if ('letterSpacing' in x) x.letterSpacing = '10px';
  x.fillText('HAYMARKET · SYDNEY', W / 2, TOP - 70);
  if ('letterSpacing' in x) x.letterSpacing = '0px';

  if (th.card) { rr(x, L - 40, TOP - 40, pw + 80, pw + 230, 44); x.fillStyle = th.card; x.fill(); }

  tiles.forEach((_, k) => {                         // 9 equal panels
    const [a, b] = xy(k);
    x.save();
    if (th.sh) { x.shadowColor = th.sh[0]; x.shadowBlur = th.sh[1]; x.shadowOffsetY = th.sh[2]; x.shadowOffsetX = th.sh[3]; }
    rr(x, a, b, T, T, th.r); x.fillStyle = th.bc; x.fill(); x.restore();
    x.save(); rr(x, a, b, T, T, th.r); x.clip(); cover(x, imgs[k], a, b, T, T); x.restore();
    if (th.bw) { rr(x, a + th.bw / 2, b + th.bw / 2, T - th.bw, T - th.bw, Math.max(th.r - th.bw / 2, 0)); x.lineWidth = th.bw; x.strokeStyle = th.bc; x.stroke(); }
  });

  const caption = `a colour story by ${NAME} · ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  let py;
  if (th.card) {                                    // wordmark + caption sit inside the card
    x.fillStyle = th.ink; x.font = `700 62px ${F}`; x.fillText(th.word, W / 2, gridBottom + 95);
    x.font = `500 30px ${F}`; x.fillText(caption, W / 2, gridBottom + 150);
    py = TOP - 40 + pw + 230 + 40;
  } else py = gridBottom + 52;

  x.save(); rr(x, L, py, pw, 48, 24); x.clip();     // colour sheet
  tiles.forEach((t, k) => { x.fillStyle = t.color; x.fillRect(L + (k * pw) / COUNT, py, pw / COUNT + 1, 48); }); x.restore();

  if (!th.card) { x.fillStyle = th.ink; x.font = `500 38px ${F}`; x.fillText(caption, W / 2, py + 138); }

  const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
  return { blob, url: URL.createObjectURL(blob) };
}

export default function Collage({ onDone }) {
  const [tiles, setTiles] = useState(cache);
  const [out, setOut] = useState(null);
  const [err, setErr] = useState('');
  const [theme, setTheme] = useState(themeCache);
  const [making, setMaking] = useState(false);
  const count = tiles.filter(Boolean).length, all = count === COUNT;

  useEffect(() => {
    if (!all) { setOut(null); return; }
    let live = true; setMaking(true);
    render(tiles, THEMES[theme]).then((o) => { if (live) { setOut(o); setMaking(false); onDone(); } });
    return () => { live = false; };
  }, [tiles, theme]);

  async function pick(k, file) {
    if (!file) return;
    setErr('');
    try {
      const blob = await shrink(file), url = URL.createObjectURL(blob);
      const color = vivid(await load(url));
      setTiles((t) => { const n = [...t]; n[k] = { url, color }; cache = n; return n; });
      fetch('/api/upload?name=red-' + (k + 1), { method: 'POST', headers: { 'Content-Type': 'image/jpeg' }, body: blob }).catch(() => {});
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
          <img className={'final' + (making ? ' dim' : '')} src={out.url} alt="Your colour story" />
          <button className="btn go csave" onClick={save}>Save / share to Instagram</button>
          <p className="cmeta">Or long-press the picture to save it.</p>
        </>
      )}
    </div>
  );
}