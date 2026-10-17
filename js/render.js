/* =====================================================================
   共鳴線 LyraLine — 内容渲染（数据见 js/data.js）
   首页：A 新闻 / B 作品 / D 成员 三个板块的列表（脚本加载时立刻渲染，赶在 main.js 之前）
   子页：news.html / works.html / members.html 的列表与详情（由 js/sub.js 调用）
   文字都输出成 data-i18n，切换语言时由 i18n.apply 统一替换
   ===================================================================== */
window.LYRA_RENDER = (() => {
  'use strict';
  const D = window.LYRA_DATA;
  const $ = (s, r = document) => r.querySelector(s);

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // 字段是三语对象 → data-i18n；是字符串 → 直接输出
  const isTx = v => v && typeof v === 'object';
  const tx = (key, v, tag = 'span', cls = '') => {
    const c = cls ? ` class="${cls}"` : '';
    return isTx(v) ? `<${tag}${c} data-i18n="${key}"></${tag}>` : `<${tag}${c}>${esc(v)}</${tag}>`;
  };
  const html = (key, v, tag = 'div', cls = '') => {
    const c = cls ? ` class="${cls}"` : '';
    return isTx(v) ? `<${tag}${c} data-i18n-html="${key}"></${tag}>` : `<${tag}${c}>${v ?? ''}</${tag}>`;
  };
  const k = (col, id, field) => `data.${col}.${id}.${field}`;
  const roles = rs => (rs || []).map(r => `<span data-i18n="role.${r}"></span>`).join('<em>/</em>');
  const avatar = m => m.avatar
    ? `<div class="avatar has-img"><img src="${m.avatar}" alt=""></div>`
    : `<div class="avatar" style="--c: ${m.color || 'var(--c-gray)'}"></div>`;
  const cover = (w, cls = 'track-cover') => `<div class="${cls}">${w.cover ? `<img src="${w.cover}" alt="" loading="lazy">` : ''}</div>`;
  const statusTag = w => `<span class="tag${w.status === 'released' ? ' on' : ''}" data-i18n="works.status.${w.status}"></span>`;
  const newsTag = n => `<span class="tag${n === D.news[0] ? ' on' : ''}" data-i18n="news.tag.${n.tag}"></span>`;

  /* ------------------------------------------------------------------
     首页板块
     ------------------------------------------------------------------ */
  function homeNews(el, max = 3) {
    el.innerHTML = D.news.slice(0, max).map(n => `
      <a class="card row card-link" href="news.html?id=${n.id}">
        <time class="card-date">${esc(n.date)}</time>
        <div>
          ${tx(k('news', n.id, 'title'), n.title, 'h3')}
          ${newsTag(n)}
          ${n.summary ? tx(k('news', n.id, 'summary'), n.summary, 'p', 'muted') : ''}
        </div>
      </a>`).join('');
  }
  function homeWorks(el, max = 3) {
    el.innerHTML = D.works.slice(0, max).map(w => `
      <a class="card track card-link" href="works.html?id=${w.id}">
        ${cover(w)}
        <div class="track-meta">${tx(k('works', w.id, 'title'), w.title, 'h3')}<span>${esc(w.kicker)}</span></div>
        ${statusTag(w)}
      </a>`).join('');
  }
  function homeMembers(el, max = 6) {
    el.innerHTML = D.members.slice(0, max).map(m => `
      <a class="card member" href="members.html#${m.id}">
        ${avatar(m)}<h3>${esc(m.name)}</h3><p>${roles(m.roles)}</p>
      </a>`).join('');
  }

  /* ------------------------------------------------------------------
     子页：新闻
     ------------------------------------------------------------------ */
  function newsList(el, filter) {
    const list = D.news.filter(n => !filter || filter === 'all' || n.tag === filter);
    el.innerHTML = list.length ? `<div class="card-list news-list">${list.map(n => `
      <a class="card news-row card-link" href="news.html?id=${n.id}">
        <time class="card-date">${esc(n.date)}</time>
        <span class="news-tag">${newsTag(n)}</span>
        <span class="news-title">${tx(k('news', n.id, 'title'), n.title, 'h3')}
          ${n.summary ? tx(k('news', n.id, 'summary'), n.summary, 'p', 'muted') : ''}</span>
        <i class="chev" aria-hidden="true"></i>
      </a>`).join('')}</div>` : `<p class="muted empty" data-i18n="ui.empty"></p>`;
  }
  function newsDetail(el, id) {
    const i = D.news.findIndex(n => n.id === id);
    if (i < 0) return false;
    const n = D.news[i];
    const prev = D.news[i + 1], next = D.news[i - 1];     // 数组里新的在前：上一篇 = 更旧的
    el.innerHTML = `
      <article class="article">
        <div class="article-meta"><time class="card-date">${esc(n.date)}</time>${newsTag(n)}</div>
        ${tx(k('news', n.id, 'title'), n.title, 'h2', 'article-title')}
        ${n.image ? `<figure class="article-img"><img src="${n.image}" alt=""></figure>` : ''}
        ${html(k('news', n.id, 'body'), n.body, 'div', 'prose')}
        ${n.link ? `<a class="btn-more" href="${n.link.url}"${/^https?:/.test(n.link.url) ? ' target="_blank" rel="noopener"' : ''}>${tx(k('news', n.id, 'link.label'), n.link.label)}<i class="chev" aria-hidden="true"></i></a>` : ''}
      </article>
      ${pager('news', prev, next)}`;
    return n;
  }

  /* ------------------------------------------------------------------
     子页：作品
     ------------------------------------------------------------------ */
  function worksList(el, filter) {
    const list = D.works.filter(w => !filter || filter === 'all' || w.type === filter);
    el.innerHTML = list.length ? `<div class="work-grid">${list.map(w => `
      <a class="work-card" href="works.html?id=${w.id}">
        ${cover(w, 'work-cover')}
        <div class="work-info">
          <div class="work-no"><span>${esc(w.no)}</span><span>${esc(w.date)}</span></div>
          ${tx(k('works', w.id, 'title'), w.title, 'h3', 'work-title')}
          <div class="work-kicker"><span>${esc(w.kicker)}</span>${statusTag(w)}</div>
          ${w.line ? tx(k('works', w.id, 'line'), w.line, 'p', 'muted') : ''}
        </div>
      </a>`).join('')}</div>` : `<p class="muted empty" data-i18n="ui.empty"></p>`;
  }
  // 嵌入播放器：B 站 / YouTube；都没有就是占位框
  function player(w) {
    const srcs = [];
    if (w.bilibili) srcs.push({ name: 'Bilibili', src: `https://player.bilibili.com/player.html?bvid=${encodeURIComponent(w.bilibili)}&autoplay=0&high_quality=1` });
    if (w.youtube) srcs.push({ name: 'YouTube', src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(w.youtube)}` });
    if (!srcs.length) {
      return `<div class="player ph"${w.cover ? ` style="background-image:url('${w.cover}')"` : ''}><span data-i18n="works.video"></span></div>`;
    }
    return `
      <div class="player">
        <iframe src="${srcs[0].src}" title="${esc(w.kicker)}" allow="fullscreen; picture-in-picture; encrypted-media" allowfullscreen loading="lazy"></iframe>
      </div>
      ${srcs.length > 1 ? `<div class="player-src" role="group">${srcs.map((s, i) =>
        `<button type="button" data-src="${s.src}"${i === 0 ? ' class="is-on"' : ''}>${s.name}</button>`).join('')}</div>` : ''}`;
  }
  function worksDetail(el, id) {
    const i = D.works.findIndex(w => w.id === id);
    if (i < 0) return false;
    const w = D.works[i];
    const prev = D.works[i + 1], next = D.works[i - 1];
    el.innerHTML = `
      <article class="article work-detail">
        <div class="article-meta"><span class="work-no-big">${esc(w.no)}</span><time class="card-date">${esc(w.date)}</time>${statusTag(w)}</div>
        <span class="kicker">${esc(w.kicker)}</span>
        <h2 class="article-title">「${isTx(w.title) ? `<span data-i18n="${k('works', w.id, 'title')}"></span>` : esc(w.title)}」</h2>
        ${w.line ? tx(k('works', w.id, 'line'), w.line, 'p', 'lead') : ''}
        ${w.status === 'released' ? player(w) : (w.cover ? `<figure class="article-img"><img src="${w.cover}" alt=""></figure>` : '')}
        ${w.credits && w.credits.length ? `
          <section class="block">
            <h3 class="block-title"><span>CREDITS</span><span data-i18n="works.credits"></span></h3>
            <dl class="credits">${w.credits.map(c => `<div><dt data-i18n="role.${c.role}"></dt><dd>${esc(c.name)}</dd></div>`).join('')}</dl>
          </section>` : ''}
        ${w.tracks && w.tracks.length ? `
          <section class="block">
            <h3 class="block-title"><span>TRACKLIST</span><span data-i18n="works.tracks"></span></h3>
            <ol class="tracks">${w.tracks.map(t => `<li><span>${esc(t.title)}</span><span>${esc(t.time)}</span></li>`).join('')}</ol>
          </section>` : ''}
        ${w.note ? `
          <details class="block note">
            <summary class="block-title"><span>NOTE</span><span data-i18n="works.note"></span><i class="chev" aria-hidden="true"></i></summary>
            ${html(k('works', w.id, 'note'), w.note, 'div', 'prose')}
          </details>` : ''}
      </article>
      ${pager('works', prev, next)}`;
    el.querySelectorAll('.player-src button').forEach(b => b.addEventListener('click', () => {
      el.querySelector('.player iframe').src = b.dataset.src;
      el.querySelectorAll('.player-src button').forEach(x => x.classList.toggle('is-on', x === b));
    }));
    return w;
  }

  // 详情页底部：上一篇 / 一览 / 下一篇
  function pager(col, prev, next) {
    const link = (item, dir) => item
      ? `<a class="pager-${dir}" href="${col}.html?id=${item.id}"><span class="kicker">${dir === 'prev' ? 'PREV' : 'NEXT'}</span>${tx(k(col, item.id, 'title'), item.title)}</a>`
      : `<span class="pager-${dir}"></span>`;
    return `<nav class="pager">${link(prev, 'prev')}<a class="pager-list" href="${col}.html"><span data-i18n="ui.backList"></span></a>${link(next, 'next')}</nav>`;
  }

  /* ------------------------------------------------------------------
     子页：成员（按分组）
     ------------------------------------------------------------------ */
  const GROUPS = [
    { id: 'music', latin: 'MUSIC', key: 'members.sub1' },
    { id: 'lyrics', latin: 'LYRICS', key: 'members.sub2' },
    { id: 'art', latin: 'ART', key: 'members.sub3' },
    { id: 'production', latin: 'PRODUCTION', key: 'members.sub4' },
  ];
  function membersPage(el) {
    el.innerHTML = GROUPS.map(g => {
      const list = D.members.filter(m => m.group === g.id);
      if (!list.length) return '';
      return `
        <section class="block member-group" id="group-${g.id}">
          <h3 class="block-title"><span>${g.latin}</span><span data-i18n="${g.key}"></span><b>${String(list.length).padStart(2, '0')}</b></h3>
          <div class="profile-list">${list.map(m => `
            <article class="profile" id="${m.id}">
              ${avatar(m)}
              <div class="profile-body">
                <h4 class="profile-name">${esc(m.name)}</h4>
                <p class="profile-roles">${roles(m.roles)}</p>
                ${m.bio ? html(k('members', m.id, 'bio'), m.bio, 'p', 'profile-bio') : ''}
                ${m.works ? `<p class="profile-works"><span data-i18n="members.works"></span>${esc(m.works)}</p>` : ''}
                ${m.links && m.links.length ? `<div class="platforms small">${m.links.map(l =>
                  `<a href="${l.url}" target="_blank" rel="noopener">${esc(l.label)}<i class="arrow" aria-hidden="true"></i></a>`).join('')}</div>` : ''}
              </div>
            </article>`).join('')}</div>
        </section>`;
    }).join('');
  }

  /* ---------- 首页：脚本加载时就渲染（main.js 之后要给 .card 绑 hover、给内容做淡入） ---------- */
  const homeNewsEl = $('#homeNews');
  const homeWorksEl = $('#homeWorks');
  const homeMembersEl = $('#homeMembers');
  if (homeNewsEl) homeNews(homeNewsEl);
  if (homeWorksEl) homeWorks(homeWorksEl);
  if (homeMembersEl) homeMembers(homeMembersEl);

  return { GROUPS, newsList, newsDetail, worksList, worksDetail, membersPage };
})();
