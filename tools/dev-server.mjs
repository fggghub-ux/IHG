import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 8080);
const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.md': 'text/plain; charset=utf-8',
};
http.createServer((req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(405);
        res.end();
        return;
    }
    let filename;
    try {
        const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        filename = path.resolve(root, '.' + pathname);
        if (filename !== root && !filename.startsWith(root + path.sep)) {
            res.writeHead(403);
            res.end();
            return;
        }
        if (fs.statSync(filename).isDirectory()) filename = path.join(filename, 'index.html');
        if (!fs.statSync(filename).isFile()) throw Error('not file');
    } catch {
        res.writeHead(404);
        res.end('Not found');
        return;
    }
    res.writeHead(200, {
        'Content-Type': types[path.extname(filename)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
    });
    if (req.method === 'HEAD') res.end();
    else fs.createReadStream(filename).pipe(res);
}).listen(port, '127.0.0.1', () =>
    console.log(`Phone development server: http://localhost:${port}`),
);
