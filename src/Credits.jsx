import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as story from './story.js';
import { drawSticker } from './stickers.js';
import { loadPhotos, recall } from './keepsakes.js';

const { NAME, WORD } = story;
const GM = story.GAMEMASTER || 'Your Gamemaster';   // set GAMEMASTER in story.js
const SPEED = 40;                                    // how fast the credits roll, px per second

// ── Edit the captions here ──────────────────────────────────────────────
const CAST = [
  ['The Contestant', NAME],
  ['The Gamemaster', GM],
];
const SCENES = {
  gallery: { slot: 'white-rabbit-gallery', kicker: 'Opening scene', title: 'The White Rabbit Gallery', line: 'Where it all began', tilt: -2 },
  booth: { slot: 'photobooth', kicker: 'Meme pose', title: 'The Photobooth', line: 'One absolute masterpiece', tilt: 2 },
  harbour: { slot: 'wynyard-harbour-view', kicker: 'Closing shot', title: 'Wynyard', line: 'The view never gets old', tilt: -1.5 },
};
// ────────────────────────────────────────────────────────────────────────

// Sky-lantern style floaters drawn from the sticker art (no outline), rising behind the credits
function makeFloaters() {
  const kinds = ['sky', 'lantern', 'blossom', 'coin', 'cloud', 'snow', 'petal', 'sky'], img = {};
  kinds.forEach((k) => {
    if (img[k]) return;
    const c = document.createElement('canvas'); c.width = c.height = 200;
    const x = c.getContext('2d'); x.translate(100, 100); drawSticker(x, k, 150, 1, false, true); img[k] = c.toDataURL();
  });
  return Array.from({ length: 16 }, (_, n) => ({
    src: img[kinds[n % kinds.length]], left: (n * 61) % 100, size: 34 + ((n * 17) % 44),
    dur: 20 + ((n * 7) % 16), delay: -((n * 3.7) % 22), sway: ((n * 37) % 90) - 45,
  }));
}

const fmtTime = (ms) => { const m = Math.max(1, Math.round(ms / 60000)), h = Math.floor(m / 60); return h ? `${h}h ${m % 60}m` : `${m} min`; };

function Scene({ cfg, photos }) {
  const src = photos[cfg.slot];
  if (!src) return null;
  return (
    <section className="cr-sec">
      <p className="cr-kicker">{cfg.kicker}</p>
      <h3 className="cr-scene">{cfg.title}</h3>
      <figure className="cr-photo" style={{ '--tilt': cfg.tilt + 'deg' }}>
        <img src={src} alt={cfg.title} />
        <figcaption>{cfg.line}</figcaption>
      </figure>
    </section>
  );
}

