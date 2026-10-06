import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const name = String(req.query.name || 'photo').replace(/[^a-z0-9_-]/gi, '').slice(0, 40);
  try {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = Buffer.concat(chunks);
    if (!body.length || body.length > 4 * 1024 * 1024) return res.status(413).json({ error: 'bad size' });
    const blob = await put(`race/${name}-${Date.now()}.jpg`, body, { access: 'public', contentType: 'image/jpeg' });
    res.status(200).json({ url: blob.url });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
}
