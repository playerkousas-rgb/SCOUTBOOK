# AGENTS.md — SCOUTBOOK 工作守則

開工前必讀。本倉庫遵循上游治理真理倉 `playerkousas-rgb/readme` 之 `0`（INTAKE）→ `1`（START）→ `2`（repo-setup）→ `3`（design-review）→ `4`（preflight）→ `5`（guard / final_check）流程，並與 `CUBSBOOK` `v1.0.2`、`VSBOOK` `v1.0.0`、`ROVERBOOK` `v16` 同構。

## 1. 一句話定位

**SCOUTBOOK** 是香港童軍支部個人隨身離線電子紀錄冊（純前端 PWA），逐頁對應《童軍紀錄冊》及 2026 年修訂版訓練綱要，支援就地打字／手寫簽名、`PT/18`・`P120A1`・`P120A2` 自動填表列印、純離線二維碼核簽與 `scoutbadge` 純進度互通。

## 2. 關鍵路徑

- 定位與邊界：[`SCOPE.md`](SCOPE.md)、[`docs/out-of-scope/README.md`](docs/out-of-scope/README.md)
- 詞彙單一真相：[`GLOSSARY.md`](GLOSSARY.md)
- 架構決策：[`docs/adr/README.md`](docs/adr/README.md)
- 視覺巡檢：[`docs/design-review.md`](docs/design-review.md)
- P1 調查與未核實項：[`docs/p1-research.md`](docs/p1-research.md)
- `scoutbadge` 後端配合：`docs/scoutbadge-patch.md`（如有需要，建構 `api/` 時補上）
- 資料與協定核心：`shared/syllabus.js`（產生檔）、`shared/book.js`、`shared/forms.js`、`shared/transfer.js`
- 伺服器接口：`api/leader.js`、`api/scoutbadge.js`
- 前端介面與離線快取：`web/index.html`、`web/src/`、`web/public/sw.js`、`web/public/icons/`
- 自動化測試與閘門：`tests/`、`scripts/`

## 3. 不可退讓底線（Non-Negotiables）

