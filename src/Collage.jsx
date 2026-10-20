import { useEffect, useRef, useState } from 'react';
import { shrink } from './util.js';
import { uploadPhoto } from './upload.js';
import { COUNT, THEMES, PACKS, FILTERS, SUB, load, vivid, render, prep, cover, hasFx } from './Collageart.js';
import { drawSticker } from './stickers.js';

// Shared by the two screens below (photos step + styling step), and kept if she navigates away and back
let cache = Array(COUNT).fill(null);
let themeCache = 0, packCache = 1, seedCache = 1, filterCache = 0, shapeCache = 'auto', sizeCache = 1, captionCache = '';

// ───────────── Screen 1: collect the nine photos ─────────────
export default function Collage({ onDone }) {
  const [tiles, setTiles] = useState(cache);
  const [err, setErr] = useState('');
  const [lost, setLost] = useState(0);
  const count = tiles.filter(Boolean).length, all = count === COUNT;

  useEffect(() => { if (all) onDone(); }, [all]);

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
      <p className="cmeta">{err || (all ? 'Tap a panel any time to swap a photo.' : `${count}/${COUNT} found. Tap a panel to add a photo.`)}</p>
      {all && <p className="cready">🎉 All 9 found! Tap <b>Next</b> to customise your colour story.</p>}
    </div>
  );
}

// ───────────── Screen 2: frame, stickers, filter, shape, text, save ─────────────
const Icon = ({ children }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const TABS = [
  { id: 'frame', label: 'Frame', hint: 'Choose a frame', icon: <Icon><rect x="4" y="4" width="16" height="16" rx="3" /><rect x="8.5" y="8.5" width="7" height="7" rx="1.5" /></Icon> },
  { id: 'stickers', label: 'Stickers', hint: 'Choose a sticker set', icon: <Icon><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" /></Icon> },
  { id: 'filter', label: 'Filter', hint: 'Choose a photo filter', icon: <Icon><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></Icon> },
  { id: 'shape', label: 'Shape', hint: 'Choose a photo shape', icon: <Icon><circle cx="9" cy="9" r="5" /><rect x="11" y="11" width="9" height="9" rx="2" /></Icon> },
  { id: 'text', label: 'Text', hint: 'Write your own caption', icon: <Icon><path d="M5 7V5h14v2M12 5v14M9 19h6" /></Icon> },
];
const SHAPES = [
  { id: 'auto', name: 'Frame default' },
  { id: 'square', name: 'Square' },
  { id: 'round', name: 'Rounded' },
  { id: 'circle', name: 'Circle' },
  { id: 'arch', name: 'Arch' },
];
const SIZES = [{ v: 0.8, label: 'Small' }, { v: 1, label: 'Medium' }, { v: 1.3, label: 'Large' }];

// One option tile: a preview thumbnail with its name underneath
function Opt({ on, label, onClick, dashed, children }) {
  return (
    <button type="button" role="radio" aria-checked={on} className={'opt' + (on ? ' on' : '') + (dashed ? ' dashed' : '')} onClick={onClick}>
      <span className="oth">{children}</span>
      <span className="onm">{label}</span>
    </button>
  );
}

function StickerThumb({ kind }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d');
    x.clearRect(0, 0, c.width, c.height);
    x.save(); x.translate(c.width / 2, c.height / 2); drawSticker(x, kind, c.width * 0.66, 1); x.restore();
  }, [kind]);
  return <canvas ref={ref} width="140" height="140" className="thumb-c" aria-hidden="true" />;
}

// Tiny picture of a frame: its background colours with nine photo squares (circles for round frames)
function FrameThumb({ th }) {
  const bg = th.bg.length > 1 ? th.bg : [th.bg[0], th.bg[0]];
  const rad = th.ts === 'circle' ? '50%' : Math.min(th.r ?? 4, 36) / 8 + 'px';
  return (
    <span className="fth" style={{ background: `linear-gradient(160deg, ${bg.join(',')})` }} aria-hidden="true">
      {Array.from({ length: 9 }, (_, k) => <i key={k} style={{ borderRadius: rad }} />)}
    </span>
  );
}

const sq = (im, size) => { const c = document.createElement('canvas'); c.width = c.height = size; cover(c.getContext('2d'), im, 0, 0, size, size); return c; };

