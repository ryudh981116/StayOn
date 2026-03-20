const fs = require("fs");
const path = require("path");

// Minimal PNG encoder for a simple icon (green bg + white "S")
// Using raw RGBA pixel data + zlib deflate
const zlib = require("zlib");

function crc32(buf) {
  let table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function createPNGChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeData));
  return Buffer.concat([len, typeData, crc]);
}

function generateIcon(size) {
  // Create RGBA pixel data
  const pixels = Buffer.alloc(size * size * 4);
  const cx = size / 2, cy = size / 2, r = size / 2;
  const cornerR = size * 0.22; // rounded corner radius

  // Green color #557C55
  const bgR = 0x55, bgG = 0x7c, bgB = 0x55;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Rounded rectangle check
      let inside = true;
      if (x < cornerR && y < cornerR) {
        inside = Math.hypot(x - cornerR, y - cornerR) <= cornerR;
      } else if (x >= size - cornerR && y < cornerR) {
        inside = Math.hypot(x - (size - cornerR), y - cornerR) <= cornerR;
      } else if (x < cornerR && y >= size - cornerR) {
        inside = Math.hypot(x - cornerR, y - (size - cornerR)) <= cornerR;
      } else if (x >= size - cornerR && y >= size - cornerR) {
        inside = Math.hypot(x - (size - cornerR), y - (size - cornerR)) <= cornerR;
      }

      if (inside) {
        pixels[idx] = bgR;
        pixels[idx + 1] = bgG;
        pixels[idx + 2] = bgB;
        pixels[idx + 3] = 255;
      } else {
        pixels[idx + 3] = 0; // transparent
      }
    }
  }

  // Draw "S" letter - using simple path filling
  const scale = size / 192;
  const letterPaths = getLetterS(size, scale);
  for (const pt of letterPaths) {
    const idx = (pt.y * size + pt.x) * 4;
    if (idx >= 0 && idx + 3 < pixels.length) {
      pixels[idx] = 255;     // white
      pixels[idx + 1] = 255;
      pixels[idx + 2] = 255;
      pixels[idx + 3] = 255;
    }
  }

  // Build PNG
  // Filter: prepend 0 (None) to each row
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter none
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }

  const deflated = zlib.deflateSync(raw);

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  const ihdrChunk = createPNGChunk("IHDR", ihdr);

  // IDAT
  const idatChunk = createPNGChunk("IDAT", deflated);

  // IEND
  const iendChunk = createPNGChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function getLetterS(size, scale) {
  const points = [];
  const cx = size / 2;
  const cy = size / 2;

  // Draw S using filled arcs and rectangles
  // Top arc center, bottom arc center
  const topCy = cy - 18 * scale;
  const botCy = cy + 18 * scale;
  const arcR = 28 * scale;
  const thickness = 14 * scale;

  // Top horizontal bar
  for (let y = Math.floor(topCy - arcR); y <= Math.floor(topCy - arcR + thickness); y++) {
    for (let x = Math.floor(cx - arcR + 4 * scale); x <= Math.floor(cx + arcR - 4 * scale); x++) {
      if (x >= 0 && x < size && y >= 0 && y < size) points.push({ x, y });
    }
  }

  // Left side of top arc
  for (let y = Math.floor(topCy - arcR); y <= Math.floor(topCy + 2 * scale); y++) {
    for (let x = Math.floor(cx - arcR - 2 * scale); x <= Math.floor(cx - arcR + thickness - 2 * scale); x++) {
      if (x >= 0 && x < size && y >= 0 && y < size) points.push({ x, y });
    }
  }

  // Middle bar
  for (let y = Math.floor(cy - thickness / 2); y <= Math.floor(cy + thickness / 2); y++) {
    for (let x = Math.floor(cx - arcR + 4 * scale); x <= Math.floor(cx + arcR - 4 * scale); x++) {
      if (x >= 0 && x < size && y >= 0 && y < size) points.push({ x, y });
    }
  }

  // Right side of top arc
  for (let y = Math.floor(topCy - arcR); y <= Math.floor(topCy - arcR + thickness); y++) {
    for (let x = Math.floor(cx + arcR - thickness + 2 * scale); x <= Math.floor(cx + arcR + 2 * scale); x++) {
      if (x >= 0 && x < size && y >= 0 && y < size) points.push({ x, y });
    }
  }

  // Right side connecting top to middle
  for (let y = Math.floor(topCy + 2 * scale); y <= Math.floor(cy - thickness / 2); y++) {
    for (let x = Math.floor(cx + arcR - thickness + 2 * scale); x <= Math.floor(cx + arcR + 2 * scale); x++) {
      if (x >= 0 && x < size && y >= 0 && y < size) points.push({ x, y });
    }
  }

  // Right side of bottom arc
  for (let y = Math.floor(botCy - 2 * scale); y <= Math.floor(botCy + arcR); y++) {
    for (let x = Math.floor(cx + arcR - thickness + 2 * scale); x <= Math.floor(cx + arcR + 2 * scale); x++) {
      if (x >= 0 && x < size && y >= 0 && y < size) points.push({ x, y });
    }
  }

  // Left side connecting middle to bottom
  for (let y = Math.floor(cy + thickness / 2); y <= Math.floor(botCy - 2 * scale); y++) {
    for (let x = Math.floor(cx - arcR - 2 * scale); x <= Math.floor(cx - arcR + thickness - 2 * scale); x++) {
      if (x >= 0 && x < size && y >= 0 && y < size) points.push({ x, y });
    }
  }

  // Bottom horizontal bar
  for (let y = Math.floor(botCy + arcR - thickness); y <= Math.floor(botCy + arcR); y++) {
    for (let x = Math.floor(cx - arcR + 4 * scale); x <= Math.floor(cx + arcR - 4 * scale); x++) {
      if (x >= 0 && x < size && y >= 0 && y < size) points.push({ x, y });
    }
  }

  // Left side of bottom bar
  for (let y = Math.floor(botCy + arcR - thickness); y <= Math.floor(botCy + arcR); y++) {
    for (let x = Math.floor(cx - arcR - 2 * scale); x <= Math.floor(cx - arcR + thickness - 2 * scale); x++) {
      if (x >= 0 && x < size && y >= 0 && y < size) points.push({ x, y });
    }
  }

  return points;
}

// Generate
const dir = path.join(__dirname, "..", "public", "icons");
fs.mkdirSync(dir, { recursive: true });

const png192 = generateIcon(192);
fs.writeFileSync(path.join(dir, "icon-192.png"), png192);
console.log("Created icon-192.png (" + png192.length + " bytes)");

const png512 = generateIcon(512);
fs.writeFileSync(path.join(dir, "icon-512.png"), png512);
console.log("Created icon-512.png (" + png512.length + " bytes)");
