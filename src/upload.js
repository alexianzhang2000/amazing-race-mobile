import { shrink } from './util.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Resize the photo, but never let a stuck or failing resize block the upload
// (e.g. a HEIC the browser can't decode). Falls back to the original file.
export async function prepare(file, ms = 15000) {
  try {
    return await Promise.race([
      shrink(file),
      new Promise((_, rej) => setTimeout(() => rej(new Error('resize timeout')), ms)),
    ]);
  } catch {
    return file;
  }
}

// POST a photo to /api/upload with a timeout, retries and a unique name.
// Throws an Error whose message says what went wrong (HTTP status, timeout...).
export async function uploadPhoto(name, blob, { tries = 3, timeout = 25000 } = {}) {
  // Unique name: re-uploading the same name (retake, going back) is rejected by
  // Vercel Blob unless the server allows overwrite, which looks like a random failure.
  const unique = `${name}-${Date.now().toString(36)}`;
  let last = new Error('Upload failed');

  for (let n = 0; n < tries; n++) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeout);
    try {
      const r = await fetch('/api/upload?name=' + encodeURIComponent(unique), {
        method: 'POST',
        headers: { 'Content-Type': blob.type || 'image/jpeg' },
        body: blob,
        signal: ctl.signal,
      });
      if (r.ok) return;
      const body = await r.text().catch(() => '');
      last = Object.assign(new Error(`HTTP ${r.status}${body ? ': ' + body.slice(0, 120) : ''}`), {
        // 4xx (except timeout / rate limit) won't fix itself, so don't retry
        fatal: r.status < 500 && r.status !== 408 && r.status !== 429,
      });
    } catch (e) {
      last = e.name === 'AbortError' ? new Error('timed out') : e;
    } finally {
      clearTimeout(timer);
    }
    if (last.fatal) break;
    if (n < tries - 1) await sleep(800 * (n + 1));
  }
  throw last;
}