# CHANGELOG.md — 版本變更紀錄

本專案採用語義化版本（Semantic Versioning），每次更新同步對齊 `package.json`、`shared/book.js` 及 `web/index.html`。

## [v2.1.0] - 2026-11-09

### 修正（Fixed）—— 欄寬：先量度、後定寬

- **先量真實內容**（`scripts/measure` 一次性數法，結果寫入 `docs/design-review.md`）：全書名稱欄最長為進度項目 **20 字**（B2 科學、科技、工程、藝術、數學及創意，僅 4 項）、中位 **7 字**；分段／範疇名 10 字；活動徽章名 8 字（中位 2 字）；專科範疇 4 字；獎章名 6 字。結論：名稱欄只需約 40–50% 闊度。
- **名稱欄不再以 `minmax(0, 1fr)` 獨佔餘下全部闊度**，改為 `minmax(clamp(下限, 百分比, 上限), 比例fr)` 攤分：
  - 細項簽核表 `clamp(152px, 40%, 280px)` / 0.95fr、主考 `clamp(96px, 26%, 200px)` / 1.2fr、日期 `--col-date-min…max`；
  - 活動徽章表 `clamp(124px, 42%, 300px)` / 1.15fr；通用表格預設 `clamp(132px, 42%, 260px)` / 1.15fr。
- **日期欄下限 104px（上限 132px）**：原生日曆輸入要 ≥104px 才放得下完整 `YYYY-MM-DD` 連日曆鈕（舊版只給 58／72／82／92／96px，數字必定被擠壓重疊）。`--col-date-min` 為單一真相，日期輸入框另有 `min-width` 保證不被壓縮。
- **表頭與表身共用同一組 `grid-template-columns`**：`Rows` 改用 `columnTemplate()` 產生單一 `--cols`，表頭與表身套用同一個值；細項表 `.asstable__head, .assrow` 與續期表 `.renewtable__head, .renewrow` 亦收成同一條規則（舊版表頭 128px、表身 92px，天然對不齊）。
- **達下限即轉兩行制**：新增 820px 斷點段（涵蓋手機全寬，以及因 `100dvh` 收窄書頁的矮桌面視窗），細項表改為「項目全寬一行、主考＋日期並排下一行」，活動徽章表改為「名稱全寬一行、日期／證書／簽署下一行」，不再硬擠；桌面回單欄的舊規則（會把兩行制壓成單欄）已刪走。斷點段刻意排在樣式表末端，避免被後面的桌面規則蓋過。
- **簽署欄只按姓名計寬**：主考欄下限 96px（不預留「姓名＋職銜」）；署名 `small` 加上 ellipsis，不會撐爆欄位。
- **簽署視窗不再預填職銜**：`SignModal` 的所有呼叫點移除 `defaultTitle`；`SignatureBlock`／`Sig` 不再收 `defaultTitle`（職位欄保留給用戶自行填寫）。示範資料人名改為純姓名（`李團長` → `李樹明`）。持有人簽署改為預填本人姓名。
- **簽名圖同時限寬限高**：`.assrow__sigbtn img`、`.otrow__sig img`、`.renewrow__sigarea img`、`.sigblock__preview img` 全部補 `max-width: 100%`（只限高會越出欄外壓住鄰欄）。
- **窄欄不再顯示浮動小按鈕**：日期欄的「放大填寫」浮動鍵預設隱藏（原生日曆鈕已在右邊，再加會遮住日期），手機版主考欄鉛筆鍵改為 24×24 行內尺寸。
- **不使用 `container-type`／container query**：全書零 container query，改用百分比 `clamp` ＋ 斷點分段；避免 `position: fixed` 的簽署／放大填寫彈窗以書頁為包含塊而破版（測試鎖死）。
- 新增 `scripts/check_columns.py`：直接由 `styles.css` 抽出真實欄寬字串，按 CSS Grid §12（base size → maximize tracks → fr 分配）計算 320／360／390／430／768／1024／1440 各寬度下每欄實際 px，證明日期欄恆 ≥104px、名稱欄有上限、永不溢出。
- 新增 `tests/layout_and_update.test.mjs`：鎖定量度數字、欄寬寫法、兩行制位置、簽名圖限寬、`defaultTitle` 絕跡。

### 修正（Fixed）—— 自動更新：已加到主畫面後會自己換新版

