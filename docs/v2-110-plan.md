# v2.0.0：按紙本 110 頁全面重排（設計案）

> 用戶決定（2026-11-05）：像 CUBSBOOK 那樣逐頁對應官方《童軍紀錄冊》。
> 紙本真結構：封面（不計頁碼）＋ 卷首語（不計頁碼）＋ 編號頁 1–110。
> 依據：`docs/paper-text/full.txt`（官方 PDF 全文抽取，**只存本地、不入 git**，見 `.gitignore`）。

## 一、總原則（抄 CUBSBOOK）

- 數位頁 `p001`–`p110` 與紙本 1–110 一一對應：**不新增、不合併、不重排任何官方頁**。
- 封面、卷首語不計頁碼；制服圖、進度總覽、使用說明屬數位延伸，全部搬入**附錄**。
- 獎章細項進度鍵 `progress[item.id]` 按題穩定，換頁只改顯示分組，**舊獎章數據零遷移**。
- 頁 id 用三位數 `p001`…`p110`，與舊制 `p01`–`p66` 永不碰撞；`meta.pagev=3`。

## 二、110 頁總表（紙本 → 數位 kind → 數據鍵）

| 紙本 | 內容 | kind | 數據鍵 |
| --- | --- | --- | --- |
| 1 | 成員編號／姓名／簽署／緊急聯絡／近照 | personal-1 | `pages.p001.*`（scoutId, nameZh, nameEn, holderSign, iceName, iceTel, iceAddr, photo） |
| 2 | 個人紀錄（出生／證件／地址／血型／學校／宗教） | personal-2 | `pages.p002.*` |
| 3 | 旅部資料 | group | `pages.p003.*` |
| 4 | 童軍經驗：小童軍／幼童軍（年期旅別職位最高獎章）／小隊職務（副／正／團隊長）／服務年星 1–5 | experience | `pages.p004.*`（紙本無深資／樂行欄，刪） |
| 5 | 轉旅紀錄＋搬遷紀錄 | transfer-move | `pages.p005.transfer[]`、`pages.p005.move[]`（紙本無資料更改欄，刪） |
| 6 | 會員資格紀錄表 | renewal | `pages.p006.rows[]`（更新／有效／簽署）＋入團／宣誓日期 |
| 7 | 續期說明＋負責領袖簽署＋旅團印 | renewal-sign | `pages.p007.*`（簽署提示，靜態為主） |
| 8 | 童軍支部（目的） | static | — |
| 9 | 童軍誓詞 | static | —（七條規律是數位增值，搬附錄或頁內附註？待定） |
| 10–11 | 進度性徽章總覽、獲取總領袖獎章之途徑 | static | —（途徑圖用 CSS 畫，不掃描） |
| 12–14 | 會員章：p12＝項1–5，p13＝項6–11，p14＝宣誓日期＋團長簽署 | award-L1 | `progress[L1-*]`＋`pages.award_L1`（沿用） |
| 15 | AYP 同意書（成員簽署／家長簽署／日期／兩項同意） | ayp-consent | `pages.p015.*` |
| 16–24 | 探索獎章（見 §三） | award-L2 | `progress[L2-*]`＋`pages.award_L2` |
| 25–39 | 標準獎章（見 §三） | award-L3 | `progress[L3-*]`＋`pages.award_L3` |
| 40–59 | 高級獎章（見 §三） | award-L4 | `progress[L4-*]`＋`pages.award_L4` |
| 60–75 | 總領袖獎章（見 §三；p75＝提名 block） | award-L5 | `progress[L5-*]`＋`pages.award_L5` |
| 76–77 | 專科徽章簡介（中／英） | static | — |
| 78–81 | 興趣／技能／服務／教導組（整組逐行，一頁一組） | ot-group | `otherBadges.*`（badgeId 鍵，沿用，換頁零遷移） |
| 82 | 海上（艇工／水手／水手長）＋航空（初／中／高級） | ot-sea-air | 同上（※須核對 syllabus 海上組名稱） |
| 83–85 | 領導才獎章 7 項（p83:1–2；p84:3–5a；p85:5b–7＋簽發） | award-LD | 新增 `progress[OT-LD-*]`＋`pages.award_OT-LD` |
| 86–87 | 服務獎章 4 項（p86:1–3；p87:4＋簽發） | award-SF | 新增 `progress[OT-SF-*]`＋`pages.award_OT-SF` |
| 88–90 | 先修章 10 項（p88:1–3；p89:4–8；p90:9–10＋簽發） | award-VS | 新增 `progress[OT-VS-*]`＋`pages.award_OT-VS` |
| 91–101 | AYP 銅／銀級紀錄（11 頁，逐頁照紙本欄位） | ayp-record | 新增 `pages.p091…p101.*`（實作時讀 full.txt 逐頁建欄） |
| 102 | 宗教章（6 選 1 a–f＋簽發） | award-RG | 新增 `progress[OT-RG-*]`＋`pages.award_OT-RG` |
| 103 | 社區參與章（3 項＋簽發） | award-CM | 新增 `progress[OT-CM-*]`＋`pages.award_OT-CM` |
| 104–105 | 其他獎章及徽章（獎章／主考／日期） | other-rows | `pages.p104.rows[]`、`pages.p105.rows[]` |
| 106 | 露營紀錄（日期／地點／摘要／晚數） | log-camping | `pages.p106.rows[]` |
| 107 | 遠足紀錄（日期／地點／摘要／里數） | log-expedition | `pages.p107.rows[]` |
| 108 | 訓練班／活動紀錄（日期／主辦／摘要／證書號碼） | log-training | `pages.p108.rows[]` |
| 109–110 | 服務紀錄（日期／主辦／摘要／時數，兩頁） | log-service | `pages.p109.rows[]`、`pages.p110.rows[]` |
| — | 附錄：制服圖＋22 圖例／進度總覽／使用說明／卷首語 | appendix | 沿用現有鍵 |

