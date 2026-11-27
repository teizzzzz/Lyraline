/* =====================================================================
   共鳴線 LyraLine — 内容数据（新闻 / 作品 / 成员）
   首页的 A / B / D 板块和 news.html / works.html / members.html 都从这里取内容，
   加一条新闻 / 作品 / 成员只需要改这个文件。

   文字字段的写法：
     - 三语不同：{ zh: '…', en: '…', ja: '…' }（缺哪种语言就回退到 日 → 中 → 英）
     - 三语相同：直接写字符串（人名、曲名的罗马字等）
   body / bio / note 这类长文字段可以带 <p> <br> <a> 等标签。
   gallery : 图片数组，渲染成宫格（成员个人作品、特写图等）。
   列表按数组顺序显示：新的写在最前面。
   ===================================================================== */
window.LYRA_DATA = (() => {
  /* ---------------- Teaser 共用文案 ----------------
     News 的 teaser 条目与 Works 的 teaser 作品共用同一份文案与图片，
     保持两处内容一致（"共用"）。 */
  const teaserBody = {
    zh: '<p>以「波动」为音乐的形态，将声音传向全世界的音乐企划共鸣线 / LyraLine，正式启动。</p>' +
        '<p>第一声共鸣，即将响起。<br>请接收这段来自宇宙的频率。</p>' +
        '<p>・－－－・　・－・・　・－　・－・・　・－・－・</p>' +
        '<p>末日之后的地球，人类几近从历史上消失。<br>曾经的城市，如今被森林与藤蔓吞没，自然再次成为主宰。</p>' +
        '<p>某天，一艘来自异星、带着机械构造的飞船静静降落。<br>舱门开启后，一位拥有绿色外衣、背着白色唱片机的外星人走了出来。</p>' +
        '<p>TA的名字是 Wavepicker-7，来自名为 Echoris 的波之星球。</p>' +
        '<p>在WP-7的故乡，科技高度发达，但他们与音乐的关系比任何文明都更深。<br>这次来到地球，本是为了获取文化与音乐的记录样本。</p>' +
        '<p>但TA很快发现——<br>这里的文明早已被大灾害抹去，只剩断壁残垣与零散的碎片，没有任何有机生命。</p>' +
        '<p>更糟糕的是，小型飞船能源耗尽，无法与母星取得联系。</p>' +
        '<p>于是，WP-7 决定踏上旅途：为了修复飞船、恢复与故乡的通讯，也为了寻找那场灾难中失落的「地球之声」。</p>' +
        '<p>跨越废墟与文明遗迹，WP-7开始倾听这颗星球残留的最后回响，并将它们化为新的音乐，送回宇宙。</p>' +
        '<p>音波跨越星海，即将传达——</p>',
    en: '<p>Turning waves into music and carrying it across the world, the music project LyraLine / 共鳴線 officially launches.</p>' +
        '<p>The first resonance is close at hand.<br>Please receive this frequency from the cosmos.</p>' +
        '<p>・－－－・　・－・・　・－　・－・・　・－・－・</p>' +
        '<p>Earth at the end of days, where humanity has all but vanished from history.</p>' +
        '<p>The places that were once cities are now swallowed by forest and vine, and nature has reclaimed its throne.</p>' +
        '<p>One day, a spacecraft of alien make, all gears and machinery, descends in silence.<br>When the hatch opens, an alien steps out — clad in green, a white record player slung across its shoulders.</p>' +
        '<p>Its name is Wavepicker-7, hailing from a planet of waves called Echoris.</p>' +
        '<p>On WP-7\'s homeworld, technology is highly advanced — yet no civilization has ever felt music more deeply.<br>It came to Earth to gather samples of culture and music.</p>' +
        '<p>But what it found was this: a civilization erased by catastrophe, nothing but ruins and scattered fragments, not a single living thing.</p>' +
        '<p>Worse still, the little ship\'s energy was spent, and contact with home was lost.</p>' +
        '<p>And so WP-7 set out on a journey — to repair the ship, to restore contact with its home world, and to seek the "sound of Earth" lost in that disaster.</p>' +
        '<p>Across ruins and the remains of civilizations, WP-7 begins to listen for the last echoes of this planet, to shape them into new music and send them back into the cosmos.</p>' +
        '<p>The sound waves cross the sea of stars, nearly within reach —</p>',
    ja: '<p>波動を音楽の形にし、世界中に届けるための音楽プロジェクト「共鳴線／LyraLine」、始動。</p>' +
        '<p>最初の共鳴は、まもなく訪れる。<br>どうか、この音を受け取って。</p>' +
        '<p>・－－－・　・－・・　・－　・－・・　・－・－・</p>' +
        '<p>終末を迎えた地球は、人類がほぼ絶滅した世界。</p>' +
        '<p>かつて都市であった場所は、今や豊かな自然が息づき、緑が生い茂っている。</p>' +
        '<p>ある日、異星から来た機械仕掛けの宇宙船が、静かに降り立つ。<br>やがて、その中からひとりの宇宙人が姿を現した。</p>',
  };
  const teaserGallery = ['docs/img/teaser3.jpg', 'docs/img/teaser2.jpg'];
  const teaserWatch = [
    { name: 'Teaser PV', links: [
      { label: 'YouTube', url: 'https://youtu.be/i8jUlTNDaq8?si=v6pSkX57VWdKo0AP' },
      { label: 'Bilibili', url: 'https://b23.tv/KUxGDhK' },
    ]},
  ];

  /* ---------------- 百聯ZX 大屏新闻共用图片 ----------------
     正文四张整图 + gallery 四宫格；顺序按截图确认后的版本。 */
  const zxFullImages = [
    'docs/img/ZX/ZX1a189112e0c472d0196970a4de2c8402e3690980697966859.jpg@1052w_!web-dynamic.webp',
    'docs/img/ZX/ZX20dda9ae654f2ffd8e99c2d1b4046568e3690980697966859.jpg@1052w_!web-dynamic.avif',
    'docs/img/ZX/ZX3.webp',
    'docs/img/ZX/ZX6.webp',
  ].map(src => `<p class="prose-img"><img src="${src}" alt=""></p>`).join('');
  const zxGridImages = [
    'docs/img/ZX/ZX4.5ed4d42e436f2820d762d83a8b8aade3690980697966859.jpg@1052w_!web-dynamic.avif',
    'docs/img/ZX/ZX5.webp',
    'docs/img/ZX/ZX4.webp',
    'docs/img/ZX/ZX7.webp',
  ];

  /* ---------------- 新闻 ----------------
     id    : 唯一 id，用在网址 news.html?id=xxx
     date  : 显示用日期（'2025.xx.xx' 这种未定日期也可以）
     tag   : 'notice' 公告 / 'event' 活动 / 'release' 发布
     image : 可选，详情页顶部的图
     gallery : 可选，图片宫格
     link  : 可选，详情页底部的外链按钮 { url, label } */
  const news = [
    {
      id: 'midori-mv',
      date: '2025.12.12',
      tag: 'release',
      hot: true,
      title: { zh: '第一首单曲「绿浮游」MV 公开', en: 'First single "Verdant Ephemera" MV released', ja: '1stシングル「緑浮遊」MV公開' },
      image: 'docs/img/First%20Song%20Cover.JPG',
      body: {
        zh: '<p>共鳴線的第一首原创单曲「绿浮游」MV 已在 Bilibili 与 YouTube 公开。</p><p>这是 WP-7 在地球上收集到的第一段声音。</p>',
        en: '<p>The music video for LyraLine\'s first original single, "Verdant Ephemera", is now live on Bilibili and YouTube.</p><p>It is the first sound WP-7 collected on Earth.</p>',
        ja: '<p>共鳴線の1stオリジナルシングル「緑浮遊」のMVを、Bilibili・YouTubeにて公開しました。</p><p>WP-7が地球で最初に集めた音です。</p>',
      },
      link: { url: 'works.html?id=midori', label: { zh: '查看作品', en: 'View work', ja: '作品を見る' } },
      watch: [
        { name: '初音ミク,ナースロボ_タイプT ver.', links: [
          { label: 'YouTube', url: 'https://youtu.be/x-2Lpzkx7uc?si=HkxZE9Q59WfqvkXS' },
          { label: 'Bilibili', url: 'https://b23.tv/Sfzdi0V' },
        ]},
        { name: '常夜謠 ver.', links: [
          { label: 'YouTube', url: 'https://youtu.be/EhFRDMh0iCk?si=WdJjCPkv2CrM_ANd' },
          { label: 'Bilibili', url: 'https://b23.tv/k4NLYHs' },
        ]},
      ],
    },
    {
      id: 'kiku-mv',
      date: '2026.07.25',
      tag: 'release',
      hot: true,
      title: { zh: '第二首单曲「聆听者（feat. GUMI）」MV 公开', en: 'Second single "The Listener (feat. GUMI)" MV released', ja: '2ndシングル「聴く人(feat.GUMI)」MV公開' },
      image: 'docs/img/kiku-hito-cover.jpg',
      body: {
        zh: '<p>共鳴線第二首原创单曲「聆听者（feat. GUMI）」MV 现已公开。</p><p>延续 WP-7 的观测记录，这段旋律由 VOCALOID 声库 GUMI 倾情演绎。</p>',
        en: '<p>The music video for LyraLine\'s second original single, "The Listener (feat. GUMI)", is now available.</p><p>Continuing WP-7\'s observations, this piece features vocals by the VOCALOID voicebank GUMI.</p>',
        ja: '<p>共鳴線の2ndオリジナルシングル「聴く人(feat.GUMI)」のMVを公開しました。</p><p>WP-7の観測記録を継ぐ本作は、VOCALOID音声合成エンジン・GUMIの歌声によるものです。</p>',
      },
      link: { url: 'works.html?id=next', label: { zh: '查看作品', en: 'View work', ja: '作品を見る' } },
    },
    {
      id: 'event-tbd',
      date: '2026.11.19',
      tag: 'event',
      title: { zh: '参展预告', en: 'Exhibition preview', ja: '出展予告' },
      summary: {
        zh: '预计参加 M3 2027 展会，展期暂定为 4 月 26 日。',
        en: 'Scheduled to appear at M3 2027, tentatively on April 26.',
        ja: 'M3 2027への出展を予定しております。開催日は4月26日の見込みです。',
      },
      body: {
        zh: '<p>预计参加明年的 M3 2027 展会，展期暂定为 4 月 26 日。</p><p>以下图片为制品预览，更多情报将于日后陆续发布。</p>' +
          '<p class="prose-img"><img src="docs/img/m3-2027-01-case.webp" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-02-sticker.webp" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-03-postcard.jpg" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-04-standee.webp" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-05-cd-booklet.webp" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-06-badge.webp" alt=""></p>',
        en: '<p>We are scheduled to appear at M3 2027 next year, tentatively on April 26.</p><p>The images below offer a preview of our merchandise; further information will be released in due course.</p>' +
          '<p class="prose-img"><img src="docs/img/m3-2027-01-case.webp" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-02-sticker.webp" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-03-postcard.jpg" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-04-standee.webp" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-05-cd-booklet.webp" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-06-badge.webp" alt=""></p>',
        ja: '<p>翌年のM3 2027への出展を予定しており、開催日は4月26日の見込みです。</p><p>以下は製品のプレビューとなります。詳細は順次公開してまいります。</p>' +
          '<p class="prose-img"><img src="docs/img/m3-2027-01-case.webp" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-02-sticker.webp" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-03-postcard.jpg" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-04-standee.webp" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-05-cd-booklet.webp" alt=""></p><p class="prose-img"><img src="docs/img/m3-2027-06-badge.webp" alt=""></p>',
      },
    },
    {
      id: 'bailian-zx',
      date: '2026.10.14',
      tag: 'event',
      hot: true,
      title: { zh: '原创音乐企划 在 上海百联 ZX大屏!!', en: 'LyraLine Appears on the Large Screens at Bailian ZX in Shanghai!!', ja: '「共鳴線」が上海・百聯ZXの大型ビジョンに登場！！' },
      summary: {
        zh: '共鸣线近期作品与插画将在上海百联ZX大屏宣传。',
        en: 'LyraLine recent works and illustrations will appear on the large screens at Bailian ZX in Shanghai.',
        ja: '上海・百聯ZXの大型ビジョンに、共鳴線の近期の作品とイラストが登場します。',
      },
      body: {
        zh: '<p>共鸣线近期的作品与插画会在上海百联ZX的屏幕上进行宣传。</p>' +
          '<p>🕐10月–11月 12:00–22:00<br>📍百联ZX南京东路店户外大屏、入口格栅屏、室内大屏、包梁屏</p>' +
          '<p>欢迎前来打卡！后续会有更多未公开作品通过百联ZX大屏释出。</p>' + zxFullImages,
        en: '<p>Recent works and illustrations from LyraLine will be shown on the large screens at Bailian ZX, a popular subculture spot in Shanghai.</p>' +
          '<p>Every day in October and November, 12:00–22:00 (UTC+8)<br>Bailian ZX Nanjing East Road location<br>Outdoor large screen, entrance grille screen, indoor large screen, and beam-wrapped screen</p>' +
          '<p>If you are in the area, please stop by and take some photos!</p>' +
          '<p>We plan to unveil more new works at Bailian ZX in the future. Stay tuned!</p>' + zxFullImages,
        ja: '<p>上海の人気サブカルスポット「百聯ZX」にて、近期の作品やイラストが大型ビジョンで公開されます。</p>' +
          '<p>10月中、11月 毎日12:00〜22:00(UTC+8)<br>百聯ZX 南京東路店<br>屋外大型ビジョン・エントランスのLEDスクリーン・館内</p>' +
          '<p>お近くにお越しの際は、ぜひ立ち寄って写真を撮ってみてください！</p>' +
          '<p>今後も新作を百聯ZXにて順次お披露目する予定です。どうぞお楽しみに！</p>' + zxFullImages,
      },
      gallery: zxGridImages,
    },
    {
      id: 'website',
      date: '2026.10.1',
      tag: 'notice',
      title: { zh: '官方网站建设中', en: 'Official website under construction', ja: '公式サイト制作中' },
      body: {
        zh: '<p>共鳴線官方网站正在建设中，内容会陆续更新。</p>',
        en: '<p>The LyraLine official website is under construction. More content is on the way.</p>',
        ja: '<p>共鳴線公式サイトは現在制作中です。コンテンツは順次公開していきます。</p>',
      },
    },
    {
      id: 'teaser',
      date: '2025.12.5',
      tag: 'release',
      title: { zh: '先行 PV 公开', en: 'Teaser PV released', ja: '先行PV公開' },
      image: 'docs/img/teaser1.jpg',
      body: teaserBody,
      gallery: teaserGallery,
      watch: teaserWatch,
      link: { url: 'works.html?id=teaser', label: { zh: '查看作品详情', en: 'View the work', ja: '作品詳細を見る' } },
    },
  ];

  /* ---------------- 作品 ----------------
     id      : 唯一 id，网址 works.html?id=xxx
     type    : 'mv' 音乐 MV / 'album' 专辑 / 'teaser' 预告（决定出现在哪个分类里）
     status  : 'released' 已发布 / 'wip' 制作中
     cover   : 封面图（没有就显示斜线占位）
     bilibili: B 站 BV 号 → 嵌入播放器
     youtube : YouTube 视频 id → 嵌入播放器；两者都填时可在详情页切换
     gallery : 图片宫格
     credits : [{ role: 'compose', name: '…' }]，role 对应 i18n 里的 role.xxx
     tracks  : 专辑曲目（可选）[{ title, time }]
     watch   : 观看版本 [{ name, links:[{label,url}], noteKey? }] */
  const works = [
    {
      id: 'midori',
      no: '01',
      type: 'mv',
      status: 'released',
      date: '2025.12.12',
      title: { zh: '绿浮游', en: 'Verdant Ephemera', ja: '緑浮遊' },
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
        { role: 'compose', name: 'noyrfa' },
        { role: 'arrange', name: 'noyrfa' },
        { role: 'narration', name: 'ナースロボ_タイプT' },
        { role: 'vocal', name: '初音ミク/常夜 謠' },
        { role: 'illust', name: 'Daokweok_羽花燈，Semi' },
        { role: 'video', name: '未央' },
        { role: 'writer', name: 'RUR1K0' },
        { role: 'chara', name: 'Shuuyakikou' },
        { role: 'lyrics', name: 'noyrfa, 拾二' },
        { role: 'mix', name: 'AiSS' },
        { role: 'producer', name: '常夜 謠' },
      ],
      note: {
        zh: '<p class="note-deco note-deco-l">.*･ﾟ.*:｡</p>' +
            '<p>一段由植物记录的波动，悠然成音。<br>即便文明崩塌、人类消亡，<br>绿意依旧恣意蔓延。</p>' +
            '<p>外星拾波者 WP-7 于高密度植生区捕捉到一段异常振動：<br>有光、有露、有未命名的花。<br>还有被翡翠砂粒掩埋的，<br>一首关于“遗忘”与“等待”的歌。</p>' +
            '<p>「连续观测启动。」</p>' +
            '<p class="note-deco note-deco-r">.*･ﾟ.*:｡</p>',
        en: '<p class="note-deco note-deco-l">.*･ﾟ.*:｡</p>' +
            '<p>A wave recorded by plants, unfolding into sound.<br>Even as civilization crumbles and humanity fades,<br>green life keeps spreading, untamed.</p>' +
            '<p>In a zone of dense vegetation, the alien Wavepicker WP-7 catches an unusual vibration:<br>there is light, there is dew, there are flowers yet unnamed.<br>And buried beneath emerald sand,<br>a song about “forgetting” and “waiting.”</p>' +
            '<p>“Continuous observation initiated.”</p>' +
            '<p class="note-deco note-deco-r">.*･ﾟ.*:｡</p>',
        ja: '<p>文明が崩れ、<br>人類が消えても、<br>緑はただ、静かに脈打っていた。</p><p>異星の拾波者・WP-7 が<br>高密度植生域で捉えた微かな振動——<br>植物が記憶した波動が、今、音になる。</p><p>「連続観測モード起動」</p>',
      },
      watch: [
        { name: '初音ミク,ナースロボ_タイプT ver.', links: [
          { label: 'YouTube', url: 'https://youtu.be/x-2Lpzkx7uc?si=HkxZE9Q59WfqvkXS' },
          { label: 'Bilibili', url: 'https://b23.tv/Sfzdi0V' },
        ]},
        { name: '常夜謠 ver.', links: [
          { label: 'YouTube', url: 'https://youtu.be/EhFRDMh0iCk?si=WdJjCPkv2CrM_ANd' },
          { label: 'Bilibili', url: 'https://b23.tv/k4NLYHs' },
        ]},
      ],
    },
    {
      id: 'teaser',
      no: '00',
      type: 'teaser',
      status: 'released',
      date: '2025.12.5',
      title: { zh: '先行 PV', en: 'Teaser PV', ja: '先行PV' },
      kicker: 'Teaser',
      cover: 'docs/img/teaser1.jpg',
      bilibili: '',
      youtube: 'i8jUlTNDaq8',
      line: {
        zh: '文明沉默之后，唯有声音留存。',
        en: 'After civilization fell silent, only sound remained.',
        ja: '文明が沈黙した後も、音だけが残り続けた。',
      },
      body: teaserBody,
      gallery: teaserGallery,
      watch: teaserWatch,
      credits: [],
    },
    {
      id: 'next',
      no: '02',
      type: 'mv',
      status: 'released',
      date: '2026.07.25',
      title: { zh: '聆听者（feat. GUMI）', en: 'The Listener (feat. GUMI)', ja: '聴く人(feat.GUMI)' },
      kicker: 'Second Single · MV',
      cover: 'docs/img/kiku-hito-listener.webp',
      videoLink: 'https://www.bilibili.com/video/BV1FEge6sE6e/?spm_id_from=333.337.search-card.all.click&vd_source=50f1e32f435debdc401462b1242b5891',
      bilibili: '',
      youtube: '',
      line: {
        zh: '来自旷野的声音。',
        en: 'A voice from the wilderness.',
        ja: '曠野から届く声。',
      },
      credits: [],
      watch: [
        { name: 'Japanese ver.(feat.GUMI)', links: [
          { label: 'Bilibili', url: 'https://b23.tv/64i0Rah' },
        ]},
        { name: 'English ver.(feat.常夜謠)', noteKey: 'works.soon', links: [] },
      ],
      note: {
        zh: '<p class="note-role">「聆听者」作曲／编曲／混音担当</p><p>殊阳Official：《聆听者》的创作灵感主要来源于羽花灯老师的曲绘。我非常喜欢它的氛围呈现，而我自己最擅长在音乐中表现的也是「巨大的悲伤和难以叙述的孤独」这类比较冷色调的情绪。为了体现孤独的质感，我在曲子的前半部分叠加了模拟老唱片噪音的特效音轨，而且所有乐器都进行高频切除，用以呈现人类文明衰败后的质感。而在曲子后半部分乃至结尾，通过新乐器的加入以及高频部分慢慢地增加剥离掉了前半部分的朦胧质感，用以体现WP-7情绪曲线的跌宕起伏。</p>',
        en: '<p class="note-role">Composition, arrangement &amp; mixing for "The Listener"</p><p>Shuyang Official: The inspiration for "Listener" came primarily from Haneka Tou\'s illustration. I was deeply drawn to the atmosphere it conveyed, and expressing immense grief and an ineffable solitude — cool-toned emotions such as these — is precisely where I feel most at home in music. To capture the texture of that loneliness, I layered in an effects track emulating the crackle of an old record across the first half, and cut the high frequencies from every instrument to evoke the worn, decayed feel of a civilization past its prime. In the second half and through the ending, new instruments enter and the high end gradually opens up, stripping away the haze of the opening to trace the arc of WP-7\'s shifting emotions.</p>',
        ja: '<p class="note-role">「聴く人」の作曲・編曲・MIX担当</p><p>殊阳Official：本作の着想は、主に羽花灯さんのイラストから得ました。あの絵が醸し出す空気感が非常に気に入っており、私自身が音楽で表現するのが最も得意としているのも、「巨大な悲しみと、言葉にしがたい孤独」といった冷たい色合いの感情です。孤独の質感を出すため、曲の前半には古いレコードのノイズを模した効果音を重ね、すべての楽器から高音域をカットすることで、文明が衰えていくような質感を演出しました。一方、後半からエンディングにかけては、新しい楽器の加入と高音域の段階的な回復によって前半のもやっとした質感が剥がれ落ち、WP-7の感情の起伏を描き出す構成になっています。</p>',
      },
    },
    {
      id: 'album-tbd',
      no: '—',
      type: 'album',
      status: 'wip',
      date: 'TBA',
      title: { zh: 'Aftertones', en: 'Aftertones', ja: 'Aftertones' },
      kicker: '1st Album',
      cover: 'docs/img/aftertones-cover.webp',
      line: {
        zh: '首张专辑《Aftertones》，预计于 M3 2027 展会发售。',
        en: 'The debut album Aftertones, scheduled for release at M3 2027.',
        ja: '1stアルバム「Aftertones」、M3 2027にて発売予定です。',
      },
      credits: [],
      /* 曲目与试听页（music.js）一一对应：封面沿用试听页对应图；
         coverSeed 表示试听页用编号生成的抽象封面，这里用同一编号生成同一张图。
         新补进来的曲目状态统一为 wip（制作中）。 */
      tracks: [
        { title: { zh: '绿浮游 (feat. 初音ミク, ナースロボ_タイプT)', en: 'Verdant Ephemera (feat. Hatsune Miku, Nourse Robot Type T)', ja: '緑浮遊 (feat. 初音ミク, ナースロボ_タイプT)' }, cover: 'docs/img/First%20Song%20Cover.JPG', status: 'released', time: '—' },
        { title: { zh: '绿浮游【人声本家】', en: 'Verdant Ephemera (feat. 常夜謠)', ja: '緑浮遊(feat. 常夜謠)' }, cover: 'docs/img/First%20Song%20Cover.JPG', status: 'released', time: '—' },
        { title: { zh: '聆听者 (English ver.)', en: 'The Listener (English ver.)', ja: '聴く人 (English ver.)' }, cover: 'docs/img/kiku-hito-listener.webp', status: 'wip', time: '—' },
        { title: '■■■■', coverSeed: 17, coverNo: 11, coverLabelColor: '--c-black', status: 'wip', time: '—' },
        { title: { zh: '水上都市', en: 'Aquapolis', ja: 'アクアポリス' }, coverSeed: 6, status: 'wip', time: '—' },
        { title: { zh: '余响行路', en: 'Keleuthos', ja: 'ケレウソス' }, coverSeed: 7, status: 'wip', time: '—' },
        { title: { zh: '暮霭', en: 'Haze', ja: '夕靄' }, coverSeed: 9, status: 'wip', time: '—' },
        { title: { zh: '第七水相观测记录', en: 'Observation Record: Aqueous Phase No. 7', ja: '第7水相観測記録' }, coverSeed: 14, coverNo: 12, status: 'wip', time: '—' },
        { title: '???', cover: 'docs/img/in-progress.png', status: 'wip', time: '—' },
      ],
    },
    /* ---------------- 补足的单曲：与试听页曲目一一对应 ----------------
       musicId 指向 music.js 的曲目编号，详情页左侧「试听此曲」据此跳转。
       note 的「定义／世界观含义」取自术语表（shuyubiao.png）对应行。 */
    {
      id: 'midori-vocal', no: '03', type: 'mv', status: 'released', date: '2025.12.12',
      title: { zh: '绿浮游【人声本家】', en: 'Verdant Ephemera (feat. 常夜謠)', ja: '緑浮遊(feat. 常夜謠)' },
      kicker: 'First Single · Vocal Ver.', cover: 'docs/img/First%20Song%20Cover.JPG', musicId: 3,
      credits: [],
    },
    {
      id: 'listener-en', no: '04', type: 'single', status: 'wip', date: 'TBA',
      title: { zh: '聆听者 (English ver.)', en: 'The Listener (English ver.)', ja: '聴く人 (English ver.)' },
      kicker: 'Second Single · English ver.', cover: 'docs/img/kiku-hito-listener.webp', musicId: 5,
      line: {
        zh: 'The only shred of sound the world remembers',
        en: 'The only shred of sound the world remembers',
        ja: 'The only shred of sound the world remembers',
      },
      credits: [],
    },
    {
      id: 'aquapolis', no: '05', type: 'single', status: 'wip', date: 'TBA',
      title: { zh: '水上都市', en: 'Aquapolis', ja: 'アクアポリス' },
      kicker: 'Single', coverSeed: 6, musicId: 6,
      line: { zh: '一座巨大的城市遗迹。', en: 'A vast ruined city.', ja: '巨大な都市遺跡。' },
      credits: [],
      note: {
        zh: '<p>Aqua意为水上，Polis意为都市。</p><p>水都市介绍：将于本周内公开。</p>',
        en: '<p>Aqua means "water" and Polis means "city".</p><p>Aquapolis introduction: To be released within this week.</p>',
        ja: '<p>Aquaは水上、Polisは都市の意。</p><p>水都市紹介：今週中に公開予定です。</p>',
      },
    },
    {
      id: 'keleuthos', no: '06', type: 'single', status: 'wip', date: 'TBA',
      title: { zh: '余响行路', en: 'Keleuthos', ja: 'ケレウソス' },
      kicker: 'Single', coverSeed: 7, musicId: 7,
      line: {
        zh: '无应答。<br>无法解码。<br>外差启动。',
        en: 'No response.<br>Decryption impossible.<br>Homodyne start.',
        ja: '応答なし。<br>復号不能。<br>ホモダイン・スタート。',
      },
      credits: [],
      note: {
        zh: '<p>「故而<br>即使是巴别塔<br>也交付一簇火<br>以代祈愿」</p><p>“Keleuthos”该词源于古希腊语，其意为“漫漫征途、艰险远行，充满波折的漫长道路。”“一场属于WP-7的旅行”。以及在旅途当中看到的那些不可思议的景色。</p>',
        en: '<p>“Therefore<br>even to the Tower of Babel<br>fire is passed<br>in place of prayer.”</p><p>“Keleuthos”<br>From Ancient Greek, the word means “a long and arduous journey, a road of hardship wound through with twists and turns.”<br>“A journey that belongs to WP-7.” And the wondrous sights seen along the way.</p>',
        ja: '<p>「故に<br>バベルの塔にも<br>火を渡す<br>祈りのかわり。」</p><p>「ケレウソス」語源は古代ギリシア語。その意味は「長く険しい旅路、波乱に満ちた道のり」。「WP-7自身の旅」。そして旅の途中で目にした、不思議な景色たち。</p>',
      },
    },
    {
      id: 'aquapolis-vip', no: '07', type: 'single', status: 'wip', date: 'TBA',
      title: { zh: '水上都市 (VIP mix)', en: 'Aquapolis (VIP mix)', ja: 'アクアポリス (VIP mix)' },
      kicker: 'Single · Remix', coverSeed: 8, musicId: 8,
      line: { zh: '不一样的水上都市', en: 'Aquapolis in a new light.', ja: '一味違うアクアポリス' },
      credits: [],
      note: {
        zh: '<p>歌词采用日英结合。</p>',
        en: '<p>The lyrics blend Japanese and English.</p>',
        ja: '<p>歌詞は日本語と英語を組み合わせています。</p>',
      },
    },
    {
      id: 'haze', no: '08', type: 'single', status: 'wip', date: 'TBA',
      title: { zh: '暮霭', en: 'Haze', ja: '夕靄' },
      kicker: 'Single', coverSeed: 9, musicId: 9,
      line: { zh: '暮霭之中，没有轮廓的光景', en: 'In the haze, a landscape without contours', ja: '夕靄の中、輪郭のない景色' },
      credits: [],
      note: {
        zh: '<p class="note-role">作编曲为白汐</p><p>「若只用指尖去追逐波，<br>无法触碰之物，再度化为虚无。」</p>',
        en: '<p class="note-role">Composed and arranged by Baixi</p><p>“Chasing the waves with fingertips alone,<br>what cannot be touched turns to nothing once more.”</p>',
        ja: '<p class="note-role">作曲・編曲は白汐</p><p>「指先だけ　波を追えば<br>触れないまま　ものは　またとなる」</p>',
      },
    },
    {
      id: 'record7', no: '09', type: 'single', status: 'wip', date: 'TBA',
      title: { zh: '第七水相观测记录', en: 'Observation Record: Aqueous Phase No. 7', ja: '第7水相観測記録' },
      kicker: 'Single', coverSeed: 14, coverNo: 12, musicId: 10,
      line: { zh: '以水的循环连接亿万年时间到一瞬。', en: 'Connecting eons to a single moment through the cycle of water.', ja: '水の循環で億万年と一瞬をつなぐ。' },
      credits: [],
      note: {
        zh: '<p class="note-role">targ制作的DNB风格曲目。</p><p>「渐远的节律<br>编织着 相位的呼吸<br>穿行于无数时代<br>怀抱一片微小的光景。」</p>',
        en: '<p class="note-role">A drum-and-bass track by targ.</p><p>“A receding rhythm<br>Weaving the breath of phases<br>Across countless eras<br>Holding a small landscape in embrace.”</p>',
        ja: '<p class="note-role">targ制作のDNB風曲目。</p><p>「遠ざかるリズム<br>紡いで　位相の呼吸<br>幾つもの時代に<br>小さな景色を抱く」</p>',
      },
    },
    {
      id: 'square', no: '10', type: 'single', status: 'wip', date: 'TBA',
      title: '■■■■',
      kicker: 'Single', coverSeed: 17, coverNo: 11, coverLabelColor: '--c-black', musicId: 11, credits: [],
      line: {
        zh: '唯有快过光速的回想，似乎能够越过昨日。',
        en: 'Only recollections faster than light seem to cross beyond yesterday.',
        ja: '光速より速い回想だけが、昨日を越えてゆくらしい。',
      },
      note: {
        zh: '<p>对象似乎通过「追忆」这一行为，暂时将过去叠加到现在。<br>该现象并不持久，每当情感变量超过阈值，同一运算便会递归执行。</p>',
        en: '<p>The subject appears to temporarily overlay the past onto the present through the act of “reminiscing.”<br>This phenomenon is not permanent; each time an emotional variable exceeded its threshold, the same operation was executed recursively.</p>',
        ja: '<p>対象は「偲ぶ」という行為により、一時的に過去を現在へ重ねていたらしい。<br>この現象に永続性はなく、感情変数が閾値を超えるたび、同一の演算が再帰的に実行されていた。</p>',
      },
    },
    {
      id: 'unknown', no: '0X', type: 'single', status: 'wip', date: 'TBA',
      title: '???',
      kicker: 'Single', cover: 'docs/img/in-progress.png', credits: [],
      note: {
        zh: '<p>正在进行制作，即将公开。</p>',
        en: '<p>Currently in production. Coming soon.</p>',
        ja: '<p>現在制作中、近日公開予定です。</p>',
      },
    },
  ];

  /* ---------------- 成员 ----------------
     顺序即成员详情页的显示顺序（按职位相关性相邻，不分组）：
     常夜 謠 → Shuuyakikou → 羽花灯 → Semi → noyrfa → Peydarg → targ → Ink
     group  : 仅用于兼容首页目录，不再在详情页作为分组小标题
     roles  : 担当，对应 i18n 里的 role.xxx（可身兼数职）
     avatar : 头像图；没有则用 color 生成小唱片头像
     gallery: 个人作品图，渲染成宫格
     links  : [{ label, url }] */
  const members = [
    {
      id: 'toyoya', name: '常夜 謠', group: 'music', roles: ['producer', 'vocal'], color: 'var(--c-red)',
      avatar: 'docs/img/members/toyoya-avatar.webp',
      bio: {
        zh: '<span data-age="2006"></span>岁。「共鸣线」主催、企划及 Vocal。正在进行唱见活动。<br>上海戏剧学院、上海交通大学音乐学专业在读，曾参与 Vocaduo 等活动。希望创作出能够长期留在人们心中的作品与世界，让音乐成为能够陪伴人与时间共同延续的体验。',
        en: '<span data-age="2006"></span> years old, utaite. Founder, PM and Vocal of LyraLine.<br>Majoring in theatre and musicology.<br>Taken part in projects such as Vocaduo.',
        ja: '2006年生まれ。歌い手。「共鳴線」の主催・企画・Vocalを担当。<br>現在、演劇と音楽学を学んでいる。英語・日本語・中国語の楽曲を歌うことを得意とし、これまでに Vocaduo や神椿「花譜 宿声 Hong Kong」創作募集などに参加。人々の心に長く残る作品や世界観を生み出し、音楽が人と時間に寄り添いながら続いていく体験となることを目指している。',
      },
      links: [
        { label: 'X', url: 'https://x.com/tokoyouta?s=21' },
        { label: 'YouTube', url: 'https://youtube.com/@tokoyouta?si=rpKc-pl8OPyU8Dhh' },
        { label: 'Bilibili', url: 'https://space.bilibili.com/178786387?spm_id_from=333.1007.0.0' },
      ],
    },
    {
      id: 'shuuyakikou', name: 'Shuuyakikou', group: 'art', roles: ['illust', 'chara', 'design'], color: 'var(--c-teal)',
      avatar: 'docs/img/members/shuuyakikou-avatar.jpg',
      bio: {
        zh: '插画师、设计师。喜欢音乐、咖啡和虾。以「保留纯粹与本质，让角色独立存在」为理念，诠释并表达所热爱的事物。',
        en: 'An illustrator and designer who loves music, coffee and shrimp.<br>Holding fast to the idea of "preserving purity and essence so that a character can stand on its own," interpreting and expressing the things held dear.',
        ja: 'イラストレーター兼デザイナー。音楽とコーヒー、そしてエビが好き。<br>「純粋さと本質を残し、キャラクターがひとつの存在として自立すること」を大切にしながら、愛するものを解釈し、表現している。',
      },
      gallery: [
        'docs/img/members/shuuyakikou-work-1.webp', 'docs/img/members/shuuyakikou-work-2.jpg',
        'docs/img/members/shuuyakikou-work-3.jpg', 'docs/img/members/shuuyakikou-work-4.jpg',
        'docs/img/members/shuuyakikou-work-5.webp', 'docs/img/members/shuuyakikou-work-6.webp',
      ],
      links: [{ label: 'X', url: 'https://x.com/shuuya_kikou?s=11' }],
    },
    {
      id: 'haneka', name: '羽花灯｜Haneka Tou', group: 'art', roles: ['illust'], color: 'var(--c-lavender)',
      avatar: 'docs/img/members/haneka-avatar.jpg',
      bio: {
        zh: '<span data-age="2004"></span>岁，插画师。平时多以合成音声为主体进行同人创作，单张创作曾在 X 上收获万赞。在共鸣线企划中担任《绿浮游》的插画和视觉指导。创作理念为描绘角色无机质的科技感，突出纤细、锐利、繁复的视觉风格。',
        en: '<span data-age="2004"></span> years old, illustrator. Doujin work centered on synthetic voices, with individual pieces drawing tens of thousands of likes on X.<br>For LyraLine, illustrated "Verdant Ephemera" and served as visual director. Creative focus on the inorganic, tech-inflected appeal of characters, rendered in a delicate, sharp and intricate style.',
        ja: '2004年生まれ。現役イラストレーター。普段は合成音声を主体とした同人創作を行っており、投稿作品はSNS上で多くの反応を集めている。<br>共鳴線プロジェクトでは『緑浮遊』のイラストおよびビジュアルディレクションを担当。創作理念は、キャラクターの無機質でテクノロジー感のある魅力を描き出すこと。繊細で鋭く、複雑なビジュアルスタイルを際立たせるのが得意。',
      },
      gallery: [
        'docs/img/members/haneka-work-1.jpg', 'docs/img/members/haneka-work-2.jpg',
        'docs/img/members/haneka-work-3.jpg', 'docs/img/members/haneka-work-4.jpg',
      ],
      links: [
        { label: 'X', url: 'https://x.com/daokweok?s=21' },
        { label: 'rednote', url: 'https://xhslink.com/m/71Oh7R08DAs' },
        { label: 'Website', url: 'https://lit.link/daokweok' },
      ],
    },
    {
      id: 'semi', name: 'Semi', group: 'production', roles: ['animation', 'illust'], color: 'var(--c-text)',
      avatar: 'docs/img/members/semi-avatar.webp',
      bio: {
        zh: '毕业于谢尔丹动画系。动画师，负责背景绘制与动画制作。希望做出能连接人与人情感的温暖作品。曾参与 YouTube 动画《The Last Hand》的场景、动画和后期制作。',
        en: 'A graduate of Sheridan College\'s Animation Program.<br>Working as an animator on backgrounds and animation, with the hope of making warm stories that connect people\'s emotions. Contributed to the setting, animation and post-production of the YouTube animation "The Last Hand."',
        ja: 'シェリダン・カレッジのアニメーション学科を卒業。<br>アニメーターとして、背景制作やアニメーション制作を行っている。人と人の感情をつなぐような、温かみのある作品づくりを目指している。YouTubeアニメ『The Last Hand』では、背景、アニメーション、エフェクトに参加した。',
      },
      links: [{ label: 'rednote', url: 'https://xhslink.com/m/1D2mv67VfvD' }],
    },
    {
      id: 'noyrfa', name: 'noyrfa', group: 'music', roles: ['compose', 'arrange'], color: 'var(--c-red)',
      bio: {
        zh: '主要进行 VOCALOID 和同人音乐的创作，也参与过动画配乐、游戏音乐与音效制作。2025 年 8 月于 Vocaloid Collection 初投稿开始活动，同年首次参加 BOF 2025，作品入选 GroundbreakinG Collections。创作上以原声乐器与电子音色的交织为特色，希望通过音乐塑造具有画面感与沉浸感的世界。',
        en: 'Primarily creating VOCALOID and doujin music, with work also in animation scoring, game music and sound design.<br>Began releasing work in August 2025 with a first submission to The VOCALOID Collection; that same year, an entry in BOF 2025 was selected for the GroundbreakinG Collections. Sound weaving acoustic instruments together with electronic textures, aiming to build cinematic, immersive worlds through music.',
        ja: '主にVOCALOIDおよび同人音楽の制作を行っているほか、アニメ制作、ゲーム音楽、効果音の制作にも携わっている。<br>2025年8月に「The VOCALOID Collection」への初投稿をきっかけに活動を開始。同年、初めて参加したBOF 2025では、作品が「GroundbreakinG Collections」に選出された。アコースティック楽器と電子音色が交差するサウンドを特色としており、音楽を通して映像的で没入感のある世界を描くことを目指している。',
      },
      links: [
        { label: 'X', url: 'https://x.com/noyrfa' },
        { label: 'YouTube', url: 'https://youtube.com/@noyrfa?si=1ZlXwxK4b1lcEOyD' },
      ],
    },
    {
      id: 'peydarg', name: 'Peydarg', group: 'music', roles: ['compose', 'arrange', 'production'], color: 'var(--c-olive)',
      avatar: 'docs/img/members/peydarg-avatar.webp',
      bio: {
        zh: '<span data-age="2006"></span>岁，电子音乐制作人。承担了近十款独立游戏的音乐音效开发工作，在 GGJ25 比赛中获北京站音乐音效第二名。单曲《Memory Overload》已被收录至独立音乐游戏《弥赛亚症候群》。音乐曾在 PHONO RECORDS（留声唱片）、Hertz Records 和 ETR Records 等厂牌发行，所创作的配乐被 CCTV7 频道舞台剧采用。喜欢通过叠加大量电子音色，为听众带来更丰富刺激的听觉体验。',
        en: '<span data-age="2006"></span> years old, electronic music producer. Composed music and sound effects for nearly ten indie games; placed second in music and sound design at the Beijing round of GGJ25.<br>Single "Memory Overload" appears in the indie rhythm game "Messiah Syndrome"; music released through labels such as PHONO RECORDS, Hertz Records and ETR Records. Favoring dense stacks of electronic textures to give listeners a richer, more exhilarating experience.',
        ja: '2006年生まれ。電子音楽プロデューサー。<br>これまでに約10作品のインディーゲームでBGMや効果音の制作を担当。Global Game Jam 2025では、北京会場の音楽・効果音部門で2位を獲得。<br>PHONO RECORDS（留声唱片）、Hertz Records、スペインのETR Recordsなど、国内外の音楽レーベルから楽曲をリリースしている。<br>さまざまな電子音色を重ね合わせ、聴く人に豊かで刺激的なサウンドを届けることを大切にしている。',
      },
      links: [
        { label: 'X', url: 'https://x.com/Peydarg' },
        { label: 'Bilibili', url: 'https://space.bilibili.com/332898356' },
      ],
    },
    {
      id: 'targ', name: 'targ', group: 'music', roles: ['compose', 'arrange'], color: 'var(--c-black)',
      bio: {
        zh: '独立音乐人 targ，擅长制作 garage 和 botanica 风格音乐，曾参与 Phigros 收录的合作曲《Bloom》。',
        en: 'An independent musician specializing in garage and botanica sounds, with a credit on "Bloom," a collaborative track featured in Phigros.',
        ja: 'GarageやBotanicaを中心に楽曲を制作しているインディペンデント・アーティスト。<br>音楽ゲーム『Phigros』に収録されているコラボ楽曲「Bloom」にも参加している。',
      },
      links: [
        { label: 'X', url: 'https://x.com/targdtm_' },
        { label: 'Netease Music', labelZh: '网易云音乐', url: 'https://music.163.com/#/artist?id=34819418' },
      ],
    },
    {
      id: 'ink', name: 'Ink', group: 'art', roles: ['artDir', 'design'], color: 'var(--c-gray)',
      bio: {
        zh: '参与共鸣线音乐企划的视觉设计，负责 Logo 及宣传海报制作，也长年为北美电竞公会 Deman Esport 设计各类宣传物料。注重设计与主题的结合，希望通过视觉表达准确传达作品特色，并塑造清晰统一的设计。',
        en: 'Visual design for LyraLine, responsible for the logo and promotional posters; long-time designer of promotional materials for the North American esports organization Deman Esport.<br>Caring deeply about the fit between design and concept, aiming to convey each work\'s identity through graphics and build a clear, unified visual language.',
        ja: '「共鳴線」のアートディレクターとして、ロゴやプロモーションポスターを担当。また、ゲーマークラブ「Deman Esport」にてプロモーションデザインも手がけている。<br>デザインとコンセプトの一致性を重視し、グラフィックを通して作品の世界観を伝え、統一感のあるデザインを形にすることを目指している。',
      },
      links: [],
    },
  ];

  /* 首页 Members 板块只展示这 6 位（顺序按用户指定） */
  const homeMemberIds = ['toyoya', 'shuuyakikou', 'haneka', 'peydarg', 'noyrfa', 'targ'];

  /* ------------------------------------------------------------------
     抽象封面：同一个编号永远生成同一张图。
     试听页（music.js）与作品详情（render.js）共用，保证对应曲目的图一致。
     ------------------------------------------------------------------ */
  function mulberry32(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pad2 = n => String(n).padStart(2, '0');
  const coverCache = new Map();
  /* seed 决定抽象图案；labelNo 单独决定右上角显示的编号（缺省与 seed 相同）
     labelColor 可选：少数封面 fg 与图案同色导致编号看不清时指定一个 CSS 变量名 */
  function coverOf(seed, labelNo, labelColor) {
    const no = labelNo == null ? seed : labelNo;
    const key = [seed, no, labelColor || ''].join(':');
    if (coverCache.has(key)) return coverCache.get(key);
    const css = getComputedStyle(document.documentElement);
    const PALETTE = ['--c-red', '--c-teal', '--c-olive', '--c-lavender', '--c-gray', '--c-black', '--c-white', '--c-text']
      .map(v => css.getPropertyValue(v).trim()).filter(Boolean);
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
    g.fillStyle = fg;
    const kind = Math.floor(rnd() * 3);
    const cx = S * (0.25 + rnd() * 0.5), cy = S * (0.25 + rnd() * 0.5), r = S * (0.22 + rnd() * 0.22);
    g.beginPath();
    if (kind === 0) g.arc(cx, cy, r, 0, Math.PI * 2);
    else if (kind === 1) g.arc(cx, cy, r, rnd() * Math.PI, rnd() * Math.PI + Math.PI);
    else { g.save(); g.translate(cx, cy); g.rotate((rnd() - 0.5) * 1.2); g.rect(-r, -r * 0.6, r * 2, r * 1.2); g.restore(); }
    g.fill();
    g.strokeStyle = ac; g.lineWidth = 1.5;
    const rx = S * rnd(), ry = S * rnd(), rings = 4 + Math.floor(rnd() * 8);
    for (let i = 1; i <= rings; i++) { g.beginPath(); g.arc(rx, ry, i * S * 0.035, 0, Math.PI * 2); g.stroke(); }
    g.strokeStyle = fg; g.lineWidth = 2;
    const ang = rnd() * Math.PI, n = 6 + Math.floor(rnd() * 10), gap = 10 + rnd() * 18;
    const ox = S * rnd(), oy = S * rnd();
    for (let i = 0; i < n; i++) {
      const dx = Math.cos(ang) * S * 0.4, dy = Math.sin(ang) * S * 0.4;
      const px = ox + Math.cos(ang + Math.PI / 2) * i * gap, py = oy + Math.sin(ang + Math.PI / 2) * i * gap;
      g.beginPath(); g.moveTo(px - dx, py - dy); g.lineTo(px + dx, py + dy); g.stroke();
    }
    g.fillStyle = ac;
    for (let i = 0, m = 20 + Math.floor(rnd() * 40); i < m; i++) {
      g.beginPath(); g.arc(S * rnd(), S * rnd(), 1 + rnd() * 3, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = fg;
    g.fillStyle = labelColor ? (css.getPropertyValue(labelColor).trim() || fg) : fg;
    g.font = `500 ${S * 0.05}px ${css.getPropertyValue('--font-latin')}`;
    g.textAlign = 'right';
    g.fillText(`No.${pad2(no)}`, S * 0.94, S * 0.1);
    const url = cv.toDataURL('image/png');
    coverCache.set(key, url);
    return url;
  }

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
  works.forEach(w => {
    register(`data.works.${w.id}`, w);
    (w.tracks || []).forEach((t, i) => register(`data.works.${w.id}.tracks.${i}`, t));
  });
  members.forEach(m => register(`data.members.${m.id}`, m));

  return { news, works, members, homeMemberIds, coverOf };
})();
