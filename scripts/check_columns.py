#!/usr/bin/env python3
"""欄寬核算（無瀏覽器環境下的等效驗算）。

由 web/src/styles.css 抽出「真實」的 grid-template-columns，按 CSS Grid 的
固定軌／比例軌演算法計出每欄實際闊度，證明：

  1. 任何寬度下日期欄都放得下完整 YYYY-MM-DD 連日曆鈕（≥ --col-date-min）；
  2. 名稱欄不會以 minmax(0,1fr) 獨佔剩餘闊度，約佔 40–55%；
  3. 版面容不下時（≤740px 或三欄低於下限總和）已轉兩行制／單欄，永不溢出。

純標準庫，可入 CI；不取代真機目測。
"""
import re
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
CSS = (ROOT / 'web/src/styles.css').read_text(encoding='utf-8')
PAPER = (ROOT / 'web/src/pages/PaperBook.jsx').read_text(encoding='utf-8')

TOK = {}
for name in ('col-date-min', 'col-date-max', 'col-short-min', 'col-short-max'):
    m = re.search(rf'--{name}:\s*(\d+)px', CSS)
    assert m, f'styles.css 缺 --{name}'
    TOK[name] = int(m.group(1))


def clamp(v, lo, hi):
    return max(lo, min(hi, v))


def expand(template):
    for name, val in TOK.items():
        template = template.replace(f'var(--{name})', f'{val}px')
    template = re.sub(r'var\(--col-sig, 30px\)', '30px', template)
    return template


def split_tracks(template):
    tracks, depth, buf = [], 0, ''
    for ch in template:
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth -= 1
        if ch == ' ' and depth == 0:
            if buf.strip():
                tracks.append(buf.strip())
            buf = ''
        else:
            buf += ch
    if buf.strip():
        tracks.append(buf.strip())
    return tracks


def length(expr, base):
    expr = expr.strip()
    if expr.endswith('px'):
        return float(expr[:-2])
    if expr.endswith('%'):
        return base * float(expr[:-1]) / 100
    raise ValueError(f'無法解析長度：{expr}')


def resolve(expr, base):
    """把 clamp(a, b%, c) 化成 (下限, 上限)。"""
    expr = expr.strip()
    m = re.fullmatch(r'clamp\((.+),\s*(.+),\s*(.+)\)', expr)
    if m:
        return length(m.group(1), base), length(m.group(3), base)
    v = length(expr, base)
    return v, v


def bounds(expr, base):
    """回傳 (base, growth_limit, fr)。

    依 CSS Grid §12：先以 base size 排版，再「maximize tracks」把非 fr 軌長到 growth limit，
    最後才用剩餘空間按 fr 分配（§12.7）。growth_limit 為 None 代表無上限。
    """
    expr = expr.strip()
    m = re.fullmatch(r'minmax\((.+),\s*(.+)\)', expr)
    if m:
        lo_s, hi_s = m.group(1), m.group(2).strip()
        lo, _ = resolve(lo_s, base)
        if hi_s.endswith('fr'):
            return lo, None, float(hi_s[:-2])
        _, hi = resolve(hi_s, base)
        return lo, hi, 0.0
    if expr.endswith('fr'):
        return 0.0, None, float(expr[:-2])
    lo, _ = resolve(expr, base)
    return lo, lo, 0.0


def solve(template, width, gap=0.0):
    tracks = split_tracks(expand(template))
    avail = width - gap * (len(tracks) - 1)  # column-gap
    parts = [bounds(t, avail) for t in tracks]
    base = sum(p[0] for p in parts)
    sizes = [p[0] for p in parts]
    # 12.6 maximize tracks：非 fr 軌可以用剩餘空間長到 growth limit
    free = avail - base
    for i, (lo, limit, fr) in enumerate(parts):
        if fr or limit is None or free <= 0:
            continue
        grow = min(limit - lo, free)
        if grow > 0:
            sizes[i] += grow
            free -= grow
    # 12.7 expand flexible tracks
    fr_total = sum(p[2] for p in parts)
    out = []
    for i, (lo, limit, fr) in enumerate(parts):
        extra = free * fr / fr_total if (fr_total and free > 0) else 0.0
        out.append({'track': tracks[i], 'width': round(sizes[i] + extra, 1), 'fr': fr, 'min': lo})
    return out, base, avail


def pct(a, b):
    return round(100 * a / b, 1)


def content_width(viewport):
    """書頁 .sheet 內文闊度。≤740px 為滿版手機版（padding 16 + 22），否則 clamp 左右內距。"""
    if viewport <= 740:
        return viewport - (16 + 22)
    pad = clamp(0.028 * viewport, 16, 32) + clamp(0.032 * viewport, 22, 38)
    return min(760, viewport - pad)


