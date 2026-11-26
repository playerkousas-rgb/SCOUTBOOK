import React from 'react';
import { useLang } from '../i18n.jsx';

/**
 * SG18「讚好／收藏」一鍵返回 SCOUT APP STORE 詳情卡（開新分頁）。
 *
 * - 只連回主站；唔直連主站資料庫、唔複製任何密鑰、唔自行呼叫主站統計函式（SG18）。
 * - 網址一律由 `store_gate_v1.0.js` 的 `ScoutStoreGate.getAppStoreUrl()` 產生，前端零寫死網址；
 *   slug `scoutbook` 對照主站 migration `20261116-app-slug-seed.sql` 核實，唔靠 repo 名猜。
 * - 閘腳本讀唔到（離線／舊快取）時 `href` 為空字串 → 整粒掣隱藏，唔會出死連。
 */
export default function StoreSupport({ onPaper = false }) {
  const { isEn } = useLang();
  const helper = typeof window !== 'undefined' && window.ScoutStoreGate?.getAppStoreUrl;
  const href = typeof helper === 'function' ? helper('scoutbook') : '';
  const label = isEn
    ? 'Like or save this app on the App Store (opens a new tab)'
    : '前往主站讚好或收藏此程式（開新分頁）';
  return (
    <a
      className={`store-support${onPaper ? ' store-support--paper' : ''}`}
      href={href || undefined}
      hidden={!href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">♥</span> <span>{isEn ? 'Like / Save' : '讚好／收藏'}</span>
    </a>
  );
}
