# GLOSSARY.md — 統一詞彙表

全倉程式碼、介面文案、測試與文件統一使用下列名稱，嚴禁混用同義舊稱。

| 繁體中文（標準名稱） | English (Canonical) | 程式碼鍵名／常數 | 定義與備註 |
| :--- | :--- | :--- | :--- |
| **童軍紀錄冊** | Scout Record Book | `SCOUTBOOK` | 香港童軍總會童軍支部個人紀錄冊（紙本；據 `PT/18` 查閱清單，總領袖獎章考驗紀錄佔第 50–62 頁；數位版自創頁序 L5 在 p34–p46），另設數位附錄。 |
| **童軍成員編號** | Scout ID | `scoutId`（同步 `memberNo`） | 成員唯一編號（總會 YMIS 內 10 位數字），與 `scoutbadge` 統一；容忍前導零（`0012345678` ≡ `12345678`）；舊稱 `ymis` 只作讀取相容。 |
| **童軍團** | Scout Troop | `troop` / `unit` / `group` | 成員所屬童軍單位（隸屬地域 `region`、區 `district`、旅 `group`）。 |
| **小隊** | Patrol | `patrol` | 童軍團內小組；成員直屬單位。 |
| **小隊長** | Patrol Leader (PL) | `pl` | 帶領小隊之成員。 |
| **童軍團長** | Scout Leader (SL) | `sl` | 負責領導童軍團、按年簽署續期及核實進度之成人領袖；可提名 `PT/18` 申請。 |
| **旅長** | Group Scout Leader (GSL) | `gsl` | 所屬童軍旅之領袖，可與童軍團長共同提名 `PT/18` 申請。 |
| **會員章** | Membership Badge | `L1`（`L1-M1`…`L1-M11`，11 項） | 進度性獎章第一階。 |
| **童軍探索獎章** | Scout Pathfinder Award | `L2`（14 項） | 第二階；A 戶外挑戰／B 個人發展／C 領導才與靈性發展／D 服務與環境。 |
| **童軍標準獎章** | Scout Standard Award | `L3`（16 項） | 第三階；A／B／C／D／E 國際視野／F 探索新知。 |
| **童軍高級獎章** | Scout Advanced Award | `L4`（17 項） | 第四階；A／B／C／D／E／F。 |
| **總領袖獎章** | Chief Scout's Award | `L5`（17 項） | 童軍支部最高進度獎章；A／B／C／D／E／F。 |
| **選修項目** | Elective options | 戶外／海上／航空三選一；社區認識／生態環境／氣象三選一 | 各進度性獎章選項須相同；海童軍必選海上、空童軍必選航空。 |
| **專科徽章** | Proficiency Badge | `SC-INT-*`／`SC-PUR-*`／`SC-SER-*`／`SC-INS-*`／`SC-SEA-*`／`SC-AIR-*`／`SC-OTH-*`（143 種） | 興趣／技能／服務／教導／海上／航空／其他七組；BOOK 鍵＝官方編號原文。 |
| **總領袖獎章及證書申請表** | Chief Scout's Award Application (`FORM PT/18`) | `pt18` | 官方表格 `FORM PT/18 (10/2025)`；甲部個人資料、乙部選修項目、丙部專科／活動徽章紀錄、丁部訓練紀錄。 |
| **童軍專科徽章／獎章考驗申請表** | Proficiency Badge Assessment Application (`P120A1`) | `p120a1` | 官方表格 `P120A1 (10/2009)`；甲部申請人＋團長副署、乙部主考及資歷、丙部考驗結果、丁部簽發。 |
| **童軍專科徽章／獎章考驗附加資料表格** | Additional Information Sheet (`P120A2`) | `p120a2` | 官方表格 `P120A2 (10/2009)`；附加報考資料。 |
| **成員二維碼傳送碼** | Member Transfer QR | `SB1.` / `scoutbook/member` | 成員自選欄位後經 gzip + Base64URL 編碼之離線二維碼字串；未壓縮時為 `SB1P.`。 |
| **領袖核簽回傳碼** | Leader Sign-off Return QR | `SB1S.` / `scoutbook/signoff` | 領袖掃描成員紀錄並一次簽名後產生之輕量回傳二維碼，供成員掃回寫入紀錄冊。 |
| **待領袖核實** | Pending leader confirmation | `status: 'pending'` | BOOK 送交 `scoutbadge` 的唯一狀態；必須由領袖在 BADGE 按 CONFIRM 方為完成。 |
| **已核實進度** | Leader-confirmed progress | `confirmedByBadge: true` | 只可來自 `scoutbadge` 已核實資料；BOOK 不可自行設定。 |
| **領袖模式** | Leader Mode (Read-Only) | `LEADER_CODE` / `/api/leader` | 伺服器端密碼解鎖；本機紀錄冊鎖為唯讀，只可掃描及簽發 `SB1S.`。 |
