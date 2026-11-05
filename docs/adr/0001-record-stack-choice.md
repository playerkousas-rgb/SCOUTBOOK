# ADR 0001：沿用 React + Vite 純前端離線優先 PWA，並以 `scoutbadge` 為項目 ID 單一真相

- **日期**：2026-11-05
- **狀態**：已採納（Accepted）

## 背景

`SCOUTBOOK` 需要同時呈現：
1. 高密度紙本《童軍紀錄冊》互動版面（就地縮字打字、觸控筆手寫、透明簽名壓縮、中英切換與手機單欄；總領袖獎章考驗紀錄佔紙本第 50–62 頁，全書頁數結構見 `SCOPE.md`）；
2. 三張官方 A4 表格（`PT/18`、`P120A1`、`P120A2`）之自動帶入與精準列印；
3. 露營、遠足及旅團集會現場無網絡時仍可 100% 讀寫、簽名與產生二維碼；
4. 與姊妹專案 `scoutbadge`（2026 年修訂版《童軍訓練綱要》，P022/2026）純進度雙向互通。

## 決策

1. 沿用 `CUBSBOOK v1.0.2`、`VSBOOK v1.0.0` 與 `ROVERBOOK v16` 的 **React 18 + Vite** 純靜態 SPA/PWA 架構（部署 Vercel `hkg1`，輸出 `dist/`，總體積 `< 5 MB`），配合手寫零依賴 `sw.js` 實作導航 Network-First、靜態資產 Cache-First 離線快取。
2. 資料模型、2026 修訂版綱要、表格映射與 `SB1` 二維碼編解碼抽離至純 ES Module `shared/`，既可被前端引用，亦可由 Node.js `node --test` 直接測試。
3. **項目 ID 不在本倉庫手寫**：`scripts/build_syllabus.mjs` 讀取上游 `scoutbadge/data/items.json`（含 `items_en.json` 英文覆蓋）產生 `shared/syllabus.js` 及 `tests/fixtures/scoutbadge-ids.json`，以 sha256 鎖定。童軍支部官方編號本身已是 `L1-M1`…`L5-*`／`SC-*-*` 的 2026 制，因此 **BOOK 內部鍵＝官方編號原文**，零映射、零改名（對齊 `scoutbadge` 內容查核「項目 ID 只用 2026 制」）。
4. 統一成員識別碼為 `scoutId`（童軍成員編號，總會 YMIS 內 10 位數字），容忍前導零；舊稱 `ymis` 只作讀取相容。

## 後果

- **正面**：零伺服器運維、零冷啟動、離線可用；與 `scoutbadge` 共用同一套 ID，測試可即時發現上游改動。
- **取捨**：上游項目增刪時須重跑 `npm run syllabus` 並檢視 fixture 差異；`localStorage` 容量約 5 MB，故內建簽名／相片壓縮與「儲存健康」瘦身面板。
