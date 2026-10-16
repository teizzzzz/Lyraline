"""
tools/make-discs.py — 把 assets/img 里的原始唱片图（Top、A–E）和 logo 处理成网页用的版本：唱片输出到 assets/img/discs/，logo 输出为 assets/img/logo.webp
  · 圆盘：以中心孔（透明区）的质心为圆心裁成正方形，这样旋转轴正好在孔上；找不到孔就用外接框中心
  · 非圆盘（E = WP-7 侧脸）：只裁掉透明边
  · 缩到最长边 1600px，存 WebP（带透明通道）
原图不动；换图之后重新跑一遍即可。
用法（在 dev/ 目录下）：python tools/make-discs.py
"""
import sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw

sys.stdout.reconfigure(encoding='utf-8')   # Windows 控制台默认 GBK，中文会乱码

SRC = Path('assets/img')
OUT = SRC / 'discs'
SIZE = 1600          # 输出最长边

# (源文件, 输出名, 是否圆盘, 是否加圆形蒙版去掉盘外杂色)
JOBS = [
    ('Top.png', 'top', True,  False),
    ('A.PNG',   'a',   True,  True),    # 原图右上角有金色毛边
    ('B.png',   'b',   True,  False),
    ('C.png',   'c',   True,  False),
    ('D.png',   'd',   True,  False),
    ('E.png',   'e',   False, False),   # WP-7 侧脸，不是圆盘
    ('logo.png', '../logo', False, False),   # 白色字标 → assets/img/logo.webp（左上角 / 首页 / 入场动画用）
]


def find(name):
    """Windows 不分大小写、Linux 分：按实际文件名（忽略大小写）找源文件。"""
    for p in SRC.iterdir():
        if p.is_file() and p.name.lower() == name.lower():
            return p
    raise FileNotFoundError(name)


def hub_center(alpha, bbox):
    """在画面中央小范围内找透明像素（中心孔）的质心。返回 (cx, cy, 是否找到)。"""
    l, t, r, b = bbox
    cx, cy = (l + r) / 2, (t + b) / 2
    w, h = r - l, b - t
    region = (int(cx - w * 0.08), int(cy - h * 0.08), int(cx + w * 0.08), int(cy + h * 0.08))
    sub = alpha.crop(region)
    px = sub.load()
    sx = sy = n = 0
    for y in range(sub.height):
        for x in range(sub.width):
            if px[x, y] < 16:
                sx += x
                sy += y
                n += 1
    if n < 20:
        return cx, cy, False
    return region[0] + sx / n, region[1] + sy / n, True


OUT.mkdir(exist_ok=True)
for src, out, is_round, mask in JOBS:
    im = Image.open(find(src)).convert('RGBA')
    alpha = im.getchannel('A')
    bbox = alpha.getbbox()

    if is_round:
        cx, cy, found = hub_center(alpha, bbox)
        half = max(cx - bbox[0], bbox[2] - cx, cy - bbox[1], bbox[3] - cy) + 4
        im = im.crop((round(cx - half), round(cy - half), round(cx + half), round(cy + half)))   # 越界部分自动补透明
        if mask:
            m = Image.new('L', im.size, 0)
            ImageDraw.Draw(m).ellipse((0, 0, im.width - 1, im.height - 1), fill=255)
            im.putalpha(ImageChops.multiply(im.getchannel('A'), m))
        note = f'圆心=({cx:.0f},{cy:.0f})' + ('' if found else '（没找到中心孔，用外接框中心）')
    else:
        im = im.crop(bbox)
        note = '只裁透明边'

    scale = SIZE / max(im.size)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)

    dst = OUT / f'{out}.webp'
    im.save(dst, 'WEBP', quality=88, method=6)
    print(f'{src:8s} → {dst.name:10s} {im.width}x{im.height}  {dst.stat().st_size / 1024:.0f} KB  {note}')
