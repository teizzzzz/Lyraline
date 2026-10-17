/* =====================================================================
   共鳴線 LyraLine — 内容数据（新闻 / 作品 / 成员）
   首页的 A / B / D 板块和 news.html / works.html / members.html 都从这里取内容，
   加一条新闻 / 作品 / 成员只需要改这个文件。

   文字字段的写法：
     - 三语不同：{ zh: '…', en: '…', ja: '…' }（缺哪种语言就回退到 日 → 中 → 英）
     - 三语相同：直接写字符串（人名、曲名的罗马字等）
   body / bio 这类长文字段可以带 <p> <br> <a> 等标签。
   列表按数组顺序显示：新的写在最前面。
   ===================================================================== */
window.LYRA_DATA = (() => {
  /* ---------------- 新闻 ----------------
     id    : 唯一 id，用在网址 news.html?id=xxx
     date  : 显示用日期（'2025.xx.xx' 这种未定日期也可以）
     tag   : 'notice' 公告 / 'event' 活动 / 'release' 发布
     image : 可选，详情页顶部的图
     link  : 可选，详情页底部的外链按钮 { url, label } */
  const news = [
    {
      id: 'midori-mv',
      date: '2025.xx.xx',
      tag: 'release',
      title: { zh: '第一首单曲「緑浮遊」MV 公开', en: 'First single "Midori Fuyū" MV released', ja: '1stシングル「緑浮遊」MV公開' },
      image: 'docs/img/First%20Song%20Cover.JPG',
      body: {
        zh: '<p>共鳴線的第一首原创单曲「緑浮遊」MV 已在 Bilibili 与 YouTube 公开。</p><p>这是 WP-7 在地球上收集到的第一段声音。</p>',
        en: '<p>The music video for LyraLine\'s first original single, "Midori Fuyū", is now live on Bilibili and YouTube.</p><p>It is the first sound WP-7 collected on Earth.</p>',
        ja: '<p>共鳴線の1stオリジナルシングル「緑浮遊」のMVを、Bilibili・YouTubeにて公開しました。</p><p>WP-7が地球で最初に集めた音です。</p>',
      },
      link: { url: 'works.html?id=midori', label: { zh: '查看作品', en: 'View work', ja: '作品を見る' } },
    },
    {
      id: 'teaser',
      date: '2025.xx.xx',
      tag: 'release',
      title: { zh: '企划预告影像公开', en: 'Project teaser released', ja: 'ティザー映像公開' },
      image: 'docs/img/Promo1.PNG',
      body: {
        zh: '<p>共鳴線企划预告影像公开。</p>',
        en: '<p>The LyraLine project teaser is now available.</p>',
        ja: '<p>共鳴線のティザー映像を公開しました。</p>',
      },
    },
    {
      id: 'website',
      date: '2025.xx.xx',
      tag: 'notice',
      title: { zh: '官方网站建设中', en: 'Official website under construction', ja: '公式サイト制作中' },
      body: {
        zh: '<p>共鳴線官方网站正在建设中，内容会陆续更新。</p>',
        en: '<p>The LyraLine official website is under construction. More content is on the way.</p>',
        ja: '<p>共鳴線公式サイトは現在制作中です。コンテンツは順次公開していきます。</p>',
      },
    },
    {
      id: 'event-tbd',
      date: '2025.xx.xx',
      tag: 'event',
      title: { zh: '参展信息（占位）', en: 'Exhibition info (placeholder)', ja: '出展情報（仮）' },
      summary: {
        zh: '活动名、情报相关插图、照片与周边信息。',
        en: 'Event name, related artwork, photos and merch info.',
        ja: 'イベント名、関連イラスト、写真、グッズ情報など。',
      },
      body: {
        zh: '<p>这里放活动名称、时间地点、展位号、情报插图、现场照片与周边信息。</p>',
        en: '<p>Event name, date and venue, booth number, key visual, photos and merch info go here.</p>',
        ja: '<p>イベント名、日時・会場、ブース番号、告知イラスト、写真、グッズ情報などを掲載します。</p>',
      },
    },
  ];

  /* ---------------- 作品 ----------------
     id      : 唯一 id，网址 works.html?id=xxx
     type    : 'mv' 音乐 MV / 'album' 专辑 / 'teaser' 预告（决定出现在哪个分类里）
     status  : 'released' 已发布 / 'wip' 制作中
     cover   : 封面图（没有就显示斜线占位）
     bilibili: B 站 BV 号（例 'BV1xx411c7mD'）→ 嵌入播放器
     youtube : YouTube 视频 id（例 'dQw4w9WgXcQ'）→ 嵌入播放器；两者都填时可在详情页切换
     credits : [{ role: 'compose', name: '…' }]，role 对应 i18n 里的 role.xxx
     tracks  : 专辑曲目（可选）[{ title, time }] */
  const works = [
    {
      id: 'midori',
      no: '01',
      type: 'mv',
      status: 'released',
      date: '2025.xx.xx',
      title: { zh: '緑浮遊', en: 'Midori Fuyū', ja: '緑浮遊' },
      kicker: 'First Single · MV',
      cover: 'docs/img/First%20Song%20Cover.JPG',
      bilibili: '',
      youtube: '',
      line: {
        zh: '沉入记忆深处的声音，再一次浮上水面。',
        en: 'A sound sunk deep in memory rises to the surface once more.',
        ja: '記憶の底に沈んだ音が、もう一度浮かび上がる。',
      },
      credits: [
        { role: 'compose', name: '—' },
        { role: 'arrange', name: '—' },
        { role: 'lyrics', name: '—' },
        { role: 'vocal', name: '—' },
        { role: 'illust', name: '—' },
        { role: 'chara', name: 'shuuyakikou' },
        { role: 'video', name: '—' },
        { role: 'mix', name: '—' },
      ],
      note: {
        zh: '<p>（创作手记占位）关于这首曲子的诞生、MV 的构想与制作过程。</p>',
        en: '<p>(Production notes placeholder) How the song was born, and how the MV came together.</p>',
        ja: '<p>（制作ノート仮）楽曲が生まれた経緯、MVの構想と制作過程について。</p>',
      },
    },
    {
      id: 'teaser',
      no: '00',
      type: 'teaser',
      status: 'released',
      date: '2025.xx.xx',
      title: { zh: '企划预告', en: 'Teaser', ja: 'ティザー' },
      kicker: 'Teaser',
      cover: 'docs/img/Promo1.PNG',
      bilibili: '',
      youtube: '',
      line: {
        zh: '文明沉默之后，唯有声音留存。',
        en: 'After civilization fell silent, only sound remained.',
        ja: '文明が沈黙した後も、音だけが残り続けた。',
      },
      credits: [],
    },
    {
      id: 'next',
      no: '02',
      type: 'mv',
      status: 'wip',
      date: 'Coming soon',
      title: { zh: '下一部作品', en: 'Next work', ja: '次の作品' },
      kicker: 'Next Single · MV',
      cover: '',
      line: { zh: '下一部作品正在制作中。', en: 'The next work is in production.', ja: '次の作品を制作中です。' },
      credits: [],
    },
    {
      id: 'album-tbd',
      no: '—',
      type: 'album',
      status: 'wip',
      date: 'TBA',
      title: { zh: '专辑（占位）', en: 'Album (placeholder)', ja: 'アルバム（仮）' },
      kicker: '1st Album',
      cover: '',
      line: { zh: '专辑封面、曲目列表与发行信息。', en: 'Cover art, tracklist and release info.', ja: 'ジャケット、トラックリスト、リリース情報。' },
      credits: [],
      tracks: [
        { title: '緑浮遊', time: '—' },
        { title: '—', time: '—' },
      ],
    },
  ];

  /* ---------------- 成员 ----------------
     group  : 'music' 音乐 / 'lyrics' 作词 / 'art' 美术 / 'production' 影像・制作
     roles  : 担当，对应 i18n 里的 role.xxx
     color  : 没有头像时，小唱片头像的颜色
     avatar : 可选，头像图
     works  : 代表作 / 参与作品（可选，文字）
     links  : [{ label: 'X', url: '…' }] */
  const members = [
    {
      id: 'shuuyakikou', name: 'shuuyakikou', group: 'art', roles: ['chara', 'illust'], color: 'var(--c-teal)',
      bio: {
        zh: 'WP-7 角色设计。<br>「一个试图看透什么、试图理解什么的孩子。」',
        en: 'Character designer of WP-7.<br>"A child trying to see through something, trying to understand."',
        ja: 'WP-7 キャラクターデザイン。<br>「何かを見抜き、理解しようとしている子。」',
      },
      works: 'WP-7',
      links: [],
    },
    { id: 'member-a', name: 'Member A', group: 'music', roles: ['compose', 'arrange'], color: 'var(--c-red)',
      bio: { zh: '（简介占位）', en: '(Bio placeholder)', ja: '（プロフィール仮）' }, links: [] },
    { id: 'member-f', name: 'Member F', group: 'music', roles: ['mix'], color: 'var(--c-black)',
      bio: { zh: '（简介占位）', en: '(Bio placeholder)', ja: '（プロフィール仮）' }, links: [] },
    { id: 'member-b', name: 'Member B', group: 'lyrics', roles: ['lyrics'], color: 'var(--c-olive)',
      bio: { zh: '（简介占位）', en: '(Bio placeholder)', ja: '（プロフィール仮）' }, links: [] },
    { id: 'member-c', name: 'Member C', group: 'art', roles: ['illust'], color: 'var(--c-lavender)',
      bio: { zh: '（简介占位）', en: '(Bio placeholder)', ja: '（プロフィール仮）' }, links: [] },
    { id: 'member-d', name: 'Member D', group: 'production', roles: ['video'], color: 'var(--c-text)',
      bio: { zh: '（简介占位）', en: '(Bio placeholder)', ja: '（プロフィール仮）' }, links: [] },
    { id: 'member-e', name: 'Member E', group: 'production', roles: ['plan'], color: 'var(--c-gray)',
      bio: { zh: '（简介占位）', en: '(Bio placeholder)', ja: '（プロフィール仮）' }, links: [] },
  ];

  /* ------------------------------------------------------------------
     把三语字段注册进 i18n 词典：data.<集合>.<id>.<字段>
     页面上用 data-i18n / data-i18n-html 引用，切换语言时不用重新渲染
     ------------------------------------------------------------------ */
  const I18N = window.LYRA_I18N;
  const LANGS = ['zh', 'en', 'ja'];
  const isTx = v => v && typeof v === 'object' && !Array.isArray(v) && LANGS.some(l => l in v);
  function register(prefix, obj) {
    Object.entries(obj).forEach(([k, v]) => {
      if (isTx(v)) {
        LANGS.forEach(l => { I18N.dict[l][`${prefix}.${k}`] = v[l] ?? v.ja ?? v.zh ?? v.en; });
      } else if (v && typeof v === 'object' && !Array.isArray(v)) {
        register(`${prefix}.${k}`, v);
      }
    });
  }
  news.forEach(n => register(`data.news.${n.id}`, n));
  works.forEach(w => register(`data.works.${w.id}`, w));
  members.forEach(m => register(`data.members.${m.id}`, m));

  return { news, works, members };
})();
