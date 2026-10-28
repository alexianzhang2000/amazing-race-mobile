import { useEffect } from 'react';
import { remember } from './keepsakes.js';

const MOMENTS = [
  { icon: '◉', title: 'Find your way', text: 'Built-in GPS is ready to track your runs, rides and adventures.' },
  { icon: '↗', title: 'Make every run count', text: 'Training insights help you see how your effort adds up over time.' },
  { icon: '☼', title: 'Check in with yourself', text: 'See useful health and recovery insights as part of your everyday routine.' },
];

function WatchIllustration() {
  return (
    <svg className="watch-art" viewBox="0 0 220 310" role="img" aria-label="Illustration of the Garmin Forerunner 265 Whitestone">
      <defs>
        <linearGradient id="watch-band" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#dce1e5" />
        </linearGradient>
        <linearGradient id="watch-screen" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#132b46" />
          <stop offset="1" stopColor="#07131f" />
        </linearGradient>
        <linearGradient id="watch-glow" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#62dbcb" />
          <stop offset="1" stopColor="#ffbf34" />
        </linearGradient>
      </defs>
      <path d="M79 4 Q110 -4 141 4 L153 92 L67 92 Z" fill="url(#watch-band)" stroke="#c6cdd3" strokeWidth="2" />
      <path d="M67 218 L153 218 L141 306 Q110 314 79 306 Z" fill="url(#watch-band)" stroke="#c6cdd3" strokeWidth="2" />
      <path d="M82 34h56M78 52h64M75 70h70M82 240h56M79 259h62M76 278h68" stroke="#c5ccd2" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      <circle cx="110" cy="155" r="78" fill="#d9dde1" />
      <circle cx="110" cy="155" r="72" fill="#f7f8f8" stroke="#aab2b8" strokeWidth="3" />
      <circle cx="110" cy="155" r="64" fill="url(#watch-screen)" />
      <circle cx="110" cy="155" r="39" fill="none" stroke="#263c51" strokeWidth="7" />
      <circle cx="110" cy="155" r="39" fill="none" stroke="url(#watch-glow)" strokeWidth="7" strokeLinecap="round" strokeDasharray="178 67" transform="rotate(-90 110 155)" />
      <path d="M110 135v21l15 11" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="110" y="118" fill="#d9e7f2" fontSize="7" fontFamily="Arial, sans-serif" textAnchor="middle" letterSpacing="1">READY WHEN YOU ARE</text>
      <text x="110" y="198" fill="#d9e7f2" fontSize="8" fontFamily="Arial, sans-serif" textAnchor="middle">RUN · MOVE · REPEAT</text>
      <rect x="181" y="115" width="7" height="24" rx="3.5" fill="#aab2b8" />
      <rect x="181" y="151" width="7" height="24" rx="3.5" fill="#aab2b8" />
    </svg>
  );
}

export default function Shop() {
  useEffect(() => { remember('watch', 'Garmin Forerunner 265 Whitestone'); }, []);

  return (
    <section className="watch-showcase" aria-label="Your Garmin Forerunner 265 showcase">
      <div className="watch-hero">
        <div className="watch-orbit watch-orbit-one" aria-hidden="true" />
        <div className="watch-orbit watch-orbit-two" aria-hidden="true" />
        <span className="watch-spark watch-spark-one" aria-hidden="true">✦</span>
        <span className="watch-spark watch-spark-two" aria-hidden="true">✧</span>
        <WatchIllustration />
        <div className="watch-stamp"><span>YOUR</span><b>265</b><span>IS WAITING</span></div>
      </div>

      <div className="watch-title">
        <p className="watch-kicker">THE NEXT CHAPTER</p>
        <h2>Forerunner 265</h2>
        <p className="watch-finish">WHITESTONE · YOUR NEW RUNNING BUDDY</p>
      </div>

      <div className="watch-promise">
        <span aria-hidden="true">✦</span>
        <p>More than a watch. A little reminder of everything you're capable of.</p>
      </div>

      <div className="watch-moments">
        {MOMENTS.map((moment, index) => (
          <article className="watch-moment" key={moment.title} style={{ '--moment-index': index }}>
            <span className="watch-moment-icon" aria-hidden="true">{moment.icon}</span>
            <div>
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="watch-finale">Here’s to the miles, milestones and adventures still to come.</p>
    </section>
  );
}