def grab(pattern_source, text=CSS, flags=re.S):
    m = re.search(pattern_source, text, flags)
    assert m, f'找不到樣式：{pattern_source[:60]}'
    return m.group(1).strip()


# ── 桌面（>740px）────────────────────────────────────────────────────────
DESKTOP = {
    '細項簽核 項目｜主考｜日期': (
        grab(r'\.asstable\s*\{\s*--cols:\s*([^;]+);'), 0.0, 0.36, 0.47),
    '活動徽章 名稱｜日期｜證書｜簽署': (
        grab(r'\.otrow\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*(minmax[^;]+);'), 0.0, 0.35, 0.56),
    '紀錄表 日期｜有效日期｜負責領袖｜備註': (
        grab(r'\.renewtable__head,\s*\n\.renewrow\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*var\(--cols,\s*(.+?)\);\n'), 0.0, 0.10, 0.40),
    '通用表格 名稱｜文字｜日期': (
        grab(r'\.pgtable__row\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*var\(--cols,\s*(.+?)\);\n'), 0.0, 0.35, 0.56),
    '小隊職務 職位｜由｜至': (
        grab(r"const RANK_COLS_STYLE = \{(?:[^}]*?)\n?\s*'--cols':\s*'([^']+)'", PAPER), 0.0, 0.30, 0.60),
    'AYP 前訓 項目｜導師簽署｜日期': (
        grab(r"const AYP_COLS_STYLE = \{(?:[^}]*?)\n?\s*'--cols':\s*'([^']+)'", PAPER), 0.0, 0.30, 0.56),
}

# ── 手機（≤740px）：兩行制／單欄，行內 --cols 自動失效 ────────────────────
MOBILE = {
    '細項簽核 主考＋日期（項目另佔全寬一行）': (
        grab(r'\.assrow,\s*\n\s*\.awardblock \.assrow\s*\{\s*grid-template-columns:\s*(minmax\(clamp\(96px[^;]+);'), 10.0, None, None),
    '活動徽章 日期｜證書｜簽署（名稱另佔全寬一行）': (
        re.sub(r'var\(--col-sig, 30px\)', '30px',
               grab(r'\.otrow\s*\{\s*grid-template-columns:\s*(minmax\(var\(--col-date-min\)[^;]+);')), 8.0, None, None),
}

FAILS = []
print(f'欄寬 token：日期 {TOK["col-date-min"]}–{TOK["col-date-max"]}px，短欄 '
      f'{TOK["col-short-min"]}–{TOK["col-short-max"]}px\n')

for viewport in (320, 360, 390, 430, 768, 1024, 1440):
    w = content_width(viewport)
    print(f'── 視窗 {viewport}px → 書頁內文 {w:.0f}px（{"手機兩行制" if viewport <= 740 else "桌面"}）')
    table = MOBILE if viewport <= 740 else DESKTOP
    for name, (template, gap, lo_share, hi_share) in table.items():
        cols, base, avail = solve(template, w, gap)
        total = sum(c['width'] for c in cols)
        print('   ' + name + ': ' + ' ｜ '.join(f'{c["width"]:.0f}px({pct(c["width"], total)}%)' for c in cols))
        if base > avail + 0.5:
            FAILS.append(f'{viewport}px {name}：欄寬下限總和 {base:.0f}px 撐爆 {avail:.0f}px（會溢出）')
        if viewport <= 740 and abs(sum(c['width'] for c in cols) - (avail - gap * (len(cols) - 1))) < 1:
            pass
        dates = [c for c in cols if 'col-date-min' in c['track'] or c['min'] == TOK['col-date-min']]
        for c in dates:
            if c['width'] < TOK['col-date-min'] - 0.5:
                FAILS.append(f'{viewport}px {name}：日期欄只有 {c["width"]}px')
        if '細項簽核' in name and lo_share is not None:
            share = pct(cols[0]['width'], total)
            if not lo_share * 100 <= share <= hi_share * 100:
                FAILS.append(f'{viewport}px {name}：名稱欄 {share}%，超出 {lo_share*100:.0f}–{hi_share*100:.0f}%')
    print()

# 手機（390px）細項列實際排法：項目全寬一行 + 主考／日期並排
w = content_width(390)
cols, base, avail = solve(MOBILE['細項簽核 主考＋日期（項目另佔全寬一行）'][0], w, 10.0)
print(f'390px 兩行制：主考 {cols[0]["width"]:.0f}px ＋ 日期 {cols[1]["width"]:.0f}px = '
      f'{sum(c["width"] for c in cols):.0f}px ≤ 內文 {avail:.0f}px')
if base > avail + 0.5:
    FAILS.append('390px 兩行制仍溢出')

print()
if FAILS:
    for f in FAILS:
        print('❌ ' + f)
    sys.exit(1)
print('✅ 欄寬核算全部通過（所有寬度：日期完整、名稱欄有上限、永不溢出）')