## 三、L2–L5 紙本分頁（item 級，※＝實作時對 full.txt 落實邊界）

- **L2（p16–24）**：p16 簡介＋A1a；p17 A1b–d＋A2；p18 A3＋A4；p19 A4尾＋A5＋A6頭；
  p20 A6尾；p21 B1＋B2＋C1；p22 C2＋D1；p23 D社區／生態／氣象；p24 簽發。
- **L3（p25–39）**：p25 簡介；p26 A1；p27 A2；p28 A3；p29 A4；p30 A5；p31 A6；
  p32 B1＋B2頭；p33 B2中；p34 B2尾＋C1＋C2頭；p35 C2尾＋D1；p36 D社區；p37 D生態；
  p38 D氣象＋E；p39 F＋簽發（※F 項名對 syllabus 落實）。
- **L4（p40–59）**：p40 簡介；p41 A1；p42–43 A2；p44 A3＋A4頭；p45 A5；p46 A6；
  p47 B1頭；p48 B1尾＋B2頭；p49 B2尾；p50 C1；p51 C2；p52 D1；p53 D社區；
  p54–55 D生態＋D氣象；p56–57 D危機；p58 E；p59 F＋簽發。
- **L5（p60–75）**：p60 簡介；p61 A1＋A2頭；p62 A2尾；p63 A3＋A4；p64 A5＋A6頭；
  p65 A6尾＋B1；p66 B1尾＋B2頭；p67 B2中；p68 B2尾＋C1＋C2頭；p69 C2尾＋D1；
  p70 D社區；p71 D生態＋D氣象頭；p72 D氣象尾＋D危機；p73 E；p74 F(1–3)；p75 提名。
- **L5 項數疑點**：紙本數出 A6＋B2＋C2＋D5＋E1＋F3＝21？須以 `syllabus.js` L5 真實 item id 為準，
  實作時逐項掛頁，不足／多出都以紙本頁為主、syllabus 補齊，差異記入 CHANGELOG。

## 四、數據遷移（pagev 2 → 3，只遷頁作用域數據）

