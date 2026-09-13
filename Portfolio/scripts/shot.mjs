/**
 * Deterministic screenshot harness for verifying sections against Figma.
 *
 * Chrome's --screenshot flag starves requestAnimationFrame under
 * --virtual-time-budget, so entrance animations get captured part-way
 * through and no two runs agree. This drives Chrome over CDP instead and
 * emulates prefers-reduced-motion, which pins every animation in this
 * project to its final state — the state worth comparing to Figma.
 *
 * Lives in the scratchpad: a verification tool, not part of the app.
 *
 *   node shot.mjs --url=... --out=... [--w=1920] [--h=1148]
 *                 [--clip=x,y,w,h] [--full] [--dsf=1] [--motion=reduce|no-preference]
 */
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9333;

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  }),
);

const url = args.url ?? "http://localhost:3000";
const out = args.out ?? "shot.png";
const width = Number(args.w ?? 1920);
const height = Number(args.h ?? 1148);
const dsf = Number(args.dsf ?? 1);
const motion = args.motion ?? "reduce";
const full = args.full === "true";
const clip = args.clip
  ? // deviceScaleFactor already scales the capture; clip.scale would double it
      (([x, y, w, h]) => ({ x, y, width: w, height: h, scale: 1 }))(
      args.clip.split(",").map(Number),
    )
  : undefined;

const profile = mkdtempSync(join(tmpdir(), "shot-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  `--window-size=${width},${height}`,
  "--no-first-run",
  "--no-default-browser-check",
  "about:blank",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Poll the DevTools endpoint until Chrome is listening. */
async function targetUrl() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const targets = await res.json();
      const page = targets.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error("Chrome did not expose a DevTools page target");
}

const ws = new WebSocket(await targetUrl());
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});

let nextId = 1;
const pending = new Map();
const events = new Map();

ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  } else if (msg.method) {
    events.get(msg.method)?.forEach((fn) => fn(msg.params));
  }
});

function send(method, params = {}) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

function once(method) {
  return new Promise((resolve) => {
    const list = events.get(method) ?? [];
    const handler = (params) => {
      events.set(
        method,
        (events.get(method) ?? []).filter((fn) => fn !== handler),
      );
      resolve(params);
    };
    events.set(method, [...list, handler]);
  });
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height,
  deviceScaleFactor: dsf,
  mobile: width < 768,
});
await send("Emulation.setEmulatedMedia", {
  media: "screen",
  features: [{ name: "prefers-reduced-motion", value: motion }],
});

const loaded = once("Page.loadEventFired");
await send("Page.navigate", { url });
await loaded;

// Let fonts settle and any in-flight images decode before capturing.
await send("Runtime.evaluate", {
  expression: "document.fonts.ready.then(() => true)",
  awaitPromise: true,
});

// next/image lazy-loads below the fold, and captureBeyondViewport does
// NOT trigger that — it renders past the viewport without ever scrolling,
// so off-screen images stay unloaded and capture blank. Walk the page
// first to bring everything into view, then return to the region wanted.
if (args.scroll !== "false") {
  await send("Runtime.evaluate", {
    expression: `(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, ${Number(args.scrollTo ?? 0)});
      // Race the decode wait against a deadline: an image that never
      // fires load or error would otherwise hang this evaluate forever.
      await Promise.race([
        Promise.all(
          [...document.images].filter((i) => !i.complete).map(
            (i) => new Promise((r) => { i.onload = i.onerror = r; })
          )
        ),
        new Promise((r) => setTimeout(r, 8000)),
      ]);
      return true;
    })()`,
    awaitPromise: true,
  });
}

await sleep(Number(args.settle ?? 1200));

const shot = await send("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: full || Boolean(clip),
  ...(clip ? { clip } : {}),
});

writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log(`wrote ${out}`);

ws.close();
chrome.kill();
try {
  rmSync(profile, { recursive: true, force: true });
} catch {
  /* profile dir is in temp; leaking it is harmless */
}
