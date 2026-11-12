# CHANGELOG.md — 版本變更紀錄

## v2.1.3

- 示範紀錄冊改為虛構的總領袖申請及表格列印測試資料；所有列印表格加上樣本提示，不放真實簽名，示範冊停用 scoutbadge 同步介面。
- 修正 PT/18 表格內的舊版徽章頁碼提示。

## v2.1.2

- 修正目錄及列印選單沿用其他版本的頁數；頁數改由資料模型提供，並說明整本列印包含目錄及附錄。
- 修正列印清單與附錄的舊版頁碼，提醒申請時核對 PT/18 和紀錄冊版本。


本專案採用語義化版本（Semantic Versioning），每次更新同步對齊 `package.json`、`shared/book.js` 及 `web/index.html`。

## [v2.1.1] - 2026-11-10

對齊姊妹倉 CUBSBOOK 同日的改動（PR #7）。CUBSBOOK 該次改動中的「家長連接頁」不適用於本倉：SCOUTBOOK 不設家長模式（測試亦禁止），所以沒有對應檔案。

### 變更（Changed）—— scoutbadge 進度檔：必須先連接並登入，才可匯出或匯入

- **行為變更**：數位附錄同步卡的「匯出『待領袖核實』進度檔」與「從 scoutbadge 匯入『領袖已核實』進度檔」兩個按鈕（連同檔案輸入框），只在**已連接並登入 scoutbadge** 後才出現。未連接時原位改為鎖定提示，說明原因並指明下方「完整紀錄冊備份與換機轉移」仍可離線使用；獨立模式（純靜態主機、無 `/api`）另有專用字句。
- **鎖定不只靠隱藏按鈕**：`onExportFile`／`onImportFile` 本身先檢查連線（`token` 與 `ymis`），未連接即拒絕並提示；殘缺的登入狀態（例如只有旅團編號、沒有 token）不算已連接。
- **其他入口一併收緊**：封面歡迎頁的「匯入備份」以往會把 scoutbadge 進度檔直接匯入一本新紀錄冊，等於繞過同步卡；現在只還原完整紀錄冊備份，選到進度檔會提示「先建立或開啟紀錄冊，並於數位附錄連接 scoutbadge」。選單內一段沒有按鈕可觸發的 scoutbadge 匯入程式（隱藏的檔案輸入框）已刪除；選單「匯入備份」的檢查由「有 `member`」收緊為「同時有 `member` 與 `pages`」（與歡迎頁一致），選到進度檔時同樣給出指引。被拒絕的檔案可即時重選（檔案輸入框會重設）。
- **完整紀錄冊備份與還原不受影響**：不需要網絡、不需要 scoutbadge，獨立模式下照常可用。
- 治理文件同步改寫：`AGENTS.md` §3 第 1 條、`SCOPE.md`「獨立性原則」第 2 條原本寫明獨立模式須「保留本機／離線 JSON 交換」，現改為「完整備份與還原照常可用；scoutbadge 進度檔須先連接」。取捨記於新增的 `docs/adr/0003-badge-progress-files-require-connection.md`（包括：沒有網絡時不能再以 JSON 檔與領袖交換進度，當面核簽改用離線二維碼；這是流程上的閘門而非安全邊界）。

### 新增（Added）—— 連接表單自動讀取已登記旅團；找不到即引導開戶

- **已登記旅團選單**：連接表單的旅團欄由手動輸入改為下拉選單，清單由 `GET /api/scoutbadge` 於伺服器端向 scoutbadge 的 `GET /api/troops` 自動讀取（零金鑰）。按編號排序（純數字編號按數值，其後為英數編號）、顯示「編號 · 名稱」、獨佔一行；有多個旅團時**不代為預選**，只有一個時直接選取。旅團編號逐字比對，不補零、不去零。
- **找不到旅團**：選單最後一項「找不到我的旅團」及標籤旁的「找不到旅團？」會打開開戶提示，提供「前往 scoutbadge 開戶」（另開分頁，`rel="noopener noreferrer"`）與「重新讀取旅團清單」。該選項值永遠不會當作旅團編號送出。
- **清單為空／暫時讀不到清單**：`GET /api/scoutbadge` 新增 `upstreamOk`，介面據此分辨「真的沒有已登記旅團」與「暫時讀不到清單」（HTTP 錯誤、逾時、非 JSON、`troops` 不是物件），各有標題；兩種情況都另設「手動輸入旅團編號」作後備。
- **清單過濾**（與家族一致，scoutbadge 現行輸出尚未使用這兩個欄位）：略過 `connected === false` 的旅團；帶 `_aliasOf` 的別名鍵只在主鍵本身會被列出時才略過——主鍵缺席、未接通、沒有名稱或本身亦是別名時照樣列出，去重絕不會令旅團從選單消失。
- **開戶連結只接受 https**：連結目標取自橋接回報的來源；不是 https（例如本機測試位址）或帶帳密的網址一律退回預設 `https://scoutbadge.vercel.app`。
- 介面細節：欄位標籤以 `useId` 連到選單、連接按鈕帶 `aria-expanded`、選了「找不到旅團」後收起編號／密碼／送出欄位、未連接時空的按鈕列不佔位、送出按鈕獨佔一行（英文標籤不再被擠成兩行）、列印時不印鎖定與開戶提示。

### 修正（Fixed）

