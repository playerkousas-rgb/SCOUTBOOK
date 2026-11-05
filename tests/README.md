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
| `scoutbadge_sync.test.mjs` | `/api/scoutbadge` 橋接：旅團清單零金鑰、403 寫入封鎖、login／load／submitPending、`requestComplete` 轉發、端到端同步 |
| `standalone_book.test.mjs` | 純離線旅程（建立→填寫→統計→出表→簽名→備份）、橋接降級、獨立模式標示、第 63 頁制服清單 |
| `ui_contracts.test.mjs` | 66 頁路由、版權三處、童軍綠金 WCAG AA、領袖密碼伺服器比對、領袖／普通模式分離、中英分離、圖示＋manifest＋SW、套件配置 |

## Fixtures

`fixtures/scoutbadge-ids.json` 由 `npm run syllabus`（`scripts/build_syllabus.mjs`）從
scoutbadge `data/items.json` 生成：75 個進度項目 ID、143 個專科徽章 ID 及來源 sha256。
測試會驗證 `shared/syllabus.js` 與 fixture 逐個相同；上游更新後請重新生成並一併提交。
