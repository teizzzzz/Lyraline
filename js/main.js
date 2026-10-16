/* =====================================================================
   共鳴線 LyraLine — v2 main.js
   目录/唱片配置 → 渲染 → 整屏翻页引擎（弹簧物理：微滚橡皮筋 / 翻页）→ 唱片弹入弹出
   → 微动效（视差 / hover）→ 菜单/底色/语言 → 入场动画
   ===================================================================== */
(() => {
  'use strict';

  /* ------------------------------------------------------------------
     配置
     ------------------------------------------------------------------ */
  // 目录：id 对应 <section id>，letter 是草图里的 A–E，subs 是子目录 ①②③ 的 i18n key
  const NAV = [
    { id: 'home',    letter: '',  latin: 'HOME',    key: 'nav.home',    subs: [] },
    { id: 'news',    letter: 'A', latin: 'NEWS',    key: 'nav.news',    subs: ['news.sub1', 'news.sub2'] },
    { id: 'works',   letter: 'B', latin: 'WORKS',   key: 'nav.works',   subs: ['works.sub1', 'works.sub2'] },
    { id: 'world',   letter: 'C', latin: 'WORLD',   key: 'nav.world',   subs: ['world.sub1', 'world.sub2', 'world.sub3'] },
    { id: 'members', letter: 'D', latin: 'MEMBERS', key: 'nav.members', subs: ['members.sub1', 'members.sub2', 'members.sub3'] },
    { id: 'about',   letter: 'E', latin: 'ABOUT',   key: 'nav.about',   subs: ['about.sub1', 'about.sub2'] },
  ];

  // 唱片：每个板块一张（草图："切换一次目录就换一个唱片"）
  //   img   : tools/make-discs.py 从 assets/img 里的 Top、A–E 裁出来的正方形 WebP；去掉 img 就退回纯色 demo 盘
  //   free  : 不是圆盘（E 是 WP-7 侧脸）→ 不裁圆、不旋转
  //   scale : free 图相对唱片位的大小（1 = 和唱片一样大；E 设成 1.15，让侧脸下缘伸出屏幕，不露出图片的裁切边）
  //   color / label / ink / text 只在没有 img 时用（纯色 demo 盘）
  const DISCS = [
    { id: 'home',    img: 'assets/img/discs/top.webp', color: '#1b1b1b', label: '#f2eee4', ink: '#1b1b1b', text: '共鳴線' },
    { id: 'news',    img: 'assets/img/discs/a.webp',   color: '#ec7f2b', label: '#fff3e6', ink: '#3a2110', text: 'A · NEWS' },
    { id: 'works',   img: 'assets/img/discs/b.webp',   color: '#a89968', label: '#f6f1e3', ink: '#3a3222', text: 'B · WORKS' },
    { id: 'world',   img: 'assets/img/discs/c.webp',   color: '#5f7d63', label: '#eef3ea', ink: '#1f2f22', text: 'C · WORLD' },
    { id: 'members', img: 'assets/img/discs/d.webp',   color: '#4d6f9e', label: '#eaf0f8', ink: '#182636', text: 'D · MEMBERS' },
    { id: 'about',   img: 'assets/img/discs/e.webp',   free: true, scale: 1.15,
                     color: '#b95c4b', label: '#f9ebe7', ink: '#3a1d17', text: 'E · ABOUT' },
  ];

  /* ---------- 动效参数 ---------- */
  // 翻页 / 微滚：整个滚动位置由一个弹簧驱动，微滚是"橡皮筋"，翻页只是把弹簧目标换成下一屏，所以任何状态之间都是连续过渡
  const FLIP_THRESHOLD = 150;    // 一次手势内累计滚动量（px）达到这个值才翻页（鼠标滚轮一格约 100–120：一格弹回，连滚两格翻页）
  const ACCUM_TAU = 0.35;        // 累计量的衰减时间常数（秒）：停止滚动后微滚预览自己慢慢回位
  const PEEK_MAX = 110;          // 橡皮筋最多拉多远（px），越拉越紧
  const PEEK_SCALE = 0.03;       // 微滚时当前屏最多缩小 3%
  const SWIPE_MIN = 50;          // 触摸：松手时滑动距离（px）够这个值才翻页
  const KICK_V = 600;            // 键盘/触摸翻到头时给弹簧的一下冲量（px/s）
  const SPRING = {               // freq 越大动作越快；damp < 1 有回弹，= 1 刚好不回弹
    flip: { freq: 7.5, damp: 0.92 },   // 翻页：约 0.8s 到位，几乎不过冲
    peek: { freq: 12,  damp: 0.85 },   // 微滚跟随 / 弹回：跟手，轻微回弹
  };
  const PARALLAX_FLIP = 48;      // 翻页时新旧页内容的视差位移
  const PARALLAX_HOVER = 14;     // 鼠标移动时唱片的视差幅度

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const G = window.gsap || null;                 // GSAP 只用于视差 / hover 微动；没加载到也不影响翻页
  const skipIntro = new URLSearchParams(location.search).has('nointro');
  let introRunning = !skipIntro;

  /* ------------------------------------------------------------------
     目录渲染（首页目录 + 菜单共用同一份 NAV）
     ------------------------------------------------------------------ */
  function renderNav(target, items, withSubs) {
    target.innerHTML = items.map(n => `
      <li><a href="#${n.id}" data-nav="${n.id}">
        <b>${n.letter || '—'}</b>
        <span class="latin">${n.latin}</span>
        <span class="local" data-i18n="${n.key}"></span>
        ${withSubs && n.subs.length
          ? `<span class="subs">${n.subs.map(k => `<span data-i18n="${k}"></span>`).join('<em>/</em>')}</span>`
          : ''}
      </a></li>`).join('');
  }
  renderNav($('#menuList'), NAV, true);

  /* ------------------------------------------------------------------
     唱片渲染
     ------------------------------------------------------------------ */
  const stage = $('#discStage');
  const discEls = new Map();
  DISCS.forEach(d => {
    const el = document.createElement('div');
    el.className = 'disc' + (d.img ? ' disc--img' : '') + (d.free ? ' disc--free' : '');
    el.dataset.discId = d.id;
    el.style.setProperty('--disc-color', d.color);
    el.style.setProperty('--disc-label', d.label);
    el.style.setProperty('--disc-ink', d.ink);
    if (d.scale) el.style.setProperty('--disc-scale', d.scale);
    el.innerHTML = `
      <div class="disc-face"${d.clip ? ` style="clip-path:${d.clip}"` : ''}>
        ${d.img ? `<img class="disc-img" src="${d.img}" alt="" draggable="false">` : ''}
        <div class="disc-label"><span>${d.text || ''}</span></div>
        <div class="disc-hole"></div>
      </div>`;
    stage.appendChild(el);
    discEls.set(d.id, el);
  });
  const faces = $$('.disc-face', stage);
  const spinFaces = faces.filter(f => !f.closest('.disc--free'));   // 圆盘：转
  const freeFaces = faces.filter(f => f.closest('.disc--free'));    // 角色图：不转，只跟鼠标视差

  /* ------------------------------------------------------------------
     转盘目录：NAV 的标题沿唱片圆弧排布，每屏一格（DIAL_STEP 度）
     整圈的角度 = -(滚动位置 / 一屏高) × 步长，所以翻页、微滚橡皮筋都会带着它转
     ------------------------------------------------------------------ */
  const DIAL_STEP = 24;          // 桌面：相邻标题的角度间隔
  const DIAL_STEP_MOBILE = 34;   // 手机：标题在底部弧上，间隔大一点免得挤
  const mobileMQ = window.matchMedia('(max-width: 768px)');
  const dial = document.createElement('div');
  dial.className = 'dial';
  dial.innerHTML = NAV.map(n =>
    `<div class="dial-item" data-slide-id="${n.id}"><span><b>${n.letter || '—'}</b>${n.latin}</span></div>`).join('');
  stage.appendChild(dial);
  const dialItems = $$('.dial-item', dial);
  const dialSpans = dialItems.map(el => el.firstElementChild);
  const dialStep = () => (mobileMQ.matches ? DIAL_STEP_MOBILE : DIAL_STEP);
  const dialBase = () => (mobileMQ.matches ? 90 : 0);      // 指针方向：桌面 3 点钟，手机 6 点钟
  // 排列方向：桌面下一个在指针下方（顺时针 +），手机下一个在指针右边（逆时针 −），整圈转向随之相反；唱片自身的旋转不受影响
  const dialDir = () => (mobileMQ.matches ? -1 : 1);
  const dialAngle = i => dialBase() + dialDir() * i * dialStep();
  function layoutDial() {
    dialItems.forEach((el, i) => el.style.setProperty('--a', dialAngle(i)));
    if (!mobileMQ.matches) dialSpans.forEach(sp => { sp.style.transform = ''; });
  }
  layoutDial();
  mobileMQ.addEventListener('change', layoutDial);
  let dialFocus = -1;

  /* ------------------------------------------------------------------
     唱片切换：dir = 1 向下翻，-1 向上翻
     向下：旧唱片往上方弹出，新唱片从下方弹入；向上则相反
     ------------------------------------------------------------------ */
  let activeId = null;
  function switchDisc(nextId, dir) {
    if (nextId === activeId) return;
    const prev = activeId ? discEls.get(activeId) : null;
    const next = discEls.get(nextId) || null;      // data-disc="none" → 全部退场

    if (prev) {
      prev.classList.remove('is-active');
      prev.classList.toggle('is-above', dir > 0);
    }
    if (next) {
      next.classList.add('no-transition');
      next.classList.toggle('is-above', dir < 0);  // 先无动画地停到入场那一侧
      void next.offsetWidth;                        // 强制回流，让车位生效
      next.classList.remove('no-transition');
      next.classList.remove('is-above');
      next.classList.add('is-active');
    }
    activeId = nextId;
    stage.dataset.active = nextId;
  }

  /* ------------------------------------------------------------------
     幻灯片：每个 [data-disc] 板块是一屏
     ------------------------------------------------------------------ */
  const slides = $$('[data-disc]');
  const stageEl = $('#stage');                     // 包住 main + footer，鼠标悬停时轻微横向视差
  const innerOf = i => slides[i].querySelector('.page-inner');
  const inners = slides.map((s, i) => innerOf(i)).filter(Boolean);
  const canScroll = (el, dir) => !!el && (dir > 0
    ? el.scrollTop + el.clientHeight < el.scrollHeight - 1
    : el.scrollTop > 0);
  const titleOf = s => { const n = NAV.find(n => n.id === s.id); return n ? n.latin : (s.dataset.title || s.id.toUpperCase()); };
  const slideTop = i => slides[i].offsetTop;

  // 右侧页码圆点
  const dots = $('#dots');
  dots.innerHTML = slides.map((s, i) =>
    `<button type="button" data-slide="${i}" aria-label="${titleOf(s)}"><span>${titleOf(s)}</span></button>`).join('');   // 桌面端竖排文字导航，手机端只显示短线
  const dotEls = $$('button', dots);
  dots.addEventListener('click', e => {
    const b = e.target.closest('[data-slide]');
    if (b) goTo(+b.dataset.slide);
  });
  // 转盘标题：点哪个翻到哪个
  const dialIndex = dialItems.map(el => slides.findIndex(s => s.id === el.dataset.slideId));
  dial.addEventListener('click', e => {
    const it = e.target.closest('.dial-item');
    if (!it) return;
    const i = dialIndex[dialItems.indexOf(it)];
    if (i >= 0) goTo(i);
  });

  /* ---------- 当前板块追踪：视口中线落在哪个板块 ---------- */
  const nowLetter = $('#now .now-letter');
  const nowTitle  = $('#now .now-title');
  let lastY = window.scrollY;
  let currentPage = null;
  let ticking = false;

  function setCurrent(page, dir) {
    currentPage = page;
    slides.forEach(p => p.classList.toggle('is-active', p === page));
    switchDisc(page.dataset.disc, dir);
    $$('[data-nav]').forEach(a => a.classList.toggle('is-current', a.dataset.nav === page.id));
    const pad = n => String(n).padStart(2, '0');
    nowLetter.textContent = `${pad(slides.indexOf(page) + 1)} / ${pad(slides.length)}`;   // 参考站的 01 / 05 计数
    nowTitle.textContent  = titleOf(page);
  }
  function update() {
    ticking = false;
    const y = window.scrollY;
    const dir = y >= lastY ? 1 : -1;
    lastY = y;
    const mid = window.innerHeight * 0.5;
    const page = slides.find(p => {
      const r = p.getBoundingClientRect();
      return r.top <= mid && r.bottom > mid;
    });
    if (page && page !== currentPage) setCurrent(page, dir);
  }
  function requestUpdate() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', requestUpdate, { passive: true });

  /* ------------------------------------------------------------------
     翻页引擎：弹簧
       pos / vel   当前滚动位置和速度
       target      = 当前屏顶部 + 橡皮筋(accum)
       accum       手势累计滚动量，随时间衰减；达到 FLIP_THRESHOLD → index 变、目标换到下一屏
     首尾两屏拉出边界时，滚动位置到头了，多出来的位移改用 transform 让当前屏位移，视觉上一样是橡皮筋
     ------------------------------------------------------------------ */
  let index = 0;
  let pos = 0, vel = 0, target = 0;
  let mode = 'peek';             // 'flip'：正在翻页（用 flip 的弹簧参数）/ 'peek'：静止或微滚
  let accum = 0;
  let holding = false;           // 手指按着：累计量不衰减
  let scaleCur = 0;              // 当前屏缩小程度 0–1（平滑后）
  let scaledSlide = null;
  let spinKick = 0;
  let zoomTarget = 1;

  const rubber = x => Math.sign(x) * PEEK_MAX * (1 - Math.exp(-Math.abs(x) / PEEK_MAX));
  const flying = () => mode === 'flip' && Math.abs(slideTop(index) - pos) > 2;
  const maxScroll = () => slideTop(slides.length - 1);

  function goTo(i, { instant = false } = {}) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    const dir = i >= index ? 1 : -1;
    const fromIndex = index;
    index = i;
    accum = 0;
    dotEls.forEach((b, k) => b.classList.toggle('is-on', k === i));
    history.replaceState(null, '', i === 0 ? location.pathname + location.search : '#' + slides[i].id);

    if (instant || reduceMotion) {
      pos = target = slideTop(i); vel = 0; mode = 'peek';
      window.scrollTo(0, pos);
      requestUpdate();
      return;
    }
    mode = 'flip';
    target = slideTop(i);
    // 轻微视差：新页内容比页面本身稍晚跟上，旧页内容稍早离开
    if (G) {
      G.killTweensOf(inners); G.set(inners, { y: 0 });
      const nextInner = innerOf(i);
      const prevInner = innerOf(fromIndex);
      if (nextInner) G.fromTo(nextInner, { y: dir * PARALLAX_FLIP }, { y: 0, duration: 0.9, ease: 'power3.out', delay: 0.05 });
      if (prevInner && prevInner !== nextInner) {
        G.to(prevInner, { y: -dir * PARALLAX_FLIP * 0.6, duration: 0.6, ease: 'power2.in', onComplete: () => G.set(prevInner, { y: 0 }) });
      }
    }
  }
  // 翻到头：给弹簧一下冲量，自己拉出去再弹回来
  function kick(dir) {
    vel += dir * KICK_V;
    spinKick += dir * 8;
  }
  function tryFlip(dir) {
    const t = index + dir;
    if (t < 0 || t >= slides.length) { kick(dir); return; }
    goTo(t);
  }
  const next = () => tryFlip(1);
  const prev = () => tryFlip(-1);

  window.addEventListener('resize', () => goTo(index, { instant: true }));
  window.addEventListener('hashchange', () => {
    const i = slides.findIndex(s => '#' + s.id === location.hash);
    if (i >= 0 && i !== index) goTo(i);
  });

  /* ---------- 输入：滚轮 / 触摸 / 键盘 ---------- */
  const menu = $('#menu');
  const menuOpen = () => menu.classList.contains('is-open');
  const inputBlocked = () => introRunning || menuOpen();

  // 板块内部（.page-inner）最近一次滚动的时间：刚滚到底时先别急着翻页
  let lastInnerT = 0;
  document.addEventListener('scroll', e => {
    if (e.target !== document) { lastInnerT = performance.now(); refreshMore(); }
  }, true);
  const innerJustScrolled = () => performance.now() - lastInnerT < 400;

  // 内容没滚到底的板块加 .has-more（底部渐隐提示）
  function refreshMore() {
    slides.forEach((s, i) => s.classList.toggle('has-more', canScroll(innerOf(i), 1)));
  }
  window.addEventListener('resize', refreshMore);
  document.addEventListener('lyra:lang', refreshMore);
  window.addEventListener('load', refreshMore);
  setTimeout(refreshMore, 1200);                            // 淡入动画结束后再算一次

  /* 滚轮：累计一次手势的滚动量 → 不到阈值只是橡皮筋（自己回位）；到阈值翻页 */
  let lastWheelT = 0, lastWheelD = 0;
  let gestureUsed = false;       // 本次滚轮手势已经翻过页：后面的惯性尾巴全部吃掉
  window.addEventListener('wheel', e => {
    if (introRunning) { e.preventDefault(); return; }
    if (menuOpen()) return;                                  // 菜单自己能滚
    const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
    if (!dir) return;

    const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1;   // 行 / 页 → 像素
    const dy = e.deltaY * unit;
    const now = performance.now();
    const d = Math.abs(dy);
    const gap = now - lastWheelT;
    const prevD = lastWheelD;
    lastWheelT = now; lastWheelD = d;
    if (gap > 250) gestureUsed = false;                                      // 停顿过 → 新手势
    else if (d >= 50 || (!flying() && d > prevD + 2)) gestureUsed = false;  // 鼠标又滚了一格 / 翻页结束后触控板重新推 → 新手势
    if (gestureUsed) { e.preventDefault(); return; }

    const inner = innerOf(index);
    if (!flying() && canScroll(inner, dir)) {                // 板块内容还没滚完：先滚内容
      if (inner.contains(e.target)) return;                  // 指针在内容上，交给原生滚动
      e.preventDefault();
      inner.scrollBy({ top: dy, behavior: 'smooth' });
      lastInnerT = now;
      return;
    }

    e.preventDefault();
    if (innerJustScrolled() || d < 4) return;                // 刚滚到内容底部 / 惯性末尾零星小事件
    if (accum === 0 && d < 50 && gap < 250 && d <= prevD) return;   // 正在衰减的惯性尾巴，不当作新手势的开始

    if (Math.sign(accum) !== dir) accum = 0;                 // 换了方向：重新累计
    accum += dy;
    if (Math.abs(accum) < FLIP_THRESHOLD) return;            // 没滚够：橡皮筋在 tick 里跟着 accum 走
    gestureUsed = true;
    const t = index + dir;
    if (t < 0 || t >= slides.length) {                       // 到头：橡皮筋拉满，然后自己弹回
      accum = dir * FLIP_THRESHOLD;
      spinKick += dir * 8;
      return;
    }
    accum = 0;
    goTo(t);
  }, { passive: false });

  /* 触摸：手指拖动时页面跟着（橡皮筋），松手时滑动距离够 SWIPE_MIN 才翻页，否则弹回 */
  let touch = null;
  document.addEventListener('touchstart', e => {
    touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, scrolling: false };
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (!touch || touch.scrolling || inputBlocked() || flying()) return;
    const dy = touch.y - e.touches[0].clientY;               // 正 = 手指上滑 = 往下翻
    const dx = touch.x - e.touches[0].clientX;
    if (Math.abs(dy) < 6 || Math.abs(dy) < Math.abs(dx)) return;
    if (canScroll(innerOf(index), dy > 0 ? 1 : -1)) { touch.scrolling = true; accum = 0; holding = false; return; }   // 这次手势是在滚内容
    holding = true;
    accum = dy * 1.2;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (!touch) return;
    const t = touch; touch = null; holding = false;
    if (inputBlocked() || t.scrolling) return;
    const dx = t.x - e.changedTouches[0].clientX;
    const dy = t.y - e.changedTouches[0].clientY;
    if (Math.abs(dy) < SWIPE_MIN || Math.abs(dy) < Math.abs(dx) || innerJustScrolled() || flying()) return;   // 不够：accum 衰减，自己弹回
    accum = 0;
    tryFlip(dy > 0 ? 1 : -1);
  }, { passive: true });
  document.addEventListener('touchcancel', () => { touch = null; holding = false; }, { passive: true });

  window.addEventListener('keydown', e => {
    if (inputBlocked()) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === 'Home') { e.preventDefault(); goTo(0); return; }
    if (e.key === 'End')  { e.preventDefault(); goTo(slides.length - 1); return; }
    const dir = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const inner = innerOf(index);
    if (canScroll(inner, dir)) { inner.scrollBy({ top: dir * window.innerHeight * 0.6, behavior: 'smooth' }); return; }
    if (!flying()) tryFlip(dir);
  });

  /* ---------- 锚点：目录 / 菜单 / 回顶部 都走翻页 ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const i = slides.findIndex(s => s.id === id);
    if (i < 0) return;
    e.preventDefault();
    closeMenu();
    goTo(i);
  });

  /* ------------------------------------------------------------------
     每帧：弹簧积分 → 滚动 → 当前屏缩放/边界位移 → 唱片旋转 / 视差 / 缩放
     ------------------------------------------------------------------ */
  let angle = 0;
  let prevT = performance.now();
  let prevScroll = window.scrollY;
  let px = 0, py = 0, tx = 0, ty = 0;      // 悬停视差：当前值 / 目标值
  let zoom = 1;

  // 弹簧用固定小步长积分：帧率低（比如截图工具、后台标签页）时也按真实时间走
  function integrate(dt) {
    if (!holding && accum !== 0) {                           // 累计量衰减（手指按着时不衰减）
      accum *= Math.exp(-dt / ACCUM_TAU);
      if (Math.abs(accum) < 6) accum = 0;                    // 快到底了直接归零，别拖一个几像素的长尾
    }
    target = slideTop(index) + rubber(accum);
    const sp = SPRING[mode];
    const w = sp.freq, c = 2 * w * sp.damp;
    vel += (w * w * (target - pos) - c * vel) * dt;
    pos += vel * dt;
    if (Math.abs(target - pos) < 0.3 && Math.abs(vel) < 2) {
      pos = target; vel = 0;
      if (mode === 'flip') mode = 'peek';
    }
  }

  function tick(t) {
    const dt = Math.min((t - prevT) / 1000, 0.1); prevT = t;

    // 1–2. 累计量衰减 + 弹簧（子步长 1/120s）
    for (let rem = dt; rem > 0; rem -= 1 / 120) integrate(Math.min(rem, 1 / 120));
    const peek = rubber(accum);
    const clamped = Math.max(0, Math.min(maxScroll(), pos));
    if (Math.abs(window.scrollY - clamped) > 0.05) window.scrollTo(0, clamped);
    const overY = clamped - pos;                             // 拉出首尾边界的部分，用 transform 表现

    // 3. 当前屏：微滚时略缩小 + 边界橡皮筋位移
    const st = Math.min(Math.abs(accum) / FLIP_THRESHOLD, 1);
    scaleCur += (st - scaleCur) * Math.min(1, dt * 12);
    if (scaleCur < 0.002 && st === 0) scaleCur = 0;
    const cur = slides[index];
    if (scaledSlide && scaledSlide !== cur) scaledSlide.style.transform = '';
    scaledSlide = cur;
    const s = 1 - PEEK_SCALE * scaleCur;
    cur.style.transform = (Math.abs(overY) > 0.05 || scaleCur > 0.002)
      ? `translate3d(0, ${overY.toFixed(2)}px, 0) scale(${s.toFixed(4)})`
      : '';
    zoomTarget = 1 - PEEK_SCALE * 0.6 * scaleCur;

    // 4. 唱片：闲置慢转 + 跟随滚动 + 翻到头时搓一下；鼠标视差；微滚时略缩小、跟着橡皮筋轻微上下
    const sy = window.scrollY; const ds = sy - prevScroll; prevScroll = sy;
    if (!reduceMotion) {
      angle += dt * 6 + ds * 0.08 + spinKick * 0.12;
      spinKick *= 0.88;
    }
    px += (tx - px) * 0.06; py += (ty - py) * 0.06;
    zoom += (zoomTarget - zoom) * 0.1;
    const dy = py - (peek - overY) * 0.15;
    const move = `translate3d(${px.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
    const sc = ` scale(${zoom.toFixed(4)})`;
    const tf = `${move} rotate(${angle.toFixed(2)}deg)${sc}`;
    spinFaces.forEach(f => { f.style.transform = tf; });
    freeFaces.forEach(f => { f.style.transform = move + sc; });

    // 5. 转盘目录：跟着滚动位置转，离指针最近的标题聚焦
    const pageH = slides.length > 1 ? slideTop(1) : window.innerHeight;
    const frac = pos / pageH;                                // 连续的"第几屏"
    const ring = -dialDir() * frac * dialStep();             // 把第 frac 个标题转到指针位置
    dial.style.transform = `${move} rotate(${ring.toFixed(2)}deg)${sc}`;
    if (mobileMQ.matches) {                                  // 手机：标题反转回水平
      dialSpans.forEach((sp, i) => { sp.style.transform = `rotate(${(-(dialAngle(i) + ring)).toFixed(1)}deg)`; });
    }
    const nearest = Math.max(0, Math.min(slides.length - 1, Math.round(frac)));
    if (nearest !== dialFocus) {
      dialFocus = nearest;
      dialItems.forEach((el, i) => {
        const d = Math.abs(dialIndex[i] - nearest);
        el.classList.toggle('is-focus', d === 0);
        el.classList.toggle('is-near', d === 1);
        el.classList.toggle('is-far', d > 1);
      });
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ------------------------------------------------------------------
     微动效：鼠标移动时唱片 / 内容轻微视差，目录项 / 卡片 hover 微动
     （只在有鼠标的设备上启用）
     ------------------------------------------------------------------ */
  if (hoverable && !reduceMotion) {
    const contentX = G ? G.quickTo(stageEl, 'x', { duration: 0.9, ease: 'power3.out' }) : null;
    window.addEventListener('mousemove', e => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      tx = nx * PARALLAX_HOVER;
      ty = ny * PARALLAX_HOVER * 0.7;
      if (contentX) contentX(-nx * PARALLAX_HOVER * 0.35);   // 内容往反方向轻微走
    }, { passive: true });

    if (G) {
      const bind = (els, on, off) => els.forEach(el => {
        el.addEventListener('mouseenter', () => G.to(el, { ...on, duration: 0.35, ease: 'power3.out', overwrite: 'auto' }));
        el.addEventListener('mouseleave', () => G.to(el, { ...off, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }));
      });
      bind($$('.card'), { y: -3 }, { y: 0 });
      bind($$('.platforms a'), { y: -2 }, { y: 0 });
    }
  }

  /* ------------------------------------------------------------------
     内容进入视口时淡入
     ------------------------------------------------------------------ */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  $$('.page-inner > *').forEach(el => io.observe(el));

  /* ------------------------------------------------------------------
     菜单（快速回归首页目录）
     ------------------------------------------------------------------ */
  const menuBtn = $('#menuBtn');
  function openMenu() {
    menu.classList.add('is-open'); menuBtn.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false'); menuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    if (!menuOpen()) return;
    menu.classList.remove('is-open'); menuBtn.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true'); menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', () => (menuOpen() ? closeMenu() : openMenu()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ------------------------------------------------------------------
     底色切换（草图 PS：预想白色，但黑也好看 → 两种都留着）
     ------------------------------------------------------------------ */
  const THEME_KEY = 'lyra.theme';
  function setTheme(theme, persist) {
    document.documentElement.dataset.theme = theme;
    if (persist) { try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ } }
  }
  let savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
  setTheme(savedTheme === 'dark' ? 'dark' : 'light', false);
  $('#themeBtn').addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  /* ------------------------------------------------------------------
     语言切换（中 / EN / 日）
     ------------------------------------------------------------------ */
  const I18N = window.LYRA_I18N;
  I18N.apply(I18N.detect(), false);
  $$('[data-lang]').forEach(b => b.addEventListener('click', () => I18N.apply(b.dataset.lang, true)));

  /* ------------------------------------------------------------------
     启动：先定位到 URL 里的板块，再播入场动画
     URL 加 ?nointro 可跳过入场动画（调试用）
     ------------------------------------------------------------------ */
  const startIndex = Math.max(0, slides.findIndex(s => '#' + s.id === location.hash));
  const intro = $('#intro');

  function openCase() {
    if (!introRunning || intro.classList.contains('is-open')) return;
    intro.classList.add('is-open');
    setTimeout(update, 450);                      // 箱盖开到一半时，唱片弹出
    setTimeout(() => {
      intro.classList.add('is-done');
      introRunning = false;
    }, 1200);
  }

  goTo(startIndex, { instant: true });
  if (skipIntro) {
    intro.remove();
    update();
  } else {
    intro.addEventListener('click', openCase);
    setTimeout(openCase, reduceMotion ? 200 : 1500);
  }

  // 调试 / 测试用的小接口
  window.lyra = {
    goTo, next, prev, slides,
    gsap: !!G,
    get index() { return index; },
    get animating() { return flying(); },
    debug: () => ({ index, mode, pos: +pos.toFixed(1), vel: +vel.toFixed(1), target, accum: +accum.toFixed(1), scrollY: window.scrollY, lastWheelT, lastWheelD }),
  };
})();
