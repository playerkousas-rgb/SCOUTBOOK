# SCOUTBOOK · 童軍支部電子紀錄冊

> **童軍支部個人隨身離線電子紀錄冊** —— 逐頁對應香港童軍總會《童軍紀錄冊》及 2026 年修訂版《童軍訓練綱要》，支援就地打字／手寫簽名、一鍵生成及列印 `PT/18`・`P120A1`・`P120A2` 官方表格、成員⇄領袖純離線二維碼核簽，以及與 `scoutbadge` 旅團進度表的**純進度、零個人資料**雙向同步。

- **目前版本**：`v2.0.0`（按紙本官方 110 頁全面重排：個人／獎章／紀錄／AYP／附錄全功能，測試 42/42；見 [CHANGELOG.md](CHANGELOG.md)）
- **架構形態**：離線優先 PWA（React + Vite + Service Worker，`localStorage` 本機儲存，零帳號、零雲端上傳；可選配 Vercel `/api/leader` 與 `/api/scoutbadge` 伺服器端接口）
- **設計主題**：對齊 `CUBSBOOK` `v1.0.2`／`VSBOOK` `v1.0.0`／`ROVERBOOK` `v16` 的介面、安全區與版權規範，改用**童軍綠布面**封面（`#143b28 → #08180f` × 燙金 `#e3c07a`／`#f6e6bb` × 象牙內頁 `#f7f2e7`）；重點按鈕及進度條同樣用童軍綠。金字只准配深綠（10.06:1），金底按鈕一律深炭字（10.67:1）；手寫墨及蓋印一律深童軍綠，會員章／總領袖獎章／制服圖版用官方裁圖（`web/public/official/`）並保留原印顏色，確保 WCAG AA（見 [`docs/design-review.md`](docs/design-review.md)）。
- **一句話**：BOOK 是「這一位成員」的口袋紀錄冊；全團名冊、批量簽核、多成員切換一律留在 `scoutbadge`。
- **獨立優先**：BOOK **不接 scoutbadge 亦 100% 可用** —— 逐頁填寫、簽名、官方表格、A4 列印、離線二維碼、JSON 備份全部在本機完成。`scoutbadge` 只是「可選」的免重打同步；純靜態主機（無 `/api`）會自動顯示「獨立模式」，不會卡住任何功能。

> 目前狀態：`v2.0.0`（官方 110 頁 1:1 重排完成，路由 `/p/p001`–`/p/p110`；紙本對照見 [`docs/paper-mapping.md`](docs/paper-mapping.md)，設計案見 [`docs/v2-110-plan.md`](docs/v2-110-plan.md)）。**真機三寬度（390／768／1440）及實機列印仍未測**，不作聲稱（見 [`docs/design-review.md`](docs/design-review.md)）。

---

## 30 秒開始

```bash
npm install          # 安裝依賴
npm run dev          # 啟動本機開發伺服器（0.0.0.0:5173）
npm test             # 執行資料模型、表格、二維碼及介面契約測試（node --test）
npm run syllabus     # 由 scoutbadge data/items.json 重新產生 shared/syllabus.js
npm run build        # 打包生產版靜態檔案至 dist/
```

品質閘門（對齊 `playerkousas-rgb/readme` 真理倉）：

```bash
node scripts/guard.mjs
rm -rf dist && node scripts/final_check_v1.0.mjs
node scripts/repo_health_v1.0.mjs
node scripts/preflight_v1.0.mjs .
```

> `dist/` 是建置產物，**不要 commit**；`final_check` 與 `preflight` 請在沒有 `dist/` 的狀態執行。

---

## 七大不可退讓規則（Iron Rules）

| # | 規則 | 在本倉庫的落地方式 |
| :-: | :--- | :--- |
| 1 | **BOOK ≠ BADGE** | 只做單一成員的紀錄冊、進度獎章、專科徽章與官方表格。**不做**全團名冊、批量簽核、多成員切換槽（屬 `scoutbadge`）。 |
| 2 | **全螢幕＝一本實體書 + 綠金對比陷阱** | `100dvh` 布面封面與紙本內頁、無卡片框線陰影；空白欄只顯示小圓點 `.write__dot`（列印自動隱藏）；就地打字自動縮字；簽名壓縮為單色透明 PNG。金字只配深綠，中綠只配象牙白字。中英文完全分開，一鍵 `中文 / EN`。 |
| 3 | **BOOK ⇄ BADGE 純進度同步（可選）** | 只傳 `SCOUT ID`、項目代號、日期；未接駁時以獨立模式運作。空白簿輸入 SCOUT ID + `scoutbadge` 密碼即可綁定並拉取已核實進度；`pendingRequests` **永不**錄入；`save`／`saveOtherBadge` 一律 `403`；BOOK→BADGE 只轉發 `requestComplete`，寫入 `status: 'pending'`。旅團下拉由 `SCOUTBADGE_ORIGIN` 伺服器端取得，BOOK 不存 Google Sheet 網址或 API key。 |
| 4 | **領袖模式（只讀）與普通模式嚴格分離** | 普通模式不能讀取他人紀錄冊，只能貼上領袖簽發的 `SB1S.` 核簽碼；出示 QR（`SB1.`）預設全不剔選。領袖模式以伺服器端 `LEADER_CODE`（**不加 `VITE_`**、`crypto.timingSafeEqual` 比對）解鎖後，本機紀錄冊鎖為唯讀，只可當面掃描及簽發 `SB1S.`。 |
| 5 | **項目 ID 單一真相** | `shared/syllabus.js` 由 `scoutbadge/data/items.json` 產生，75 個進度細項（`L1`–`L5`）+ 143 個專科徽章逐一對照，測試以 fixture 的 sha256 與 ID 清單鎖定。BOOK 內部鍵＝官方編號原文，零映射。 |
| 6 | **官方表格自動帶入 + A4 忠實列印** | `PT/18`（總領袖獎章及證書申請表）、`P120A1`（專科徽章／獎章考驗申請表）、`P120A2`（附加資料表格）自動填入；不適用表格（`PT/65`・`PT/19`・`PT/20`・`PT/21`・`PT/22`・`PT/69`・`PT/68`）一律不加入。桌面／平板維持 A4 比例，`≤740px` 手機自動單欄、無水平捲軸。 |
| 7 | **版權擺位與全套圖示** | `Copyright © 2026 SCOUT SYSTEM` 與非官方聲明只出現於**封面頁腳、數位附錄、選單「關於」**三處；齊備 `/icons/*` 九件套（`icon-192-v2.png`、`icon-512-v2.png`、`icon-maskable-192-v2.png`、`icon-maskable-512-v2.png`、`apple-touch-icon-v2.png`、`favicon-16-v2.png`、`favicon-32-v2.png`、`favicon-48-v2.png`、`favicon-v2.ico`、`og-image-v2.png`；全 PNG／ICO，無 SVG）；內含真理倉五支守衛腳本。 |

