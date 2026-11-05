# 00 — SCOUTBOOK 一頁速查卡（Quickcard）

| 項目 | 內容 |
| :--- | :--- |
| **定位** | 香港童軍支部個人隨身離線電子紀錄冊（紙本《童軍紀錄冊》＋ 2026 修訂版訓練綱要 ＋ `PT/18`・`P120A1`・`P120A2`）；**可獨立運作**，`scoutbadge` 同步屬可選 |
| **頁數** | 紙本頁數結構待用戶提供紙本對照後鎖定（已知第 1、2、3、6、7 頁及第 50–62 頁；見 `docs/p1-research.md` §4） |
| **獨立模式** | 沒有 `/api/scoutbadge`（純靜態主機）時，數位附錄自動顯示「現時以獨立模式運作」＋本機 JSON 交換；其餘功能不變 |
| **網址路由** | `/` 封面・`/p/pNN` 紙本逐頁（頁碼待鎖定）・`/p/contents` 目錄・`/p/appendix` 數位附錄・`/forms` 官方表格（`pt18`、`p120a1`、`p120a2`、`all`）・`/scan` 掃描二維碼・`/print` 整本列印 |
| **本機儲存鍵** | `scoutbook.book.v1`（紀錄冊主體）、`scoutbook.lang`（語言 `zh`/`en`）、`scoutbook.last`（上次頁面）、`scoutbook.signoff.applied.v1`（已寫入核簽序號）、`scoutbook.scoutbadge.member.v1`（同步身分） |
| **互通格式** | `scoutbadge.pending.v1`（以 `scoutId` 對齊 `L1-*`…`L5-*`、`SC-*-*`；BOOK 鍵＝官方編號原文，零映射） |
| **二維碼協定** | `SB1.<base64url(gzip(JSON))>`（壓縮優先）、`SB1P.`（未壓縮後備）、`SB1S.`（領袖核簽），上限 `2400` 字元 |
| **版權與聲明** | `Copyright © 2026 SCOUT SYSTEM — All Rights Reserved`（見 [`../LICENSE`](../LICENSE)）＋ 非官方獨立工具聲明，只出現於封面頁腳、數位附錄、選單「關於」 |

## 常用指令

```bash
npm run dev                                        # 本機開發（http://0.0.0.0:5173）
npm run syllabus                                   # 由 scoutbadge items.json 重新產生 shared/syllabus.js
npm test                                           # 資料模型、同步、表格及介面契約測試
npm run build                                      # 建置生產版至 dist/
npm run icons                                      # 重新生成 web/public/icons/ 九件套及根目錄 favicon
node scripts/guard.mjs                             # 檔案／連結／體積／機密守衛
rm -rf dist && node scripts/final_check_v1.0.mjs   # 收工閘門
node scripts/repo_health_v1.0.mjs                  # 倉庫健康
node scripts/preflight_v1.0.mjs .                  # 開局與交付總閘門
```

## 常見排障

1. **手機提示「儲存空間不足」**：前往 `/p/appendix`（數位附錄）→「本機儲存健康」，點擊一鍵壓縮圖片與手寫墨跡，並匯出 JSON 備份。
2. **二維碼超出容量（> 2,400 字元）**：在「出示二維碼」對話框取消勾選「近照」或「領袖簽署墨跡」；完整轉移請用數位附錄的「匯出完整紀錄冊 JSON」。
3. **表格列印出現頁首網址或邊界裁切**：列印對話框選 `A4`、邊界「預設／無」、勾選「背景圖形」、取消「頁首及頁尾」。
4. **同步顯示「尚未登入 scoutbadge」**：在數位附錄重新輸入 SCOUT ID 與 `scoutbadge` 密碼；BOOK 不會儲存密碼，只保存登入 token 於本次工作階段。
5. **輸入 SCOUT ID 後拉不到進度**：確認該旅團已在伺服器設定 `SCOUTBADGE_ORIGIN` 或 `TROOP_<id>_*`，且成員在 `scoutbadge` 內的角色可讀取自己的進度；`pendingRequests` 不會出現在紀錄冊。
