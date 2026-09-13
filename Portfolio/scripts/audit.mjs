/**
 * Page audit across viewports: console errors, page errors, failed
 * requests, horizontal overflow, and which elements overflow.
 *
 * Same CDP approach as shot.mjs. Scratchpad tool, not shipped.
 *   node audit.mjs [url]
 */
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9344;
const URL_ = process.argv[2] ?? "http://localhost:3000";

const VIEWPORTS = [
  { name: "large desktop", w: 2560, h: 1440 },
  { name: "desktop", w: 1920, h: 1080 },
  { name: "laptop", w: 1440, h: 900 },
  { name: "tablet", w: 820, h: 1180 },
  { name: "mobile", w: 390, h: 844 },
  { name: "small mobile", w: 320, h: 640 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "audit-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
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
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome did not start");
}

const ws = new WebSocket(await targetUrl());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));

let nextId = 1;
const pending = new Map();
let logs = [];
const reqUrl = new Map();

ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    if (m.error) reject(new Error(JSON.stringify(m.error)));
    else resolve(m.result);
    return;
  }
  if (m.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(m.params.type)) {
    logs.push(`console.${m.params.type}: ${m.params.args.map((a) => a.value ?? a.description ?? "").join(" ")}`);
  }
  if (m.method === "Runtime.exceptionThrown") {
    logs.push(`pageerror: ${m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text}`);
  }
  if (m.method === "Network.requestWillBeSent") reqUrl.set(m.params.requestId, m.params.request.url);
  if (m.method === "Network.loadingFailed") {
    logs.push(`request failed: ${m.params.errorText} (${m.params.type}) ${reqUrl.get(m.params.requestId) ?? "?"}`);
  }
});

const send = (method, params = {}) => {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((res, rej) => pending.set(id, { resolve: res, reject: rej }));
};

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");

let failures = 0;

for (const vp of VIEWPORTS) {
  logs = [];
  await send("Emulation.setDeviceMetricsOverride", {
    width: vp.w,
    height: vp.h,
    deviceScaleFactor: 1,
    mobile: vp.w < 768,
  });
  await send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  // Park on a blank page first. This harness reuses one tab, and a
  // navigation cancels whatever the previous page still had in flight —
  // those ERR_ABORTEDs would otherwise be attributed to the next
  // viewport and read as real failures.
  await send("Page.navigate", { url: "about:blank" });
  await sleep(400);
  logs = [];
  reqUrl.clear();

  await send("Page.navigate", { url: URL_ });
  await sleep(2500);

  // Walk the page so lazy images load, then measure.
  const { result } = await send("Runtime.evaluate", {
    expression: `(async () => {
      const step = innerHeight * 0.9;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        scrollTo(0, y); await new Promise(r => setTimeout(r, 60));
      }
      scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));

      const de = document.documentElement;
      const overflow = de.scrollWidth - de.clientWidth;

      // Which elements actually stick out past the right edge?
      const culprits = [];
      for (const el of document.body.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        if (r.right > de.clientWidth + 1 || r.left < -1) {
          const style = getComputedStyle(el);
          // An element inside its own scroll container is fine.
          let p = el.parentElement, contained = false;
          while (p) {
            const ps = getComputedStyle(p);
            if (ps.overflowX === 'auto' || ps.overflowX === 'scroll' || ps.overflowX === 'hidden') { contained = true; break; }
            p = p.parentElement;
          }
          if (!contained && style.position !== 'fixed') {
            culprits.push(el.tagName + (el.className ? '.' + String(el.className).slice(0, 60) : ''));
          }
        }
      }

      const brokenImgs = [...document.images]
        .filter(i => i.complete && i.naturalWidth === 0)
        .map(i => i.currentSrc || i.src);

      const h1 = document.querySelectorAll('h1').length;
      const noAlt = [...document.images].filter(i => !i.hasAttribute('alt')).length;

      return JSON.stringify({
        overflow,
        scrollWidth: de.scrollWidth,
        clientWidth: de.clientWidth,
        docHeight: document.body.scrollHeight,
        culprits: [...new Set(culprits)].slice(0, 6),
        brokenImgs: [...new Set(brokenImgs)].slice(0, 6),
        h1, noAlt,
      });
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });

  const r = JSON.parse(result.value);
  const bad =
    r.overflow > 0 || r.brokenImgs.length > 0 || r.h1 !== 1 || r.noAlt > 0 || logs.length > 0;
  if (bad) failures++;

  console.log(`\n${bad ? "FAIL" : "ok  "}  ${vp.name} (${vp.w}x${vp.h})`);
  console.log(`      page height ${r.docHeight}px, scrollWidth ${r.scrollWidth} vs ${r.clientWidth}`);
  if (r.overflow > 0) console.log(`      HORIZONTAL OVERFLOW +${r.overflow}px -> ${r.culprits.join(", ") || "(no culprit found)"}`);
  if (r.brokenImgs.length) console.log(`      broken images: ${r.brokenImgs.join(", ")}`);
  if (r.h1 !== 1) console.log(`      h1 count = ${r.h1} (expected 1)`);
  if (r.noAlt) console.log(`      images missing alt: ${r.noAlt}`);
  for (const l of [...new Set(logs)].slice(0, 8)) console.log(`      ${l}`);
}

console.log(`\n${failures === 0 ? "ALL VIEWPORTS CLEAN" : failures + " viewport(s) with findings"}`);

ws.close();
chrome.kill();
try { rmSync(profile, { recursive: true, force: true }); } catch {}
