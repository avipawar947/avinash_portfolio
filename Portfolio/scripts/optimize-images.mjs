/**
 * Re-encode and downscale the Figma assets.
 *
 * Figma hands back originals — a 3024x4032 phone photo for a 332px
 * card, a 4096x2731 JPEG for a texture drawn at 10% opacity. next/image
 * optimises what it *serves*, but the originals still sit in the repo
 * and ship to the build host.
 *
 * Uses headless Chrome as the codec rather than adding a native image
 * dependency: the project already needs Chrome for `shot.mjs` and
 * `audit.mjs`, and the stack is meant to stay lean. Each file is decoded
 * into a canvas, scaled to at most 2x its largest rendered size, and
 * re-encoded as WebP.
 *
 *   node scripts/optimize-images.mjs [--dry]
 */
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9355;
const DRY = process.argv.includes("--dry");

/**
 * Target width = 2x the largest size the asset is ever rendered at, so
 * it still looks right on a 2x display. `quality` is tuned per group:
 * photographs tolerate more compression than flat UI art.
 */
const GROUPS = [
  { dir: "public/backgrounds", width: 1920, quality: 0.72 },
  // The mirrored figure fills a 1154px box, so it needs 2x that.
  { dir: "public/images/gallery", only: /^figure./, width: 2308, quality: 0.82 },
  { dir: "public/images/projects", width: 1476, quality: 0.82 },
  { dir: "public/images/gallery", width: 574, quality: 0.82 },
  { dir: "public/images/life", width: 664, quality: 0.82 },
  { dir: "public/images/clients", width: 600, quality: 0.9 },
];

/** Never touch these: tiny, or their exact pixels matter. */
const SKIP = new Set(["ap-logo-sheet.png", "character.png"]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "opt-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  "--no-first-run",
  "--no-default-browser-check",
  "about:blank",
]);

async function targetUrl() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const page = (await res.json()).find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error("Chrome did not start");
}

const ws = new WebSocket(await targetUrl());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));

let nextId = 1;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (!m.id || !pending.has(m.id)) return;
  const { resolve, reject } = pending.get(m.id);
  pending.delete(m.id);
  if (m.error) reject(new Error(JSON.stringify(m.error)));
  else resolve(m.result);
});
const send = (method, params = {}) => {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((res, rej) => pending.set(id, { resolve: res, reject: rej }));
};

await send("Runtime.enable");

// .webp is decodable but never an input: re-encoding an already
// optimised file only loses quality.
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };

let before = 0;
let after = 0;
const rewrites = [];

for (const group of GROUPS) {
  let files;
  try {
    files = readdirSync(group.dir);
  } catch {
    continue;
  }

  for (const name of files) {
    const ext = extname(name).toLowerCase();
    if (!MIME[ext] || SKIP.has(name)) continue;
    if (group.only && !group.only.test(name)) continue;

    const path = join(group.dir, name);
    const bytes = statSync(path).size;
    const dataUrl = `data:${MIME[ext]};base64,${readFileSync(path).toString("base64")}`;

    const { result } = await send("Runtime.evaluate", {
      expression: `(async () => {
        const img = new Image();
        img.src = ${JSON.stringify(dataUrl)};
        await img.decode();
        const scale = Math.min(1, ${group.width} / img.naturalWidth);
        const w = Math.round(img.naturalWidth * scale);
        const h = Math.round(img.naturalHeight * scale);
        const c = new OffscreenCanvas(w, h);
        const ctx = c.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        const blob = await c.convertToBlob({ type: 'image/webp', quality: ${group.quality} });
        const buf = new Uint8Array(await blob.arrayBuffer());
        let s = '';
        for (let i = 0; i < buf.length; i++) s += String.fromCharCode(buf[i]);
        return JSON.stringify({ w, h, ow: img.naturalWidth, oh: img.naturalHeight, b64: btoa(s) });
      })()`,
      awaitPromise: true,
      returnByValue: true,
    });

    const out = JSON.parse(result.value);
    const webp = Buffer.from(out.b64, "base64");

    before += bytes;

    // Only adopt the WebP if it is actually smaller.
    if (webp.length >= bytes && out.w === out.ow) {
      after += bytes;
      console.log(`  keep   ${path}  (${(bytes / 1024).toFixed(0)}KB, webp would be larger)`);
      continue;
    }

    after += webp.length;
    const target = path.replace(/\.(png|jpe?g)$/i, ".webp");
    console.log(
      `  write  ${target}  ${out.ow}x${out.oh} -> ${out.w}x${out.h}  ` +
        `${(bytes / 1024).toFixed(0)}KB -> ${(webp.length / 1024).toFixed(0)}KB`,
    );

    if (!DRY) {
      writeFileSync(target, webp);
      if (target !== path) {
        unlinkSync(path);
        rewrites.push([name, name.replace(/\.(png|jpe?g)$/i, ".webp")]);
      }
    }
  }
}

console.log(
  `\n${(before / 1048576).toFixed(2)}MB -> ${(after / 1048576).toFixed(2)}MB ` +
    `(saved ${(((before - after) / before) * 100).toFixed(0)}%)`,
);
if (rewrites.length) {
  console.log(`\n${rewrites.length} file(s) renamed to .webp — update references:`);
  for (const [from, to] of rewrites) console.log(`  ${from} -> ${to}`);
}

ws.close();
chrome.kill();
try {
  rmSync(profile, { recursive: true, force: true });
} catch {
  /* temp dir */
}