- **四處版本號同步遞增**：`package.json` 2.0.1 → 2.1.0、`shared/book.js` `APP_VERSION`、`web/index.html`（`meta app-version`、`window.APP_VERSION`、標題、描述、開機畫面）、以及 **Service Worker 快取名 `scoutbook-cache-v2` → `v3`**（只改程式不改快取名，已安裝的 APP 永遠收舊版面）。
- **主動查更新**：`pwa.js` 保留 `visibilitychange`（切回前景即 `reg.update()`），另加開機即查、`focus`／`online` 事件，以及每 30 分鐘的背景輪詢；註冊時加 `updateViaCache: 'none'`，避免 HTTP cache 令更新永遠查不到。
- **偵測到新版即彈提示**：更新提示改為 `role="alertdialog"`，明示「已下載新版本 — 按一下即自動重新載入，毋須刪除或重裝 APP」，並提供「稍後」；首次安裝（無 controller）不會誤彈。
- **按下即更新**：`postMessage({ type: 'SKIP_WAITING' })` → SW `skipWaiting()` → `controllerchange` → 自動 `location.reload()`；另加 3 秒保險重載。SW 的 `install` 不自動 `skipWaiting`（新版先停在 waiting），`activate` 清走所有 `scoutbook-*` 舊 cache 後 `clients.claim()`。
- 手機版更新提示貼齊安全區、可換行，不再遮住底部翻頁膠囊。
- 新增 `tests/sw_update_flow.test.mjs`：以 vm 假物真跑 SW 生命週期與前台協定（install 不自動接管、SKIP_WAITING 才接管、activate 只清自家舊 cache、切回前景查更新、背景不查、提示只彈一次、controllerchange 只重載一次、首次安裝不誤彈）。

### 待辦（Todo；真機及紙本核實）

- 真機三寬度目測（390／768／1440）與列印實測仍未做；本版欄寬以「量度＋CSS Grid 演算法核算」驗證，未經真機目測。
- 第 12 項驗收（加到主畫面 → 部署新版 → 切背景再切回 → 見提示 → 按下自動重載）需在已部署環境人手做一次。

## [v2.0.1] - 2026-11-08

### 修正（Fixed）
- 按 2026 修訂綱要分級更新 D 部自選：L2/L3 三選一；L4/L5 增加危機及保護並支援四選二。
- 獎章細項加入中英雙語完成方式／專科徽章選單；選取已完成的專科徽章時，在細項日期空白的情況下自動帶入其完成日期。
- 增加回歸測試，檢查分級選項及所有細項選項的中英文標籤。

## [Unreleased]

### 變更（Changed）
- **圖標重設計（對齊家族版式）**：不再自創「書本卡片」，改為 VSBOOK／ROVERBOOK 同一基因——圓角布色方塊（radius 0.19）＋內嵌金線＋單色金浮雕（上方家族共用水滴環，下方支部圖案＝打開的紀錄冊）。四色以上、滿版、扁平。
- 依 G11 標準出齊 10 個 PNG／ICO 並**移除 SVG**（`favicon.svg` 及根目錄重複 favicon 全部刪走）：`icon-192-v2` / `icon-512-v2` / `icon-maskable-192-v2` / `icon-maskable-512-v2` / `apple-touch-icon-v2` / `favicon-16-v2`（手繪像素圖，非縮圖）/ `favicon-32-v2` / `favicon-48-v2` / `favicon-v2.ico`（16+32+48 三合一）/ `og-image-v2`；總體積 183.7 KB（≤ 260 KB）。
- 檔名一律加 `-v2`：`/icons/*` 設 immutable cache，換圖必換名，避免主畫面殘留舊圖。
- `index.html` 改為 G11 的 5 條 link ＋ 4 條 meta；`og:image` 改絕對網址；manifest 收成 4 個 icon（any 192/512＋maskable 192/512）；SW 預快取同步換名、`CACHE_NAME` 升 v2；`vercel.json` 為 `/icons/*` 加 immutable。
- 新增 `npm run icons`（`scripts/generate_icons.mjs` 重寫：零依賴 PNG/ICO 編碼器＋SDF 繪圖＋16px 手繪網格）。
- 新增 `docs/partner-scoutbadge.md`：給 scoutbadge 的配合清單（不用改／要改／請你決定）。

