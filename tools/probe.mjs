// tools/probe.mjs — 定点排查：手机端各板块 .page-inner 的溢出来自哪个子元素
// 用法（在 dev/ 目录下）：node tools/probe.mjs
import { launch, sleep, PAGE, MOBILE } from './cdp.mjs';

const b = await launch({ port: 9334 });
const { open, evaluate, go } = b;

await open(`${PAGE}?nointro`, MOBILE);
await sleep(1500);
for (const id of ['home', 'news', 'works']) {
  await go(id, true); await sleep(1200);            // 等淡入结束
  const info = await evaluate(`(() => {
    const inner = document.querySelector('#${id} .page-inner');
    const ib = inner.getBoundingClientRect();
    const kids = [...inner.children].map(k => {
      const r = k.getBoundingClientRect();
      const cs = getComputedStyle(k);
      return { tag: k.tagName + (k.className ? '.' + String(k.className).split(' ')[0] : ''), top: Math.round(r.top - ib.top + inner.scrollTop), bottom: Math.round(r.bottom - ib.top + inner.scrollTop), mb: cs.marginBottom, tf: cs.transform, isIn: k.classList.contains('is-in') };
    });
    return JSON.stringify({ id: '${id}', scrollHeight: inner.scrollHeight, clientHeight: inner.clientHeight, over: inner.scrollHeight - inner.clientHeight, kids }, null, 0);
  })()`);
  console.log(info);
}
b.close();
