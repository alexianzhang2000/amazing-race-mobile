import { useRef, useState } from 'react';
import Img from './Img.jsx';

const WATCHES = [
  {
    id: 'vivoactive5',
    short: 'vívoactive 5',
    role: 'Everyday',
    name: 'vívoactive 5',
    eyebrow: 'The everyday all-rounder',
    tagline: 'A little bit of everything, done well.',
    price: 'Around A$300',
    colors: [
      {
        name: 'Black / Slate',
        strap: '#2c3339', bezel: '#15191c', screen: '#0b0d10', accent: '#7ad0ff',
        image: 'https://res.garmin.com/en/products/010-02862-10/v/cf-lg.jpg',
      },
      {
        name: 'Ivory / Cream Gold',
        strap: '#efe7d6', bezel: '#c9a96a', screen: '#0b0d10', accent: '#c9a96a',
        image: 'https://res.garmin.com/en/products/010-02862-11/v/cf-lg.jpg',
      },
      {
        name: 'Navy / Metallic Navy',
        strap: '#1d3b66', bezel: '#5b7ca8', screen: '#0b0d10', accent: '#ffbf34',
        image: 'https://res.garmin.com/en/products/010-02862-12/v/cf-lg.jpg',
      },
      {
        name: 'Orchid / Metallic Orchid',
        strap: '#b178b4', bezel: '#7e4a84', screen: '#0b0d10', accent: '#ffd1f0',
        image: 'https://res.garmin.com/en/products/010-02862-13/v/cf-lg.jpg',
      },
    ],
    display: '1.2-inch AMOLED',
    battery: 'Up to 11 days',
    build: '42.2 mm case · 36 g · 5 ATM',
    durability: 'Aluminium bezel, reinforced polymer case, Gorilla Glass 3 lens and silicone strap. Suitable for swimming.',
    ui: 'Bright colour touchscreen and two side buttons. Easy-to-read health summaries and workout screens.',
    everyday: 'Smart notifications, Garmin Pay, onboard music, sleep score, nap detection, stress tracking and Body Battery.',
    fitness: '30+ sport profiles, built-in GPS, heart rate, VO₂ max, workout guidance and sleep/recovery insights.',
    review: 'Common praise: comfortable, lightweight, bright screen and versatile everyday tracking. Some users report inconsistent sleep or heart-rate readings.',
    pros: [
      'Lightweight enough for all-day wear',
      'On-watch music and contactless payments',
      'Balanced everyday and workout features',
    ],
    cons: [
      'No barometric altimeter or stair-climb tracking',
      'Less running-focused than the Forerunner',
      'No speaker or microphone for calls',
    ],
    fit: 'You want one watch for everyday life, gym sessions, walks and runs.',
    priceNote: 'Price is indicative; check current Australian retailer offers.',
  },
  {
    id: 'forerunner165',
    short: 'Forerunner',
    role: 'Runner',
    name: 'Forerunner 165',
    eyebrow: 'The runner',
    tagline: 'For chasing your next personal best.',
    price: 'Around A$400',
    colors: [
      {
        name: 'Black / Slate Grey',
        strap: '#262a2e', bezel: '#6b7580', screen: '#0b0d10', accent: '#93b21f',
        image: 'https://res.garmin.com/en/products/010-02863-20/v/cf-lg.jpg',
      },
      {
        name: 'Mist Grey / Whitestone',
        strap: '#cdd1d6', bezel: '#a7adb4', screen: '#0b0d10', accent: '#ff7a5c',
        image: 'https://res.garmin.com/en/products/010-02863-21/v/cf-lg.jpg',
      },
    ],
    display: '1.2-inch AMOLED',
    battery: 'Up to 11 days',
    build: '43 mm case · 39 g · 5 ATM',
    durability: 'Chemically strengthened glass and reinforced polymer bezel/case. Five-button design with a silicone strap.',
    ui: 'Touchscreen plus five physical buttons. The buttons are particularly useful during sweaty runs or when you do not want to swipe.',
    everyday: 'Smart notifications, sleep and wellness tracking, Garmin Pay. On-watch music storage is available on the Forerunner 165 Music edition.',
    fitness: 'Running-focused GPS pace and distance, VO₂ max, race-time predictions, adaptive training plans and suggested workouts.',
    review: 'Common praise: lightweight fit, readable AMOLED display and useful running guidance. It is well suited to beginner and intermediate runners.',
    pros: [
      'More running-specific training guidance',
      'Physical buttons work well mid-run',
      'Training plans and race predictions',
    ],
    cons: [
      'Sportier look than jewellery-style watches',
      'Standard version has no onboard music storage',
      'No full-colour offline maps or dual-band GPS',
    ],
    fit: 'Running plans, pace, race preparation and training feedback matter most.',
    priceNote: 'The Music edition costs more; check the exact model.',
  },
  {
    id: 'lily2',
    short: 'Lily 2',
    role: 'Style',
    name: 'Lily 2',
    eyebrow: 'The style pick',
    tagline: 'Small, subtle and made to accessorise.',
    price: 'Around A$400–450',
    colors: [
      {
        name: 'Cream Gold / Coconut',
        strap: '#efe3c2', bezel: '#cfae6a', screen: '#0b0d10', accent: '#c9a96a',
        image: 'https://res.garmin.com/en/products/010-02839-00/v/cf-lg.jpg',
      },
      {
        name: 'Metallic Lilac / Lilac',
        strap: '#bba9dc', bezel: '#9a86c4', screen: '#0b0d10', accent: '#ffffff',
        image: 'https://res.garmin.com/en/products/010-02839-01/v/cf-lg.jpg',
      },
    ],
    display: 'Small monochrome touchscreen',
    battery: 'Up to 5 days',
    build: '35.4 mm case · 24.4 g · 5 ATM',
    durability: 'Aluminium case, Gorilla Glass 3 lens and a compact, lightweight design. Suitable for swimming.',
    ui: 'Minimal tap-based display beneath a patterned lens. Elegant, but less colourful and less information-dense than the other two.',
    everyday: 'Notifications, sleep and wellness tracking, stress tracking and Body Battery. No onboard music storage.',
    fitness: 'Activity profiles, heart rate, steps, sleep tracking and connected GPS using your phone.',
    review: 'Common praise: stylish design, comfort and a discreet size. The main compromises are its monochrome screen and lack of built-in GPS.',
    pros: [
      'Smallest and lightest of these three',
      'Jewellery-inspired design and patterned lens',
      'Useful everyday wellness tracking',
    ],
    cons: [
      'No built-in GPS; phone needed for GPS activities',
      'Monochrome display is less vivid and detailed',
      'Fewer advanced running tools and no onboard music',
    ],
    fit: 'Size and appearance matter more than advanced running metrics.',
    priceNote: 'Price varies considerably by edition and finish.',
  },
];

