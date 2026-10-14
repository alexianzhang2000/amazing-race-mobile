import { useEffect, useRef, useState } from 'react';
import fist from './assets/poses/fist.webp';
import pray from './assets/poses/pray.webp';
import roar from './assets/poses/roar.webp';
import cathug from './assets/poses/cathug.webp';
import sixseven from './assets/poses/sixseven.webp';
import tongue from './assets/poses/tongue.webp';
import finger from './assets/poses/finger.webp';
import cook from './assets/poses/cook.webp';

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

export default function Booth() {
  const ref = useRef(null);
  const [at, setAt] = useState(0);

  // Which card is closest to the centre of the track?
  const nearest = () => {
    const el = ref.current;
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
    el.scrollTo({ left: c.offsetLeft - (el.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
  };

  const surprise = () => {
    let n;
    do { n = Math.floor(Math.random() * POSES.length); } while (n === at);
    goTo(n);
  };

  useEffect(() => { setAt(nearest()); }, []);

  return (
    <div className="booth">
      <div className="btrack" ref={ref} onScroll={() => setAt(nearest())}>
        {POSES.map((p, n) => (
          <article className={'pose' + (n === at ? ' on' : '')} key={n}>
            <div className="pnum">Pose {n + 1} of {POSES.length}</div>
            <div className="pimg"><img src={p.img} alt={p.t} /></div>
            <div className="pt">{p.t}</div>
            <div className="pd">{p.d}</div>
          </article>
        ))}
      </div>
      <div className="bdots">
        {POSES.map((p, n) => (
          <button key={n} type="button" aria-label={`Go to pose ${n + 1}: ${p.t}`}
            className={n === at ? 'on' : ''} onClick={() => goTo(n)} />
        ))}
      </div>
      <button className="btn go shuf" onClick={surprise}>Surprise us</button>
    </div>
  );
}