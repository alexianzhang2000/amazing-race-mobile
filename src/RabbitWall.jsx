import { useEffect, useState } from 'react';

// ── Edit the puzzle here ──────────────────────────────────────────────
const ANSWER = ['🤍', '🐇', '🖼️'];      // White · Rabbit · Gallery (order matters)
const DECOYS = ['✌️', '🪞', '🍵'];      // red herrings from the first date
const PLACE = 'White Rabbit Gallery';
const ADDRESS = '30 Balfour St, Chippendale';
const HINT = 'Think in order: a colour, an animal, then where art hangs.';
// ──────────────────────────────────────────────────────────────────────

const COLS = 3, ROWS = 2, TOTAL = COLS * ROWS;
const TILT = [-2.4, 1.6, -1.2, 2.2, -1.8, 1.4];
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
const pickFrom = (list) => list[(Math.random() * list.length) | 0];

// The White Rabbit, with his pocket watch (he's late, obviously)
function Rabbit() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="25" cy="13" rx="4.6" ry="12" fill="#fff" stroke="#d9cdb8" strokeWidth="1.4" transform="rotate(-12 25 13)" />
      <ellipse cx="25" cy="13" rx="2" ry="8" fill="#ffc2d1" transform="rotate(-12 25 13)" />
      <ellipse cx="37" cy="12" rx="4.6" ry="12" fill="#fff" stroke="#d9cdb8" strokeWidth="1.4" transform="rotate(10 37 12)" />
      <ellipse cx="37" cy="12" rx="2" ry="8" fill="#ffc2d1" transform="rotate(10 37 12)" />
      <circle cx="13" cy="47" r="6.5" fill="#fff" stroke="#d9cdb8" strokeWidth="1.4" />
      <ellipse cx="31" cy="46" rx="19" ry="14" fill="#fff" stroke="#d9cdb8" strokeWidth="1.4" />
      <circle cx="33" cy="31" r="13" fill="#fff" stroke="#d9cdb8" strokeWidth="1.4" />
      <circle cx="38" cy="29" r="2.1" fill="#2b2118" /><circle cx="38.7" cy="28.3" r=".7" fill="#fff" />
      <ellipse cx="42" cy="34" rx="3.4" ry="2.2" fill="#ffc2d1" opacity=".75" />
      <ellipse cx="46.2" cy="32" rx="1.6" ry="1.2" fill="#ff8fab" />
      <path d="M36 44 Q40 40 46 44" stroke="#c98d00" strokeWidth="1.3" fill="none" />
      <circle cx="44" cy="48" r="5.6" fill="#ffd36b" stroke="#c98d00" strokeWidth="1.5" />
      <path d="M44 45v3.4l2.4 1.4" stroke="#8a5a00" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function RabbitWall({ solved = false, onComplete }) {
  const [emojis] = useState(() => shuffle([...ANSWER, ...DECOYS]));   // what hides behind each frame
  const [got, setGot] = useState(() => (solved ? emojis.map((_, k) => k) : []));   // frames uncovered, in the order she caught them
  const [at, setAt] = useState(() => (Math.random() * TOTAL) | 0);    // frame the rabbit is sitting on
  const [hopKey, setHopKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [slots, setSlots] = useState(solved ? ANSWER : []);
  const [fails, setFails] = useState(0);
  const [shake, setShake] = useState(false);
  const [ok, setOk] = useState(solved);
  const [msg, setMsg] = useState('');
  const all = got.length === TOTAL;

  // The rabbit gets bored and hops to another frame, faster each time she catches him
  useEffect(() => {
    if (all || busy) return;
    const t = setTimeout(() => {
      const left = emojis.map((_, k) => k).filter((k) => !got.includes(k) && k !== at);
      if (left.length) { setAt(pickFrom(left)); setHopKey((n) => n + 1); }
    }, Math.max(1000, 2500 - got.length * 280));
    return () => clearTimeout(t);
  }, [at, got.length, busy, all]);

  function catchIt() {
    if (busy || all) return;
    navigator.vibrate?.(25);
    const next = [...got, at];
    setGot(next); setBusy(true);
    setTimeout(() => {
      const left = emojis.map((_, k) => k).filter((k) => !next.includes(k));
      if (left.length) { setAt(pickFrom(left)); setHopKey((n) => n + 1); }
      setBusy(false);
    }, 850);
  }

  function place(e) {
    if (!all || ok || slots.includes(e) || slots.length >= 3) return;
    const n = [...slots, e];
    setSlots(n);
    if (n.length < 3) return;
    if (n.every((x, i) => x === ANSWER[i])) { setOk(true); setMsg(''); onComplete?.(); return; }
    const f = fails + 1;
    setFails(f); setShake(true);
    if (f >= 5) {                                   // never leave her stuck
      setTimeout(() => { setSlots(ANSWER); setShake(false); setOk(true); setMsg("Okay, I'll help this once."); onComplete?.(); }, 800);
    } else {
      setMsg(f >= 3 ? HINT : 'Not quite. Try a different order.');
      setTimeout(() => { setSlots([]); setShake(false); }, 800);
    }
  }

  const col = at % COLS, row = Math.floor(at / COLS);
  const g = 'var(--g)';
  return (
    <div className="rw">
      {!solved && (
        <>
          <p className="rw-count">{all ? 'All six uncovered!' : `Caught ${got.length} of ${TOTAL}. Tap the rabbit before he hops!`}</p>
          <div className="rw-wall">
            <div className="rw-grid">
              {emojis.map((e, k) => (
                <div key={k} className={'rw-frame' + (got.includes(k) ? ' open' : '')} style={{ '--r': TILT[k] + 'deg' }}>
                  <div className="rw-art">
                    <span className="rw-emoji">{e}</span>
                    <span className="rw-cloth" />
                  </div>
                </div>
              ))}
              {!all && (
                <button type="button" className="rw-rabbit" aria-label="Catch the rabbit" onClick={catchIt}
                  style={{
                    left: `calc(${col} * ((100% - 2 * ${g}) / 3 + ${g}) + (100% - 2 * ${g}) / 6)`,
                    top: `calc(${row} * ((100% - ${g}) / 2 + ${g}) + (100% - ${g}) / 4)`,
                  }}>
                  <span key={hopKey}><Rabbit /></span>
                </button>
              )}
            </div>
          </div>

          <div className="rw-tray" aria-label="Clues collected">
            {Array.from({ length: TOTAL }, (_, n) => {
              const e = got[n] !== undefined ? emojis[got[n]] : null;
              return e ? (
                <button key={n} type="button" className={'rw-tile full' + (all && !ok ? ' tap' : '') + (slots.includes(e) ? ' used' : '')}
                  disabled={!all || ok || slots.includes(e)} onClick={() => place(e)} aria-label={`Clue ${e}`}>{e}</button>
              ) : <span key={n} className="rw-tile" />;
            })}
          </div>
        </>
      )}

      {(all || solved) && (
        <div className={'rw-label' + (ok ? ' ok' : '')}>
          {ok ? (
            <>
              <small>Now showing</small>
              <h3>{PLACE}</h3>
              <p className="rw-addr">{ADDRESS}</p>
            </>
          ) : (
            <>
              <small>Untitled, 2026 · mixed emoji on wall</small>
              <p className="rw-ask">Hang the three clues on the placard, in order.</p>
            </>
          )}
          <div className={'rw-slots' + (shake ? ' shake' : '')}>
            {[0, 1, 2].map((n) => (
              <button key={n} type="button" className={'rw-slot' + (slots[n] ? ' on' : '')} disabled={ok || !slots[n]}
                aria-label={slots[n] ? `Remove ${slots[n]}` : 'Empty slot'}
                onClick={() => setSlots((s) => s.filter((_, i) => i !== n))}>{slots[n] || ''}</button>
            ))}
          </div>
          {msg && <p className="rw-msg">{msg}</p>}
        </div>
      )}
    </div>
  );
}