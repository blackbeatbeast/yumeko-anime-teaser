import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { resolve, sep, extname } from 'node:path';

const root = resolve('dist/pages');
const prefix = '/yumeko-anime-teaser/';
const port = Number(process.env.PREVIEW_PORT || 4382);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.png':'image/png', '.webp':'image/webp', '.svg':'image/svg+xml', '.mp4':'video/mp4', '.webm':'video/webm', '.vtt':'text/vtt; charset=utf-8', '.ico':'image/x-icon' };
if (!existsSync(resolve(root, 'index.html'))) throw new Error('Run npm run build:pages first.');
createServer((request, response) => {
  if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400); response.end(); return; }
  if (pathname === '/' || pathname === prefix.slice(0,-1)) { response.writeHead(302, { Location: prefix }); response.end(); return; }
  if (!pathname.startsWith(prefix)) { response.writeHead(404); response.end(); return; }
  const path = resolve(root, pathname.slice(prefix.length) || 'index.html');
  if (!path.startsWith(root + sep) || !existsSync(path) || !statSync(path).isFile()) { response.writeHead(404); response.end(); return; }
  const size = statSync(path).size;
  const headers = { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
  let start = 0, end = size - 1, status = 200;
  if (request.headers.range) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range);
    if (!match || Number(match[1]) >= size || (match[2] && Number(match[2]) < Number(match[1]))) { response.writeHead(416, { 'Content-Range': `bytes */${size}` }); response.end(); return; }
    start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]), size-1) : size-1;
    status = 206; headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
  }
  headers['Content-Length'] = end-start+1;
  response.writeHead(status, headers);
  if (request.method === 'HEAD') { response.end(); return; }
  createReadStream(path, { start, end }).pipe(response);
}).listen(port, '127.0.0.1', () => console.log(`Local draft: http://127.0.0.1:${port}${prefix}`));
