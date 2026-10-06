import { useEffect, useRef, useState } from 'react';

// Snapshot of Australian prices, Oct 2026 (approximate; they vary by retailer)
const WATCHES = [
  {
    id: 'venu3', name: 'Garmin Venu 3', tag: 'The all-rounder', theme: 'night',
    price: '~A$600', rrp: 'RRP A$749 · deals from ~A$320',
    rings: ['#ff6f59', '#7ee0c0', '#ffb02e'],
    colors: [{ n: 'Black', strap: '#1c1f24', bezel: '#9aa3ad' }, { n: 'Whitestone', strap: '#ece7dc', bezel: '#cfd4da' }],
    specs: [['Display', '1.4" AMOLED, 454 × 454'], ['Battery', 'Up to 14 days (about 26 h GPS)'], ['Weight', '47 g (45 mm case)'],
      ['Calls', 'Built-in speaker and mic'], ['Water', '5 ATM, swim-safe'], ['Also', 'Sleep coach, Body Battery, Garmin Pay, music']],
  },
  {
    id: 'viva5', name: 'Garmin Vivoactive 5', tag: 'The easy pick', theme: 'sun',
    price: '~A$300', rrp: 'Launch ~A$499 · deals from ~A$259',
    rings: ['#0e5560', '#ff6f59', '#10282c'],
    colors: [{ n: 'Black', strap: '#22262b', bezel: '#3a4048' }, { n: 'Navy', strap: '#27406b', bezel: '#a9b4c4' },
      { n: 'Orchid', strap: '#c9a0dc', bezel: '#d8c8a4' }, { n: 'Cream Gold', strap: '#efe4cf', bezel: '#d9b45a' }],
    specs: [['Display', '1.2" AMOLED, 390 × 390'], ['Battery', 'Up to 11 days (about 21 h GPS)'], ['Weight', '36 g'],
      ['Calls', 'Notifications only, no speaker'], ['Water', '5 ATM, swim-safe'], ['Also', '30+ sport apps, sleep coaching, Garmin Pay, music']],
  },
];

const fmt = () => new Date().toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: false });
function useClock() {
  const [t, setT] = useState(fmt);
  useEffect(() => { const id = setInterval(() => setT(fmt()), 1000); return () => clearInterval(id); }, []);
  return t;
}

function Watch({ time, c, rings }) {
  return (
    <svg className="wsvg" viewBox="0 0 120 200" aria-hidden="true">
      <rect x="38" y="0" width="44" height="72" rx="14" fill={c.strap} />
      <rect x="38" y="128" width="44" height="72" rx="14" fill={c.strap} />
      <rect x="104" y="88" width="7" height="14" rx="3" fill={c.bezel} />
      <circle cx="60" cy="100" r="48" fill={c.bezel} />
      <circle cx="60" cy="100" r="43" fill="#0b0d10" />
      {rings.map((col, k) => (
        <circle key={k} cx="60" cy="100" r={38 - k * 3.6} fill="none" stroke={col} strokeWidth="2.4" strokeLinecap="round"
          strokeDasharray={`${[170, 120, 80][k]} 300`} transform="rotate(-90 60 100)" />
      ))}
      <text x="60" y="105" textAnchor="middle" fontSize="15" fontWeight="600" fill="#fff" fontFamily="Fredoka,sans-serif">{time}</text>
    </svg>
  );
}

function Card({ w, time }) {
  const [ci, setCi] = useState(0);
  const [open, setOpen] = useState(false);
  return (
    <article className={'wcard ' + w.theme}>
      <Watch time={time} c={w.colors[ci]} rings={w.rings} />
      <div className="wname">{w.name}</div>
      <div className="wtag">{w.tag}</div>
      <div className="sw">
        {w.colors.map((x, k) => (
          <button key={k} className={k === ci ? 'on' : ''} style={{ background: x.strap }} aria-label={x.n} onClick={() => setCi(k)} />
        ))}
      </div>
      <div className="wp">{w.price}</div>
      <div className="wrrp">{w.rrp}</div>
      <button className="btn alt wbtn" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Hide specs' : 'Show specs'}</button>
      {open && (
        <dl className="specs">
          {w.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      )}
    </article>
  );
}

export default function Shop() {
  const time = useClock();
  const ref = useRef(null);
  const [at, setAt] = useState(0);
  const onScroll = () => { const e = ref.current; setAt(Math.round(e.scrollLeft / (e.scrollWidth / WATCHES.length))); };
  return (
    <div className="shop">
      <div className="track" ref={ref} onScroll={onScroll}>
        {WATCHES.map((w) => <Card key={w.id} w={w} time={time} />)}
      </div>
      <div className="dots">{WATCHES.map((w, k) => <i key={w.id} className={k === at ? 'on' : ''} />)}</div>
      <div className="fine">Snapshot of Australian prices, Oct 2026. Check JB Hi-Fi for today's price.</div>
    </div>
  );
}