---

## 核心功能

1. **紙本逐頁對應**：個人資料、童軍紀錄、會員資格續期、服務及獎勵、會員章（`L1` 11 項）、童軍探索獎章（`L2` 14 項）、童軍標準獎章（`L3` 16 項）、童軍高級獎章（`L4` 17 項）、總領袖獎章（`L5` 17 項）、專科徽章、頒發及宣誓紀錄、誓詞與規律、制服及徽章位置、進度總覽、使用說明，另設**數位附錄**（同步、備份、示範與重設）。頁碼待紙本核實後鎖定。
2. **就地打字與手寫**：空白欄只顯示 `.write__dot`，一按即寫、字多自動縮字；簽名以單色透明 PNG 壓縮儲存，可直接嵌入二維碼。
3. **A4 紙本原貌**：桌面／平板 A4 比例與裝訂陰影；手機自動展開單欄。`/print` 一次過列印全本。
4. **官方表格**：
   - `FORM PT/18 (10/2025)` 總領袖獎章及證書申請表
   - `P120A1 (10/2009)` 童軍專科徽章／獎章考驗申請表
   - `P120A2 (10/2009)` 童軍專科徽章／獎章考驗附加資料表格
5. **純離線二維碼**：`SB1.`（gzip）／`SB1P.`（未壓縮）／`SB1S.`（領袖核簽）＋ `#v=` 連結，上限 2,400 字元；出示前逐項剔選，預設全不選。
6. **與 `scoutbadge` 純進度互通**：拉取已核實進度免重打；送出申報一律 `status: 'pending'`，由領袖在 BADGE 按 CONFIRM。

### Vercel 部署設定（領袖密碼 `LEADER_CODE` 及 `scoutbadge` 後端配合）

在 Vercel → **Project → Settings → Environment Variables** 新增（**請勿加 `VITE_` 前綴**）：

1. **`LEADER_CODE`**（必填以啟用領袖模式）：
   - **Name**：`LEADER_CODE`
   - **Value**：你設定的領袖密碼（本機 `npm run dev` 未設定時預設為 `1234` 方便測試）
   - **Scope**：`Production`（及 `Preview`）
   - 設定後重新部署（Redeploy）；若未設定 `LEADER_CODE`，系統會自動隱藏領袖模式入口，作為純成員版運作。
2. **`SCOUTBADGE_ORIGIN`**（選填，預設 `https://scoutbadge.vercel.app`，待核實）：
   - 供成員在「數位附錄」一鍵連接自己的 `scoutbadge` 帳戶（如有自建網址可改；個別旅團另可用 `TROOP_<id>_*` 覆寫，見 [`.env.example`](.env.example)）。

---

## 文件索引

| 文件 | 內容 |
|---|---|
| [AGENTS.md](AGENTS.md) | Agent 開工順序、關鍵路徑、不可退讓底線 |
| [SCOPE.md](SCOPE.md) | 做乜／唔做乜、第 0 步需求確認紀錄 |
| [GLOSSARY.md](GLOSSARY.md) | 統一詞彙（程式、介面、文件共用） |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 修改流程、提交檢查、雙版號規則 |
| [CHANGELOG.md](CHANGELOG.md) | 版本變更紀錄 |
| [LICENSE](LICENSE) | 專有版權（All Rights Reserved）＋非官方聲明 |
| [docs/00-quickcard.md](docs/00-quickcard.md) | 一頁紙速查（路由、儲存鍵、排障） |
| [docs/design-review.md](docs/design-review.md) | 視覺基準與巡檢紀錄 |
| [docs/p1-research.md](docs/p1-research.md) | P1 研發前調查（相近產品、自己方案、未核實項） |
| [docs/adr/README.md](docs/adr/README.md) | 架構決策紀錄（0001 技術棧、0002 二維碼與版權） |
| [docs/out-of-scope/README.md](docs/out-of-scope/README.md) | 明確不做事項 |
| [scripts/README.md](scripts/README.md) | 守衛與產生器腳本說明 |

---

Copyright © 2026 SCOUT SYSTEM — All Rights Reserved（見 [LICENSE](LICENSE)）。本工具為非官方獨立工具，與香港童軍總會無任何官方從屬關係；訓練綱要及紀錄冊內容版權歸香港童軍總會所有。
