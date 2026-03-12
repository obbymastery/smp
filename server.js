const http = require('http');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const net = require('net');

const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const ROOT_DIR = __dirname;
const MC_HOST = '152.70.137.25';
const MC_PORT = 25565;
const STATUS_CACHE_MS = 15000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

let cachedStatus = null;
let cachedAt = 0;

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function getStaticPath(urlPathname) {
  const normalized = urlPathname === '/' ? '/index.html' : urlPathname;
  const decoded = decodeURIComponent(normalized);
  const fullPath = path.resolve(ROOT_DIR, `.${decoded}`);
  const safeRoot = `${path.resolve(ROOT_DIR)}${path.sep}`;
  const indexPath = path.resolve(ROOT_DIR, 'index.html');

  if (!fullPath.startsWith(safeRoot) && fullPath !== indexPath) return null;
  return fullPath;
}

async function serveStatic(req, res, urlPathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  const filePath = getStaticPath(urlPathname);
  if (!filePath) {
    sendJson(res, 400, { error: 'Invalid path' });
    return;
  }

  try {
    const stat = await fsp.stat(filePath);
    if (!stat.isFile()) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    fs.createReadStream(filePath).pipe(res);
  } catch {
    sendJson(res, 404, { error: 'Not found' });
  }
}

function writeVarInt(value) {
  const bytes = [];
  let part = value >>> 0;
  do {
    let temp = part & 0x7f;
    part >>>= 7;
    if (part !== 0) temp |= 0x80;
    bytes.push(temp);
  } while (part !== 0);
  return Buffer.from(bytes);
}

function readVarInt(buffer, offset = 0) {
  let numRead = 0;
  let result = 0;
  let byte = 0;

  do {
    if (offset + numRead >= buffer.length) {
      throw new Error('Incomplete VarInt');
    }

    byte = buffer[offset + numRead];
    result |= (byte & 0x7f) << (7 * numRead);
    numRead += 1;

    if (numRead > 5) {
      throw new Error('VarInt too large');
    }
  } while ((byte & 0x80) !== 0);

  return { value: result, size: numRead };
}

function normalizeDescription(description) {
  if (typeof description === 'string') return description;
  if (!description || typeof description !== 'object') return '';
  if (typeof description.text === 'string') return description.text;
  if (!Array.isArray(description.extra)) return '';
  return description.extra.map((entry) => (typeof entry.text === 'string' ? entry.text : '')).join('').trim();
}

function fetchMinecraftStatus() {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: MC_HOST, port: MC_PORT });
    const timeout = setTimeout(() => {
      socket.destroy();
      reject(new Error('Status timeout'));
    }, 5000);

    const finish = (value, error) => {
      clearTimeout(timeout);
      socket.destroy();
      if (error) {
        reject(error);
        return;
      }
      resolve(value);
    };

    socket.once('connect', () => {
      try {
        const hostBuffer = Buffer.from(MC_HOST, 'utf8');
        const handshakeData = Buffer.concat([
          writeVarInt(0),
          writeVarInt(760),
          writeVarInt(hostBuffer.length),
          hostBuffer,
          Buffer.from([(MC_PORT >> 8) & 0xff, MC_PORT & 0xff]),
          writeVarInt(1)
        ]);
        const handshakePacket = Buffer.concat([writeVarInt(handshakeData.length), handshakeData]);
        const requestData = writeVarInt(0);
        const requestPacket = Buffer.concat([writeVarInt(requestData.length), requestData]);
        socket.write(Buffer.concat([handshakePacket, requestPacket]));
      } catch (error) {
        finish(null, error);
      }
    });

    let received = Buffer.alloc(0);

    socket.on('data', (chunk) => {
      received = Buffer.concat([received, chunk]);

      try {
        const packetLength = readVarInt(received, 0);
        if (received.length < packetLength.size + packetLength.value) return;

        let offset = packetLength.size;
        const packetId = readVarInt(received, offset);
        offset += packetId.size;
        if (packetId.value !== 0) {
          throw new Error('Unexpected packet id');
        }

        const stringLength = readVarInt(received, offset);
        offset += stringLength.size;
        const jsonString = received.slice(offset, offset + stringLength.value).toString('utf8');
        const parsed = JSON.parse(jsonString);

        finish({
          description: normalizeDescription(parsed.description),
          players: {
            online: parsed.players && typeof parsed.players.online === 'number' ? parsed.players.online : 0,
            max: parsed.players && typeof parsed.players.max === 'number' ? parsed.players.max : 0,
            sample: parsed.players && Array.isArray(parsed.players.sample) ? parsed.players.sample : []
          },
          version: {
            name: parsed.version && parsed.version.name ? parsed.version.name : 'Unknown',
            protocol: parsed.version && parsed.version.protocol ? parsed.version.protocol : null
          }
        });
      } catch (error) {
        if (error.message !== 'Incomplete VarInt') {
          finish(null, error);
        }
      }
    });

    socket.once('error', (error) => finish(null, error));
  });
}

async function getMinecraftStatus() {
  const now = Date.now();
  if (cachedStatus && now - cachedAt < STATUS_CACHE_MS) {
    return cachedStatus;
  }

  const status = await fetchMinecraftStatus();
  cachedStatus = status;
  cachedAt = now;
  return status;
}

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    if (requestUrl.pathname === '/healthz') {
      sendJson(res, 200, { ok: true, service: 'paradox-smp', time: new Date().toISOString() });
      return;
    }

    if (requestUrl.pathname === '/api/server-status') {
      try {
        const status = await getMinecraftStatus();
        sendJson(res, 200, { ok: true, status, fetchedAt: new Date().toISOString() });
      } catch (error) {
        sendJson(res, 503, {
          ok: false,
          error: 'Server status unavailable',
          detail: error && error.message ? error.message : 'Unknown error'
        });
      }
      return;
    }

    await serveStatic(req, res, requestUrl.pathname);
  } catch {
    sendJson(res, 500, { error: 'Internal server error' });
  }
});

server.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use on ${HOST}. Stop the existing service/process or use a different PORT.`);
    process.exit(1);
    return;
  }

  console.error('Server startup error:', error);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`Paradox SMP server running on http://${HOST}:${PORT}`);
});
