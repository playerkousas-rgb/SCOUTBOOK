# SCOUTBOOK 測試

執行全部測試：

```sh
npm test
```

即 `node --test tests/*.test.mjs`，零測試框架依賴。

## 測試檔案

| 檔案 | 覆蓋範圍 |
| --- | --- |
| `book_and_syllabus.test.mjs` | 66 頁映射、75＋143 項目 ID 單一真相、五獎章階級、頁切片不重不漏、自選項目、SCOUT ID、年齡、示範統計、BOOK⇄BADGE 進度交換 |
| `forms_and_transfer.test.mjs` | PT/18・P120A1・P120A2 元數據與自動帶入、QR 預設不剔選、SB1／SB1S 編解碼、核簽套用、A4 列印契約 |
| `scoutbadge_sync.test.mjs` | `/api/scoutbadge` 橋接：預設來源與 `SCOUTBADGE_ORIGIN`、旅團清單零金鑰、已登記旅團清單（`upstreamOk`、略過未接通旅團與重複別名、編號逐字比對）、403 寫入封鎖、login／load／submitPending、`requestComplete` 轉發、端到端同步 |
| `standalone_book.test.mjs` | 純離線旅程（建立→填寫→統計→出表→簽名→備份）、橋接降級、獨立模式標示、同步卡純函式（開戶連結只接受 https、旅團排序、不代選旅團、備份檔／進度檔分類）、未連接前鎖定進度檔匯出匯入（介面＋處理函式）、其他入口不得繞過同步卡、第 63 頁制服清單 |
| `ui_contracts.test.mjs` | 66 頁路由、版權三處、童軍綠金 WCAG AA、領袖密碼伺服器比對、領袖／普通模式分離、中英分離、圖示＋manifest＋SW、同步卡樣式類別一一對應與列印隱藏、`<Icon>` 名稱必須存在、Toast 版面、套件配置 |
| `layout_and_update.test.mjs` | 欄寬量度數字、名稱欄寫法（禁 `minmax(0, 1fr)`）、日期欄 ≥104px、表頭＝表身欄寬、兩行制位置、簽名圖限寬、禁 container query、四處版本號同步、更新協定 |
| `sw_update_flow.test.mjs` | 以 vm 假物真跑 SW 生命週期與前台更新協定（install 不自動接管、SKIP_WAITING、舊 cache 清理、切回前景查更新、controllerchange 只重載一次） |
| `embed_contract.test.mjs` | 服務平台 iframe 嵌入契約：`frame-ancestors` 白名單精確值、`X-Frame-Options`／`SAMEORIGIN` 不得重現、相機權限保留、嵌入偵測、備份／還原文案、反嵌入跳轉禁止、文件同步 |

另有一支非測試框架的版面核算指令：

```sh
python3 scripts/check_columns.py
```

它直接由 `web/src/styles.css` 抽出真實欄寬字串，按 CSS Grid §12 演算法計算
320／360／390／430／768／1024／1440 各寬度下每欄實際 px，證明日期欄恆 ≥ 104px、
名稱欄有上限、永不溢出。欄寬改動後必跑。

## Fixtures

`fixtures/scoutbadge-ids.json` 由 `npm run syllabus`（`scripts/build_syllabus.mjs`）從
scoutbadge `data/items.json` 生成：75 個進度項目 ID、143 個專科徽章 ID 及來源 sha256。
測試會驗證 `shared/syllabus.js` 與 fixture 逐個相同；上游更新後請重新生成並一併提交。
