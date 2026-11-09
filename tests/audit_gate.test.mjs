// 閘門回歸：單檔 HTML 審計器對「多檔建置部署入口」的 V4 例外必須窄到唔會放生真・單檔 HTML。
// 背景：SCOUTBOOK 係 Vite 多檔建置，dist/index.html 只係入口殼；若硬要佢改名帶 _vX.Y，
// Vercel（cleanUrls／outputDirectory: dist）就搵唔到首頁。但真・單檔 HTML 交付物仍然要版號檔名。
import test from 'node:test';
import assert from 'node:assert/strict';
import { audit } from '../scripts/audit_single_html_v1.0.mjs';

const shell = ({ scripts, meta = 'v1.2' }) => `<!doctype html><html lang="zh-Hant-HK"><head>
<meta charset="utf-8" />
<meta name="copyright" content="© SCOUT SYSTEM" />
<meta name="app-version" content="${meta}" />
<script>window.APP_VERSION = '${meta}';</script>
${scripts}
</head><body><h1>APP v${meta}</h1></body></html>`;

const findingsOf = (html, name) => audit(html, name, Buffer.byteLength(html)).findings;
const v1Fails = (f) => f.filter((x) => x.level === 'FAIL' && x.id === 'V1');

test('V4 例外：多檔建置的 index.html（有 /assets module bundle）不再誤報 V1', () => {
  const html = shell({ scripts: '<script type="module" crossorigin src="/assets/index-AbC123.js"></script>' });
  const v = v1Fails(findingsOf(html, 'index.html'));
  assert.equal(v.length, 0, '建置入口 index.html 不應判 V1 失敗');
  const info = findingsOf(html, 'index.html').filter((x) => x.id === 'V4');
  assert.ok(info.length >= 1, '應以 INFO 講明係多檔建置部署入口');
  assert.match(info.map((x) => x.msg).join(' '), /多檔建置部署入口/, 'INFO 要清楚標示理由');
});

test('V4 例外唔會放生真・單檔 HTML（無外部 bundle）', () => {
  // 全部程式內嵌，正是 Canvas／單檔交付物的形態
  const html = shell({ scripts: '<script>/* 全部程式內嵌 */ function boot(){}</script>' });
  const v = v1Fails(findingsOf(html, 'index.html'));
  assert.equal(v.length, 1, '單檔 HTML 叫 index.html 一樣要 FAIL（仍然要求 _vX.Y 檔名）');
});

test('V4 例外只認 index.html：其他檔名即使有 bundle 一樣要版號', () => {
  const html = shell({ scripts: '<script type="module" src="/assets/index-AbC123.js"></script>' });
  const v = v1Fails(findingsOf(html, 'entry.html'));
  assert.equal(v.length, 1, '非 index.html 的部署拷貝不得套用例外');
});

test('V4 例外唔會蓋過版本常數檢查（V2 仍然硬檢）', () => {
  const html = `<!doctype html><html><head><meta name="copyright" content="© SCOUT SYSTEM" />
  <script type="module" src="/assets/index-AbC123.js"></script></head><body>app</body></html>`;
  const f = findingsOf(html, 'index.html');
  assert.ok(f.some((x) => x.level === 'FAIL' && x.id === 'V2'), '無 APP_VERSION 仍然要 FAIL（例外只針對檔名）');
  assert.ok(f.some((x) => x.level === 'FAIL' && /app-version/.test(x.msg)), '無 app-version meta 仍然要 FAIL');
});
