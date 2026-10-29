import { useEffect, useState } from 'react';
import { remember } from './keepsakes.js';

/* ---------- Watch faces (tap the watch to flip through them) ---------- */
const FACES = [
  { id: 'morning', cap: 'Morning Report', note: 'Wake up to your sleep, recovery and a suggested workout for the day.' },
  { id: 'run', cap: 'Live run data', note: 'Pace, heart rate and distance on a bright AMOLED screen, even in full sun.' },
  { id: 'ready', cap: 'Training Readiness', note: 'A daily score that tells you whether to push hard or take it easy.' },
  { id: 'gps', cap: 'Multi-band GPS', note: 'Dual-frequency GPS keeps your route accurate between tall buildings and under trees.' },
  { id: 'battery', cap: 'Body Battery', note: 'See how much energy you have left, based on sleep, stress and activity.' },
];

function Ring({ pct, r = 40, w = 7, from = '#62dbcb', to = '#ffbf34', id }) {
  const c = 2 * Math.PI * r;
  return (
    <svg className="ring" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={w} />
      <circle
        cx="50" cy="50" r={r} fill="none" stroke={`url(#${id})`} strokeWidth={w} strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`} transform="rotate(-90 50 50)" className="ring-fill"
        style={{ '--len': c * pct, '--circ': c }}
      />
    </svg>
  );
}

function Face({ id }) {
  switch (id) {
    case 'morning':
      return (
        <div className="face-in">
          <small>Good morning</small>
          <b className="big">6:12</b>
          <div className="face-row"><span>Sleep 87</span><span>HRV ✓</span></div>
        </div>
      );
    case 'run':
      return (
        <div className="face-in">
          <small>Pace /km</small>
          <b className="big">5:24</b>
          <div className="face-row"><span>♥ 152</span><span>8.42 km</span></div>
        </div>
      );
    case 'ready':
      return (
        <div className="face-in">
          <Ring pct={0.82} id="g-ready" />
          <div className="ring-label"><b>82</b><small>Prime</small></div>
        </div>
      );
    case 'gps':
      return (
        <div className="face-in">
          <svg viewBox="0 0 100 100" className="route" aria-hidden="true">
            <path d="M18 74 C28 52 14 40 34 34 S58 52 62 30 S82 22 84 40" pathLength="1" />
            <circle cx="84" cy="40" r="3.4" />
          </svg>
          <small className="gps-tag">GPS locked</small>
        </div>
      );
    default:
      return (
        <div className="face-in">
          <Ring pct={0.91} from="#93B21F" to="#62dbcb" id="g-batt" />
          <div className="ring-label"><b>91</b><small>Battery</small></div>
        </div>
      );
  }
}

/* ---------- Feature tabs ---------- */
const TABS = [
  {
    key: 'run',
    label: 'Run',
    items: [
      { icon: '◉', title: 'Multi-band GPS', text: 'Dual-frequency satellite tracking for a more accurate route in the city.' },
      { icon: '↗', title: 'Race predictor', text: 'Estimates your 5K, 10K, half and marathon times from your training.' },
      { icon: '≋', title: 'Running dynamics', text: 'Cadence, stride length and ground contact time, to run smoother.' },
      { icon: '✦', title: 'Daily suggested workouts', text: 'Workouts picked for you each day, based on your recent training and recovery.' },
    ],
  },
  {
    key: 'recover',
    label: 'Recover',
    items: [
      { icon: '☾', title: 'Sleep score & coach', text: 'Learn how well you slept and how much sleep your body needs tonight.' },
      { icon: '♥', title: 'HRV status', text: 'Track your heart rate variability trend to see how your body is coping.' },
      { icon: '⚡', title: 'Body Battery', text: 'A simple energy meter that shows when to go hard and when to rest.' },
      { icon: '⏱', title: 'Recovery time', text: 'Know how long to wait before your next hard session.' },
    ],
  },
  {
    key: 'daily',
    label: 'Every day',
    items: [
      { icon: '▣', title: 'AMOLED touchscreen', text: 'Bright, sharp and touch-friendly, with buttons for when your hands are sweaty.' },
      { icon: '♪', title: 'Music on your wrist', text: 'Store songs on the watch and pair headphones to run without your phone.' },
      { icon: '◈', title: 'Garmin Pay', text: 'Tap to pay on your wrist after a long run. No wallet needed.' },
      { icon: '▮', title: 'Up to 13 days battery', text: 'Up to about 13 days in smartwatch mode, with GPS use shortening that.' },
    ],
  },
];

/* ---------- Finish-time toy ---------- */
const DISTANCES = [
  { label: '5K', km: 5 },
  { label: '10K', km: 10 },
  { label: 'Half', km: 21.0975 },
  { label: 'Marathon', km: 42.195 },
];
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
function hms(total) {
  const t = Math.round(total);
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}

export default function Shop() {
  const [face, setFace] = useState(0);
  const [auto, setAuto] = useState(true);
  const [tab, setTab] = useState(0);
  const [dist, setDist] = useState(3);
  const [pace, setPace] = useState(330); // seconds per km

  useEffect(() => { remember('watch', 'Garmin Forerunner 265 Whitestone'); }, []);

  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setFace((f) => (f + 1) % FACES.length), 3200);
    return () => clearInterval(t);
  }, [auto]);

  const f = FACES[face];
  const d = DISTANCES[dist];

  return (
    <section className="ws" aria-label="Your Garmin Forerunner 265 showcase">
      {/* ===== Stage ===== */}
      <div className="ws-stage">
        <div className="ws-beam" aria-hidden="true" />
        <div className="ws-track" aria-hidden="true"><i /><i /><i /></div>

        <button
          type="button"
          className="ws-watch"
          aria-label={`Watch showing ${f.cap}. Tap to see the next screen.`}
          onClick={() => { setAuto(false); setFace((x) => (x + 1) % FACES.length); }}
        >
          <span className="strap top" />
          <span className="strap bot" />
          <span className="case">
            <span className="bezel">
              <span className="screen" key={f.id}>
                <Face id={f.id} />
              </span>
            </span>
            <span className="btn-l a" /><span className="btn-l b" /><span className="btn-l c" />
            <span className="btn-r a" /><span className="btn-r b" />
          </span>
        </button>

        <div className="ws-stamp" aria-hidden="true"><span>Yours</span><b>265</b><span>Whitestone</span></div>

        <div className="ws-caption" aria-live="polite">
          <b>{f.cap}</b>
          <p>{f.note}</p>
          <div className="dots" role="tablist" aria-label="Watch screens">
            {FACES.map((x, n) => (
              <button
                key={x.id} type="button" role="tab" aria-selected={n === face} aria-label={x.cap}
                className={n === face ? 'on' : ''}
                onClick={() => { setAuto(false); setFace(n); }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===== Headline ===== */}
      <div className="ws-title">
        <h2>Forerunner 265</h2>
        <p>Your new running partner, in Whitestone.</p>
      </div>

      {/* ===== Quick stats ===== */}
      <div className="ws-stats">
        <div><b>1.3″</b><span>AMOLED display</span></div>
        <div><b>2</b><span>GPS frequency bands</span></div>
        <div><b>13</b><span>days smartwatch battery</span></div>
      </div>

      {/* ===== Feature explorer ===== */}
      <div className="ws-explore">
        <h3>What it can do</h3>
        <div className="tabs" role="tablist">
          {TABS.map((t, n) => (
            <button key={t.key} type="button" role="tab" aria-selected={n === tab}
              className={n === tab ? 'on' : ''} onClick={() => setTab(n)}>
              {t.label}
            </button>
          ))}
        </div>
        <ul className="feat" key={TABS[tab].key}>
          {TABS[tab].items.map((it, n) => (
            <li key={it.title} style={{ '--n': n }}>
              <span className="ic" aria-hidden="true">{it.icon}</span>
              <div>
                <h4>{it.title}</h4>
                <p>{it.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ===== Finish-time toy ===== */}
      <div className="ws-predict">
        <h3>Dream race, dream pace</h3>
        <p className="sub">Slide to pick a pace and see your finish time. This is just for fun; the watch will predict the real one.</p>
        <div className="chips" role="group" aria-label="Race distance">
          {DISTANCES.map((x, n) => (
            <button key={x.label} type="button" className={n === dist ? 'on' : ''} aria-pressed={n === dist} onClick={() => setDist(n)}>
              {x.label}
            </button>
          ))}
        </div>
        <label className="pace">
          <span>Pace <b>{mmss(pace)} /km</b></span>
          <input type="range" min="240" max="450" step="5" value={pace} onChange={(e) => setPace(+e.target.value)} />
        </label>
        <div className="finish">
          <span>{d.label} finish</span>
          <b>{hms(d.km * pace)}</b>
        </div>
      </div>

      <p className="ws-finale">Here’s to the miles, milestones and adventures still to come.</p>
    </section>
  );
}