export function CollageStudio() {
  const tiles = cache, ready = tiles.every(Boolean);
  const [theme, setTheme] = useState(themeCache);
  const [pack, setPack] = useState(packCache);
  const [seed, setSeed] = useState(seedCache);
  const [flt, setFlt] = useState(filterCache);
  const [shape, setShape] = useState(shapeCache);
  const [size, setSize] = useState(sizeCache);
  const [cap, setCap] = useState(captionCache);
  const [capNow, setCapNow] = useState(captionCache);   // the caption actually drawn (waits until she stops typing)
  const [tab, setTab] = useState('frame');
  const [out, setOut] = useState(null);
  const [making, setMaking] = useState(false);
  const [fthumbs, setFthumbs] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => { captionCache = cap; setCapNow(cap); }, 500);
    return () => clearTimeout(t);
  }, [cap]);

  useEffect(() => {
    if (!ready) return;
    let live = true; setMaking(true);
    render(tiles, THEMES[theme], { pack: PACKS[pack], seed, flt, shape, size, caption: capNow })
      .then((o) => { if (live) { setOut(o); setMaking(false); } })
      .catch(() => live && setMaking(false));
    return () => { live = false; };
  }, [theme, pack, seed, flt, shape, size, capNow]);

  // filter previews use her own first photo, so she can see what each one does
  useEffect(() => {
    if (!ready) return;
    let live = true;
    load(tiles[0].url).then((im) => {
      const base = sq(im, 120);
      const urls = FILTERS.map((f) => (hasFx(f) ? prep(base, f, 3, 120) : base).toDataURL('image/jpeg', 0.8));
      if (live) setFthumbs(urls);
    }).catch(() => {});
    return () => { live = false; };
  }, []);

  async function save() {
    const file = new File([out.blob], 'colour-story.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'Colour story' }); return; }
      catch (e) { if (e.name === 'AbortError') return; }
    }
    const a = document.createElement('a'); a.href = out.url; a.download = 'colour-story.png'; a.click();
  }

  if (!ready) return <p className="cmeta">Add all 9 photos on the previous screen first, then come back to style them.</p>;

  const cur = TABS.find((t) => t.id === tab), th = THEMES[theme];
  const chosen = tab === 'frame' ? th.name : tab === 'stickers' ? PACKS[pack].name : tab === 'filter' ? FILTERS[flt].name
    : tab === 'shape' ? (th.fixedShape ? 'Set by frame' : SHAPES.find((s) => s.id === shape).name) : (cap.trim() ? 'Custom' : 'Default');

  return (
    <div className="collage studio">
      {out
        ? <img className={'final' + (making ? ' dim' : '')} src={out.url} alt="Your colour story" />
        : <div className="sk sk-load final-skel"><span className="sk-shim" aria-hidden="true" /></div>}

      <div className="cpanel">
        <div className="ctabs" role="tablist" aria-label="Customise">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
              {t.icon}<span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="orow"><span>{cur.hint}</span><b>{chosen}</b></div>

        {tab !== 'text' && !(tab === 'shape' && th.fixedShape) && (
          <div className="opts" role="radiogroup" aria-label={cur.hint}>
            {tab === 'frame' && THEMES.map((t, n) => (
              <Opt key={t.id} on={n === theme} label={t.name} onClick={() => { themeCache = n; setTheme(n); }}><FrameThumb th={t} /></Opt>
            ))}
            {tab === 'stickers' && (
              <>
                {PACKS.map((p, n) => (
                  <Opt key={p.id} on={n === pack} label={p.name} onClick={() => { packCache = n; setPack(n); }}>
                    {p.thumb
                      ? <StickerThumb kind={p.thumb} />
                      : <Icon><circle cx="12" cy="12" r="8" /><path d="M6.5 17.5l11-11" /></Icon>}
                  </Opt>
                ))}
                {pack > 0 && (
                  <Opt dashed label="Shuffle" onClick={() => { seedCache += 1; setSeed(seedCache); }}>
                    <Icon><path d="M16 4h4v4M4 20l16-16M20 16v4h-4M15 15l5 5M4 4l5 5" /></Icon>
                  </Opt>
                )}
              </>
            )}
            {tab === 'filter' && FILTERS.map((f, n) => (
              <Opt key={f.id} on={n === flt} label={f.name} onClick={() => { filterCache = n; setFlt(n); }}>
                {fthumbs[n] ? <img src={fthumbs[n]} alt="" className="thumb-i" /> : <span className="sk-shim" />}
              </Opt>
            ))}
            {tab === 'shape' && SHAPES.map((s) => (
              <Opt key={s.id} on={s.id === shape} label={s.name} onClick={() => { shapeCache = s.id; setShape(s.id); }}>
                <span className={'shth sh-' + s.id} />
              </Opt>
            ))}
          </div>
        )}

        {tab === 'stickers' && pack > 0 && (
          <div className="osize">
            <span>Size</span>
            <div className="seg" role="radiogroup" aria-label="Sticker size">
              {SIZES.map((s) => (
                <button key={s.label} type="button" role="radio" aria-checked={size === s.v} className={size === s.v ? 'on' : ''} onClick={() => { sizeCache = s.v; setSize(s.v); }}>{s.label}</button>
              ))}
            </div>
          </div>
        )}

        {tab === 'shape' && th.fixedShape && (
          <p className="onote">The {th.name} frame has its own photo shape. Pick a different frame to change it.</p>
        )}

        {tab === 'text' && (
          <div className="otext">
            <input type="text" value={cap} maxLength={44} placeholder={SUB} onChange={(e) => setCap(e.target.value)} aria-label="Caption" />
            <div className="otext-foot">
              <small>{cap.length}/44 · shows under your colour bar</small>
              {cap && <button type="button" onClick={() => setCap('')}>Reset</button>}
            </div>
          </div>
        )}
      </div>

      <button className="btn go csave" onClick={save} disabled={!out}>Save / share to Instagram</button>
      <p className="cmeta">Or long-press the picture to save it.</p>
    </div>
  );
}