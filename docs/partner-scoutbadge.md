# 給 SCOUTBADGE 的配合清單（SCOUTBOOK v2.0.0）

> 寫給姊妹倉 `playerkousas-rgb/scoutbadge`（旅團進度系統）的對接文件。
> 目的：v2.0.0 把紀錄冊由「自創 66 頁」改為「紙本官方 110 頁」，同步面**刻意零改動**；
> 以下列出「不用改」、「要改」與「想請你決定」三份清單，逐項可勾。

---

## 0. 一句話

**同步協議、項目編號、隱私邊界全部不變**；改動只在「BOOK 的網址／頁碼」與「新增但不上傳的獎章」，
所以 scoutbadge 只需處理 **深層連結、CORS、錯誤碼、冪等** 四件事。

---

## 1. 不用改（請勿跟改）

| 項目 | 現況 | 理由 |
| --- | --- | --- |
| 項目編號 | `L1-*`…`L5-*`、`OT-*`、`SC-*-*` 全部照舊 | BOOK 以 `toBadgeId()` 轉成官方編號，你是唯一真相；你改名＝全員歷史紀錄斷鏈 |
| 五大獎章同步範圍 | L1–L5 仍然只同步這五個 | BOOK 新增的全文獎章（`OT-LD/SF/VS/RG/CM`）與 AYP **只存本機，不上傳** |
| 個人資料 | BOOK 端已硬性剝除姓名、電話、地址、家長、相片 | 伺服器端仍會二次清洗，你毋須配合 |
| 寫入方向 | BOOK 只送 `requestComplete`，永不直接寫已核實進度 | 團長在 scoutbadge 按 CONFIRM 才是完成 |
| 二維碼協議 | `SB1.` / `SB1P.` / `SB1S.` 未改 | 純離線核簽，與你無關 |
| `load` 回傳欄位 | `progress` / `flatProgress` / `otherBadges` / `pendingRequests` 照舊讀 | BOOK 只認這四個 |

---

## 2. 需要 scoutbadge 配合（4 項，全部可獨立做）

### 2.1 CORS：放行 BOOK 網域

> **更正（SCOUTBOOK v2.1.1）**：BOOK 現行版本的瀏覽器**不會**直接呼叫 scoutbadge。旅團清單、登入、讀取
> 及申報全部經 BOOK 自己的同源 `/api/scoutbadge` 在伺服器端轉發（`GET <origin>/api/troops`、
> `POST <origin>/api/proxy`），瀏覽器唯一接觸 scoutbadge 的地方是「前往 scoutbadge 開戶」這條另開分頁
> 的普通連結。所以 CORS **不是** BOOK 運作的前提；你已放行的白名單可以保留（無害），日後 BOOK 若改為
> 瀏覽器直連才會用得着。以下為原來的要求，留作紀錄：

