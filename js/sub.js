/* =====================================================================
   共鳴線 LyraLine — 子页面（news.html / works.html / members.html）
   普通滚动页面，没有唱片和整屏翻页；底色 / 语言 / 菜单和首页共用同一套存储
   <body data-page="news|works|members">
     - 列表：news.html、news.html?tag=event（筛选）
     - 详情：news.html?id=xxx
   ===================================================================== */
(() => {
  'use strict';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const I18N = window.LYRA_I18N;
  const R = window.LYRA_RENDER;
  const page = document.body.dataset.page;
  const params = new URLSearchParams(location.search);

  // 菜单目录：和 main.js 的 NAV 一致，跳回首页对应板块
  const NAV = [
    { id: 'home',    letter: '',  latin: 'HOME',    key: 'nav.home',    subs: [] },
    { id: 'news',    letter: 'A', latin: 'NEWS',    key: 'nav.news',    subs: ['news.sub1', 'news.sub2'] },
    { id: 'works',   letter: 'B', latin: 'WORKS',   key: 'nav.works',   subs: ['works.sub1', 'works.sub2'] },
    { id: 'world',   letter: 'C', latin: 'WORLD',   key: 'nav.world',   subs: ['world.sub1', 'world.sub2', 'world.sub3'] },
    { id: 'members', letter: 'D', latin: 'MEMBERS', key: 'nav.members', subs: ['members.sub1', 'members.sub2', 'members.sub3'] },
    { id: 'about',   letter: 'E', latin: 'ABOUT',   key: 'nav.about',   subs: ['about.sub1', 'about.sub2'] },
  ];
  const HAS_PAGE = ['news', 'works', 'members'];   // 有独立子页的板块：菜单直接进子页
  const navPage = page === 'music' ? 'works' : page;   // 音乐作品页归在 B 作品下
  $('#menuList').innerHTML = NAV.map(n => `
    <li><a href="${HAS_PAGE.includes(n.id) ? `${n.id}.html` : `index.html#${n.id}`}" class="${n.id === navPage ? 'is-current' : ''}">
      <b>${n.letter || '—'}</b>
      <span class="latin">${n.latin}</span>
      <span class="local" data-i18n="${n.key}"></span>
      ${n.subs.length ? `<span class="subs">${n.subs.map(k => `<span data-i18n="${k}"></span>`).join('<em>/</em>')}</span>` : ''}
    </a></li>`).join('');

  /* ---------- 进入视口时淡入 ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  function reveal() {
    $$('.work-card, .card, .profile, .article > *, .block, .pager').forEach(el => {
      if (!el.classList.contains('is-in')) { el.classList.add('fx'); io.observe(el); }
    });
  }

  /* ---------- 内容 ---------- */
  const main = $('#subMain');
  const filterEl = $('#subFilter');
  const side = $('.sub-side');
  const id = params.get('id');
  let detail = null;          // 详情页的那一条数据（用来更新标题）

  const LISTS = {
    news:  { list: R.newsList,  detail: R.newsDetail,  param: 'tag' },
    works: { list: R.worksList, detail: R.worksDetail, param: 'type' },
  };

  if (page === 'members') {
    R.membersPage(main);
  } else if (LISTS[page]) {
    const cfg = LISTS[page];
    if (id) detail = cfg.detail(main, id);
    if (detail) {
      document.body.classList.add('is-detail');
    } else {
      // 列表 + 筛选：按钮切换时只改网址参数，不刷新页面
      const show = f => {
        cfg.list(main, f);
        $$('button', filterEl).forEach(b => b.classList.toggle('is-on', b.dataset.filter === f));
        I18N.apply(I18N.lang, false);
        reveal();
      };
      const initial = params.get(cfg.param) || 'all';
      filterEl.addEventListener('click', e => {
        const b = e.target.closest('[data-filter]');
        if (!b) return;
        const f = b.dataset.filter;
        history.replaceState(null, '', f === 'all' ? location.pathname : `?${cfg.param}=${f}`);
        show(f);
      });
      show(initial);                              // ?id= 找不到时也退回列表
    }
  }

  if (page === 'members' || detail) reveal();

  /* ---------- 标题：详情页显示「条目名 | 共鳴線」 ---------- */
  const baseTitle = document.title;
  function updateTitle() {
    if (!detail) return;
    const key = `data.${page}.${detail.id}.title`;
    const t = typeof detail.title === 'object' ? I18N.t(key) : detail.title;
    document.title = `${t} | ${baseTitle}`;
  }
  document.addEventListener('lyra:lang', updateTitle);


  /* ---------- 菜单 ---------- */
  const menu = $('#menu'), menuBtn = $('#menuBtn');
  const menuOpen = () => menu.classList.contains('is-open');
  function setMenu(open) {
    menu.classList.toggle('is-open', open); menuBtn.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true'); menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.documentElement.classList.toggle('is-locked', open);
  }
  menuBtn.addEventListener('click', () => setMenu(!menuOpen()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen()) setMenu(false); });

  /* ---------- 底色 ---------- */
  const THEME_KEY = 'lyra.theme';
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
  document.documentElement.dataset.theme = saved === 'dark' ? 'dark' : 'light';
  $('#themeBtn').addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* ignore */ }
  });

  /* ---------- 语言 ---------- */
  I18N.apply(I18N.detect(), false);
  $$('[data-lang]').forEach(b => b.addEventListener('click', () => I18N.apply(b.dataset.lang, true)));

  // 从首页带 #成员id 进来：等字体和图片排好版再滚过去
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) {
      target.classList.add('is-target');
      window.addEventListener('load', () => target.scrollIntoView({ block: 'center' }));
    }
  }
  if (side) side.classList.add('is-in');
})();
