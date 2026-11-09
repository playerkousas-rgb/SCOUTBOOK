#!/usr/bin/env python3
"""產生欄寬規格圖（docs/column-layout-check.png）。

沙盒沒有瀏覽器，這支腳本把「styles.css 的真實欄寬」＋「scripts/check_columns.py 的
CSS Grid 核算結果」畫成示意圖：每個寬度畫一條表尺，日期欄以綠框標示是否放得下
完整 YYYY-MM-DD，名稱欄標出所佔百分比。用途是交付前用肉眼對一次版面分配，
不是取代真機目測。需要 Pillow（只在產生文件時用，不是 app 依賴）。
"""
import pathlib
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))

import check_columns as cc  # noqa: E402  （重用同一套真實欄寬讀取與 grid 演算）

W, PAD = 1180, 28
ROW_H = 74
INK = (30, 26, 20)
GREEN = (28, 82, 54)
PAPER = (251, 247, 236)
DATE_OK = (31, 92, 58)
DATE_BAD = (166, 38, 38)
FONT = ImageFont.load_default()


def tracks():
    out = []
    for label, (template, gap, _lo, _hi) in cc.DESKTOP.items():
        out.append((label, template, gap, False))
    for label, (template, gap, _lo, _hi) in cc.MOBILE.items():
        out.append((label, template, gap, True))
    return out


def main():
    job = subprocess.run(
        [sys.executable, str(ROOT / 'scripts/check_columns.py')],
        capture_output=True, text=True, check=True,
    )
    lines = job.stdout.splitlines()
    summary = lines[-1]

    cases = [(name, solve) for name, (tpl, gap, _l, _h) in cc.DESKTOP.items() for solve in [(tpl, gap)]]
    viewports = [
        ('Mobile 390px — Award items (2-row mode: item full width, then assessor + date)', 390,
         cc.MOBILE['細項簽核 主考＋日期（項目另佔全寬一行）'], 10.0,
         '(date row: assessor / date)'),
        ('Mobile 390px — Activity badges (2-row mode)', 390,
         cc.MOBILE['活動徽章 日期｜證書｜簽署（名稱另佔全寬一行）'], 8.0,
         'date / cert / sign'),
        ('Desktop 1024px — Award items: name / assessor / date', 1024,
         cc.DESKTOP['細項簽核 項目｜主考｜日期'], 0.0, 'name / assessor / date'),
        ('Desktop 1024px — Activity badges: name / date / cert / sign', 1024,
         cc.DESKTOP['活動徽章 名稱｜日期｜證書｜簽署'], 0.0, 'name / date / cert / sign'),
        ('Desktop 1024px — Generic table: name / text / date', 1024,
         cc.DESKTOP['通用表格 名稱｜文字｜日期'], 0.0, 'name / text / date'),
        ('Desktop 1024px — Patrol posts: post / from / to', 1024,
         cc.DESKTOP['小隊職務 職位｜由｜至'], 0.0, 'post / from / to'),
    ]

    height = PAD + 96 + len(viewports) * ROW_H + 96
    img = Image.new('RGB', (W, height), PAPER)
    d = ImageDraw.Draw(img)

    d.text((PAD, PAD), 'SCOUTBOOK v2.1.0 — Column width spec (measured first, then sized)', fill=GREEN, font=FONT)
    d.text((PAD, PAD + 20),
           'Longest name in the whole book: 20 chars (progress item, 4 cases only); median 7. '
           'Activity badge: 8 max, median 2. Segment: 10.', fill=INK, font=FONT)
    d.text((PAD, PAD + 36),
           'Name column 36-46%; date column >= 104px so the native date input fits YYYY-MM-DD + calendar button. '
           'No container queries.', fill=INK, font=FONT)
    ok = 'check_columns: PASS' if '✅' in summary else 'check_columns: FAIL'
    d.text((PAD, PAD + 52), ok, fill=DATE_OK if ok.endswith('PASS') else DATE_BAD, font=FONT)

    y = PAD + 76
    for title, viewport, (template, gap, _lo, _hi), g, legend in viewports:
        avail = cc.content_width(viewport)
        cols, _base, _free = cc.solve(template, avail, g)
        total = sum(c['width'] for c in cols)
        scale = (W - PAD * 2) / avail

        d.text((PAD, y), f'{title}  [content {avail:.0f}px]', fill=INK, font=FONT)
        top = y + 18
        x = PAD
        for idx, c in enumerate(cols):
            w = c['width'] * scale
            is_date = c['min'] == cc.TOK['col-date-min']
            area = c['width'] >= cc.TOK['col-date-min'] - 0.5
            edge = DATE_OK if (is_date and area) else (DATE_BAD if is_date else GREEN)
            d.rectangle([x, top, x + w, top + 34], outline=edge, width=2 if is_date else 1)
            label = f'{c["width"]:.0f}px'
            share = f'{cc.pct(c["width"], total)}%'
            d.text((x + 5, top + 4), label, fill=INK, font=FONT)
            d.text((x + 5, top + 18), share, fill=GREEN if idx == 0 else INK, font=FONT)
            if is_date:
                d.text((x + w - 84, top + 12), 'YYYY-MM-DD', fill=edge, font=FONT)
            x += w + gap * scale
        y += ROW_H

    note = ('Green box = date column, always >= 104px (fits YYYY-MM-DD plus the native calendar button). '
            'Name column has a clamp upper bound, so spare width goes back to assessor / date.')
    d.text((PAD, height - PAD - 20), note, fill=GREEN, font=FONT)

    out = ROOT / 'docs/column-layout-check.png'
    img.save(out)
    print(f'written {out}')


if __name__ == '__main__':
    main()
