import { useEffect, useRef, useState } from 'react';
import Img from './Img.jsx';
import fist from './assets/poses/fist.webp';
import pray from './assets/poses/pray.webp';
import roar from './assets/poses/roar.webp';
import cathug from './assets/poses/cathug.webp';
import sixseven from './assets/poses/sixseven.webp';
import tongue from './assets/poses/tongue.webp';
import finger from './assets/poses/finger.webp';
import cook from './assets/poses/marmot-cook.jpg';

const POSES = [
  { img: fist, t: 'Fist to the mouth', d: "Stand side by side. One of you aims a fist at the other's mouth. Stay deadpan." },
  { img: pray, t: 'Dramatic prayer', d: 'Hands clasped, eyes shut, maximum suffering. Both of you.' },
  { img: roar, t: 'The roar and the thinker', d: 'One roars like a lion. The other strokes their chin and judges.' },
  { img: cathug, t: 'The cat hug', d: 'One hugs from behind with a straight face. The other yells.' },
  { img: sixseven, t: 'Six seven', d: 'Palms up, tilt them like scales: one hand six, the other seven. Say it out loud.' },
  { img: tongue, t: 'Tongue vs smirk', d: 'One of you goes full tongue-out. The other is far too smug.' },
  { img: finger, t: 'Actually...', d: 'One raises a finger to make a point. The other cracks up.' },
  { img: cook, t: 'Let him cook', d: "One pats the other's chest. The other talks like a genius mid-thought." },
];

const STRIP_WIDTH = 480;
const STRIP_HEIGHT = 720;
const STRIP_PADDING = 12;
const STRIP_GAP = 8;
const TILE_SIZE = 224;
const POSE_SIZE = 184;

async function createStrip(selected) {
  const images = await Promise.all(selected.map(({ img }) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('A selected pose image could not be loaded.'));
    image.src = img;
  })));
  const canvas = document.createElement('canvas');
  canvas.width = STRIP_WIDTH;
  canvas.height = STRIP_HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Your browser could not create the photobooth strip.');

  context.fillStyle = '#ffe08a';
  context.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);
  images.forEach((image, index) => {
    const x = STRIP_PADDING + (index % 2) * (TILE_SIZE + STRIP_GAP);
    const y = STRIP_PADDING + Math.floor(index / 2) * (TILE_SIZE + STRIP_GAP);
    context.fillStyle = '#fff3c4';
    context.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    const scale = Math.min(POSE_SIZE / image.naturalWidth, POSE_SIZE / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    context.drawImage(image, x + (TILE_SIZE - width) / 2, y + (TILE_SIZE - height) / 2, width, height);
  });
  return canvas.toDataURL('image/png');
}

export default function Booth({ selected, strip, onSelectionChange, onStripChange }) {
  const ref = useRef(null);
  const [at, setAt] = useState(0);
  const [stripError, setStripError] = useState('');

  // Which card is closest to the centre of the track?
  const nearest = () => {
    const el = ref.current;
    if (!el) return 0;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, gap = Infinity;
    [...el.children].forEach((c, n) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < gap) { gap = d; best = n; }
    });
    return best;
  };

  const goTo = (n) => {
    const el = ref.current, c = el.children[n];
    if (!el || !c) return;
    el.scrollTo({ left: c.offsetLeft - (el.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
  };

  useEffect(() => { setAt(nearest()); }, []);

  useEffect(() => {
    let cancelled = false;
    setStripError('');
    if (selected.length !== 6) return () => { cancelled = true; };

    createStrip(selected.map((index) => POSES[index])).then((image) => {
      if (!cancelled) onStripChange(image);
    }).catch((error) => {
      if (!cancelled) setStripError(error.message);
    });
    return () => { cancelled = true; };
  }, [selected, onStripChange]);

  const togglePose = (index) => {
    if (selected.includes(index)) {
      onSelectionChange(selected.filter((pose) => pose !== index));
    } else if (selected.length < 6) {
      onSelectionChange([...selected, index]);
    }
  };

  return (
    <div className="booth">
      <p className="booth-count" aria-live="polite">
        Choose 6 poses for your strip ({selected.length}/6 selected).
      </p>
      <div className="btrack" ref={ref} onScroll={() => setAt(nearest())}>
        {POSES.map((p, n) => (
          <article className={'pose' + (n === at ? ' on' : '') + (selected.includes(n) ? ' selected' : '')} key={n}>
            <div className="pimg"><Img src={p.img} alt={p.t} /></div>
            <div className="pt">{p.t}</div>
            <div className="pd">{p.d}</div>
            <button type="button" className="btn alt pose-pick"
              aria-pressed={selected.includes(n)}
              disabled={!selected.includes(n) && selected.length === 6}
              onClick={() => togglePose(n)}>
              {selected.includes(n) ? `Selected ${selected.indexOf(n) + 1} · Remove` : 'Choose pose'}
            </button>
          </article>
        ))}
      </div>
      <div className="bdots">
        {POSES.map((p, n) => (
          <button key={n} type="button" aria-label={`Go to pose ${n + 1}: ${p.t}`}
            className={n === at ? 'on' : ''} onClick={() => goTo(n)} />
        ))}
      </div>
      {strip && (
        <div className="booth-preview">
          <h3>Your photobooth strip</h3>
          <img className="booth-strip" src={strip} alt="Photobooth strip with your six selected poses" />
        </div>
      )}
      {stripError && <p className="msg err" role="alert">{stripError} Please change a pose and try again.</p>}
    </div>
  );
}