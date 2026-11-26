# ADR 0005 — 指定入口白名單（Store Gate）

- 狀態：已採用（2026-11-26）
- 決策者：維護者（依治理真理倉 `playerkousas-rgb/readme` 的 SG1–SG19 及 VSBOOK `v1.0.7` 做法）
- 相關：[ADR 0004 服務平台 iframe 嵌入白名單](0004-portal-iframe-embedding.md)、[`README.md`](../../README.md)、[`store_gate_v1.0.js`](../../web/public/store_gate_v1.0.js)

## 背景

BOOK 系列（`SCOUTBOOK`／`CUBSBOOK`／`VSBOOK`／`ROVERBOOK`）用家手上係**真實紀錄**（成員進度、考章、服務時數），全部存在裝置自己的 `localStorage`。治理倉把這一類 App 歸入「管制宜寬鬆」（SG2／SG11-a），並且：

- **不可以**用 `iframe-only`（純 iframe 白名單）：iOS 主畫面開 App 屬頂層導覽，會被閘踢走；跨站 iframe 亦會令儲存分家、ITP 有機會清走資料（SG2 五類禁區第一、二項）。
- **可以**用頂層跳板 `entry-gate`：子站保留自己的一等網域，`localStorage`、PWA、Cookie 全部照舊，只係「唔經入口嘅直接開啟」顯示白名單提示卡（SG5）。

治理倉同時定案：所有新 App 落地都要內置「讚好／收藏」一鍵返回 APP STORE 詳情卡（SG18，2026-11-21 起不分 A／B／C 組），子 App **嚴禁**直連主站資料庫或自行呼叫統計函數。

## 決策

1. **採用治理倉的 `store_gate_v1.0.js`，原樣複製，不在地修改閘邏輯。**
   來源：`playerkousas-rgb/readme` @ `6ebfdd72a1ea5a5e83df4a6644fc66d0236df98e` 的 `templates/vercel/store_gate_v1.0.js`，落到 `web/public/store_gate_v1.0.js`（Vite 會複製到 `dist/`）。與 VSBOOK `v1.0.7` 做法一致：App 只透過 `initStoreGate()` 傳入設定，入口註冊表（`PORTAL_REGISTRY`）由真理倉單一維護。
2. **模式：`entry-gate`。** 不用 `iframe-only`、不用 `closed`（軟關站要另經用戶確認）。
3. **SCOUTBOOK 的設定（`web/index.html`）**

   ```js
   initStoreGate({
     appKey: 'scoutbook',
     mode: 'entry-gate',
     portalIds: ['appstore'],
     silentPortalIds: ['member'],
     allowStandalone: true,
     autoRedirectSeconds: 0,
   });
   ```

   - `appKey: 'scoutbook'`：工作階段通行證存於 `sessionStorage['scoutbook.store_pass']`，不寫入紀錄冊，亦不會與其他 BOOK 互通。
   - `portalIds: ['appstore']`：SG17 — BOOK 類只需認 APP STORE 做入口；分享連結／QR 由 APP STORE 產生（SG9）。
   - `silentPortalIds: ['member']`：成員系統是**唯一例外**——`Referer` 照樣放行，但**卡上唔提、唔畫掣**（silent）。原因見下節：成員系統本身公開，又已內置四本 BOOK，成員永遠有路入；但一旦把佢寫成白名單卡上的按鈕，普通人就會學到「可以由成員系統入」，落架開關即失效。圖書館**不列入**放行來源（與 VSBOOK 的 `['library','member']` 不同），令 APP STORE 落架後普通人真係入唔到；如日後想恢復圖書館引流，只在 `silentPortalIds` 加一個 `'library'` 即可。
   - `allowStandalone: true`：SG11-a — 已加入主畫面的用家、以及直接開網址的現有用戶，紀錄照用得；閘只擋「新開、無入口、無通行證」的工作階段。
   - `autoRedirectSeconds: 0`：不自動跳轉，用家自己揀（自動跳會令「我只是想開自己的紀錄冊」的用家失去控制）。
   - **本機開發例外**：`location.hostname` 為 `localhost`／`127.0.0.1`／`[::1]` 時用 `mode: 'open'`，否則 `entry-gate`。這是唯一一行與 VSBOOK 設定不同的地方 —— 唔加就 `npm run dev` 一開就被自己的閘擋住。Vercel Production／Preview 主機名不是 localhost，一律照行 `entry-gate`。
4. **啟動保護**：`web/src/main.jsx` 只在 `document.documentElement` 沒有 `data-store-gated` 時才掛載 React 及註冊 PWA，避免先閃一閃紀錄冊或裝出一個打不開的主畫面圖示。
5. **離線快取**：`web/public/sw.js` 把 `/store_gate_v1.0.js` 放入 `SHELL` 並以 cache-first 提供，令離線開 App 一樣判斷得到入口；`vercel.json` 的 SPA rewrite 明確排除該檔，避免被吞成 `index.html`。
6. **讚好／收藏（SG18）**：新增 `web/src/components/StoreSupport.jsx`，網址由 `ScoutStoreGate.getAppStoreUrl('scoutbook')` 產生（零寫死網址、零跨倉密鑰），讀不到閘腳本時整粒掣隱藏。slug `scoutbook` 已對照主站 migration `20261116-app-slug-seed.sql`（`scoutbook-five.vercel.app → scoutbook`）。頂欄與歡迎頁各放一次，列印時隱藏。

## 落架開關：APP STORE 一落架，普通人就入唔到

