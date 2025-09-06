const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  const safePath = req.url.split('?')[0].replace(/\/+/, '/');
  let filePath = path.join(__dirname, 'public', safePath);

  if (filePath.endsWith(path.join('public', '/')) || filePath === path.join(__dirname, 'public')) {
    filePath = path.join(__dirname, 'public', 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
      return;
    }

    const stream = fs.createReadStream(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    }[ext] || 'application/octet-stream';

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    stream.pipe(res);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on 0.0.0.0:${port}`);
});