// Fallback drawing if a product photo fails to load (weak signal)
function WatchArt({ color }) {
  return (
    <svg className="gs-art" viewBox="0 0 180 230" role="img" aria-label={`${color.name} watch`}>
      <path d="M66 5 Q90 -3 114 5 L120 62 L60 62 Z M60 172 L120 172 L114 225 Q90 233 66 225 Z" fill={color.strap} />
      <rect x="51" y="53" width="78" height="122" rx="24" fill={color.bezel} />
      <rect x="57" y="59" width="66" height="110" rx="19" fill={color.screen} />
      <circle cx="90" cy="114" r="29" fill="none" stroke={color.accent} strokeWidth="4"
        strokeDasharray="130 60" transform="rotate(-90 90 114)" strokeLinecap="round" />
      <path d="M90 99 V114 L102 123" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Detail({ title, children }) {
  return (
    <div className="gs-detail">
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  );
}

function WatchCard({ watch, active, picked, onPick }) {
  const [ci, setCi] = useState(0);
  const [open, setOpen] = useState(false);
  const [broken, setBroken] = useState({});
  const color = watch.colors[ci];

  return (
    <article className={'gs-card' + (active ? ' on' : '') + (picked ? ' picked' : '')}>
      <div className="gs-stage">
        <span className="gs-tag">{watch.eyebrow}</span>
        {picked && <b className="gs-pick">Birthday pick</b>}
        {broken[color.image]
          ? <WatchArt color={color} />
          : <Img key={color.image} src={color.image} alt={`${watch.name} in ${color.name}`} loading="lazy"
              wrapClass="gs-imgwrap"
              onError={() => setBroken((b) => ({ ...b, [color.image]: true }))} />}
      </div>

      <div className="gs-body">
        <div className="gs-head">
          <h3>{watch.name}</h3>
          <span className="gs-price">{watch.price}</span>
        </div>
        <p className="gs-tagline">{watch.tagline}</p>

        <div className="gs-colors" role="group" aria-label={`${watch.name} finishes`}>
          {watch.colors.map((c, n) => (
            <button key={c.name} type="button" className={n === ci ? 'on' : ''}
              style={{ '--strap': c.strap, '--bezel': c.bezel }}
              aria-label={c.name} aria-pressed={n === ci} onClick={() => setCi(n)} />
          ))}
          <span className="gs-colorname">{color.name}</span>
        </div>

        <div className="gs-specs">
          <div><small>Display</small><b>{watch.display}</b></div>
          <div><small>Battery</small><b>{watch.battery}</b></div>
          <div className="wide"><small>Build</small><b>{watch.build}</b></div>
        </div>

        <button type="button" className="gs-more" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          <span>{open ? 'Hide details' : 'Features, pros & cons'}</span>
          <span className={'gs-chev' + (open ? ' up' : '')} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </button>

        {open && (
          <div className="gs-open">
            <Detail title="Everyday">{watch.everyday}</Detail>
            <Detail title="Fitness">{watch.fitness}</Detail>
            <Detail title="Durability">{watch.durability}</Detail>
            <Detail title="Using it">{watch.ui}</Detail>
            <Detail title="What people say">{watch.review}</Detail>
            <div className="gs-procon">
              <h4>The good</h4>
              <ul className="pro">{watch.pros.map((x) => <li key={x}>{x}</li>)}</ul>
              <h4>The trade-offs</h4>
              <ul className="con">{watch.cons.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className="gs-fit"><b>Best for Norita if…</b><p>{watch.fit}</p></div>
          </div>
        )}
      </div>

      <button type="button" className={'gs-choose' + (picked ? ' chosen' : '')} onClick={() => onPick(watch.id)}>
        {picked ? 'Your birthday pick ✓' : 'Choose this watch'}
      </button>
      <p className="gs-note">{watch.priceNote}</p>
    </article>
  );
}

export default function Shop() {
  const [picked, setPicked] = useState('vivoactive5');
  const [at, setAt] = useState(0);
  const track = useRef(null);

  const nearest = () => {
    const el = track.current, mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, gap = Infinity;
    [...el.children].forEach((c, n) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < gap) { gap = d; best = n; }
    });
    return best;
  };
  const goTo = (n) => {
    const el = track.current, c = el.children[n];
    el.scrollTo({ left: c.offsetLeft - (el.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
  };

  return (
    <section className="garmin-shop">
      <div className="gs-intro">
        <h2>Find your perfect Garmin</h2>
        <p>Three watches, three personalities. Swipe through and pick one.</p>
      </div>

      <div className="gs-nav" role="group" aria-label="Jump to a watch">
        {WATCHES.map((w, n) => (
          <button key={w.id} type="button" className={n === at ? 'on' : ''} aria-pressed={n === at} onClick={() => goTo(n)}>
            {picked === w.id && <i aria-label="Your pick">✓</i>}
            {w.short}
            <small>{w.role}</small>
          </button>
        ))}
      </div>

      <div className="gs-track" ref={track} onScroll={() => setAt(nearest())}>
        {WATCHES.map((w, n) => (
          <WatchCard key={w.id} watch={w} active={n === at} picked={picked === w.id} onPick={setPicked} />
        ))}
      </div>

      <p className="gs-fine">
        Colours vary by region and edition. Battery life is a manufacturer estimate. Prices are indicative, not live quotes.
      </p>
    </section>
  );
}