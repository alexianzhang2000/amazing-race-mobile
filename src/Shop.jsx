
import { useState } from 'react';

const WATCHES = [
  {
    id: 'vivoactive5',
    name: 'vívoactive 5',
    eyebrow: 'THE EVERYDAY ALL-ROUNDER',
    tagline: 'A little bit of everything, done well.',
    price: 'Around A$300',
    colors: [
      {
        name: 'Black / Slate',
        image: 'https://res.garmin.com/en/products/010-02862-10/v/cf-lg.jpg',
        // Keep your existing colour properties here
      },
      {
        name: 'Ivory / Cream Gold',
        image: 'https://res.garmin.com/en/products/010-02862-11/v/cf-lg.jpg',
      },
      {
        name: 'Navy / Metallic Navy',
        image: 'https://res.garmin.com/en/products/010-02862-12/v/cf-lg.jpg',
      },
      {
        name: 'Orchid / Metallic Orchid',
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
    name: 'Forerunner 165',
    eyebrow: 'THE RUNNER',
    tagline: 'For chasing your next personal best.',
    price: 'Around A$400',
    colors: [
      {
        name: 'Black / Slate Grey',
        image: 'https://res.garmin.com/en/products/010-02863-20/v/cf-lg.jpg',
      },
      {
        name: 'Mist Grey / Whitestone',
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
    name: 'Lily 2',
    eyebrow: 'THE STYLE PICK',
    tagline: 'Small, subtle and made to accessorise.',
    price: 'Around A$400–450',
    colors: [
      {
        name: 'Cream Gold / Coconut',
        image: 'https://res.garmin.com/en/products/010-02839-00/v/cf-lg.jpg',
      },
      {
        name: 'Metallic Lilac / Lilac',
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

function WatchArt({ color }) {
  return (
    <svg
      className="shop-watch-art"
      viewBox="0 0 180 230"
      role="img"
      aria-label={`Watch colour illustration: ${color.name}`}
    >
      <defs>
        <linearGradient id={`glass-${color.name.replace(/[^a-z0-9]/gi, '')}`}
          x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff" stopOpacity=".2" />
          <stop offset="1" stopColor="#000" stopOpacity=".2" />
        </linearGradient>
      </defs>
      <path
        d="M66 5 Q90 -3 114 5 L120 62 L60 62 Z M60 172 L120 172 L114 225 Q90 233 66 225 Z"
        fill={color.strap}
      />
      <rect x="51" y="53" width="78" height="122" rx="24" fill={color.bezel} />
      <rect x="57" y="59" width="66" height="110" rx="19" fill={color.screen} />
      <circle
        cx="90" cy="114" r="29" fill="none"
        stroke={color.accent} strokeWidth="4"
        strokeDasharray="130 60" transform="rotate(-90 90 114)"
        strokeLinecap="round"
      />
      <circle cx="90" cy="114" r="21" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="2" />
      <path d="M90 99 V114 L102 123" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="128" y="99" width="6" height="18" rx="3" fill={color.bezel} />
    </svg>
  );
}

function Feature({ title, children }) {
  return (
    <div className="shop-feature">
      <strong>{title}</strong>
      <p>{children}</p>
    </div>
  );
}

function WatchCard({ watch, selected, onSelect }) {
  const [colorIndex, setColorIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const color = watch.colors[colorIndex];

  return (
    <article className={`shop-product ${selected ? 'is-selected' : ''}`}>
      <div className="shop-eyebrow">
        <span>{watch.eyebrow}</span>
        {selected && <b>Birthday pick</b>}
      </div>

      <div className="shop-hero">
        <div className="shop-hero-copy">
          <h3>{watch.name}</h3>
          <p>{watch.tagline}</p>
          <strong>{watch.price}</strong>
        </div>
        <img
          className="watch-product-image"
          src={color.image}
          alt={`${watch.name} in ${color.name}`}
          loading="lazy"
        />
      </div>

      <div className="shop-colors">
        <div className="shop-color-heading">
          <span>Choose a finish</span>
          <strong>{color.name}</strong>
        </div>
        <div className="shop-swatches" role="group" aria-label={`${watch.name} colours`}>
          {watch.colors.map((c, index) => (
            <button
              key={c.name}
              type="button"
              className={index === colorIndex ? 'active' : ''}
              style={{ '--swatch': c.strap, '--bezel': c.bezel }}
              onClick={() => setColorIndex(index)}
              aria-label={`Select ${c.name}`}
              aria-pressed={index === colorIndex}
              title={c.name}
            >
              <span />
            </button>
          ))}
        </div>
      </div>

      <div className="shop-specs">
        <div>
          <span>DISPLAY</span>
          <b>{watch.display}</b>
        </div>
        <div>
          <span>BATTERY</span>
          <b>{watch.battery}</b>
        </div>
        <div className="shop-build">
          <span>BUILD & DURABILITY</span>
          <b>{watch.build}</b>
          <p>{watch.durability}</p>
        </div>
      </div>

      <div className="shop-features">
        <Feature title="Everyday features">{watch.everyday}</Feature>
        <Feature title="Fitness features">{watch.fitness}</Feature>
        <Feature title="What people say">{watch.review}</Feature>
      </div>

      <button
        type="button"
        className="shop-toggle"
        onClick={() => setExpanded(value => !value)}
        aria-expanded={expanded}
      >
        <span>{expanded ? 'Hide the details' : 'UI, pros & cons'}</span>
        <span className={expanded ? 'up' : ''}>⌄</span>
      </button>

      {expanded && (
        <div className="shop-expanded">
          <Feature title="UI & ease of use">{watch.ui}</Feature>

          <div className="shop-procon">
            <div>
              <h4>＋ The good</h4>
              <ul>{watch.pros.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h4>− The trade-offs</h4>
              <ul>{watch.cons.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>

          <div className="shop-fit">
            <b>Best for Norita if…</b>
            <p>{watch.fit}</p>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`shop-choose ${selected ? 'chosen' : ''}`}
        onClick={() => onSelect(watch.id)}
      >
        {selected ? 'Selected for the birthday ✓' : 'Choose this watch'}
      </button>
      <p className="shop-price-note">{watch.priceNote}</p>
    </article>
  );
}

export default function Shop() {
  const [selectedId, setSelectedId] = useState('vivoactive5');

  return (
    <section className="garmin-shop">
      <div className="shop-intro">
        <span>THE BIRTHDAY EDITION</span>
        <h2>Find your perfect Garmin.</h2>
        <p>Three watches. Three personalities. Pick the one that fits your life.</p>
      </div>

      <div className="shop-model-nav" role="group" aria-label="Choose a Garmin to compare">
        {WATCHES.map((watch, index) => (
          <button
            key={watch.id}
            type="button"
            className={selectedId === watch.id ? 'active' : ''}
            onClick={() => setSelectedId(watch.id)}
          >
            <small>0{index + 1}</small>
            {watch.name}
          </button>
        ))}
      </div>

      <div className="shop-products">
        {WATCHES.map(watch => (
          <WatchCard
            key={watch.id}
            watch={watch}
            selected={selectedId === watch.id}
            onSelect={setSelectedId}
          />
        ))}
      </div>

      <p className="shop-disclaimer">
        Colour availability varies by region and edition. Battery life is a manufacturer
        estimate and varies with settings and use. Prices are indicative, not live quotes.
      </p>
    </section>
  );
}