| 舊鍵 | 新鍵 | 說明 |
| --- | --- | --- |
| `progress.*`（L1–L5 全部） | 不動 | 題鍵穩定，換頁零遷移 |
| `otherBadges.*`（全部徽章行） | 不動 | badgeId 穩定；領導才／服務／先修／宗教／社區的舊**單行完成**保留為章級紀錄，另以後填方式把同日期回填各新分項（`confirmedByBadge` 般標記） |
| `pages.award_L1…L5` | 不動 | 章級簽發 block 沿用 |
| `pages.p01.*` 個人欄 | `pages.p001/p002.*` | 逐欄映射（舊有多餘欄→丟棄並記 CHANGELOG） |
| `pages.p03.*` | `pages.p003.*` | 同上 |
| `pages.p04.*` | `pages.p004.*` | 小童軍／幼童軍／職務／年星映射；深資／樂行欄丟棄 |
| `pages.p05.*` | `pages.p005.*` | 轉旅／搬遷映射；資料更改丟棄 |
| `pages.p06.rows` | `pages.p006.rows` | 更新／有效映射 |
| `pages.p07/p24–p33` 活動行 | `pages.p106–p110` | best-effort：日期／地點／摘要映射，角色→丟棄；服務時數無法回填 |
| `pages.p27/p61–62` 其他獎章行 | `pages.p104–105` | 合併遷移 |
| 制服／總覽／說明 | 附錄鍵 | 沿用，換頁不換鍵 |
| `scoutbook.last` 等雜項 | 映射或重置為封面 | 沿 v1.1 兩階段遷移模式 |

## 五、實作結構

- 新增 `shared/officialPages.js`：`OFFICIAL_GROUPS`（personal／promise／membership／pathfinder／
  standard／advanced／csa／ot-intro／ot-groups／spotlight(LD/SF/VS)／ayp／faith-service／
  others／logs）＋ `OFFICIAL_PAGES`（110 條：id/no/zh/en/group/kind＋items[]/cols[] meta）。
- `shared/book.js`：SECTIONS ＝ cover＋foreword＋110＋appendix；PRINT_PAGES／PAGE_TOTAL 跟著走；
  快照／QR／transfer 按新 id 走；刪舊 `PAGE_ID_MIGRATION`（pagev2→3 另寫 `migrateV2toV3`）。
- 元件（數據驅動，110 頁不靠 110 個手寫元件）：
  `PersonalPage`（p1–5 field schema）、`RenewalPage`、`StaticPage`（p8–11、76–77）、
  `PaperAwardPage`（獎章頁：intro/items/sign 三槽＋AwardArt）、`OTGroupPage`、
  `AYPPage`（field schema）、`RecordTable`（p104–110 cols meta）、附錄三頁沿用。
- 靜態文字（支部／誓詞／總覽／途徑／OT 簡介）用**自家行文重述**，不貼 PDF 原文整段
  （版權）；欄名、項名、數字可照錄（事實資訊）。
- Syllabus 擴充：新增 `OT-LD`(7)、`OT-SF`(4)、`OT-VS`(10)、`OT-RG`(6 options→1 項＋選項？或 6 項）、
  `OT-CM`(3) 的 segments/items（含 en 名，照紙本英文照錄）；舊 otherBadges 名錄保留章級。
- 測試：110 ids 齊／順序／分組覆蓋；**每個 L1–L5 syllabus item 恰掛一頁**；
  新獎章項頁覆蓋；v2→v3 遷移；無舊 `p01`–`p66` 殘留；static 頁無數據鍵。

## 六、路線圖

1. 本文件＋paper-text 抽取 → commit（已做）。
2. `officialPages.js`＋syllabus 擴充＋SECTIONS／路由／遷移骨架 → 可跑 110 頁（已做，獎章／專科／紀錄／靜態頁全功能；個人／AYP 頁待建）。
3. 個人／續期／靜態／獎章／AYP 頁 → 首個可驗證增量（已做：110 頁全功能，附錄待遷）。
4. L3–L5、OT、LD／SF／VS、AYP、faith、logs、附錄 → 補齊。
5. 測試／閘門／CHANGELOG／README → v2.0.0。

## 七、實作前待核對（讀 full.txt 本地檔即可）

1. syllabus 海上組三名是否＝艇工／水手／水手長；航空組三名是否＝初／中／高級。
2. L5 真實 segments／items（解 §三 項數疑點）。
3. L3-F、L4-F 項名；L2 p16 營藝 b 歸屬；L3 p37＝生態、p38 氣象＋E 邊界。
4. p6 續期表有無簽署欄；AYP p91–101 逐頁欄位；p9 規律去留；p85 簽發放頁尾（輕微偏離紙本，文件註明）。
