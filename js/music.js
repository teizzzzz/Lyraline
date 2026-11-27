/* =====================================================================
   共鳴線 LyraLine — 音乐作品页（music.html）
   曲名采用术语表（shuyubiao）专有名词；试听分三类：
     mode 'links'   → 点击试听弹出官方链接（绿浮游 / 聆听者）
     mode 'file'    → 点击试听播放 songpreview 预览文件
     mode 'none'    → 无试听按钮（Aftertones EP）
     mode 'unknown' → 试听位置显示 ??? 占位（尚无素材的曲目）
   ===================================================================== */
(() => {
  'use strict';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const I18N = window.LYRA_I18N;
  const t = k => I18N.t(k);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

  /* ------------------------------------------------------------------
     曲目数据：曲名三语均为术语表专有名词
       name     : { zh, en, ja } 三语专有名词
       mode     : 'none' | 'links' | 'file' | 'unknown'
       links    : [{ label, url }]   （mode=links）
       musicUrl : 本地预览音频        （mode=file）
       duration : 秒；无素材显示 ???
       cover    : 封面图；留空 → canvas 生成抽象占位封面
     ------------------------------------------------------------------ */
  let MUSIC = [
    { id: 1, type: 'EP', mode: 'none',
      name: { zh: 'Aftertones', en: 'Aftertones', ja: 'Aftertones' },
      duration: null, cover: 'docs/img/aftertones-cover.jpg' },

    { id: 2, type: 'Single', mode: 'links',
      name: { zh: '绿浮游 (feat. 初音ミク, ナースロボ_タイプT)', en: 'Verdant Ephemera (feat. Hatsune Miku, Nourse Robot Type T)', ja: '緑浮遊 (feat. 初音ミク, ナースロボ_タイプT)' },
      duration: 207, cover: 'docs/img/First%20Song%20Cover.JPG',
      links: [
        { label: 'YouTube', url: 'https://youtu.be/x-2Lpzkx7uc?si=HkxZE9Q59WfqvkXS' },
        { label: 'Bilibili', url: 'https://b23.tv/Sfzdi0V' },
      ] },

    { id: 3, type: 'Single', mode: 'links',
      name: { zh: '绿浮游【人声本家】', en: 'Verdant Ephemera (feat. 常夜謠)', ja: '緑浮遊(feat. 常夜謠)' },
      duration: 207, cover: 'docs/img/First%20Song%20Cover.JPG',
      links: [
        { label: 'YouTube', url: 'https://youtu.be/EhFRDMh0iCk?si=WdJjCPkv2CrM_ANd' },
        { label: 'Bilibili', url: 'https://b23.tv/k4NLYHs' },
      ] },

    { id: 4, type: 'Single', mode: 'links',
      name: { zh: '聆听者 (feat. GUMI)', en: 'The Listener (feat. GUMI)', ja: '聴く人 (feat. GUMI)' },
      duration: 312, cover: 'docs/img/kiku-hito-listener.jpg',
      links: [ { label: 'Bilibili', url: 'https://b23.tv/64i0Rah' } ] },

    { id: 5, type: 'Single', mode: 'none',
      name: { zh: '聆听者 (English ver.)', en: 'The Listener (English ver.)', ja: '聴く人 (English ver.)' },
      duration: null, cover: 'docs/img/kiku-hito-listener.jpg' },

    { id: 6, type: 'Single', mode: 'file',
      name: { zh: '水上都市', en: 'Aquapolis', ja: 'アクアポリス' },
      duration: null, musicUrl: 'docs/audio/aquapolis-preview.mp3', cover: '' },

    { id: 7, type: 'Single', mode: 'file',
      name: { zh: '余响行路', en: 'Keleuthos', ja: 'ケレウソス' },
      duration: null, musicUrl: 'docs/audio/keleuthos-preview.mp3', cover: '' },

    { id: 8, type: 'Single', mode: 'file',
      name: { zh: '水上都市 (VIP mix)', en: 'Aquapolis (VIP mix)', ja: 'アクアポリス (VIP mix)' },
      duration: null, musicUrl: 'docs/audio/aquapolis-vip-preview.mp3', cover: '' },

    { id: 9, type: 'Single', mode: 'file',
      name: { zh: '暮霭', en: 'Haze', ja: '夕靄' },
      duration: null, musicUrl: 'docs/audio/haze-preview.mp3', cover: '' },

    { id: 11, type: 'Single', mode: 'file',
      name: '■■■■',
      duration: null, musicUrl: 'docs/audio/wp7-2-preview.mp3', coverSeed: 17, coverNo: 11, coverLabelColor: '--c-black' },

    { id: 10, type: 'Single', mode: 'file',
      name: { zh: '第七水相观测记录', en: 'Observation Record: Aqueous Phase No. 7', ja: '第7水相観測記録' },
      duration: null, musicUrl: 'docs/audio/observation-record-preview.mp3', coverSeed: 14, coverNo: 12 },

    { id: 12, type: 'Single', mode: 'unknown',
      name: '???',
      duration: null, cover: 'docs/img/in-progress.png' },
  ];

  const nameOf = m => typeof m.name === 'string'
    ? m.name
    : ((m.name && m.name[I18N.lang]) || (m.name && m.name.zh) || '');
  const pad2 = n => String(n).padStart(2, '0');
  const fmt = s => { s = Math.max(0, Math.floor(s || 0)); return `${Math.floor(s / 60)}:${pad2(s % 60)}`; };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     占位封面：与作品详情共用 data.js 的 coverOf（同一个编号永远同一张图）
     ------------------------------------------------------------------ */
  const coverOf = m => m.cover || window.LYRA_DATA.coverOf(m.coverSeed || m.id, m.coverNo, m.coverLabelColor);

  /* ------------------------------------------------------------------
     试听时长：从预览文件读取 metadata（只读取、不播放）
     ------------------------------------------------------------------ */
  const timeOf = m => m.duration ? fmt(m.duration) : (m.mode === 'file' ? '??:??' : '???');
  /* TOTAL = 除 01 Aftertones / 05 English ver. 外所有已知时长之和 */
  function updateTotal() {
    const secs = MUSIC.filter(m => m.id !== 1 && m.id !== 5)
      .reduce((s, m) => s + (m.duration || 0), 0);
    $('#statTotal').textContent = secs ? fmt(secs) : '0:00';
  }
  function probeDurations() {
    MUSIC.filter(m => m.mode === 'file' && !m.duration).forEach(m => {
      const a = new Audio();
      a.preload = 'metadata';
      a.src = m.musicUrl;
      a.addEventListener('loadedmetadata', () => {
        if (Number.isFinite(a.duration) && a.duration > 0) {
          m.duration = Math.round(a.duration);
          const card = $(`#t${m.id}`);
          if (card) card.querySelector('.album-time').textContent = timeOf(m);
          updateTotal();
        }
      }, { once: true });
    });
  }

  /* ------------------------------------------------------------------
     链接弹窗：mode=links 的曲目点击试听后弹出官方收听链接
     ------------------------------------------------------------------ */
  function closeLinks() {
    const modal = $('#linkModal');
    if (modal) modal.classList.remove('is-open');
  }
  function openLinks(track) {
    let modal = $('#linkModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'linkModal';
      modal.className = 'link-modal';
      modal.innerHTML =
        '<div class="link-modal-panel" role="dialog" aria-modal="true">' +
          '<button type="button" class="link-modal-close" aria-label="Close">&times;</button>' +
          '<span class="link-modal-kicker">LISTEN</span>' +
          '<h3 class="link-modal-title"></h3>' +
          '<div class="link-modal-links"></div>' +
        '</div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', e => {
        if (e.target === modal || e.target.closest('.link-modal-close')) closeLinks();
      });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLinks(); });
    }
    modal.querySelector('.link-modal-title').textContent = nameOf(track);
    modal.querySelector('.link-modal-links').innerHTML = (track.links || []).map(l =>
      `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}<i class="arrow" aria-hidden="true"></i></a>`
    ).join('');
    modal.classList.add('is-open');
  }

  /* ------------------------------------------------------------------
     播放引擎：mode=file 用 HTMLAudioElement
     ------------------------------------------------------------------ */
  let ctx = null;
  async function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') await ctx.resume();
    return ctx;
  }
  function audioEngine(track) {
    const a = new Audio();
    a.preload = 'metadata';
    a.src = track.musicUrl;
    const eng = {
      onend: null,
      get duration() { return Number.isFinite(a.duration) && a.duration > 0 ? a.duration : (track.duration || 1); },
      get currentTime() { return a.currentTime; },
      play: () => a.play(),
      pause: () => a.pause(),
      seek: s => { a.currentTime = clamp(s, 0, eng.duration); },
      stop: () => { a.pause(); a.currentTime = 0; },
    };
    a.addEventListener('ended', () => eng.onend && eng.onend());
    return eng;
  }
  const createEngine = track => (track.musicUrl ? audioEngine(track) : null);

  /* ------------------------------------------------------------------
     渲染：页头统计 + 曲目网格
     ------------------------------------------------------------------ */
  const grid = $('#albumGrid');
  const ICONS = '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15L19.5 12z"/></svg>'
              + '<svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z"/></svg>';

  function musicRender(list = MUSIC) {
    MUSIC = list;
    $('#statCount').textContent = pad2(list.length);
    updateTotal();
    grid.innerHTML = list.map((m, i) => {
      const cover = coverOf(m);
      // 试听按钮：none / unknown 无按钮；links / file 有按钮
      const hasBtn = m.mode === 'links' || m.mode === 'file';
      const btn = hasBtn ? `<button type="button" class="album-play" data-index="${i}">${ICONS}</button>` : '';
      const listen = m.mode === 'unknown' ? '<span class="album-unknown">???</span>' : '';
      const time = `<span class="album-time">${timeOf(m)}</span>`;
      return `
      <li class="album mode-${m.mode}" id="t${m.id}" data-index="${i}">
        <div class="art">
          <div class="album-vinyl" aria-hidden="true">
            <div class="album-vinyl-face"><div class="album-label" style="background-image:url('${cover}')"></div></div>
          </div>
          <div class="album-cover"><img src="${cover}" alt="" loading="lazy"></div>
          ${btn}${listen}
        </div>
        <div class="album-meta">
          <div class="album-no">No.${pad2(i + 1)} — ${time}</div>
          <h3 class="album-title"><span class="album-type">${esc(m.type)}</span><span class="album-sep" aria-hidden="true"></span><span>${esc(nameOf(m))}</span></h3>
          <p class="album-en">${esc(m.name && m.name.en ? m.name.en : '')}</p>
        </div>
      </li>`;
    }).join('');
    cards = $$('.album', grid);
    syncCards();
    probeDurations();
  }
  let cards = [];

  /* ------------------------------------------------------------------
     播放状态 + 切歌
     ------------------------------------------------------------------ */
  let index = -1;
  let engine = null;
  let playing = false;
  let playToken = 0;

  function syncCards() {
    cards.forEach((el, i) => {
      const on = i === index;
      el.classList.toggle('on', on);
      el.classList.toggle('is-playing', on && playing);
      const btn = el.querySelector('.album-play');
      if (btn) {
        btn.setAttribute('aria-label', `${t(on && playing ? 'music.pause' : 'music.play')}: ${nameOf(MUSIC[i])}`);
        btn.setAttribute('aria-pressed', on && playing ? 'true' : 'false');
      }
    });
  }

  function changeMusicDetail(i, { autoplay = false, updateHash = true } = {}) {
    i = ((i % MUSIC.length) + MUSIC.length) % MUSIC.length;
    if (engine) { engine.onend = null; engine.stop(); }
    engine = null;
    playToken++;
    playing = false;
    index = i;
    const song = MUSIC[i];
    if (updateHash) history.replaceState(null, '', `#t${song.id}`);
    syncCards();
    setBar();
    if (autoplay) play();
  }

  async function play() {
    const song = MUSIC[index];
    if (!song || song.mode !== 'file' || playing) return;
    if (!engine) engine = createEngine(song);
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
    engine.onend = () => {
      playing = false; syncCards(); setBar();
      changeMusicDetail(index + 1, { autoplay: false });
    };
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

  function toggle(i) {
    const song = MUSIC[i];
    if (!song) return;
    if (song.mode === 'links') { openLinks(song); return; }
    if (song.mode !== 'file') return;                 // none / unknown 不响应
    if (i === index) (playing ? pause() : play());
    else changeMusicDetail(i, { autoplay: true });
  }

  grid.addEventListener('click', e => {
    const card = e.target.closest('.album');
    if (!card) return;
    const btn = e.target.closest('.album-play');
    if (!btn && !e.target.closest('.art')) return;
    toggle(+card.dataset.index);
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
    durEl.textContent = dur > 0 ? fmt(dur) : '??:??';
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

  let raf = 0;
  function startLoop() {
    if (raf) return;
    const step = () => {
      if (!playing) { raf = 0; return; }
      if (!dragging && engine) paint(engine.currentTime, engine.duration);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  let peekTimer = 0;
  function peek() {
    bar.classList.add('is-peek');
    clearTimeout(peekTimer);
    peekTimer = setTimeout(() => bar.classList.remove('is-peek'), 2200);
  }

  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    bar.classList.toggle('is-near', window.innerHeight - e.clientY <= 110);
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => bar.classList.remove('is-near'));
  window.addEventListener('blur', () => bar.classList.remove('is-near'));

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
    if (commit && engine) engine.seek(dragRatio * engine.duration);
    if (engine) paint(engine.currentTime, engine.duration);
  };
  track.addEventListener('pointerup', endDrag(true));
  track.addEventListener('pointercancel', endDrag(false));

  track.addEventListener('keydown', e => {
    if (!engine) return;
    const d = { ArrowLeft: -5, ArrowRight: 5, ArrowDown: -5, ArrowUp: 5 }[e.key];
    if (d == null) return;
    e.preventDefault();
    engine.seek(engine.currentTime + d);
    paint(engine.currentTime, engine.duration);
  });

  window.addEventListener('keydown', e => {
    if (e.key !== ' ' && e.code !== 'Space') return;
    const el = e.target;
    if (el.closest && el.closest('button, a, input, textarea, select, [role="slider"], [contenteditable="true"]')) return;
    if (document.documentElement.classList.contains('is-locked')) return;
    e.preventDefault();
    toggle(index);
  });

  /* ------------------------------------------------------------------
     hash 路由：#t<id> 定位到某张曲目
     ------------------------------------------------------------------ */
  const indexFromHash = () => {
    const m = /^#t(\d+)$/.exec(location.hash);
    return m ? MUSIC.findIndex(x => String(x.id) === m[1]) : -1;
  };
  window.addEventListener('hashchange', () => {
    const i = indexFromHash();
    if (i < 0 || i === index) return;
    changeMusicDetail(i, { autoplay: false });
    cards[i].scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // 切换语言：曲名随语言重新渲染
  document.addEventListener('lyra:lang', () => {
    const keep = index;
    musicRender(MUSIC);
    index = keep;
    syncCards();
  });

  /* ---------- 启动 ---------- */
  musicRender(MUSIC);
  const start = indexFromHash();
  // 没有指定曲目时不要默认选中第一首（Aftertones 无试听）：保持所有封面默认灰，
  // 鼠标移上去才恢复彩色，与其他曲目一致。
  if (start >= 0) changeMusicDetail(start, { updateHash: true });

  window.lyraMusic = {
    musicRender, changeMusicDetail, play, pause, toggle,
    get index() { return index; }, get playing() { return playing; },
    get currentTime() { return engine ? engine.currentTime : 0; },
  };
})();
