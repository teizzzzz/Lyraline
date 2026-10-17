/* =====================================================================
   共鳴線 LyraLine — 音乐作品页（music.html）
   数据 → 封面（缺图时 canvas 生成）→ 播放引擎（Audio / Web Audio 合成）
   → musicRender() 渲染网格 → changeMusicDetail() 切歌 → 底部进度条 → 键盘 / hash 路由
   ===================================================================== */
(() => {
  'use strict';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const I18N = window.LYRA_I18N;
  const t = k => I18N.t(k);

  /* ------------------------------------------------------------------
     数据（原创示例；之后换成接口返回，结构保持一致即可）
       type      : 'EP' | 'Single' | 'OST'
       duration  : 秒
       musicUrl  : 音频地址；留空 → 用 Web Audio 合成一段环境音演示
       cover     : 封面地址；留空 → canvas 生成抽象占位封面
     ------------------------------------------------------------------ */
  let MUSIC = [
    { id: 1, type: 'EP',     musicName: '盛夏未央',   musicNameEn: 'Midsummer, Unfinished',   duration: 94,  musicUrl: '', cover: '' },
    { id: 2, type: 'Single', musicName: '雨后的天线', musicNameEn: 'Antenna After the Rain',  duration: 112, musicUrl: '', cover: '' },
    { id: 3, type: 'OST',    musicName: '旧城回声',   musicNameEn: 'Echoes of the Old Town',  duration: 128, musicUrl: '', cover: '' },
    { id: 4, type: 'Single', musicName: '无人站台',   musicNameEn: 'Empty Platform',          duration: 86,  musicUrl: '', cover: '' },
    { id: 5, type: 'EP',     musicName: '风化的磁带', musicNameEn: 'Weathered Tape',          duration: 140, musicUrl: '', cover: '' },
    { id: 6, type: 'OST',    musicName: '铁轨与萤火', musicNameEn: 'Rails and Fireflies',     duration: 102, musicUrl: '', cover: '' },
    { id: 7, type: 'Single', musicName: '黄昏信号',   musicNameEn: 'Dusk Signal',             duration: 118, musicUrl: '', cover: '' },
    { id: 8, type: 'EP',     musicName: '漂流电台',   musicNameEn: 'Drifting Radio',          duration: 96,  musicUrl: '', cover: '' },
    { id: 9, type: 'OST',    musicName: '星屑储藏室', musicNameEn: 'Stardust Storeroom',      duration: 121, musicUrl: '', cover: '' },
  ];

  const pad2 = n => String(n).padStart(2, '0');
  const fmt = s => { s = Math.max(0, Math.floor(s || 0)); return `${Math.floor(s / 60)}:${pad2(s % 60)}`; };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     占位封面：种子随机数 → 抽象几何（同一个 id 每次生成都一样）
     颜色取自 style.css 的企划色板变量
     ------------------------------------------------------------------ */
  function mulberry32(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  const css = getComputedStyle(document.documentElement);
  const PALETTE = ['--c-red', '--c-teal', '--c-olive', '--c-lavender', '--c-gray', '--c-black', '--c-white', '--c-text']
    .map(v => css.getPropertyValue(v).trim()).filter(Boolean);
  const coverCache = new Map();
  function makeCover(seed) {
    if (coverCache.has(seed)) return coverCache.get(seed);
    const rnd = mulberry32(seed * 9973 + 17);
    const pick = () => PALETTE[Math.floor(rnd() * PALETTE.length)];
    const S = 640;
    const cv = document.createElement('canvas');
    cv.width = cv.height = S;
    const g = cv.getContext('2d');
    const bg = pick();
    let fg = pick(); while (fg === bg) fg = pick();
    let ac = pick(); while (ac === bg || ac === fg) ac = pick();
    g.fillStyle = bg; g.fillRect(0, 0, S, S);

    // 大色块：圆 / 半圆 / 斜切矩形三选一
    g.fillStyle = fg;
    const kind = Math.floor(rnd() * 3);
    const cx = S * (0.25 + rnd() * 0.5), cy = S * (0.25 + rnd() * 0.5), r = S * (0.22 + rnd() * 0.22);
    g.beginPath();
    if (kind === 0) g.arc(cx, cy, r, 0, Math.PI * 2);
    else if (kind === 1) g.arc(cx, cy, r, rnd() * Math.PI, rnd() * Math.PI + Math.PI);
    else { g.save(); g.translate(cx, cy); g.rotate((rnd() - 0.5) * 1.2); g.rect(-r, -r * 0.6, r * 2, r * 1.2); g.restore(); }
    g.fill();

    // 同心细圈（呼应唱片纹路）
    g.strokeStyle = ac; g.lineWidth = 1.5;
    const rx = S * rnd(), ry = S * rnd(), rings = 4 + Math.floor(rnd() * 8);
    for (let i = 1; i <= rings; i++) { g.beginPath(); g.arc(rx, ry, i * S * 0.035, 0, Math.PI * 2); g.stroke(); }

    // 平行斜线
    g.strokeStyle = fg; g.lineWidth = 2;
    const ang = rnd() * Math.PI, n = 6 + Math.floor(rnd() * 10), gap = 10 + rnd() * 18;
    const ox = S * rnd(), oy = S * rnd();
    for (let i = 0; i < n; i++) {
      const dx = Math.cos(ang) * S * 0.4, dy = Math.sin(ang) * S * 0.4;
      const px = ox + Math.cos(ang + Math.PI / 2) * i * gap, py = oy + Math.sin(ang + Math.PI / 2) * i * gap;
      g.beginPath(); g.moveTo(px - dx, py - dy); g.lineTo(px + dx, py + dy); g.stroke();
    }

    // 散点
    g.fillStyle = ac;
    for (let i = 0, m = 20 + Math.floor(rnd() * 40); i < m; i++) {
      g.beginPath(); g.arc(S * rnd(), S * rnd(), 1 + rnd() * 3, 0, Math.PI * 2); g.fill();
    }

    // 右上角编号（左下角留给播放按钮）
    g.fillStyle = fg;
    g.font = `500 ${S * 0.05}px ${css.getPropertyValue('--font-latin')}`;
    g.textAlign = 'right';
    g.fillText(`No.${pad2(seed)}`, S * 0.94, S * 0.1);

    const url = cv.toDataURL('image/png');
    coverCache.set(seed, url);
    return url;
  }
  const coverOf = m => m.cover || makeCover(m.id);

  /* ------------------------------------------------------------------
     播放引擎：统一接口 play / pause / seek / stop / onend + currentTime / duration
     ------------------------------------------------------------------ */
  let ctx = null;                                  // AudioContext：第一次播放（用户点击）时才创建
  async function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') await ctx.resume();
    return ctx;
  }

  // 有 musicUrl：HTMLAudioElement
  function audioEngine(track) {
    const a = new Audio();
    a.preload = 'metadata';
    a.src = track.musicUrl;
    const eng = {
      onend: null,
      get duration() { return Number.isFinite(a.duration) && a.duration > 0 ? a.duration : track.duration; },
      get currentTime() { return a.currentTime; },
      play: () => a.play(),
      pause: () => a.pause(),
      seek: s => { a.currentTime = clamp(s, 0, eng.duration); },
      stop: () => { a.pause(); a.currentTime = 0; },
    };
    a.addEventListener('ended', () => eng.onend && eng.onend());
    return eng;
  }

  // 没有 musicUrl：几个振荡器叠成和弦 → 低通滤波（慢速 LFO 扫频）→ 主音量淡入 / 淡出
  function synthEngine(track) {
    const rnd = mulberry32(track.id * 131 + 7);
    const ROOTS = [110, 116.54, 123.47, 130.81, 146.83, 164.81];
    const CHORDS = [[0, 7, 12, 16, 19], [0, 3, 7, 10, 14], [0, 5, 7, 12, 17], [0, 4, 9, 14, 16]];
    const root = ROOTS[Math.floor(rnd() * ROOTS.length)];
    const chord = CHORDS[Math.floor(rnd() * CHORDS.length)];
    const cutoff = 500 + rnd() * 700;
    const FADE_IN = 1.4, FADE_OUT = 0.45, LEVEL = 0.12;

    let offset = 0;                                // 暂停时的位置
    let startedAt = 0;                             // 本次开始播放时的 ctx.currentTime
    let running = false;
    let nodes = null;
    let endTimer = 0;

    function build(c) {
      const master = c.createGain(); master.gain.value = 0;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cutoff; lp.Q.value = 0.7;
      const lfo = c.createOscillator(); lfo.frequency.value = 0.06 + rnd() * 0.05;
      const lfoAmt = c.createGain(); lfoAmt.gain.value = cutoff * 0.45;
      lfo.connect(lfoAmt).connect(lp.frequency);
      lp.connect(master).connect(c.destination);
      const oscs = chord.map((semi, i) => {
        const o = c.createOscillator();
        o.type = i % 2 ? 'triangle' : 'sine';
        o.frequency.value = root * Math.pow(2, semi / 12);
        o.detune.value = (rnd() - 0.5) * 12;
        const g = c.createGain(); g.gain.value = 1 / chord.length * (i === 0 ? 1.4 : 1);
        o.connect(g).connect(lp);
        return o;
      });
      [lfo, ...oscs].forEach(o => o.start());
      return { master, oscs: [lfo, ...oscs] };
    }
    function release(n, c) {
      const now = c.currentTime;
      n.master.gain.cancelScheduledValues(now);
      n.master.gain.setValueAtTime(n.master.gain.value, now);
      n.master.gain.linearRampToValueAtTime(0, now + FADE_OUT);
      n.oscs.forEach(o => o.stop(now + FADE_OUT + 0.05));
    }
    function scheduleEnd() {
      clearTimeout(endTimer);
      const left = track.duration - eng.currentTime;
      endTimer = setTimeout(() => {
        if (!running) return;
        offset = track.duration;
        running = false;
        if (nodes) { release(nodes, ctx); nodes = null; }
        eng.onend && eng.onend();
      }, Math.max(0, left) * 1000);
    }

    const eng = {
      onend: null,
      get duration() { return track.duration; },
      get currentTime() { return running ? Math.min(track.duration, offset + ctx.currentTime - startedAt) : offset; },
      async play() {
        if (running) return;
        const c = await getCtx();
        if (offset >= track.duration) offset = 0;
        nodes = build(c);
        const now = c.currentTime;
        nodes.master.gain.setValueAtTime(0, now);
        nodes.master.gain.linearRampToValueAtTime(LEVEL, now + FADE_IN);
        startedAt = now;
        running = true;
        scheduleEnd();
      },
      pause() {
        if (!running) return;
        offset = eng.currentTime;
        running = false;
        clearTimeout(endTimer);
        if (nodes) { release(nodes, ctx); nodes = null; }
      },
      seek(s) {
        offset = clamp(s, 0, track.duration);
        if (running) { startedAt = ctx.currentTime; scheduleEnd(); }
      },
      stop() { eng.pause(); offset = 0; },
    };
    return eng;
  }
  const createEngine = track => (track.musicUrl ? audioEngine(track) : synthEngine(track));

  /* ------------------------------------------------------------------
     渲染：页头统计 + 专辑网格
     ------------------------------------------------------------------ */
  const grid = $('#albumGrid');
  const ICONS = '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15L19.5 12z"/></svg>'
              + '<svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z"/></svg>';

  function musicRender(list = MUSIC) {
    MUSIC = list;
    $('#statCount').textContent = pad2(list.length);
    $('#statTotal').textContent = fmt(list.reduce((s, m) => s + (m.duration || 0), 0));
    grid.innerHTML = list.map((m, i) => {
      const cover = coverOf(m);
      return `
      <li class="album" id="t${m.id}" data-index="${i}">
        <div class="art">
          <div class="album-vinyl" aria-hidden="true">
            <div class="album-vinyl-face"><div class="album-label" style="background-image:url('${cover}')"></div></div>
          </div>
          <div class="album-cover"><img src="${cover}" alt="" loading="lazy"></div>
          <button type="button" class="album-play" data-index="${i}">${ICONS}</button>
        </div>
        <div class="album-meta">
          <div class="album-no">No.${pad2(i + 1)} — ${fmt(m.duration)}</div>
          <h3 class="album-title"><span class="album-type">${m.type}</span><span class="album-sep" aria-hidden="true"></span><span>${m.musicName}</span></h3>
          <p class="album-en">${m.musicNameEn}</p>
        </div>
      </li>`;
    }).join('');
    cards = $$('.album', grid);
    syncCards();
  }
  let cards = [];

  /* ------------------------------------------------------------------
     播放状态 + 切歌
     ------------------------------------------------------------------ */
  let index = -1;
  let engine = null;
  let playing = false;
  let playToken = 0;                               // 防止快速连点时旧的 play() 晚到

  function syncCards() {
    cards.forEach((el, i) => {
      const on = i === index;
      el.classList.toggle('on', on);
      el.classList.toggle('is-playing', on && playing);
      const btn = el.querySelector('.album-play');
      btn.setAttribute('aria-label', `${t(on && playing ? 'music.pause' : 'music.play')}: ${MUSIC[i].musicName}`);
      btn.setAttribute('aria-pressed', on && playing ? 'true' : 'false');
    });
  }

  function changeMusicDetail(i, { autoplay = false, updateHash = true } = {}) {
    i = ((i % MUSIC.length) + MUSIC.length) % MUSIC.length;
    if (engine) { engine.onend = null; engine.stop(); }
    playToken++;
    playing = false;
    index = i;
    const song = MUSIC[i];
    engine = createEngine(song);
    engine.onend = () => changeMusicDetail(index + 1, { autoplay: true });   // 播完自动下一首（循环）
    if (updateHash) history.replaceState(null, '', `#t${song.id}`);
    syncCards();
    setBar();
    if (autoplay) play();
  }

  async function play() {
    if (!engine) return;
    const token = ++playToken;
    try {
      await engine.play();
    } catch (e) {
      if (token === playToken) { playing = false; syncCards(); setBar(); }
      return;
    }
    if (token !== playToken) return;
    playing = true;
    syncCards();
    setBar();
    peek();
    startLoop();
  }
  function pause() {
    if (!engine) return;
    playToken++;
    engine.pause();
    playing = false;
    syncCards();
    setBar();
  }
  // 点的是当前曲目 → 播放 / 暂停；别的曲目 → 切过去并自动播放
  function toggle(i) {
    if (i === index) (playing ? pause() : play());
    else changeMusicDetail(i, { autoplay: true });
  }

  grid.addEventListener('click', e => {
    const art = e.target.closest('.art');
    if (!art) return;
    toggle(+art.closest('.album').dataset.index);
  });

  /* ------------------------------------------------------------------
     底部进度条
     ------------------------------------------------------------------ */
  const bar = $('#mbar');
  const track = $('#mbarTrack');
  const fill = $('#mbarFill');
  const thumb = $('#mbarThumb');
  const curEl = $('#mbarCur');
  const durEl = $('#mbarDur');
  let dragging = false;
  let dragRatio = 0;
  let lastAria = -1;

  function paint(time, dur) {
    const r = dur > 0 ? clamp(time / dur, 0, 1) : 0;
    fill.style.width = `${r * 100}%`;
    thumb.style.left = `${r * 100}%`;
    curEl.textContent = fmt(time);
    durEl.textContent = fmt(dur);
    const sec = Math.floor(time);
    if (sec !== lastAria) {
      lastAria = sec;
      track.setAttribute('aria-valuenow', String(sec));
      track.setAttribute('aria-valuetext', `${fmt(time)} / ${fmt(dur)}`);
    }
  }
  function setBar() {
    bar.classList.toggle('is-playing', playing);
    if (!engine) return;
    track.setAttribute('aria-valuemax', String(Math.floor(engine.duration)));
    if (!dragging) paint(engine.currentTime, engine.duration);
  }

  // requestAnimationFrame 刷新进度；暂停时停
  let raf = 0;
  function startLoop() {
    if (raf) return;
    const step = () => {
      if (!playing) { raf = 0; return; }
      if (!dragging) paint(engine.currentTime, engine.duration);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  // 每次 play() 自动浮出一次，2.2 秒后收回
  let peekTimer = 0;
  function peek() {
    bar.classList.add('is-peek');
    clearTimeout(peekTimer);
    peekTimer = setTimeout(() => bar.classList.remove('is-peek'), 2200);
  }

  // 鼠标离窗口底部 110px 以内（忽略触摸）；鼠标离开页面时取消
  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    bar.classList.toggle('is-near', window.innerHeight - e.clientY <= 110);
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => bar.classList.remove('is-near'));
  window.addEventListener('blur', () => bar.classList.remove('is-near'));

  // 拖动：pointer capture；拖动中只更新显示，松手才 seek
  const ratioAt = e => { const r = track.getBoundingClientRect(); return clamp((e.clientX - r.left) / r.width, 0, 1); };
  track.addEventListener('pointerdown', e => {
    if (!engine || e.button > 0) return;
    e.preventDefault();
    track.setPointerCapture(e.pointerId);
    dragging = true;
    bar.classList.add('is-drag');
    dragRatio = ratioAt(e);
    paint(dragRatio * engine.duration, engine.duration);
  });
  track.addEventListener('pointermove', e => {
    if (!dragging) return;
    dragRatio = ratioAt(e);
    paint(dragRatio * engine.duration, engine.duration);
  });
  const endDrag = commit => e => {
    if (!dragging) return;
    dragging = false;
    bar.classList.remove('is-drag');
    if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
    if (commit) engine.seek(dragRatio * engine.duration);
    paint(engine.currentTime, engine.duration);
  };
  track.addEventListener('pointerup', endDrag(true));
  track.addEventListener('pointercancel', endDrag(false));

  // 键盘：← → 快退 / 快进 5 秒
  track.addEventListener('keydown', e => {
    if (!engine) return;
    const d = { ArrowLeft: -5, ArrowRight: 5, ArrowDown: -5, ArrowUp: 5 }[e.key];
    if (d == null) return;
    e.preventDefault();
    engine.seek(engine.currentTime + d);
    paint(engine.currentTime, engine.duration);
  });

  // 空格：播放 / 暂停（焦点在按钮或滑块上时交给它们自己）
  window.addEventListener('keydown', e => {
    if (e.key !== ' ' && e.code !== 'Space') return;
    const el = e.target;
    if (el.closest && el.closest('button, a, input, textarea, select, [role="slider"], [contenteditable="true"]')) return;
    if (document.documentElement.classList.contains('is-locked')) return;   // 菜单打开中
    e.preventDefault();
    toggle(index);
  });

  /* ------------------------------------------------------------------
     hash 路由：#t<id> 定位到某张专辑
     ------------------------------------------------------------------ */
  const indexFromHash = () => {
    const m = /^#t(\d+)$/.exec(location.hash);
    return m ? MUSIC.findIndex(x => String(x.id) === m[1]) : -1;
  };
  window.addEventListener('hashchange', () => {
    const i = indexFromHash();
    if (i < 0 || i === index) return;
    changeMusicDetail(i, { autoplay: playing });   // 正在播放就接着播新的那首
    cards[i].scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // 切换语言后更新按钮的 aria-label
  document.addEventListener('lyra:lang', syncCards);

  /* ---------- 启动 ---------- */
  musicRender(MUSIC);
  const start = indexFromHash();
  // 只定位，不自动播放（浏览器要求第一次播放由用户触发）；没有 hash 时默认第一首，网址保持干净
  changeMusicDetail(Math.max(0, start), { updateHash: start >= 0 });

  // 之后接后端时：fetch(...).then(list => { musicRender(list); changeMusicDetail(0); })
  window.lyraMusic = {
    musicRender, changeMusicDetail, play, pause, toggle,
    get index() { return index; }, get playing() { return playing; },
    get currentTime() { return engine ? engine.currentTime : 0; },
  };
})();