export default function Credits() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);       // { photos, meta }
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  const scroller = useRef(null), pausedRef = useRef(false);
  const floaters = useMemo(() => (open ? makeFloaters() : []), [open]);

  pausedRef.current = paused;

  async function play() {
    const photos = await loadPhotos();
    setData({ photos, meta: recall() });
    setEnded(false);
    setPaused(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false);
    setOpen(true);
  }

  // Roll the credits. Touching the screen pauses the roll while she scrolls for herself.
  useEffect(() => {
    if (!open || !data) return;
    const el = scroller.current; if (!el) return;
    let raf, last = performance.now(), pos = el.scrollTop, idle = 0;
    const touch = () => { idle = 2.2; };
    ['touchstart', 'touchmove', 'wheel', 'pointerdown'].forEach((t) => el.addEventListener(t, touch, { passive: true }));
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (idle > 0) { idle -= dt; pos = el.scrollTop; }
      else if (!pausedRef.current) {
        pos += SPEED * dt; el.scrollTop = pos;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) setEnded(true);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ['touchstart', 'touchmove', 'wheel', 'pointerdown'].forEach((t) => el.removeEventListener(t, touch)); };
  }, [open, data]);

  // Fade each credit in as it scrolls into view
  useEffect(() => {
    if (!open || !data) return;
    const el = scroller.current;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { root: el, threshold: 0.2 });
    el.querySelectorAll('.cr-sec').forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [open, data]);

  function replay() { const el = scroller.current; el.scrollTop = 0; el.querySelectorAll('.cr-sec').forEach((s) => s.classList.remove('in')); setEnded(false); setPaused(false); }

  const p = data?.photos || {}, m = data?.meta || {};
  const reds = Array.from({ length: 9 }, (_, k) => p['red-' + (k + 1)]).filter(Boolean);
  const photoCount = Object.keys(p).filter((k) => k !== 'collage').length;
  const stats = [
    m.start && [fmtTime(Date.now() - m.start), 'Running time'],
    photoCount && [photoCount, 'Photos taken'],
    [WORD.length, 'Letters collected'],
    m.songs?.length && [m.songs.length, 'Songs sung'],
    m.puzzleMoves && [m.puzzleMoves, 'Puzzle moves'],
    ['0', 'Strangers spoken to (allegedly)'],
  ].filter(Boolean);

  return (
    <>
      <div className="cr-card">
        <span className="cr-card-k">Now showing</span>
        <strong>The Amazing Race: Sydney</strong>
        <small>starring {NAME}</small>
        <button type="button" className="btn go" onClick={play}>Roll the credits</button>
      </div>

      {open && data && createPortal(
        <div className="cr" role="dialog" aria-label="End credits">
          <div className="cr-sky" aria-hidden="true">
            {floaters.map((f, n) => (
              <img key={n} className="cr-float" src={f.src} alt="" style={{ left: f.left + '%', width: f.size, '--dur': f.dur + 's', '--delay': f.delay + 's', '--sway': f.sway + 'px', opacity: f.size < 48 ? 0.5 : 0.9, filter: f.size < 48 ? 'blur(1.2px)' : 'none' }} />
            ))}
          </div>

          <div className="cr-scroll" ref={scroller}>
            <section className="cr-sec cr-first">
              <p className="cr-kicker">A birthday production</p>
              <h1 className="cr-h1">The Amazing Race</h1>
              <p className="cr-h2">Sydney edition</p>
              <p className="cr-star">starring</p>
              <h2 className="cr-name">{NAME}</h2>
            </section>

            <section className="cr-sec">
              <p className="cr-kicker">Cast</p>
              {CAST.map(([role, who]) => (
                <div className="cr-row" key={role}><span>{role}</span><i /><b>{who}</b></div>
              ))}
            </section>

            <Scene cfg={SCENES.gallery} photos={p} />

            {(reds.length > 0 || p.collage) && (
              <section className="cr-sec">
                <p className="cr-kicker">Chinatown</p>
                <h3 className="cr-scene">Nine reds, zero strangers</h3>
                {reds.length > 0 && (
                  <div className="cr-grid">
                    {reds.map((src, k) => <img key={k} src={src} alt="" style={{ '--tilt': (k % 2 ? 2 : -2) + 'deg' }} />)}
                  </div>
                )}
                {p.collage && <img className="cr-story" src={p.collage} alt="Your colour story" />}
              </section>
            )}

            <Scene cfg={SCENES.booth} photos={p} />

            {m.songs?.length > 0 && (
              <section className="cr-sec">
                <p className="cr-kicker">Soundtrack</p>
                {m.songs.map((s) => (
                  <div className="cr-song" key={s.t}><b>{s.t}</b><span>{s.a}</span></div>
                ))}
                <p className="cr-fine">Performed by {NAME} &amp; {GM}</p>
              </section>
            )}

            {m.watch && (
              <section className="cr-sec">
                <p className="cr-kicker">Product placement</p>
                <h3 className="cr-scene">{m.watch}</h3>
                <p className="cr-fine">So the time can finally be checked by someone else.</p>
              </section>
            )}

            <Scene cfg={SCENES.harbour} photos={p} />

            <section className="cr-sec">
              <p className="cr-kicker">By the numbers</p>
              <div className="cr-stats">
                {stats.map(([n, l]) => <div className="cr-stat" key={l}><b>{n}</b><span>{l}</span></div>)}
              </div>
            </section>

            <section className="cr-sec">
              <p className="cr-kicker">The nine letters spelled</p>
              <div className="cr-letters">{WORD.split('').map((ch, k) => <b key={k} style={{ '--k': k }}>{ch}</b>)}</div>
              <h2 className="cr-big">Dinner is served.</h2>
            </section>

            <section className="cr-sec cr-last">
              <h2 className="cr-end">The End</h2>
              <p className="cr-wish">Happy birthday, {NAME}.</p>
              <p className="cr-fine">No white rabbits were harmed in the making of this race.</p>
              <div className="cr-actions">
                <button type="button" className="btn go" onClick={replay}>Watch again</button>
                <button type="button" className="btn" onClick={() => setOpen(false)}>Close</button>
              </div>
            </section>
          </div>

          <button type="button" className="cr-skip" onClick={() => setOpen(false)}>Skip</button>
          {!ended && (
            <button type="button" className="cr-pause" onClick={() => setPaused((v) => !v)} aria-label={paused ? 'Play' : 'Pause'}>
              {paused
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z" /></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>}
            </button>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}