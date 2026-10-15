// api/upload.js  <- project ROOT (next to package.json), NOT src/api
import { put } from '@vercel/blob';

const ACCESS = 'private';        // must match how the store was created: 'private' or 'public'
const MAX = 4.5 * 1024 * 1024;   // Vercel Functions reject bigger request bodies anyway

export async function POST(request) {
  try {
    const raw = new URL(request.url).searchParams.get('name') || 'photo';
    const name = raw.replace(/[^a-z0-9_-]/gi, '').slice(0, 60) || 'photo';
    const type = request.headers.get('content-type') || 'image/jpeg';
    if (!type.startsWith('image/')) return new Response('Only images are accepted', { status: 415 });

    const body = Buffer.from(await request.arrayBuffer());
    if (!body.length) return new Response('Empty upload', { status: 400 });
    if (body.length > MAX) return new Response('Photo too large', { status: 413 });

    const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
    const blob = await put(`norita-amazing-race/${name}.${ext}`, body, {
      access: ACCESS,
      contentType: type,
      addRandomSuffix: true,     // never collides, so retakes can't fail with "already exists"
    });
    return Response.json({ pathname: blob.pathname });
  } catch (e) {
    console.error('upload failed', e);
    return new Response(String(e?.message || e), { status: 500 }); // shows up in the app's error text
  }
}