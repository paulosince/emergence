// Minimal PNG writer (RGB, 8 bit) for researcher previews of camera images.
import { deflateSync } from 'node:zlib';
const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = b => { let c = -1; for (const x of b) c = CRC[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (type, data) => { const t = Buffer.from(type), len = Buffer.alloc(4), crc = Buffer.alloc(4); len.writeUInt32BE(data.length); crc.writeUInt32BE(crc32(Buffer.concat([t, data]))); return Buffer.concat([len, t, data, crc]); };
export function encodePng(width, height, rgb8) {
  const raw = Buffer.alloc((3 * width + 1) * height);
  for (let y = 0; y < height; y++) { raw[y * (3 * width + 1)] = 0; Buffer.from(rgb8.buffer, rgb8.byteOffset + 3 * width * y, 3 * width).copy(raw, y * (3 * width + 1) + 1); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
// tone mapping for display only (Reinhard on luminance, key from the median)
export function toneMap(rgb) {
  const n = rgb.length / 3, lum = new Float32Array(n);
  for (let i = 0; i < n; i++) lum[i] = 0.2126 * rgb[3 * i] + 0.7152 * rgb[3 * i + 1] + 0.0722 * rgb[3 * i + 2];
  const key = [...lum].sort((a, b) => a - b)[Math.floor(n / 2)] * 2 + 1e-6, out = new Uint8Array(rgb.length);
  for (let i = 0; i < rgb.length; i++) out[i] = Math.round(255 * Math.pow(rgb[i] / (rgb[i] + key), 1 / 2.2));
  return out;
}
