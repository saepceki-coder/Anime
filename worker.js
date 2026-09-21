export default {
  async fetch(request) {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    const url = new URL(request.url);
    if (url.searchParams.has('url')) {
      const target = decodeURIComponent(url.searchParams.get('url'));
      try {
        const r = await fetch(target, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Referer': new URL(target).origin + '/' } });
        const buf = await r.arrayBuffer();
        const headers = { ...cors, 'Content-Type': r.headers.get('Content-Type') || 'text/html; charset=utf-8' };
        return new Response(buf, { status: 200, headers });
      } catch (e) { return new Response(e.message, { status: 502, headers: cors }); }
    }
    return new Response('CORSflare OK', { headers: cors });
  }
};
