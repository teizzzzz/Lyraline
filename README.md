# 共鳴線 LyraLine — v2 结构 demo

按草图重搭的官网结构：**左侧唱片 + 右侧内容列**，滚动切换板块时唱片弹出 / 弹入并换片。
根目录的 `index.html` 是之前发布的旧版，未改动。

## 打开方式

- 直接双击 `v2/index.html`；或在 `dev/` 下 `npx serve .`，访问 `http://localhost:3000/v2/`
- 调试时在 URL 加 `?nointro` 跳过入场动画，例如 `v2/index.html?nointro#works`
- 批量截图（桌面 + 手机，各板块 / 菜单 / 深色 / 三语 / 入场动画）：在 `dev/` 下运行 `node tools/shot.mjs`，输出到临时目录，并打印页面 JS 报错

## 文件

| 文件 | 内容 |
| --- | --- |
| `index.html` | 页面骨架：入场动画 / 角落控件 / 菜单 / 唱片舞台 / 首页 + A–E 五个板块 / 尾页 |
| `css/style.css` | 布局、唱片弹入弹出动画、浅色 / 深色两套底色、手机端适配 |
| `js/i18n.js` | 中 / EN / 日 三语词典与切换逻辑 |
| `js/main.js` | 目录与唱片配置（`NAV` / `DISCS`）、滚动追踪、唱片切换、菜单、底色、入场动画 |

## 页面结构（对应草图 2）

```
入场动画（打开手提箱）
首页        KV & 企划简介 + 目录导航
A 新闻      ① 最新公告 ② 活动情报
B 作品      ① 音乐 MV ② 专辑
C 世界介绍  ① 世界观简述 ② 故事背景 ③ 角色立绘 & 设定
D 成员构成  ① 音乐 ② 作词 ③ 美术
E 关于我们  ① 各平台账号 ② 联系方式
尾页        THANKS（合上手提箱）
```

角落：左上 logo，右上 语言切换（中 / EN / 日）+ 底色切换（白 / 黑）+ 菜单（回目录）。右下角显示当前板块。

## 整屏翻页

- 每个板块正好占满一屏（`height: 100dvh`），像 PPT 一样一次翻一页。
- 根节点 `overflow: hidden`，用户不能自由滚动；滚轮 / 触摸滑动 / 方向键 / PageUp·PageDown / 空格 / Home·End 都由 `main.js` 接管。
- 滚动位置由一个弹簧驱动（`main.js` 的 `tick()`），微滚和翻页是同一套运动：
  - 微滚：一次手势累计滚动量不到 `FLIP_THRESHOLD`（默认 150px，鼠标一格约 100–120）时，页面被"橡皮筋"拉出一小段（越拉越紧，最多 `PEEK_MAX`），当前屏略缩小（`PEEK_SCALE`），唱片跟着微动；停止滚动后累计量按 `ACCUM_TAU` 衰减，页面自己回位。
  - 累计够了：弹簧目标换成下一屏，从当前位置连续过渡过去（`SPRING.flip` 调快慢和回弹）。慢慢滚的话，两三格也会累计到阈值。
  - 首尾两屏拉出边界时改用 transform 位移当前屏，视觉上同样是橡皮筋。
- 触摸：手指拖动时页面跟手，松手时滑动距离够 `SWIPE_MIN` 才翻，否则回位。
- 板块内容超过一屏时，会先在 `.page-inner` 里滚动，滚到底之后再翻页（手机端尤其需要）。
- 触控板惯性有过滤：翻页后 350ms 内、以及连续变小的小幅滚轮事件都不会再翻。
- 右侧一列圆点是页码，可点击；URL hash 会跟着当前页更新。
- 调试接口：控制台里 `lyra.goTo(2)` / `lyra.next()` / `lyra.prev()` / `lyra.index`。

## GSAP 动效

`index.html` 从 cdnjs 加载 GSAP 3.13；离线加载失败时 `main.js` 自动退回纯 JS 缓动（只保留翻页，无回弹 / 视差）。参数都在 `main.js` 顶部：

| 常量 | 作用 |
| --- | --- |
| `SLIDE_MS` / `SLIDE_EASE` | 翻页时长与缓动曲线（默认 900ms，`power3.inOut`） |
| `PARALLAX_FLIP` | 翻页时新页内容比页面稍晚跟上、旧页内容稍早离开的位移 |
| `NUDGE_PX` | 首页往上 / 尾页往下时的回弹幅度（唱片同时"搓"一下） |
| `PARALLAX_HOVER` | 鼠标移动时唱片 / 内容的视差幅度（只在有鼠标的设备启用） |

目录项、卡片、平台按钮的 hover 微动也由 GSAP 做；菜单里的目录项用 CSS hover（因为它们的入场动画走 CSS transition）。

## 唱片机制

- 每个 `<section>` 用 `data-disc="xxx"` 指定对应唱片；`data-disc="none"` 表示该板块没有唱片（尾页）。
- 视口中线落在哪个板块，哪个就是当前板块；切换时旧唱片往滚动方向弹出，新唱片从反方向弹入。
- 唱片一直缓慢自转，滚动时会跟着加速。
- 桌面端唱片圆心贴左边缘、上下出血；手机端改为顶部半圆，左右横向弹入弹出。
- 几何参数都在 `style.css` 顶部的 `--disc-r` / `--disc-cx` / `--content-left` 里调。

## 唱片图

原图放在 `v2/assets/img/`（`Top.png`、`A.PNG`、`B–E.png`，透明底），网页不直接用原图，而是用
`python tools/make-discs.py`（在 `dev/` 下运行，需要 Pillow）生成的 `v2/assets/img/discs/*.webp`：

- 圆盘（Top、A–D）以中心孔为圆心裁成正方形，旋转轴才会正好落在孔上；A 顺便用圆形蒙版去掉盘外毛边
- E 是 WP-7 侧脸，不是圆盘，只裁掉透明边
- 统一缩到最长边 1600px、WebP 带透明通道，体积从 2–6 MB 降到几百 KB

换了原图之后重新跑一遍脚本即可。`js/main.js` 的 `DISCS` 里每一项：

| 字段 | 作用 |
| --- | --- |
| `img` | 图片路径（相对于 `v2/`）。去掉这个字段就退回纯色 demo 盘 |
| `free: true` | 不是圆盘：不裁圆、不旋转（E 用） |
| `scale` | `free` 图相对唱片位的大小，0–1 |
| `color` / `label` / `ink` / `text` | 只在没有 `img` 时用 |

`assets/img/logo.png` 目前还没有用上。

## 加一个板块（例如草图 PS 里的「美术馆」）

1. `index.html` 加一个 `<section class="page" id="gallery" data-disc="gallery">`
2. `js/main.js` 的 `NAV` 和 `DISCS` 各加一条
3. `js/i18n.js` 三种语言各加 `nav.gallery`

## 文案

`data-i18n="key"` 从词典取文字，`data-i18n-html` 允许带标签，`data-i18n-attr="aria-label:key"` 翻译属性。
当前文案来自 `docs/LyraLine_Website_Content.md`，新闻 / 作品 / 成员部分是占位。
