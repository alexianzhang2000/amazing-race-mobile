import { useEffect, useRef, useState } from 'react';

const PASSWORD = import.meta.env.VITE_RACE_PASSWORD;

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem('race-unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.inert = !unlocked;
  }, [unlocked]);

  function submit(event) {
    event.preventDefault();
    if (!PASSWORD) {
      setError('Password protection is not configured. Set VITE_RACE_PASSWORD and rebuild the app.');
      return;
    }
    if (password !== PASSWORD) {
      setError('That password is not correct. Try again.');
      return;
    }

    try {
      sessionStorage.setItem('race-unlocked', 'true');
    } catch {
      // Keep access for this page load if session storage is unavailable.
    }
    setUnlocked(true);
  }

  return (
    <>
      <div ref={contentRef} aria-hidden={!unlocked}>
        {children}
      </div>
      {!unlocked && (
        <div className="password-overlay">
          <section className="password-modal" role="dialog" aria-modal="true" aria-labelledby="password-title">
            <h1 id="password-title">The Amazing Race</h1>
            <p>Enter your race password to continue.</p>
            <form onSubmit={submit}>
              <label className="sr-only" htmlFor="race-password">Race password</label>
              <input
                id="race-password"
                type="password"
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
              />
              <button className="btn password-submit" type="submit">Unlock the race</button>
              <p className="msg err" role="alert">{error}</p>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
