import { useEffect, useRef, useState } from 'react';
import { CHAPTERS, S } from './story.js';
import gm from './assets/gamemaster.webp';
import spot from './assets/spot.jpg';
import busClue from './assets/b-line.webp';
import Shop from './Shop.jsx';
import Jigsaw from './Jigsaw.jsx';
import Collage, { CollageStudio } from './Collage.jsx';
import Booth from './Booth.jsx';
import Karaoke from './Karaoke.jsx';
import Img from './Img.jsx';
import { prepare, uploadPhoto } from './upload.js';

const KEY = 'race-step';
const ICONS = ['🏁', '🧋', '📸', '🏮', '🏛️', '🎤', '⌚', '🚉', '🥭'];
const COLORS = ['#FFBF34', '#93B21F', '#ffffff', '#6fb0e6', '#ffe08a'];
const letterAt = S.map((s, n) => (s.letter ? n : -1)).filter((n) => n >= 0);
const firstOf = CHAPTERS.map((_, c) => S.findIndex((s) => s.c === c));
 
export default function App() {
  const [i, setI] = useState(() => {
    try { return Math.min(+localStorage.getItem(KEY) || 0, S.length - 1); } catch { return 0; }
  });
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState({});
  const [photos, setPhotos] = useState({});
  const [ans, setAns] = useState('');
  const [tries, setTries] = useState(0);
  const [msg, setMsg] = useState({ text: '', kind: '' });
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(0);
  const mainRef = useRef(null);
  const s = S[i];
  const locked = (s.ask || s.photo || s.collage || s.karaoke || s.puzzle) && !done[i];
 
  useEffect(() => {
    try { localStorage.setItem(KEY, i); } catch {}
    setAns(''); setTries(0); setMsg({ text: '', kind: '' });
    mainRef.current?.scrollTo(0, 0);
    const isLetter = !!S[i].letter;
    if (isLetter || i === S.length - 1) {
      const delay = isLetter ? 900 : 0; // wait for the letter card to flip
      const a = setTimeout(() => {
        setBurst((b) => b + 1);
        if (isLetter) navigator.vibrate?.([40, 30, 90]);
      }, delay);
      const b = setTimeout(() => setBurst(0), delay + 1400);
      return () => { clearTimeout(a); clearTimeout(b); };
    }
  }, [i]);
 
  const unlock = () => setDone((d) => ({ ...d, [i]: true }));
 
  function check() {
    if (s.ask.a.includes(ans.trim().toLowerCase())) {
      unlock(); setMsg({ text: 'Correct!', kind: 'ok' });
      return;
    }
    const t = tries + 1;
    setTries(t);
    if (t >= 3) {
      unlock();
      setMsg({ text: `Hint: ${s.ask.hint} (or tap Next to skip)`, kind: 'err' });
    } else setMsg({ text: 'Not quite, try again.', kind: 'err' });
  }
 
  async function upload(file) {
    if (!file || busy) return;
    setBusy(true);
    setMsg({ text: 'Uploading...', kind: '' });
    try {
      const blob = await prepare(file);
      // show the photo straight away so she can see it worked on her side
      setPhotos((p) => ({ ...p, [s.photo]: URL.createObjectURL(blob) }));
      try {
        await uploadPhoto(s.photo, blob);
        setMsg({ text: 'Saved!', kind: 'ok' });
      } catch (e) {
        console.error('upload failed', e);
        setMsg({ text: `Couldn't save it (${e.message}). Try again, or tap Next to skip.`, kind: 'err' });
      }
    } finally {
      unlock(); // never leave her stuck
      setBusy(false);
    }
  }
 
  return (
    <>
      <div className="bg" aria-hidden="true"><i /><i /><i /></div>
 
      <div className="app">
        <header>
          <button className="burger" aria-label="Open checkpoints" aria-expanded={open} onClick={() => setOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <div className="slots" aria-label="Letters collected">
            {letterAt.map((n, k) => (
              <div key={k} className={'slot' + (n <= i ? ' on' : '') + (n === i ? ' new' : '')}>{n <= i ? S[n].letter : ''}</div>
            ))}
          </div>
        </header>
        <div className="bar"><b style={{ width: (i / (S.length - 1)) * 100 + '%' }} /></div>
 
        <main ref={mainRef}>
          <div className="stage">
            <div className="gm-row" key={'g' + i}>
              <div className={'gm' + (s.letter ? ' cheer' : '')}>
                <img src={gm} alt="Your gamemaster" />
                <i className="wave" /><i className="wave w2" />
              </div>
              <p className="chap"><span>{ICONS[s.c]}</span>{CHAPTERS[s.c]}</p>
            </div>
 
            <div className="box" key={'b' + i}>
              {s.h && <h2>{s.h}</h2>}
              {s.t.split('\n').map((l, k) => <p key={k}>{l}</p>)}
 
              {s.letter && (
                <div className="reveal" key={'r' + i}>
                  <div className="reveal-card" role="img" aria-label={`Letter ${s.letter}`}>
                    <span className="face front">?</span>
                    <span className="face back">{s.letter}</span>
                  </div>
                  <p className="reveal-cap">Letter {letterAt.indexOf(i) + 1} of {letterAt.length}</p>
                </div>
              )}
 
              {s.collage && <Collage onDone={unlock} />}
 
              {s.studio && <CollageStudio />}
 
              {s.booth && <Booth />}
 
              {s.karaoke && <Karaoke done={!!done[i]} onDone={unlock} />}
 
              {s.shop && <Shop />}
 
              {s.puzzle && (
                <Jigsaw
                  solved={!!done[i]}
                  onComplete={() => {
                    unlock();
                    setMsg({ text: 'Puzzle solved! 🧩', kind: 'ok' });
                    setBurst((b) => b + 1);
 
                    setTimeout(() => setBurst(0), 1400);
                  }}
                />
              )}
 
              {s.image && (
                <div className="story-image-wrap">
                  <Img
                    className="story-image"
                    wrapClass="story-sk"
                    src={s.image === 'bus-clue' ? busClue : spot}
                    alt={
                      s.image === 'bus-clue'
                        ? 'Double-decker bus clue'
                        : 'Clue location'
                    }
                  />
                </div>
              )}
 
              {s.ask && (
                <div className="extra">
                  <input type="text" autoComplete="off" autoCapitalize="none" placeholder="Your answer"
                    value={ans} onChange={(e) => setAns(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && check()} />
                  <p className={'msg ' + msg.kind}>{msg.text}</p>
                  <button className="btn alt" onClick={check}>Check</button>
                </div>
              )}
 
              {s.photo && (
                <div className="extra">
                  <label className="btn alt pick">
                    {busy ? 'Uploading...' : photos[s.photo] ? 'Retake photo' : 'Take / choose photo'}
                    <input type="file" accept="image/*" disabled={busy}
                      onChange={(e) => { const f = e.target.files[0]; e.target.value = ''; upload(f); }} />
                  </label>
                  <p className={'msg ' + msg.kind}>{msg.text}</p>
                  {photos[s.photo] && <img className="thumb" src={photos[s.photo]} alt="" />}
                </div>
              )}
            </div>
          </div>
        </main>
 
        <footer>
          <button className="btn back" disabled={i === 0} aria-label="Back" onClick={() => setI(i - 1)}>&larr;</button>
          <button className="btn next" disabled={locked || i === S.length - 1} onClick={() => setI(i + 1)}>
            {i === S.length - 1 ? 'Done' : 'Next'}
          </button>
        </footer>
      </div>
 
      {burst > 0 && (
        <div className="confetti" key={burst} aria-hidden="true">
          {Array.from({ length: 20 }, (_, k) => {
            const a = (k / 20) * 6.283, r = 90 + (k % 3) * 45;
            return <span key={k} style={{ '--x': Math.cos(a) * r + 'px', '--y': Math.sin(a) * r + 'px', '--c': COLORS[k % 5], '--d': (k % 4) * 40 + 'ms' }} />;
          })}
        </div>
      )}
 
      {open && (
        <div className="drawer" onClick={() => setOpen(false)}>
          <nav className="panel" onClick={(e) => e.stopPropagation()}>
            <button className="x" aria-label="Close" onClick={() => setOpen(false)}>&times;</button>
            <h3>Checkpoints</h3>
            <p>Lost or glitched? Jump to a leg.</p>
            {CHAPTERS.map((n, c) => (
              <button key={c} className={s.c === c ? 'cur' : ''}
                onClick={() => { setI(firstOf[c]); setOpen(false); }}>
                {s.c > c ? '✓ ' : ''}{n}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