- **同步卡樣式沒有生效**：v2.1.0 的樣式表寫成姊妹倉的 `.vsbsync__*`，元件用的卻是 `.scoutsync__*`，統計列、登入表單、檔案列其實沒有套用樣式。現已改正，並以測試鎖定「元件用到的類別」與「樣式表有規則的類別」一一對應。
- **Toast 在手機上被擠成窄柱（全站）**：容器原本以 `left: 50%` ＋ `translateX(-50%)` 置中，闊度因而被限死在視窗的一半；`390` 闊度下一則稍長的訊息會變成 195px 闊、5 行高。改為 `left／right: 12px` 後置中，同一則訊息變為 366px 闊、2 行；單行仍是膠囊形。本版新增的引導訊息較長，所以一併修正。
- **`SCOUTBADGE_ORIGIN` 預設值已核實**：`https://scoutbadge.vercel.app` 確為 scoutbadge 的正式網址（GitHub Production 部署 success；首頁與 `GET /api/troops` 均實際回應）。README、`.env.example`、`docs/p1-research.md` 的「待核實」字眼已更新。
- **`.env.example` 的個別旅團鍵名寫錯**：範本寫 `NAME_EN`／`ORIGIN`，程式實際讀的是 `NAME`／`EN`／`BACKEND`／`APIKEY`（三項必填齊備才生效）。已按程式更正並補上說明。
- `docs/partner-scoutbadge.md`：`GET /api/troops` 的 `troops` 是以旅團編號為鍵的**物件**（文件原寫陣列）；並更正「BOOK 會從瀏覽器直連 scoutbadge」的說法（實際全部經同源 `/api/scoutbadge` 於伺服器端轉發）、註明 `legacyIds` 別名對應 BOOK 尚未實作。

### 版本

- **四處版本號同步遞增**：`package.json` 2.1.0 → 2.1.1、`shared/book.js` `APP_VERSION`、`web/index.html`（`meta app-version`、`window.APP_VERSION`、標題、描述、開機畫面）、Service Worker 快取名 `scoutbook-cache-v3` → `v4`。

### 測試

- `npm test` 64 → **70** 項。新增：橋接的清單過濾／別名去重／`upstreamOk`（含與物件內建屬性同名的旅團編號）；同步卡純函式（https 連結、旅團排序、不代選、備份檔與進度檔分類）；鎖定契約（介面分支＋處理函式的檢查次序、其他入口不得匯入進度檔）；樣式類別一一對應、列印隱藏、`<Icon>` 名稱必須存在於圖示表、Toast 版面。
- 另以 41 項人手變異（逐一弄壞實作後重跑測試）核對新測試確實會失敗：40 項被測試捉到，餘下 1 項為行為等價的寫法（以 `in` 取代 `hasOwnProperty`，因其後仍會檢查條目類型而結果相同）。
- 瀏覽器驗證（沙盒無頭 Chromium、模擬 scoutbadge 上游，對正式建置）：主流程 303／303、窄螢幕版面 260／260、跨頁流程 36／36；方法、對比度與限制見 `docs/design-review.md` ROUND 4。

### 待辦（Todo；真機及線上核實）

- **未在真機測試**：以上瀏覽器驗證用的是沙盒內的無頭 Chromium 與模擬的旅團清單，並非 iOS／Android 實機；原生下拉選單的外觀、觸控、實際列印仍待目測。
- **未對線上 scoutbadge 實測登入**：線上只核對過網址與旅團清單格式；登入、讀取、申報沿用既有流程，本版沒有改動，但亦沒有用真帳戶再測。
- scoutbadge 的旅團清單要待其管理員登記並重新部署後才更新，回應亦設有邊緣快取；剛登記的旅團未必即時出現，「重新讀取旅團清單」不保證立刻見到。
- 既有問題，本版沒有處理：封面歡迎頁的成功提示（「備份已還原」等）因頁面隨即切換而不會顯示；正式建置首次開啟時 Service Worker 接管會令頁面自動重載一次，可能清走歡迎頁正在輸入的內容；旅團改編號後的 `legacyIds` 對應尚未實作。

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

### 修正（Fixed）—— 收工閘門：多檔建置入口不再被誤判

- **問題**：`scripts/audit_single_html_v1.0.mjs` 的 V1 規則要求「檔名帶 `_vX.Y`」。本專案是 Vite 多檔建置，`dist/index.html` 只是入口殼（程式在 `/assets/*.js`），硬要它改名帶版號會令 Vercel（`cleanUrls`／`outputDirectory: dist`）及靜態主機找不到首頁。因此只要 `dist/` 未清走就跑到 `final_check`，就會出現假的 `FINAL CHECK FAIL`（`rm -rf dist` 後則全綠）。
- **修法**（窄例外，不外溢）：新增 **V4 例外之二**——`index.html` 同時具備 `<script type="module" src="/assets/…">` 外部 bundle 時，視為多檔建置部署入口，不判 V1 失敗，改以 INFO 說明；版本真理仍由 `meta app-version`、`APP_VERSION`、SW 快取名硬檢（V2 規則不變）。
- 例外只認檔名 `index.html`；真・單檔 HTML（無外部 bundle）、以及其他檔名一律照舊要求 `_vX.Y`，不會被放生。
- 新增 `tests/audit_gate.test.mjs`（4 項）鎖住例外邊界：建置入口放行、單檔 HTML 仍 FAIL、非 `index.html` 不適用、V2 仍然硬檢。
- 結果：`final_check` 無論「先 build 後跑」抑或「先 `rm -rf dist` 後跑」都全綠；`preflight_v1.0.mjs` 由 7/8 變 **8/8 PASS**。

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
