# CHANGELOG.md — 版本變更紀錄

本專案採用語義化版本（Semantic Versioning），每次更新同步對齊 `package.json`、`shared/book.js` 及 `web/index.html`。

## [Unreleased]

### 待辦（Todo；真機及紙本核實）
- 真機三寬度實測（390／768／1440）及列印實測（見 `docs/design-review.md` ROUND 2）。
- 核實：紙本《童軍紀錄冊》頁序覆核（現為 66 頁自創工作版本）、`SCOUTBADGE_ORIGIN` 預設值、scoutbadge 後端配合事項。

## [v1.1.0] - 2026-11-05

### 變更（Changed）
- 頁序重排：專科徽章 16 頁移到總領袖獎章之後（訓練計劃及活動紀錄 p24–p33、總領袖獎章 p34–p46、專科徽章 p47–p62）；v1.0.0 已存 `pages.pNN` 由 `PAGE_ID_MIGRATION` 自動搬遷一次。
- 全書童軍綠化：清除 port 殘留的幼童軍黃覆蓋層、家長模式樣式、酒紅漸層、海軍藍手寫墨；手寫墨及蓋印改深童軍綠 `#124a26`（9.25:1），真正錯誤另立 `--danger` 紅；頁緣色帶一律綠系並補 L5。

### 新增（Added）
- 官方徽章實圖 `web/public/official/`：會員章（封面＋L1 頁）、總領袖獎章（L5 簡介頁）、中英制服圖版＋22 項童軍圖例（p63）；保留原印顏色，不用 SVG 重繪。
- 測試增至 40 項：頁序契約、遷移契約、官方圖契約、殘留色掃描。

### 待辦（Todo）
- L2–L4 進度性獎章章圖：待官方《童軍紀錄冊》PDF（`scout-record-book_20260829.pdf`，scoutsinfohub）附加後裁圖補上；屆時一併覆核紙本頁序。

## [v1.0.0] - 2026-11-05

### 新增（Added）
- 倉庫骨架：`README.md`、`AGENTS.md`、`SCOPE.md`、`GLOSSARY.md`、`CONTRIBUTING.md`、專有版權 `LICENSE`、`docs/`（速查卡、設計巡檢、ADR、範圍外、P1 調查）、真理倉五支守衛腳本、`vercel.json`、`vite.config.js`、`package.json`。
- 第 0 步需求確認（2026-11-05）：形式＝框架 SPA／PWA（跟 BOOK 家族）、有 UI、無身份、核心無後台（`api/` 可選配）、唔係 Gemini、私人專有授權、童軍綠布面、表格 PT/18＋P120A1/A2，答案已寫入 `SCOPE.md`。
- `shared/`：綱要產生器（75 進度細項＋143 專科徽章，中英 100%）、資料模型（66 頁映射＋頁切片＋同步契約）、三表映射（`PT/18`・`P120A1`・`P120A2`）、`SB1`／`SB1S.` 二維碼協定。
- `api/`：領袖密碼（`timingSafeEqual` 伺服器比對）、scoutbadge 橋接（403 寫入封鎖、`requestComplete` 待核實轉發）。
- `web/`：React PWA 全 66 頁（個人資料、L1–L5 獎章、專科徽章、訓練計劃、安全、宣誓、活動紀錄、總領袖獎章流程、制服、誓詞、總覽、說明、數位附錄）、三表自動帶入＋A4 列印、整本列印、童軍綠封面、PWA 離線快取、圖示九件套。
- `tests/`：五套契約測試 38 項全過（頁數、ID 單一真相、表格、QR、同步、離線、WCAG、版權、圖示）。
