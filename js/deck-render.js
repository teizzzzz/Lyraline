/* =====================================================================
   共鳴線 LyraLine — Pitch Deck 渲染与交互
   在首页「DECK」一屏内渲染横向幻灯片轨道：
     - 上一张 / 下一张按钮、圆点导航、页码
     - 键盘 ← → / 触摸滑动 / 鼠标滚轮横向
     - 文字用 data-i18n 输出，切换站点语言时由 i18n.apply 统一替换
   注意：不提供任何下载按钮。
   ===================================================================== */
window.LYRA_DECK_RENDER = (() => {
  'use strict';
  const D = window.LYRA_DECK;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const parasClass = s => `deck-paras${s.parasLarge ? ' deck-paras-lg' : ''}${s.parasGrow ? ' deck-paras-grow' : ''}`;

  // 字段可能是三语对象 / 字符串 / 数组；统一成可注入 i18n 的关键字或直接字符串
  const field = (i, name, v, tag = 'span', cls = '') => {
    const c = cls ? ` class="${cls}"` : '';
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return `<${tag}${c} data-i18n="deck.${i}.${name}"></${tag}>`;
    }
    return `<${tag}${c}>${esc(v ?? '')}</${tag}>`;
  };
  const rich = (i, name, v, tag, cls) => {
    const c = cls ? ` class="${cls}"` : '';
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return `<${tag}${c} data-i18n-html="deck.${i}.${name}"></${tag}>`;
    }
    return `<${tag}${c}>${v ?? ''}</${tag}>`;
  };
  // paras/items 是「三语对象，每语是数组」或「直接数组」
  const localizedArr = (v, lang) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') return v[lang] ?? v.ja ?? v.zh ?? v.en ?? [];
    return [];
  };
  const IS_ARR_FIELD = { paras: true, items: true };

  function renderSlide(s, i) {
    const k = f => field(i, f, s[f]);
    const img = s.img ? `<div class="deck-visual"><img src="${s.img}" alt="" loading="lazy"></div>` : '';
    const watermark = s.no ? `<span class="deck-watermark">${esc(s.no)}</span>` : '';
    let body = '';

    switch (s.kind) {
      case 'cover':
        body = `
          <div class="dslide-inner cover-layout">
            <div class="cover-text">
              ${s.kicker ? `<span class="deck-kicker">${esc(s.kicker)}</span>` : ''}
              ${s.logo
                ? `<div class="cover-logo"><img src="${s.logo}" alt="共鳴線 LyraLine"></div>`
                : `<h1 class="cover-title">${k('title')}</h1>`}
              <p class="cover-sub">${k('sub')}</p>
              <span class="cover-foot">${k('foot')}</span>
            </div>
            ${img}
          </div>`;
        break;

      case 'chapter':
        body = `
          <div class="dslide-inner chapter-layout">
            ${watermark}
            <span class="deck-kicker">${esc(s.kicker)}</span>
            <h2 class="chapter-title">${k('title')}</h2>
            <p class="chapter-sub">${k('sub')}</p>
          </div>`;
        break;

      case 'quote':
        body = `
          <div class="dslide-inner quote-layout">
            ${watermark}
            <span class="deck-kicker">${k('kicker')}</span>
            <blockquote class="deck-quote">${k('quote')}</blockquote>
            <cite class="deck-by">${k('by')}</cite>
          </div>`;
        break;

      case 'grid':
        body = `
          <div class="dslide-inner">
            ${watermark}
            <div class="deck-head">
              <span class="deck-kicker">${k('kicker')}</span>
              <h2 class="deck-title">${k('title')}</h2>
              ${s.sub ? `<p class="deck-sub">${k('sub')}</p>` : ''}
            </div>
            <div class="deck-cards" data-arr="items" data-idx="${i}"></div>
          </div>`;
        break;

      case 'timeline':
        body = `
          <div class="dslide-inner">
            ${watermark}
            <div class="deck-head">
              <span class="deck-kicker">${k('kicker')}</span>
              <h2 class="deck-title">${k('title')}</h2>
            </div>
            <div class="deck-timeline" data-arr="items" data-idx="${i}"></div>
          </div>`;
        break;

      case 'split':
        body = `
          <div class="dslide-inner split-layout${s.imgSide === 'left' ? ' img-left' : ''}">
            <div class="split-text">
              <span class="deck-kicker">${k('kicker')}</span>
              <h2 class="deck-title">${k('title')}</h2>
              ${s.sub ? `<p class="deck-sub">${k('sub')}</p>` : ''}
              <div class="deck-paras" data-arr="paras" data-idx="${i}"></div>
            </div>
            ${img}
          </div>`;
        break;

      case 'closing':
        body = `
          <div class="dslide-inner closing-layout">
            ${watermark}
            <span class="deck-kicker">${esc(s.kicker)}</span>
            <h2 class="deck-title">${k('title')}</h2>
            <div class="${parasClass(s)}" data-arr="paras" data-idx="${i}"></div>
            <span class="cover-foot">${k('foot')}</span>
          </div>`;
        break;

      default: // text
        body = `
          <div class="dslide-inner">
            ${watermark}
            <div class="deck-head">
              <span class="deck-kicker">${k('kicker')}</span>
              <h2 class="deck-title">${k('title')}</h2>
            </div>
            <div class="${parasClass(s)}" data-arr="paras" data-idx="${i}"></div>
          </div>`;
    }

    return `<section class="dslide dslide--${s.kind}" data-slide="${i}">${body}</section>`;
  }

  // 渲染数组字段（paras / items）：跟随当前语言，并注册语言切换事件
  function fillArrays(root, lang) {
    $$('[data-arr]', root).forEach(box => {
      const idx = +box.dataset.idx;
      const name = box.dataset.arr;
      const s = D.slides[idx];
      const arr = localizedArr(s[name], lang);
      if (name === 'paras') {
        box.innerHTML = arr.map(p => `<p>${p}</p>`).join('');
      } else if (s.kind === 'timeline') {
        box.innerHTML = arr.map((it, j) => `
          <div class="tl-item"><span class="tl-no">${String(j + 1).padStart(2, '0')}</span>
            <div><h4>${esc(it.h || '')}</h4><p>${esc(it.t || '')}</p></div></div>`).join('');
      } else {
        box.innerHTML = arr.map(it => `
          <div class="deck-card"><span class="deck-card-h">${esc(it.h || '')}</span>
            <p>${esc(it.t || '')}</p></div>`).join('');
      }
    });
  }

  function init() {
    const root = $('#deck');
    if (!root || !D || !D.slides.length) return;
    const track = $('.deck-track', root);
    if (!track) return;

    const lang = () => (window.LYRA_I18N ? window.LYRA_I18N.lang : 'ja');
    track.innerHTML = D.slides.map(renderSlide).join('');
    fillArrays(root, lang());

    const slides = $$('.dslide', track);
    const dotsBox = $('.deck-dots', root);
    if (dotsBox) {
      dotsBox.innerHTML = D.slides.map((_, i) =>
        `<button type="button" data-goto="${i}" aria-label="${i + 1}"></button>`).join('');
    }
    const dots = $$('button', dotsBox || document);
    const count = $('.deck-count .cur', root);
    let idx = 0;

    function go(n, animate = true) {
      idx = Math.max(0, Math.min(slides.length - 1, n));
      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translateX(-${idx * 100}%)`;
      if (animate) track.style.transition = '';
      dots.forEach((d, i) => d.classList.toggle('is-on', i === idx));
      if (count) count.textContent = String(idx + 1).padStart(2, '0');
    }
    go(0, false);

    $('.deck-nav .prev', root)?.addEventListener('click', () => go(idx - 1));
    $('.deck-nav .next', root)?.addEventListener('click', () => go(idx + 1));
    dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.goto)));

    // 键盘左右：仅当 deck 屏可见时响应，避免干扰其它屏
    document.addEventListener('keydown', e => {
      if (!root.classList.contains('is-active')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
    });

    // 触摸滑动
    let x0 = null;
    track.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });

    // 语言切换：刷新数组字段（标题类等由 i18n.apply 通过 data-i18n 自动替换）
    document.addEventListener('lyra:lang', e => fillArrays(root, e.detail.lang));

    // deck 的 DOM 是脚本运行时才注入的，晚于启动时那次 i18n.apply，
    // 这里主动再应用一次，确保新注入的 data-i18n 元素被填充（幂等，无副作用）。
    if (window.LYRA_I18N) window.LYRA_I18N.apply(window.LYRA_I18N.lang, false);
  }

  // 脚本在 body 末尾加载，DOM 已就绪；main.js 之后加载会接管翻屏。
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();
