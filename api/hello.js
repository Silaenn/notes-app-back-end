export default async function handler(req, res) {
  try {
    return res.status(200).json({ status: "ok", message: "Hello from Vercel API" });
  } catch (err) {
    console.error('hello error', err);
    return res.status(500).json({ error: true, message: 'Internal error' });
  }
}
