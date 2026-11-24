/* =====================================================================
   共鳴線 LyraLine — i18n（中 / EN / 日）
   用法：<span data-i18n="nav.news"></span>
        <p data-i18n-html="world.p1"></p>                 （允许 <br> 等标签）
        <button data-i18n-attr="aria-label:ui.menu;title:ui.menu">
   缺 key 时回退到英文，再回退到 key 本身。
   ===================================================================== */
window.LYRA_I18N = (() => {
  const dict = {
    /* ---------------- 中文 ---------------- */
    zh: {
      'site.name': '共鳴線',
      'site.tagline': '在声音成为记忆之前，愿它能抵达某个人。',

      'ui.menu': '菜单',
      'ui.close': '关闭',
      'ui.theme': '切换底色',
      'ui.lang': '语言',
      'ui.scroll': '向下滚动',
      'hint.dragScroll': '按住向下拖动',
      'ui.intro.tip': '点击打开手提箱',

      'nav.home': '首页',
      'nav.news': '新闻',
      'nav.works': '作品',
      'nav.world': '世界介绍',
      'nav.members': '成员构成',
      'nav.about': '关于我们',
      'nav.deck': '企划书',

      'home.kicker': '音乐企划 · 建设中',
      'home.intro': '以原创音乐为核心，角色・世界观・影像交织的多媒体企划。',
      'home.dirTitle': '目录',

      'news.sub1': '最新公告',
      'news.sub2': '活动情报',
      'news.tag.notice': '公告',
      'news.tag.event': '活动',
      'news.more': '查看全部新闻',

      'works.sub1': '音乐 MV',
      'works.sub2': '专辑',
      'works.nav1': '单曲',
      'works.nav2': '曲绘',
      'works.nav3': '角色与世界观',
      'works.nav4': 'PV',
      'works.nav5': '专辑',
      'works.lead': '每一首乐曲，都是世界的碎片，也是情感的记录。',
      'works.video': '',
      'works.watchMV': '点击观看 MV',
      'works.watch': '观看版本',
      'works.status.released': '已发布',
      'works.status.wip': '制作中',
      'works.soon': '即将公开',

      'world.sub1': '世界观简述',
      'world.sub2': '故事背景',
      'world.sub3': '角色立绘 & 设定',
      'world.lead': '文明沉默之后，唯有声音留存。',
      'world.p1': '曾经繁荣的文明，因大规模灾害而崩塌。城市化为废墟，建筑被藤蔓覆盖，野花在崩裂的墙壁间安静地萌芽。',
      'world.p2': '语言消失了，历史断绝了，秩序不复存在。然而，声音留了下来。在损坏的机械里，在风化的存储介质中，以微弱的振动，沉睡在世界的某个角落。',
      'world.char.role': '收集者',
      'world.char.desc': '来自一个缺乏情感与音乐文化的宇宙文明，被派遣至地球的存在。任务是收集地球上残留的声音与音乐记录。',

      'members.sub1': '音乐',
      'members.sub2': '作词',
      'members.sub3': '美术',
      'members.lead': '一个人无法做到的事，我们一起实现。',
      'members.note': '此外，还有 20 名以上的长期协作成员在籍，构建了持续稳定的制作体制。',

      'about.sub1': '各平台账号',
      'about.sub2': '联系方式',
      'about.lead': '共鳴線是以原创音乐为核心，结合角色・视觉・世界观的多媒体企划。每首乐曲作为独立作品存在，最终织就世界的肌理。',
      'about.contactTitle': '联系我们',
      'about.contact': '合作相关请通过邮件联系。',
      'about.emailNote': '',

      'ui.backHome': '返回首页',
      'ui.all': '全部',
      'ui.empty': '暂无内容。',
      'ui.backList': '返回一览',
      'news.tag.release': '发布',
      'works.sub3': '预告',
      'works.more': '查看全部作品',
      'works.credits': '制作人员',
      'works.tracks': '曲目',
      'works.note': '创作手记',
      'members.sub4': '影像・制作',
      'members.more': '查看全部成员',
      'members.works': '代表作　',
      'role.compose': '作曲',
      'role.arrange': '编曲',
      'role.lyrics': '作词',
      'role.vocal': '演唱',
      'role.illust': '插画',
      'role.chara': '角色设计',
      'role.video': 'PV',
      'role.mix': '混音',
      'role.plan': '企划・统筹',
      'role.narration': '念白',
      'role.writer': '写手',
      'role.producer': '制作人・统筹',
      'role.production': '制作统筹',
      'role.design': '设计',
      'role.artDir': '视觉指导',
      'role.animation': '动画',

      'music.sub': '恭喜你，发现了未知的领域！部分歌曲目前还在制作中…敬请期待!',
      'music.play': '播放',
      'music.pause': '暂停',
      'music.seek': '播放进度',
      'music.listen': '试听全部作品',
      'works.listenTrack': '试听此曲',

      'footer.line': '感谢你听到这里。',
      'footer.close': '合上手提箱',
      'footer.copy': '© 2025 共鳴線 LyraLine',
      'footer.top': '回到顶部',
    },

    /* ---------------- English ---------------- */
    en: {
      'site.name': '共鳴線',
      'site.tagline': 'Before a sound becomes a memory, may it reach someone.',

      'ui.menu': 'Menu',
      'ui.close': 'Close',
      'ui.theme': 'Toggle background',
      'ui.lang': 'Language',
      'ui.scroll': 'Scroll',
      'hint.dragScroll': 'Scroll to see more',
      'ui.intro.tip': 'Click to open the case',

      'nav.home': 'Home',
      'nav.news': 'News',
      'nav.works': 'Works',
      'nav.world': 'World',
      'nav.members': 'Members',
      'nav.about': 'About',
      'nav.deck': 'Pitch Deck',

      'home.kicker': 'Music project · under construction',
      'home.intro': 'A multimedia project built around original music, where characters, worldbuilding and film intersect.',
      'home.dirTitle': 'Index',

      'news.sub1': 'Announcements',
      'news.sub2': 'Events',
      'news.tag.notice': 'Notice',
      'news.tag.event': 'Event',
      'news.more': 'View all news',

      'works.sub1': 'Music videos',
      'works.sub2': 'Albums',
      'works.nav1': 'Single',
      'works.nav2': 'Illustration',
      'works.nav3': 'Character&World',
      'works.nav4': 'PV',
      'works.nav5': 'Albums',
      'works.lead': 'Each song is a fragment of the world, and a record of feeling.',
      'works.video': '',
      'works.watchMV': 'Watch the MV',
      'works.watch': 'Watch versions',
      'works.status.released': 'Released',
      'works.status.wip': 'In progress',
      'works.soon': 'Coming soon',

      'world.sub1': 'Overview',
      'world.sub2': 'Story',
      'world.sub3': 'Characters & settings',
      'world.lead': 'After civilization fell silent, only sound remained.',
      'world.p1': 'A once-flourishing civilization collapsed in a great disaster. Cities became ruins, buildings were swallowed by vines, and wildflowers quietly took root between the cracked walls.',
      'world.p2': 'Language was lost, history was severed, order disappeared. And yet, sound remained. Inside broken machines, on weathered storage media, it sleeps somewhere in the world as the faintest vibration.',
      'world.char.role': 'The Collector',
      'world.char.desc': 'Sent to Earth from a civilization with little emotion or music. Its mission: to collect the sounds and musical records left behind on Earth.',

      'members.sub1': 'Music',
      'members.sub2': 'Lyrics',
      'members.sub3': 'Art',
      'members.lead': 'What one cannot do alone, we do together.',
      'members.note': 'In addition, more than 20 long-term collaborating members are part of the team, sustaining a continuous production system.',

      'about.sub1': 'Platforms',
      'about.sub2': 'Contact',
      'about.lead': 'LyraLine is a multimedia project built around original music, combining characters, visuals and worldbuilding. Each song stands as an independent work, while all of them connect within one shared world.',
      'about.contactTitle': 'Contact',
      'about.contact': 'For partnership inquiries, please reach us by email.',
      'about.emailNote': '',

      'ui.backHome': 'Back to top',
      'ui.all': 'All',
      'ui.empty': 'Nothing here yet.',
      'ui.backList': 'Back to list',
      'news.tag.release': 'Release',
      'works.sub3': 'Teaser',
      'works.more': 'View all works',
      'works.credits': 'Credits',
      'works.tracks': 'Tracklist',
      'works.note': 'Production notes',
      'members.sub4': 'Video · Production',
      'members.more': 'View all members',
      'members.works': 'Works: ',
      'role.compose': 'Composer',
      'role.arrange': 'Arranger',
      'role.lyrics': 'Lyricist',
      'role.vocal': 'Vocal',
      'role.illust': 'Illustration',
      'role.chara': 'Character design',
      'role.video': 'PV',
      'role.mix': 'Mixing',
      'role.plan': 'Planning · Production',
      'role.narration': 'Narration',
      'role.writer': 'Writer',
      'role.producer': 'Producer · Production Manager',
      'role.production': 'Production Manager',
      'role.design': 'Design',
      'role.artDir': 'Art direction',
      'role.animation': 'Animation',

      'music.sub': "Congratulations — you've discovered uncharted territory!<br>Some songs are still in production… stay tuned!",
      'music.play': 'Play',
      'music.pause': 'Pause',
      'music.seek': 'Playback position',
      'music.listen': 'Listen to all works',
      'works.listenTrack': 'Listen to this track',

      'footer.line': 'Thank you for listening this far.',
      'footer.close': 'Closing the case',
      'footer.copy': '© 2025 共鳴線 LyraLine',
      'footer.top': 'Back to top',
    },

    /* ---------------- 日本語 ---------------- */
    ja: {
      'site.name': '共鳴線',
      'site.tagline': '音が記憶になる前に、誰かに届くように。',

      'ui.menu': 'メニュー',
      'ui.close': '閉じる',
      'ui.theme': '背景色を切り替え',
      'ui.lang': '言語',
      'ui.scroll': 'スクロール',
      'hint.dragScroll': '押して下にスクロール',
      'ui.intro.tip': 'クリックでケースを開く',

      'nav.home': 'トップ',
      'nav.news': 'ニュース',
      'nav.works': '作品',
      'nav.world': '世界観',
      'nav.members': 'メンバー',
      'nav.about': '私たちについて',
      'nav.deck': '企画書',

      'home.kicker': '音楽プロジェクト · 制作中',
      'home.intro': 'オリジナル音楽を核に、キャラクター・世界観・映像が交差するマルチメディアプロジェクト。',
      'home.dirTitle': '目次',

      'news.sub1': '最新のお知らせ',
      'news.sub2': 'イベント情報',
      'news.tag.notice': 'お知らせ',
      'news.tag.event': 'イベント',
      'news.more': 'NEWS一覧を見る',

      'works.sub1': 'ミュージックビデオ',
      'works.sub2': 'アルバム',
      'works.nav1': 'シングル',
      'works.nav2': 'イラスト',
      'works.nav3': 'キャラクター＆世界観',
      'works.nav4': 'PV',
      'works.nav5': 'アルバム',
      'works.lead': 'それぞれの楽曲は、世界の断片であり、感情の記録です。',
      'works.video': '',
      'works.watchMV': 'MVを見る',
      'works.watch': '視聴バージョン',
      'works.status.released': '公開済み',
      'works.status.wip': '制作中',
      'works.soon': '近日公開',

      'world.sub1': '世界観',
      'world.sub2': '物語の背景',
      'world.sub3': 'キャラクター設定',
      'world.lead': '文明が沈黙した後も、音だけが残り続けた。',
      'world.p1': 'かつて栄えた文明は、大規模な災害によって崩壊した。都市は廃墟となり、建物は蔦に覆われ、野の花が崩れた壁のあいだに静かに芽吹いている。',
      'world.p2': '言語は失われ、歴史は途絶え、秩序は消えた。けれど、音だけが残った。壊れた機械の中に、風化した記録媒体の中に、かすかな振動として、世界のどこかに眠り続けている。',
      'world.char.role': '収集者',
      'world.char.desc': '感情や音楽文化が乏しい宇宙文明から、地球へ派遣された存在。任務は、地球に残された音と音楽の記録を収集すること。',

      'members.sub1': '音楽',
      'members.sub2': '作詞',
      'members.sub3': '美術',
      'members.lead': '一人ではできないことを、共に実現する。',
      'members.note': 'また、長期的に協力するメンバーが20名以上在籍しており、継続的な制作体制を構築しています。',

      'about.sub1': '各プラットフォーム',
      'about.sub2': 'お問い合わせ',
      'about.lead': '共鳴線は、オリジナル楽曲を核に、キャラクター・ビジュアル・世界観を組み合わせたマルチメディア企画です。楽曲一つ一つを独立した作品として成立させ、最終的に世界の肌理を織りなします。',
      'about.contactTitle': 'お問い合わせ',
      'about.contact': '協業に関するご相談は、メールにてご連絡ください。',
      'about.emailNote': '',

      'ui.backHome': 'トップへ戻る',
      'ui.all': 'すべて',
      'ui.empty': 'まだありません。',
      'ui.backList': '一覧へ戻る',
      'news.tag.release': 'リリース',
      'works.sub3': 'ティザー',
      'works.more': '作品一覧を見る',
      'works.credits': 'クレジット',
      'works.tracks': '収録曲',
      'works.note': '制作ノート',
      'members.sub4': '映像・制作',
      'members.more': 'メンバー一覧を見る',
      'members.works': '代表作　',
      'role.compose': '作曲',
      'role.arrange': '編曲',
      'role.lyrics': '作詞',
      'role.vocal': '歌唱',
      'role.illust': 'イラスト',
      'role.chara': 'キャラクターデザイン',
      'role.video': 'PV',
      'role.mix': 'ミックス',
      'role.plan': '企画・マネジメント',
      'role.narration': 'ナレーション',
      'role.writer': '脚本',
      'role.producer': 'プロデューサー・制作統括',
      'role.production': '制作統括',
      'role.design': 'デザイン',
      'role.artDir': 'アートディレクション',
      'role.animation': 'アニメーション',

      'music.sub': 'おめでとうございます！未踏の領域を発見しました。現在制作中の曲もあります…お楽しみに！',
      'music.play': '再生',
      'music.pause': '一時停止',
      'music.seek': '再生位置',
      'music.listen': '全作品を試聴する',
      'works.listenTrack': 'この曲を試聴する',

      'footer.line': 'ここまで聴いてくれてありがとう。',
      'footer.close': 'ケースを閉じる',
      'footer.copy': '© 2025 共鳴線 LyraLine',
      'footer.top': 'トップへ戻る',
    },
  };

  const htmlLang = { zh: 'zh-CN', en: 'en', ja: 'ja' };
  const STORE = 'lyra.lang.v2';   // 换 key 让旧的语言缓存失效，确保默认日语
  let current = 'ja';

  const store = {
    get() { try { return localStorage.getItem(STORE); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE, v); } catch (e) { /* 隐私模式等 */ } },
  };

  /* 顺序：用户手动选过的 → 默认日语 */
  function detect() {
    const saved = store.get();
    if (saved && dict[saved]) return saved;
    return 'ja';   // 站点默认语言为日语
  }

  function t(key, lang) {
    const d = dict[lang || current] || dict.en;
    if (d[key] != null) return d[key];
    if (dict.en[key] != null) return dict.en[key];
    return key;
  }

  function apply(lang, persist) {
    current = dict[lang] ? lang : 'en';
    document.documentElement.lang = htmlLang[current];

    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const i = pair.indexOf(':');
        if (i > 0) el.setAttribute(pair.slice(0, i).trim(), t(pair.slice(i + 1).trim()));
      });
    });
    document.querySelectorAll('[data-lang]').forEach(b => {
      const on = b.dataset.lang === current;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    if (persist) store.set(current);
    document.dispatchEvent(new CustomEvent('lyra:lang', { detail: { lang: current } }));
  }

  return { dict, t, apply, detect, get lang() { return current; } };
})();