### 修正（Fixed）
- `og:image` 原本誤填姊妹 app 網域（`scoutbook.vercel.app`），改為本 app 真網址 `https://scoutbook-five.vercel.app/icons/og-image-v2.png`；同時補 `og:url` 與 `canonical`，三者同源。夥伴文件的 CORS 白名單同步更正。
- 新增測試：`og:image` 必須等於本 app 真網址、不得再出現姊妹 app 網域、`canonical`／`og:url`／`og:image` 必須同源。
- README 補「換圖標後主畫面要重加」的操作步驟（Android／iOS 各一）。
- 底部翻頁膠囊仍是姊妹倉 VSBOOK／ROVERBOOK 的酒紅底（`rgba(46, 7, 16, 0.9)`）—— 改為童軍綠 `rgba(8, 24, 15, 0.9)`。
- 同色系一併清零：舞台底部酒紅光暈（`rgba(150, 30, 52, 0.28)`）、離線／更新提示條、遮罩層、吐司、掃描框共 7 處；手寫墨由酒紅黑 `#24161c` 改回深童軍綠 `#143b28`。
- 新增回歸測試：`styles.css` 掃描紅相色值（僅放行語意錯誤色 `rgba(166, 38, 38)`），並鎖定手寫墨為 `#143b28`。

### 待辦（Todo；真機及紙本核實）
- 真機三寬度實測（390／768／1440）及列印實測（見 `docs/design-review.md` ROUND 2）—— 仍未測，不作聲稱。
- 核實：`SCOUTBADGE_ORIGIN` 預設值、scoutbadge 後端配合事項。

## [v2.0.0] - 2026-11-06

### 新增（Added）
- `shared/officialPages.js`：官方 1–110 頁藍本（群組／種別／獎章分頁／複示／實圖／紀錄欄）。
- 全文獎章綱要：領導才（7 項）／服務（4）／先修（10）／宗教（6 選 1）／社區（3），共 25 項只存本機，不入 scoutbadge 同步。
- `PaperBook.jsx`：110 頁數據驅動渲染（獎章頁全功能：細項＋複示＋自選圈選＋簽發；專科整組；紀錄專欄；靜態頁；續期；同意書）。
- 遷移鏈：v1.0→v1.1（舊表）→v2（p26→p014、續期→p006、活動行→p104／p106–p109、單行章級→分項回填）；舊鍵原位保留；`meta.pagev=3`。

- 個人頁 p001–p005 全功能（相片／SCOUT ID／簽署／緊急聯絡／出生證件／旅部／小童軍幼童軍／小隊職務／服務年星／轉旅搬遷；紙本無的欄如家長、性別、旅長只保留數據不顯示）。
- AYP p091–p101 全功能（參加頒發／銅銀野外鍛鍊 8 項前訓／實習及評核旅程／技能／康樂體育／服務科）。
- member 新增 birthPlace／passportNo／bloodType／emergencyAddr／groupPhone；scouting 新增 scoutRanks／stars；轉旅列紙本化（舊鍵保留）。

- 附錄遷入完成：卷首語（紙本意譯＋誓詞體會欄沿用 pages.p64）／制服圖（UNIFORM 22 圖例＋剔選沿用 pages.p63）／總覽（改列全部追蹤獎章）／說明（頁碼更新為 p001–p005、p102–p110）；列印返回鍵修正為 p001。
- 刪舊頁面模組 BookFront／BookTraining／BookSkills／BookL5／BookBack；OtherBadgeTable 搬入 components；誓詞正文只留官方第 9 頁。
- 測試 42/42。

### 變更（Changed）
- 整冊改為官方頁碼：`p001`–`p110` 逐頁對應紙本 1–110，刪除自創 66 頁工作版本；路由 `/p/p001`。
- 進度總覽改列全部追蹤獎章（含全文／專科／AYP 旁支），`badgeStats` 仍只計五大獎章，`scoutbadge` 同步範圍不變。
- 附錄頁面合併：卷首語／制服／總覽／說明／工具／版權聲明同在一頁，數據路徑 `pages.p63`–`p65` 原位保留（舊書零遷移）。

## [v1.2.0] - 2026-11-05

### 新增（Added）
- L2–L4 官方章圖：探索（綠）／標準（藍）／高級（紅）接入三獎章開卷頁；`official/` 集齊七圖，測試驗 PNG 檔頭。
- 紙本對照表 `docs/paper-mapping.md`：官方 PDF（111 頁＝卷首語＋編號 1–110）逐段對數位 66 頁，並誠實列出四個已知缺口（AYP、全文獎章、途徑圖、紀錄專欄）。

### 待辦（Todo）
- 是否按紙本 110 頁全面重排，待用戶決定（見 `docs/paper-mapping.md`）。

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
