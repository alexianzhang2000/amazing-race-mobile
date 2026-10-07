import { useEffect, useState } from 'react';
import { shrink } from './util.js';
import { NAME } from './story.js';

const COUNT = 9;                       // 3x3 grid, one photo per panel
let cache = Array(COUNT).fill(null);   // keeps photos if she navigates away and back

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

async function render(tiles) {
  try { await document.fonts.load('700 100px Fredoka'); } catch {}
  const imgs = await Promise.all(tiles.map((t) => load(t.url)));
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); const F = 'Fredoka, sans-serif';

  const bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#fff7e8'); bg.addColorStop(1, '#ffdcd0');
  x.fillStyle = bg; x.fillRect(0, 0, W, H);
  [[980, 150, 320, '255,111,89,.22'], [60, 1790, 360, '255,176,46,.26'], [1020, 1480, 200, '126,224,192,.25']]
    .forEach(([a, b, r, col]) => { x.fillStyle = `rgba(${col})`; x.beginPath(); x.arc(a, b, r, 0, 6.283); x.fill(); });

  x.textAlign = 'center';
  x.fillStyle = '#c8102e'; x.font = `600 34px ${F}`; if ('letterSpacing' in x) x.letterSpacing = '10px';
  x.fillText('HAYMARKET · SYDNEY', W / 2, 385);
  if ('letterSpacing' in x) x.letterSpacing = '0px';

  tiles.forEach((_, k) => {                         // 9 equal panels
    const [a, b] = xy(k);
    x.save(); x.shadowColor = 'rgba(120,20,30,.28)'; x.shadowBlur = 30; x.shadowOffsetY = 12;
    rr(x, a, b, T, T, 40); x.fillStyle = '#fff'; x.fill(); x.restore();
    x.save(); rr(x, a, b, T, T, 40); x.clip(); cover(x, imgs[k], a, b, T, T); x.restore();
    rr(x, a + 4, b + 4, T - 8, T - 8, 36); x.lineWidth = 8; x.strokeStyle = '#fff'; x.stroke();
  });

  const pw = 3 * T + 2 * G, py = TOP + 3 * T + 2 * G + 52;   // colour sheet under the grid
  x.save(); rr(x, L, py, pw, 48, 24); x.clip();
  tiles.forEach((t, k) => { x.fillStyle = t.color; x.fillRect(L + (k * pw) / COUNT, py, pw / COUNT + 1, 48); }); x.restore();

  x.fillStyle = '#10282c'; x.font = `500 38px ${F}`;
  x.fillText(`a colour story by ${NAME} · ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}`, W / 2, py + 138);

  const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
  return { blob, url: URL.createObjectURL(blob) };
}

export default function Collage({ onDone }) {
  const [tiles, setTiles] = useState(cache);
  const [out, setOut] = useState(null);
  const [err, setErr] = useState('');
  const count = tiles.filter(Boolean).length, all = count === COUNT;

  useEffect(() => {
    if (!all) { setOut(null); return; }
    let live = true;
    render(tiles).then((o) => { if (live) { setOut(o); onDone(); } });
    return () => { live = false; };
  }, [tiles]);

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
          <img className="final" src={out.url} alt="Your colour story" />
          <button className="btn go csave" onClick={save}>Save / share to Instagram</button>
          <p className="cmeta">Or long-press the picture to save it.</p>
        </>
      )}
    </div>
  );
}