// tools/shot.mjs — 给 v2 页面批量截图 + 翻页行为自检
// 用法（在 dev/ 目录下）：node tools/shot.mjs [输出目录]
// 依次翻到各板块、试滚轮/键盘翻页、菜单、深色/多语言、入场动画，桌面 + 手机两套尺寸，并打印页面里的 JS 报错。
import { launch, sleep, PAGE, DESKTOP, MOBILE } from './cdp.mjs';

const b = await launch({ outDir: process.argv[2] });
const { evaluate, shot, open, go, wheel, key, state } = b;
const innerOverflow = id => evaluate(`(() => { const el = document.querySelector('#${id} .page-inner'); return el.scrollHeight - el.clientHeight; })()`);

/* ---------------- 桌面 ---------------- */
await open(`${PAGE}?nointro#news`, DESKTOP);
console.log('  open with #news →', await state());

await open(`${PAGE}?nointro`, DESKTOP);
await sleep(1200); await shot('d-home'); console.log('  home →', await state());
console.log('  gsap loaded →', await evaluate('lyra.gsap ? gsap.version : "missing (fallback easing)"'));
console.log('  disc images →', await evaluate(`JSON.stringify([...document.querySelectorAll('.disc-img')].map(i => i.src.split('/').pop() + ':' + (i.complete && i.naturalWidth > 0 ? i.naturalWidth + 'x' + i.naturalHeight : 'NOT LOADED')))`));

// 微滚（一格 = 120 < 阈值 150）：不翻页，页面跟着橡皮筋滚一小段（scrollY > 0）、当前屏略缩小，然后自己回位
const homeTf = () => evaluate('document.getElementById("home").style.transform || "(none)"');
await wheel(120); await sleep(150);
console.log('  small wheel at home → ', await state(), 'home transform =', await homeTf(), await b.debug());
await shot('d-peek-mid'); await sleep(1500);
console.log('  after settle (expect 0, scrollY 0, identity) → ', await state(), 'home transform =', await homeTf());
// 翻到头：首页往上滚够阈值 → 不翻页，当前屏用 transform 往下拉出边界再弹回
await wheel(-120); await sleep(40); await wheel(-120); await sleep(150);
console.log('  wheel up past threshold at home → ', await state(), 'home transform =', await homeTf());
await sleep(1500);
console.log('  after settle → ', await state(), 'home transform =', await homeTf());
// 慢速鼠标：每 300ms 一格，第 2–3 格应累计到阈值翻页
await wheel(120); await sleep(300); await wheel(120); await sleep(300); await wheel(120); await sleep(1500);
console.log('  slow wheel x3 (expect 1) → ', await state());
await go('home', true); await sleep(300);
console.log('  inner overflow (desktop): ', await Promise.all(['home', 'news', 'works', 'world', 'members', 'about'].map(async id => `${id}=${await innerOverflow(id)}`)));

// 滚轮翻页：一次手势累计 ≥ 160 才翻（两格 = 240）
await wheel(120); await sleep(40); await wheel(120); await sleep(340); await shot('d-wheel-mid');   // 翻页缓动进行中
await sleep(900); console.log('  after 2 quick wheels (expect 1) →', await state());
// 触控板：一次推动 + 连续惯性尾巴，整段只能翻一页
await wheel(40);
for (let i = 0; i < 30; i++) { await wheel(Math.max(1, 36 - i * 1.5)); await sleep(45); }
await sleep(1300); console.log('  after trackpad flick (expect 2) →', await state());
await shot('d-works');
await wheel(-120); await sleep(40); await wheel(-120); await sleep(1400); console.log('  wheel up (expect 1) →', await state());
await key('ArrowDown'); await sleep(1400); console.log('  ArrowDown (expect 2) →', await state());
await key('PageDown'); await sleep(1400); console.log('  PageDown (expect 3) →', await state());
await key('ArrowUp'); await sleep(1400); console.log('  ArrowUp (expect 2) →', await state());
await key('End'); await sleep(2000); console.log('  End (expect 6) →', await state());
await key('Home'); await sleep(2000); console.log('  Home (expect 0) →', await state());
await key('End'); await sleep(2000); await wheel(120); await sleep(40); await wheel(120); await sleep(150);
console.log('  wheel down past threshold at last page (expect 6) → ', await state(), 'thanks transform =', await evaluate('document.getElementById("thanks").style.transform || "(none)"'));
await sleep(1500);
await key('ArrowDown'); await sleep(150);
console.log('  ArrowDown at last page (kick) → ', await state(), 'thanks transform =', await evaluate('document.getElementById("thanks").style.transform || "(none)"'));
await sleep(1500);
// 悬停视差：鼠标移动后唱片 / 内容有轻微位移
await evaluate(`window.dispatchEvent(new MouseEvent('mousemove', {clientX: 1300, clientY: 100})); 'ok'`); await sleep(900);
console.log('  hover parallax → face =', await evaluate('document.querySelector(".disc-face").style.transform'), '| stage =', await evaluate('document.getElementById("stage").style.transform || "(none)"'));
console.log('  page-inner transforms after flips →', await evaluate('JSON.stringify([...document.querySelectorAll(".page-inner")].map(el => el.style.transform || "none"))'));

await go('news'); await sleep(1500); await shot('d-news');
await go('world'); await sleep(1500); await shot('d-world');
await go('members'); await sleep(1500); await shot('d-members');
await go('about'); await sleep(1500); await shot('d-about');
await go('thanks'); await sleep(1800); await shot('d-thanks'); console.log('  thanks →', await state());
await go('world'); await sleep(350); await shot('d-world-up-mid');
await sleep(1400); await shot('d-world-up');

await evaluate(`document.getElementById('menuBtn').click(); 'ok'`); await sleep(800); await shot('d-menu');
await evaluate(`document.querySelector('#menuList a[href="#news"]').click(); 'ok'`); await sleep(1600); console.log('  menu → news (expect 1) →', await state());
await evaluate(`document.getElementById('themeBtn').click(); document.querySelector('[data-lang=en]').click(); 'ok'`);
await sleep(800); await shot('d-dark-en');
await evaluate(`document.querySelector('[data-lang=ja]').click(); 'ok'`); await sleep(400); await shot('d-dark-ja');
await evaluate(`localStorage.clear(); 'ok'`);

// 入场动画：1500ms 后自动开盖；期间滚轮应无效
await open(`${PAGE}`, DESKTOP); await sleep(200); await shot('d-intro-0');
await wheel(120); await sleep(200); console.log('  wheel during intro (expect 0) →', await state());
await sleep(1500); await shot('d-intro-mid');
await sleep(1500); await shot('d-intro-done'); console.log('  after intro →', await state());

/* ---------------- 手机 ---------------- */
await open(`${PAGE}?nointro`, MOBILE); await sleep(1200); await shot('m-home');
console.log('  inner overflow (mobile): ', await Promise.all(['home', 'news', 'works', 'world', 'members', 'about'].map(async id => `${id}=${await innerOverflow(id)}`)));
await go('news'); await sleep(350); await shot('m-news-mid'); await sleep(1200); await shot('m-news');
await go('works'); await sleep(1500); await shot('m-works');
await evaluate(`document.querySelector('#works .page-inner').scrollTop = 99999; 'ok'`); await sleep(600); await shot('m-works-scrolled');
await go('world'); await sleep(1500); await shot('m-world');
await go('members'); await sleep(1500); await shot('m-members');
await go('thanks'); await sleep(1800); await shot('m-thanks');
await evaluate(`document.getElementById('menuBtn').click(); 'ok'`); await sleep(800); await shot('m-menu');

b.close();
console.log('done →', b.OUT);
