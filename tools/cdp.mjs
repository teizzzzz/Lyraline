// tools/cdp.mjs — 用 Chrome DevTools Protocol 驱动本机 Chrome 的小工具库（不需要 puppeteer）
// 被 shot.mjs / probe.mjs 共用。
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const sleep = ms => new Promise(r => setTimeout(r, ms));
export const PAGE = pathToFileURL(resolve('index.html')).href;

export async function launch({ outDir = `${process.env.TEMP}/lyra-shots`, port = 9333 } = {}) {
  const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const OUT = resolve(outDir);
  mkdirSync(OUT, { recursive: true });

  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}/lyra-cdp-${port}`,
    '--window-size=1440,900', 'about:blank',
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 50 && !wsUrl; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      const p = list.find(t => t.type === 'page');
      if (p) wsUrl = p.webSocketDebuggerUrl;
    } catch { /* not ready yet */ }
    if (!wsUrl) await sleep(200);
  }
  if (!wsUrl) throw new Error('chrome not ready');

  const ws = new WebSocket(wsUrl);
  await new Promise(r => { ws.onopen = r; });
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    else if (m.method) listeners.forEach(l => l(m));
  };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const once = method => new Promise(r => {
    const l = m => { if (m.method === method) { listeners.splice(listeners.indexOf(l), 1); r(m.params); } };
    listeners.push(l);
  });
  listeners.push(m => {
    if (m.method === 'Runtime.exceptionThrown') console.log('  [JS ERROR]', m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') console.log('  [console.error]', m.params.args.map(a => a.value ?? a.description).join(' '));
  });
  await send('Page.enable');
  await send('Runtime.enable');

  async function evaluate(expr) {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.result?.exceptionDetails) console.log('  [eval error]', r.result.exceptionDetails.text, expr);
    return r.result?.result?.value;
  }
  async function shot(name) {
    const r = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.result.data, 'base64'));
    console.log('shot', name);
  }
  async function open(url, { width, height, mobile }) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
    const loaded = once('Page.loadEventFired');
    await send('Page.navigate', { url });
    await loaded;
    await sleep(300);
  }
  const go = (slideId, instant = false) => evaluate(`lyra.goTo(lyra.slides.findIndex(s => s.id === '${slideId}'), {instant:${instant}}); 'ok'`);
  const wheel = dy => evaluate(`document.body.dispatchEvent(new WheelEvent('wheel', {deltaY:${dy}, bubbles:true, cancelable:true})); 'ok'`);
  const key = k => evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', {key:'${k}', bubbles:true, cancelable:true})); 'ok'`);
  const state = async () => `index=${await evaluate('lyra.index')} scrollY=${await evaluate('window.scrollY')} disc=${await evaluate('document.getElementById("discStage").dataset.active')} hash=${await evaluate('location.hash')}`;
  const debug = () => evaluate('JSON.stringify(lyra.debug())');
  const close = () => { ws.close(); chrome.kill(); };

  return { OUT, evaluate, shot, open, go, wheel, key, state, debug, close };
}

export const DESKTOP = { width: 1440, height: 900, mobile: false };
export const MOBILE  = { width: 390, height: 844, mobile: true };
