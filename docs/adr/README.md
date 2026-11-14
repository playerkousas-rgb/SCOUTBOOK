# Architecture Decision Records (ADR)

本目錄記錄 `SCOUTBOOK` 的關鍵架構與法務技術取捨：

- [`0001-record-stack-choice.md`](0001-record-stack-choice.md) — 沿用 React + Vite 純前端離線優先 PWA 架構，並以 `scoutbadge` 項目 ID 為單一真相
- [`0002-pure-client-qr-and-copyright.md`](0002-pure-client-qr-and-copyright.md) — 採用零伺服器 `SB1` 二維碼協定、`/api/scoutbadge` 純進度橋接及 All Rights Reserved 專有版權保護
- [`0003-badge-progress-files-require-connection.md`](0003-badge-progress-files-require-connection.md) — scoutbadge 進度檔須先連接並登入 scoutbadge 才可匯出或匯入；完整紀錄冊備份不受影響
- [`0004-portal-iframe-embedding.md`](0004-portal-iframe-embedding.md) — 移除 `X-Frame-Options`，改以 CSP `frame-ancestors` 白名單只容許 BOOK 自身及「服務平台」iframe 嵌入；相機權限委派與分割儲存的取捨
