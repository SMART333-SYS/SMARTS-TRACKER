import fs from 'fs';
import zlib from 'zlib';

// Function to generate an uncompressed RGBA PNG file using standard Node.js zlib
function createPng(width, height, r, g, b) {
  // CRC32 table
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c >>> 0;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeAndData, crc]);
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = chunk('IHDR', ihdrData);

  // Raw image bytes: each scanline starts with filter byte 0
  const scanlineWidth = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineWidth);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;
  const innerRadius = width * 0.22;

  for (let y = 0; y < height; y++) {
    const lineOffset = y * scanlineWidth;
    rawData[lineOffset] = 0; // Filter 0: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = lineOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Gradient background in emerald: #059669 -> #047857
      let pr = r;
      let pg = g;
      let pb = b;

      // Draw subtle circular golden ring
      if (Math.abs(dist - radius) < width * 0.015) {
        pr = 250;
        pg = 204;
        pb = 21; // Yellow accent
      } else if (dist < innerRadius) {
        // Inner white/emerald core
        pr = 240;
        pg = 253;
        pb = 244;
      }

      rawData[pixelOffset] = pr;
      rawData[pixelOffset + 1] = pg;
      rawData[pixelOffset + 2] = pb;
      rawData[pixelOffset + 3] = 255; // Alpha
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = chunk('IDAT', compressedData);
  const iendChunk = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate the required PWA assets in public/
fs.mkdirSync('./public', { recursive: true });

// Brand Emerald color: (5, 150, 105)
fs.writeFileSync('./public/pwa-192x192.png', createPng(192, 192, 5, 150, 105));
fs.writeFileSync('./public/pwa-512x512.png', createPng(512, 512, 5, 150, 105));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createPng(512, 512, 4, 120, 87));
fs.writeFileSync('./public/apple-touch-icon.png', createPng(180, 180, 5, 150, 105));

console.log('PWA PNG icons generated successfully in public/');