用戶定案（2026-11-26）：保留入口白名單的真正目的，是日後「無人用就喺 APP STORE 落架」時，可以一次過令**普通人**用唔到，而唔需要改程式：

| 動作 | 效果 |
| :--- | :--- |
| APP STORE 落架（Delist） | 卡上唯一按鈕帶去 APP STORE 亦搵唔到本 App → 普通人沒有入口，`entry-gate` 擋住直開（卡上唔需要額外文案） |
| 成員系統（例外，靜默） | 本身公開、又內置四本 BOOK，成員仍可由 `/books` 內嵌或開啟 BOOK 進入；**卡上永不顯示**，所以不構成「公開後門」的宣傳 |
| 已加入主畫面（`allowStandalone`） | 已裝用家照用 —— 佢哋手上有真實紀錄，唔可以因為落架而失去更新／匯出（SG11-a） |
| 要連例外都關 | 改用 `mode: 'closed'`（維護卡）或 Vercel Pause；**落架前先叫用家匯出 JSON 備份** |
| 不可用 | `iframe-only`（會踢走已裝主畫面用家，亦令儲存分家） |

> 圖書館、區管理系統、GEMINI 一律**不是**本 App 的放行來源：任何一個公開入口都會令「落架＝普通人入唔到」失效。

## 與 ADR 0004（iframe 嵌入白名單）的關係

兩者並存、互不取代：

| | ADR 0004 | ADR 0005 |
| :--- | :--- | :--- |
| 管什麼 | **被誰嵌入**（`Content-Security-Policy: frame-ancestors`） | **由哪裡開啟**（頂層導覽的入口來源） |
| 執行位置 | 部署回應標頭 | 前端 `<head>` 腳本（React 之前） |
| 對儲存的影響 | 平台內與獨立版**分開儲存** | **零影響**（子站自己一等網域） |
| 本機開發 | 無作用（Vite dev 不套用 `vercel.json` 標頭） | `localhost`／`127.0.0.1` 自動用 `open` |
| 可否當安全邊界 | 是（瀏覽器強制） | **否**（前端導流，可被繞過） |

## 設計目標：擋一般用家，唔係擋技術人員

用戶定案（2026-11-26）：「我係擋普通人唔係技術人員。」本閘只負責「唔好令人誤打誤撞由唔應該嘅入口入」，唔係防線：

- **要擋嘅人**：收到轉發連結、開舊書籤／搜尋結果、唔知要由 APP STORE 入嘅一般成員同家長。佢哋見到提示卡會按掣去 APP STORE，唔會識改 `sessionStorage` 或偽造 `Referer`。
- **唔打算擋嘅人**：識用 DevTools 嘅技術人員。改 `sessionStorage['scoutbook.store_pass'] = '1'`、自行設定 `Referer`、或用自動化瀏覽器都入得到；**呢點係已知並接受**。所以：
  - 唔加後端 `/api/enter` 驗票、唔加簽名 Cookie、唔加反調試／代碼混淆（依 SG12：唔為「防抄」過度工程）；
  - 閘腳本載入失敗時 **fail-open**，寧願放行都唔好鎖死用家手上嘅紀錄；
  - 真正嘅資產（紀錄冊）本來就喺用戶自己部機，繞過閘只係「唔經入口用」，唔等於資料外洩或可以改到別人嘅資料。
- **仍然要守嘅部分**：`/api/leader`（`LEADER_CODE`，`crypto.timingSafeEqual`）同 scoutbadge 純進度契約照舊運作，**唔靠**呢個閘；將來若有收費或敏感資料，另設後端驗票。
- **卡片文案一律用治理倉預設**（SG19 簡短人話版：「需經由 SCOUT APP STORE 開啟」／「請按下方按鈕前往 APP STORE 開啟。」），與其他 App 完全一致，**不**加 `customTitle`／`customMessage`。用戶定案（2026-11-26）：「唔洗係卡片寫，就好似其他 APP 甘指番去 APP STORE，佢去到 APP STORE 發現落左架咪入唔到」—— 落架後撳掣去 APP STORE 都搵唔到本 App，普通人自然入唔到，卡上唔需要額外解釋。

## 誠實限制

- **不是身份驗證或安全邊界。** 技術人員可以偽造 `Referer`、改 `sessionStorage`（見上節，屬接受範圍）；`/api/leader` 與 `/api/scoutbadge` **不受此閘保護**（本身另有 `LEADER_CODE` 及純進度契約）。
- **Fail-open 與 fail-closed 的分工**：閘腳本載入失敗（離線、舊快取、被攔截）時紀錄冊維持可用（不影響成員手上嘅紀錄）；但未知 `mode` 會 fail-closed，避免串錯字靜默開閘。
- **新工作階段／新分頁**：`sessionStorage` 通行證不跨分頁繼承，可能再次見到白名單卡；由任一入口進入即可。
- **`#v=` 分享連結**：若被攔截，返回主站會失去片段；領袖要先經入口進入，再重新開啟分享連結。
- **`noreferrer` 入口**：成員系統現時連結仍帶 `noreferrer`（清空 `Referer`），所以由 `/books` 直接跳入 BOOK 有機會被擋；成員可改為在成員系統內以內嵌方式使用 BOOK（同一頁 iframe），或先由 APP STORE 進入一次。治理倉 §4.4-11 有記錄。
- **不可用此閘保護未備份的資料**：BOOK 類下架前仍須保留可達入口、開 `allowStandalone`、並先叫用家匯出 JSON 備份（SG11-a）。
