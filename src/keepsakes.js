// Keepsakes: the things Norita makes during the race, kept on her phone so the end credits can show them.
// Photos go in IndexedDB (too big for localStorage). Small facts (songs, watch, start time) go in localStorage.
// Vercel Blob still gets every upload as your archive; the credits just don't depend on it.

const DB = 'norita-race', STORE = 'keepsakes', META = 'race-meta';
const mem = new Map();   // fallback if IndexedDB isn't available (some private modes)

const open = () => new Promise((res, rej) => {
  if (typeof indexedDB === 'undefined') return rej(new Error('no indexedDB'));
  const r = indexedDB.open(DB, 1);
  r.onupgradeneeded = () => r.result.createObjectStore(STORE);
  r.onsuccess = () => res(r.result);
  r.onerror = () => rej(r.error);
});
const finished = (tx) => new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = tx.onabort = () => rej(tx.error); });

// Save (or replace) the photo for a slot, e.g. 'photobooth' or 'red-3'. A retake simply overwrites it.
export async function keepPhoto(slot, blob) {
  mem.set(slot, blob);
  try {
    const db = await open(); const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(blob, slot); await finished(tx); db.close();
  } catch {}
}

// All saved photos as { slot: objectURL }
export async function loadPhotos() {
  const found = new Map(mem);
  try {
    const db = await open(); const store = db.transaction(STORE, 'readonly').objectStore(STORE);
    await new Promise((res) => {
      const rq = store.openCursor();
      rq.onsuccess = () => { const c = rq.result; if (c) { if (!found.has(c.key)) found.set(c.key, c.value); c.continue(); } else res(); };
      rq.onerror = () => res();
    });
    db.close();
  } catch {}
  const urls = {}; found.forEach((blob, slot) => { urls[slot] = URL.createObjectURL(blob); });
  return urls;
}

const readMeta = () => { try { return JSON.parse(localStorage.getItem(META)) || {}; } catch { return {}; } };
export function remember(key, value) { try { const m = readMeta(); m[key] = value; localStorage.setItem(META, JSON.stringify(m)); } catch {} }
export const recall = readMeta;

// Wipe everything (fresh run, or the "Start over" button)
export async function resetKeepsakes() {
  mem.clear();
  try { localStorage.removeItem(META); } catch {}
  try {
    const db = await open(); const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).clear(); await finished(tx); db.close();
  } catch {}
}
