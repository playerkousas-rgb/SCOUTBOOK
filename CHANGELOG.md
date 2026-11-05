# CHANGELOG.md — 版本變更紀錄

本專案採用語義化版本（Semantic Versioning），每次更新同步對齊 `package.json`、`shared/book.js` 及 `web/index.html`。

## [Unreleased]

### 新增（Added）
- 倉庫骨架：`README.md`、`AGENTS.md`、`SCOPE.md`、`GLOSSARY.md`、`CONTRIBUTING.md`、專有版權 `LICENSE`、`docs/`（速查卡、設計巡檢、ADR、範圍外、P1 調查）、真理倉五支守衛腳本、`vercel.json`、`vite.config.js`、`package.json`。
- 第 0 步需求確認（2026-11-05）：形式＝框架 SPA／PWA（跟 BOOK 家族）、有 UI、無身份、核心無後台（`api/` 可選配）、唔係 Gemini、私人專有授權、童軍綠布面、表格 PT/18＋P120A1/A2，答案已寫入 `SCOPE.md`。

### 待辦（Todo；v1.0.0 收貨前完成）
- `shared/`（綱要產生器、資料模型、表格映射、二維碼協定）、`api/`（領袖密碼、scoutbadge 橋接）、`web/`（React PWA 全頁）、`tests/`（契約測試）、圖示九件套。
- 核實：紙本《童軍紀錄冊》頁數結構、`SCOUTBADGE_ORIGIN` 預設值、scoutbadge 後端配合事項。
