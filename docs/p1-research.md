# P1 研發前調查 — 相近產品、自己現有方案、差異與決策

- **日期**：2026-11-05
- **對應**：真理倉 `PLAYBOOK` P1（開工前先找相近產品及自己的現有方案，記錄來源、差異與決策；無法查證須說明限制）。

## 1. 相近產品（外部）

| 產品 | 來源 | 做法 | 與本專案差異 |
|---|---|---|---|
| **Scoutbook（美國 Scouting America 官方）** | [1](https://www.piedmontcouncilbsa.org/helpscoutbook) · [2](https://ggacbsa.org/scoutbook-2/) · [3](https://help.scoutbook.scouting.org/faq/) | 雲端全團管理：進度追蹤、名冊、日曆、電郵、服務時數；家長／領袖帳號；直通全國紀錄 | 美國制綱要、雲端帳號制；本專案係**香港制、離線、零帳號、單一成員**紀錄冊，定位完全唔同（只撞名） |
| **OSM（Online Scout Manager，英國）、TroopTrack、Scout Manager 等** | [4](https://orgo.space/blog/best-scout-management-software/) | 雲端收費／免費增值：badge 追蹤、批量操作、活動管理、ScoutBook 雙向同步 | 同上：全部雲端多用戶制，無離線紙本逐頁對應、無 QR 當面核簽、無香港總會表格 |
| **社群評價** | [5](https://www.reddit.com/r/BSA/comments/i6h5z9/digital_tools_for_tracking_scout_advancement/) | Scoutbook 被指 UI 笨重，但因官方紀錄必填而無可取代 | 引證：官方流程綁定才是採用關鍵；本專案不取代總會批核，只做「整齊填報＋核對」 |

**結論**：市面相近產品全部係雲端帳號制，無一個做到「離線單人紙本紀錄冊＋QR 核簽＋香港表格列印」；本專案填補呢個空位，唔與任何官方系統競爭。

## 2. 自己的現有方案（playerkousas-rgb）

| 倉庫 | 角色 | 可重用 | 來源 |
|---|---|---|---|
| `CUBSBOOK` v1.0.2 | 幼童軍 BOOK（最新家族成員） | **架構全套照抄**：React+Vite PWA、`shared/` 四件套、`api/leader`＋`/api/cubbadge`→改 `scoutbadge`、`SB1` 前綴仿 `CB1`、`vercel.json`、`vite.config.js`、測試契約、圖示產生器 | https://github.com/playerkousas-rgb/CUBSBOOK |
| `VSBOOK` v1.0.0 | 深資童軍 BOOK | 40 頁大書排版經驗、三表格（`PT/65`・`PT/19`・`PT/20`）自動帶入模式 | https://github.com/playerkousas-rgb/VSBOOK |
| `ROVERBOOK` v16 | 樂行童軍 BOOK | `RB1` 前綴格式（確立家族 `[Section]B1` 命名，SCOUTBOOK 用 `SB1`）、藍布面對比經驗 | https://github.com/playerkousas-rgb/ROVERBOOK |
| `scoutbadge` | 童軍支部 BADGE（合作方） | **項目 ID 單一真相**：`data/items.json`（5 章 `L1`–`L5` 共 75 細項＋143 專科徽章＋`forms` 三表定義）；表格欄位結構抄 `renderPT18Form`／`renderP120A1Form`；同步經 `POST /api/proxy`，旅團清單經 `GET /api/troops`；角色用語（旅長 GSL／童軍團長 SL） | https://github.com/playerkousas-rgb/scoutbadge（`docs/SCOUT_SECTION_AUDIT.md` §1–§5 為童軍支部內容紅線） |
| `scoutmeeting` | 團集會教案庫 | 範圍外，不重用，只作邊界參照 | https://github.com/playerkousas-rgb/scoutmeeting |

**關鍵差異**：`scoutbadge` 的 `badges[].items` 係平面清單（官方編號本身已係 `L1-M1`／`L2-A1` 2026 制），唔似 `cubbadge` 要分段映射；因此 SCOUTBOOK 的 BOOK 內部鍵＝官方編號原文，零映射（見 `docs/adr/0001-record-stack-choice.md` 決策 3）。

## 3. 決策

1. 跟家族：框架 SPA／PWA（React 18 + Vite + Service Worker），離線優先，`localStorage`，零帳號；`api/` 只做可選配。
2. 紙本逐頁對應、全螢幕實體書、童軍綠布面、中英分開、`PT/18`＋`P120A1/A2` 自動帶入＋A4 列印、`SB1`／`SB1S.` QR、與 `scoutbadge` 純進度互通。
3. 授權：public repo ＋專有 `LICENSE`（跟家族，用戶 2026-11-05 親自揀）。

## 4. 未核實／限制

- 紙本《童軍紀錄冊》完整頁數結構：v1.1.0 沿用 66 頁自創工作版本（總領袖獎章 p34–p46、專科徽章 p47–p62；紙本第 50–62 頁據 `PT/18` 查閱清單為總領袖獎章考驗紀錄，數位頁序與之不同）。官方 PDF（`scout-record-book_20260829.pdf`，scoutsinfohub）已取得並核對：111 頁＝卷首語＋編號 1–110，L2–L4 章圖已裁取接入；逐段對照見 `docs/paper-mapping.md`。
- `SCOUTBADGE_ORIGIN` 預設值 `https://scoutbadge.vercel.app` 按家族命名推斷，未核實部署；以 `TROOP_*` 覆寫及獨立模式降級兜底。
- 相近產品只做桌面調查（2026-11-05），無試用帳號實測；香港總會表格只核對 `scoutbadge` 已重做版本，未逐格對總會 PDF。
- 本倉無瀏覽器／真機實測（用戶亦確認未能實測三寬度）；交付時 `docs/design-review.md` 會照實標示「機器驗證通過，真機待測」。
