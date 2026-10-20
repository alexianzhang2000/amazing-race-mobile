import { useEffect, useRef, useState } from 'react';

// <img> with a shimmer + spinner while it loads, a fade-in once it's ready,
// and a tap-to-retry if it fails (weak signal).
//   className -> the <img>      wrapClass -> the wrapper around it
export default function Img({ src, alt = '', className = '', wrapClass = '', onError, ...rest }) {
  const [state, setState] = useState('load'); // load | ok | err
  const [attempt, setAttempt] = useState(0);
  const ref = useRef(null);

  // Cached images can finish loading before React attaches onLoad
  useEffect(() => {
    const el = ref.current;
    setState(el && el.complete && el.naturalWidth ? 'ok' : 'load');
  }, [src, attempt]);

  // Cache-bust remote URLs on retry so the browser actually asks again
  const url = attempt && /^https?:/.test(src) ? `${src}${src.includes('?') ? '&' : '?'}r=${attempt}` : src;

  return (
    <span className={`sk sk-${state} ${wrapClass}`}>
      <img
        key={attempt}
        ref={ref}
        src={url}
        alt={alt}
        className={className}
        onLoad={() => setState('ok')}
        onError={(e) => { setState('err'); onError?.(e); }}
        {...rest}
      />
      {state === 'load' && <span className="sk-shim" aria-hidden="true" />}
      {state === 'err' && (
        <button type="button" className="sk-retry" onClick={() => setAttempt((a) => a + 1)}>
          Couldn't load. Tap to retry
        </button>
      )}
    </span>
  );
}