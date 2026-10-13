import { useEffect, useState } from 'react';

// Edit the setlist here
const SONGS = [
  { tag: 'Old banger', title: 'I Want You Back', artist: '*NSYNC', icon: '🎤' },
  { tag: 'Rap duet', title: 'Love the Way You Lie', artist: 'Eminem & Rihanna', icon: '🔥' },
  { tag: 'Love song', title: 'About You', artist: 'The 1975', icon: '💌' },
  { tag: 'Encore · optional', title: 'Your pick', artist: "Any song you love. It's your birthday!", icon: '✨', bonus: true },
];
const REQUIRED = SONGS.map((s, n) => (s.bonus ? -1 : n)).filter((n) => n >= 0);
let cache = []; // keeps her ticks if she navigates away and back

export default function Karaoke({ done, onDone }) {
  const [sung, setSung] = useState(() => (done ? REQUIRED : cache));
  const ok = REQUIRED.every((n) => sung.includes(n));

  useEffect(() => { if (ok) onDone(); }, [ok]);

  const toggle = (n) => setSung((c) => {
    const x = c.includes(n) ? c.filter((v) => v !== n) : [...c, n];
    cache = x; return x;
  });

  return (
    <div className="setlist">
      {SONGS.map((s, n) => {
        const on = sung.includes(n);
        return (
          <button key={n} aria-pressed={on} onClick={() => toggle(n)}
            className={'song' + (on ? ' sung' : '') + (s.bonus ? ' bonus' : '')}>
            <span className="sicon">{on ? '✓' : s.icon}</span>
            <span className="sbody"><em>{s.tag}</em><b>{s.title}</b><small>{s.artist}</small></span>
          </button>
        );
      })}
      <p className="snote">
        {ok ? 'Setlist complete! Encore if you dare.' : `${REQUIRED.filter((n) => sung.includes(n)).length}/${REQUIRED.length} sung. Tap a song once you've done it.`}
      </p>
    </div>
  );
}