1. **BOOK 必須可獨立運作**：不得讓任何核心功能（逐頁填寫、簽名、表格、列印、二維碼、備份還原）依賴 `/api/*` 或網絡；`scoutbadge` 同步只屬可選加速，偵測失敗必須安全降級為「獨立模式」並保留本機 JSON 交換。
2. **BOOK 只服務一位成員**：不設全團名冊、批量簽核工作台、多成員切換槽——那些屬 `scoutbadge`（BADGE）。新增任何「一次看多位成員」的介面即屬越界。
3. **零個人資料同步**：跨系統只准傳 `SCOUT ID`、項目代號及日期；伺服器端必須硬性剝除姓名、電話、地址、家長／監護人資料、相片及任何其他成員紀錄。`pendingRequests` **永不**錄入 BOOK。
4. **不可自我核實**：BOOK 送出的進度只可經 `requestComplete` 變成 `status: 'pending'`；`save`／`saveOtherBadge`／`reviewRequest` 一律回 `403`；只有領袖在 BADGE 內按 CONFIRM 才算完成。
5. **版權擺位僅三處**：封面頁腳 `LegalLine`、數位附錄 `LegalNote`、選單「關於」`LegalNote`。其餘頁面、列印及表格不得重複。
6. **童軍綠是主色，且對比不可退讓**：封面為綠布面（`#143b28 → #08180f`），**金字（`#f6e6bb`）只准配深綠 `#143b28`（10.06:1）**；內頁綠墨標題 `#1c5236` 配象牙紙 `#f7f2e7`（8.14:1）；金底按鈕一律用深炭字 `#1a1206`（10.67:1）。中英文完全分開，一鍵切換，不得並排塞入同一表格。色值以 `web/src/styles.css` 實裝為準，改動必須同步重算 `docs/design-review.md`。
7. **項目 ID 單一真相**：任何 `L1-*`…`L5-*`、`SC-*-*` 的改動必須先在 `scoutbadge/data/items.json` 落地，再執行 `npm run syllabus`，並更新 `tests/fixtures/scoutbadge-ids.json`；測試會以 sha256 與清單鎖死。BOOK 內部鍵＝官方編號原文，不得另起映射。
8. **四處版本號（V）與體積預算（S7 / G11）**：任何可見更新須同步遞增 ①`package.json` ②`shared/book.js`（`APP_VERSION`）③`web/index.html`（`meta[name="app-version"]`、`window.APP_VERSION`）④**`web/public/sw.js` 的 `CACHE_NAME` 版本尾碼**（`scoutbook-cache-v3 → v4`），並更新 `CHANGELOG.md`。只改程式不改快取名，已安裝到主畫面的 APP 永遠收舊版面。`dist/` 總體積須 `< 5 MB`，`web/public/icons/` 9 個圖示總和須 `<= 260 KB`。
9. **禁止在 `.js/.mjs/.jsx` 寫 `// v1.0` 行內版本註解（F15）**：版本號只寫在常數、HTML meta 與 `CHANGELOG.md`。
10. **`LEADER_CODE` 不得加 `VITE_` 前綴**：只在 `api/leader.js` 以 `crypto.timingSafeEqual` 比對；前端 bundle 不得出現任何密碼。
11. **欄寬先量度、後定寬（L）**：不得照官方 PDF 比例或憑感覺定欄寬。名稱欄禁用 `minmax(0, 1fr)` 獨佔剩餘闊度，須用 `minmax(clamp(下限, 百分比, 上限), 比例fr)` 並約佔 40–50%；日期欄下限 ≥ `--col-date-min`（104px，要放得下完整 `YYYY-MM-DD` 連日曆鈕）；表頭與表身共用同一組 `grid-template-columns`；簽署欄只按姓名計寬、不預填職銜；簽名圖須同時限寬限高。**禁用 `container-type`／container query**（會困住 `position: fixed` 彈窗），改以百分比 `clamp` ＋ 斷點分段。任何改動須跑 `python3 scripts/check_columns.py`。
12. **自動更新不可退讓（U）**：`sw.js` 的 `install` 不得自動 `skipWaiting`；前台須在 `visibilitychange`（回到前景）主動 `reg.update()`，偵測到新版即彈提示，按下後 `postMessage({ type: 'SKIP_WAITING' })`，`controllerchange` 時自動 `location.reload()`。用戶全程不用刪除或重裝 APP。

## 4. 交付前必跑指令

```bash
npm test
python3 scripts/check_columns.py
npm run build
node scripts/guard.mjs
rm -rf dist && node scripts/final_check_v1.0.mjs
node scripts/repo_health_v1.0.mjs
node scripts/preflight_v1.0.mjs .
```

## 5. 常用改動指引

| 想改 | 改哪裡 | 之後要跑 |
| :--- | :--- | :--- |
| 綱要項目／專科徽章 | `scoutbadge/data/items.json`（上游） | `npm run syllabus && npm test` |
| 內頁版面 | `web/src/pages/Book{Front,Training,Skills,L5,Back}.jsx` | `npm test`（頁數契約） |
| 樣式／配色 | `web/src/styles.css`（`--cover-bg`、`--scout-green`、`--foil`） | `npm test`（WCAG 契約） |
| 表格欄位 | `shared/forms.js` + `web/src/pages/Forms.jsx` | `npm test` |
| 表格欄寬 | `web/src/styles.css`（`--col-date-min` 等 token ＋ `--cols`）＋ `columnTemplate()` | `python3 scripts/check_columns.py && npm test` |
| 二維碼格式 | `shared/transfer.js` | `npm test`（`SB1`／`SB1S` 契約） |
| 同步契約 | `api/scoutbadge.js` + `shared/book.js` | `npm test`（403／pending 契約） |
| 圖示 | `scripts/generate_icons.mjs` | `npm run icons && npm test` |
