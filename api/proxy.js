export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const target = req.query.url;
  if (!target) return res.status(400).json({ error: 'Missing ?url= parameter' });
  
  try {
    const targetUrl = decodeURIComponent(target);
    const r = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': new URL(targetUrl).origin + '/'
      },
      redirect: 'follow'
    });
    
    const contentType = r.headers.get('content-type') || 'text/html; charset=utf-8';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=300');
    
    // Remove X-Frame-Options & CSP headers (biar bisa di-embed)
    // Vercel auto-strip, tapi kita set explicit
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    
    const buffer = await r.arrayBuffer();
    res.status(200).send(Buffer.from(buffer));
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
