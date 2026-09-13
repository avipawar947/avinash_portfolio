/**
 * Minimal PNG decoder, enough to answer "does this file have real
 * transparency, and where is the visible mark?".
 *
 * Handles the 8-bit RGB / RGBA / grayscale cases Figma exports; that is
 * all this project needs. Scratchpad tool, not shipped.
 */
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

const CHANNELS = { 0: 1, 2: 3, 4: 2, 6: 4 };

export function decodePng(path) {
  const buf = readFileSync(path);
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");

  let pos = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 8;
  let colorType = 6;
  let palette = null;
  let trns = null;
  const idat = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === "PLTE") palette = data;
    else if (type === "tRNS") trns = data;
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;

    pos += 12 + len;
  }

  if (bitDepth !== 8) throw new Error(`unsupported bit depth ${bitDepth}`);

  const ch = colorType === 3 ? 1 : CHANNELS[colorType];
  if (!ch) throw new Error(`unsupported color type ${colorType}`);

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * ch;
  const out = Buffer.alloc(height * stride);

  // Undo per-scanline filtering (PNG spec 9.2).
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    const cur = out.subarray(y * stride, (y + 1) * stride);

    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? cur[x - ch] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= ch ? prev[x - ch] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[x] = v & 0xff;
    }
  }

  const pixel = (x, y) => {
    const i = y * stride + x * ch;
    if (colorType === 3) {
      const p = out[i] * 3;
      return {
        r: palette[p],
        g: palette[p + 1],
        b: palette[p + 2],
        a: trns && out[i] < trns.length ? trns[out[i]] : 255,
      };
    }
    if (colorType === 0) return { r: out[i], g: out[i], b: out[i], a: 255 };
    if (colorType === 4)
      return { r: out[i], g: out[i], b: out[i], a: out[i + 1] };
    if (colorType === 2)
      return { r: out[i], g: out[i + 1], b: out[i + 2], a: 255 };
    return { r: out[i], g: out[i + 1], b: out[i + 2], a: out[i + 3] };
  };

  return { width, height, colorType, hasAlpha: colorType === 4 || colorType === 6, pixel };
}

if (process.argv[2]) {
  const img = decodePng(process.argv[2]);
  console.log(
    `${process.argv[2]}  ${img.width}x${img.height} colorType=${img.colorType} alpha=${img.hasAlpha}`,
  );

  // Report, per horizontal band, how much of it is opaque and how light
  // it is — enough to locate a mark and tell figure from ground.
  const cols = 8;
  const rows = 6;
  for (let ry = 0; ry < rows; ry++) {
    const cells = [];
    for (let rx = 0; rx < cols; rx++) {
      let opaque = 0;
      let lum = 0;
      let n = 0;
      for (let y = Math.floor((ry * img.height) / rows); y < Math.floor(((ry + 1) * img.height) / rows); y += 3) {
        for (let x = Math.floor((rx * img.width) / cols); x < Math.floor(((rx + 1) * img.width) / cols); x += 3) {
          const p = img.pixel(x, y);
          if (p.a > 16) opaque++;
          lum += (p.r + p.g + p.b) / 3;
          n++;
        }
      }
      cells.push(`a${String(Math.round((opaque / n) * 100)).padStart(3)}% l${String(Math.round(lum / n)).padStart(3)}`);
    }
    console.log(cells.join(" | "));
  }
}