```http
Access-Control-Allow-Origin: https://scoutbook-five.vercel.app
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

- 需要回 `OPTIONS` 204。
- 若你日後有自訂網域，請一併加入白名單（BOOK 會用 `SCOUTBADGE_ORIGIN` 環境變數覆寫）。
- **不要**用 `Access-Control-Allow-Origin: *` 搭配 credentials；BOOK 不用 cookie，用 token。

### 2.2 `GET /api/troops`：旅團下拉選單的契約

BOOK 的「已登記旅團」下拉選單由這支 API 自動讀取（BOOK 伺服器端的 `GET /api/scoutbadge` 代為請求，
零金鑰）。現行契約（2026-11-10 按線上回應核實）——`troops` 是**以旅團編號為鍵的物件**，不是陣列：

```json
{
  "success": true,
  "troops": {
    "0082": { "id": "0082", "name": "港島第82旅", "legacyIds": [] }
  },
  "legacyIds": {}
}
```

BOOK（v2.1.1 起）怎樣使用這份清單：

- **`troops` 必須是物件**：陣列、`null`、缺欄位、非 JSON 或非 2xx 一律視為「暫時讀不到清單」
  （BOOK 回報 `upstreamOk: false`，介面顯示「暫時未能讀取已登記旅團清單」＋重新讀取），不會當成「沒有旅團」。
- **只取 `name`（必填）與 `en`（選填）**；其他欄位（`legacyIds`、後端網址、金鑰等）一律不轉給瀏覽器。
  沒有 `name` 的條目不列入選單。
- **旅團編號逐字比對**：不補零、不去零，`0082` 與 `82` 是兩個不同旅團。
- **`connected: false`**（選填）：若某旅團已登記但後端未接通，可加此旗標，BOOK 便不會把它列入選單。
  只有明確的布林值 `false` 才生效。
- **`_aliasOf: "<主鍵>"`**（選填）：若同一旅團以兩個鍵輸出（例如 `0082` 與 `82`），請在別名鍵加上此標記，
  BOOK 便只列主鍵一次。主鍵不在清單、未接通、沒有名稱或本身亦是別名時，BOOK 會照樣列出別名
  ——去重絕不會令一個旅團從選單消失。
- 清單讀取成功但找不到用戶的旅團（或清單為空）時，BOOK 會引導用戶前往 scoutbadge 開戶及登記旅團。
- `id` 必須**穩定不變**（BOOK 會把 `id` 存在本機 `scoutbook.scoutbadge.member.v1`）。
- `legacyIds`：你已在回應提供；**BOOK 目前尚未使用它做別名對應**——若旅團改了 `id`，用戶現時要重新選擇
  旅團並登入一次。

你現時的輸出沒有 `connected`／`_aliasOf`／`en`，BOOK 會原樣列出全部有名稱的旅團；這兩個旗標只是預留
（與姊妹系統 `cubsbadge` 的輸出格式一致），毋須為 BOOK 而改。

### 2.3 錯誤碼：請回機器可讀 `code`，不要只回中文訊息

BOOK 會把錯誤翻譯成中／英並給「重試」按鈕，靠的是 `code` 而非訊息文字：

| `code` | 意思 | BOOK 的行為 |
| --- | --- | --- |
| `AUTH_EXPIRED` | token 過期 | 靜默重新 login 一次，再失敗才提示 |
| `NOT_FOUND` | 成員／項目不存在 | 提示「請在 scoutbadge 確認編號」 |
| `RATE_LIMITED` | 太頻繁 | 顯示「請 1 分鐘後再試」 |
| `VALIDATION` | 參數不合法 | 顯示欄位錯誤，不重試 |
| 其他／無 `code` | 未知 | 顯示通用錯誤＋重試 |

現時 BOOK 靠 HTTP status + `error` 字串猜，容易誤判（例如把「已提交過」當失敗）。

### 2.4 `requestComplete` 必須冪等

露營現場訊號差，BOOK 會**重試同一批**（最多 200 項／批，30 秒 timeout）。請以
`(ymis, itemId, requested_date)` 為唯一鍵：

- 已有同鍵 pending 記錄 → 回 `{ success: true, duplicate: true }`（不要當錯誤）。
- 這樣 BOOK 重試不會在老師的待批清單裡堆出重複項。

---

## 3. 想請你決定（3 項，影響你未來的功能，不急）

### 3.1 BOOK 深層連結：頁碼由 `p01–p66` 改為 `p001–p110`

BOOK v2.0.0 路由改為 `/p/p001` … `/p/p110`（1:1 對應紙本）。若 scoutbadge 有任何
「在紀錄冊打開第 N 頁」的連結或教學截圖：

| 舊 | 新 | 說明 |
| --- | --- | --- |
| `/p/p01` | `/p/p001` | 個人資料首頁（規則：舊 1–61 → 新 2 位數 + `0` 前綴） |
| `/p/p26` | `/p/p014` | 投資典禮紀錄搬到紙本第 14 頁 |
| `/p/p34` | `/p/p060` | L5 章節起點 |
| `/p/p50` | `/p/p078` | 專科徽章起點 |
| `/p/p64` | `/p/p009` | 誓詞與規律（正文現只在官方第 9 頁） |

完整 66→110 對照在 BOOK 的 `docs/paper-mapping.md`；程式化對照用 `shared/book.js` 的
`PAGE_ID_MIGRATION` 與 `migratePageId()`（BOOK 內建兩段式遷移，舊書照開）。
建議：**連結用「頁碼常數」而非硬編字串**，或直接連 `/p/contents` 讓 BOOK 自己跳。

### 3.2 新增獎章：要不要納入同步？

BOOK 現在有、但**不入同步**的：

- 全文獎章 5 個：`OT-LD`（領導才 7 項）、`OT-SF`（服務 4 項）、`OT-VS`（先修 10 項）、`OT-RG`（宗教 6 選 1）、`OT-CM`（社區 3 項）
- AYP 銅章／銀章（`AYP-BRONZE`、`AYP-SILVER` 兩個資格 ＋ 各 8 項前訓、旅程、技能、康體、服務）

你若要接手（旅團層面本來就應該看得見全文獎章），請提供：

1. 官方項目編號（沿用你現有命名規則）；
2. 誰有權核實（團長／專科教練／AYP 評核員）；
3. `load` 回傳是否包含它們（BOOK 會自動認得，因為 `isKnownItem()` 讀你的 `ITEM_INDEX`）。

在你有決定之前，BOOK 會把它們標示為「本機紀錄，未上傳」。

### 3.3 BOOK JSON 匯出格式 v3

若 scoutbadge 有「匯入 BOOK 備份」功能（或未來想做），請同時支援兩個版本：

| 欄位 | v2（舊） | v3（現） |
| --- | --- | --- |
| `meta.pagev` | 2 | **3** |
| `pages` 鍵 | `p01` … `p66` | **`p001` … `p110`** |
| `transfers[]` | `fromGroup` / `toGroup` / `note` | 新增 `group` / `leaderName` / `leaderPhone`（舊鍵保留） |
| 個人資料 | — | 新增 `member.birthPlace` / `passportNo` / `bloodType` / `emergencyAddr` / `groupPhone`、`scouting.scoutRanks` / `stars` |
| `<5 大名>` 不變 | `progress` / `otherBadges` | **不變**（你只會用到這兩個） |

判斷版本：`meta.pagev === 3` 或 `pages` 首鍵符合 `/^p\d{3}$/`。

---

## 4. 驗收（BOOK 這邊已經自動測）

| # | 情境 | 期望 |
| --- | --- | --- |
| 1 | `load` 回傳含姓名／電話 | BOOK 丟棄，只留 `scoutId` + 進度 |
| 2 | `save` / `approve` 等寫入動作 | BOOK 代理層直接 403，永不轉發 |
| 3 | 同一項目重複提交 | BADGE 回 `duplicate: true`，不重複入 pending |
| 4 | token 過期 | 回 `AUTH_EXPIRED`，BOOK 自動重登一次 |
| 5 | 200 項一批 + 30 秒 timeout | 分批成功／失敗逐項回報，BOOK 只重送失敗項 |
| 6 | 旅團 id 改名 | 用 `legacyIds` 對應，用戶不用重選（**BOOK 尚未實作**：現時用戶須重新選擇旅團並登入） |

BOOK 端的契約測試在 `tests/scoutbadge_sync.test.mjs`（SB1 編解碼、403 封鎖、PII 剝除、
`SCOUTBADGE_ORIGIN` 清洗）；你那邊若有對應測試，兩邊一起跑就等於端到端。

---

## 5. 給你的三個「不要」

1. **不要**因為 BOOK 換了頁碼就跟著改項目編號（`L1-*` 等）——那是歷史紀錄的錨。
2. **不要**把 BOOK 送來的 `requestComplete` 當成已完成（`status: pending` 才是正解）。
3. **不要**在 `load` 回應塞個人資料「方便顯示」——BOOK 會全部丟棄，你只是白做。

---

_最後更新：SCOUTBOOK v2.1.1（2026-11-10：§2.1、§2.2 及 §4 第 6 項按現行程式與線上回應更正；其餘章節仍為 v2.0.0／2026-11-06 的內容）。有疑問直接在本 repo 開 issue，或看 `api/scoutbadge.js` 的檔頭契約。_
