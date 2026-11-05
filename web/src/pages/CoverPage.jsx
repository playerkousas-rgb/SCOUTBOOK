import React from 'react';
import { allStats, BADGE_SYLLABUS } from '@shared/book.js';
import { Crest, cx } from '../ui.jsx';
import { useLang } from '../i18n.jsx';
import { LegalLine } from '../components/Legal.jsx';

const CHIEF = BADGE_SYLLABUS.find((b) => b.id === 'L5') || {};

/**
 * 全螢幕童軍布面燙金封面（對齊 BOOK 家族 CoverPage）：
 * 整個螢幕就是紀錄冊封面；深童軍綠布面 × 燙金徽章，避免黃底白字的對比度陷阱。
 */
export default function CoverPage({ book, onOpen, last, onContinue, onLeader }) {
  const { isEn } = useLang();
  const m = book?.member || {};
  const stats = allStats(book);

  const hint = !m.nameZh && !m.nameEn
    ? isEn
      ? 'Step 1: write your name on page 1 — or leave it blank and sync with your Scout ID'
      : '第一步：在第 1 頁寫上名字；或全部留白，直接用 SCOUT ID 同步'
    : isEn
      ? `${stats.done} / ${stats.total} items · Next: ${stats.nextAward?.award?.en || 'All completed'}`
      : `已完成 ${stats.done} / ${stats.total} 項 · 下一步：${
          stats.nextAward?.award?.name || '全部完成，等領袖簽署'
        }`;

  const medals = [
    { id: 'L1', label: isEn ? 'Membership Badge' : '會員章', short: isEn ? 'MB' : '會', earned: Boolean(book?.pages?.award_L1?.date) || stats.awards[0]?.complete },
    { id: 'L2', label: isEn ? 'Pathfinder Award' : '探索獎章', short: isEn ? 'PF' : '探', earned: Boolean(book?.pages?.award_L2?.date) || stats.awards[1]?.complete },
    { id: 'L3', label: isEn ? 'Standard Award' : '標準獎章', short: isEn ? 'ST' : '標', earned: Boolean(book?.pages?.award_L3?.date) || stats.awards[2]?.complete },
    { id: 'L4', label: isEn ? 'Advanced Award' : '高級獎章', short: isEn ? 'AD' : '高', earned: Boolean(book?.pages?.award_L4?.date) || stats.awards[3]?.complete },
    { id: 'L5', label: isEn ? "Chief Scout's Award" : '總領袖獎章', short: isEn ? 'CS' : '總', earned: Boolean(book?.pages?.award_L5?.date) || stats.awards[4]?.complete },
  ];

  return (
    <div className="coverart">
      <div className="coverart__grain" aria-hidden="true" />
      <span className="coverart__frame coverart__frame--outer" aria-hidden="true" />
      <span className="coverart__frame coverart__frame--inner" aria-hidden="true" />
      <span className="coverart__spine" aria-hidden="true" />

      <div className="coverart__top">
        <Crest size={58} />
        <div>
          <strong>{isEn ? 'SCOUT ASSOCIATION OF HONG KONG' : '香港童軍總會'}</strong>
        </div>
      </div>

      <div className="coverart__center">
        {isEn ? (
          <>
            <span className="coverart__kicker">SCOUT SECTION</span>
            <h1 className="coverart__title coverart__title--en">SCOUT</h1>
            <h2 className="coverart__subtitle">RECORD BOOK</h2>
          </>
        ) : (
          <>
            <span className="coverart__kicker">SCOUT</span>
            <h1 className="coverart__title">童軍</h1>
            <h2 className="coverart__subtitle">紀　錄　冊</h2>
          </>
        )}
      </div>

      <div className="coverart__plate">
        <span className="coverart__plate-label">{isEn ? 'HOLDER' : '持有人'}</span>
        <strong>{(isEn ? m.nameEn || m.nameZh : m.nameZh || m.nameEn) || (isEn ? 'Your Name' : '你的名字')}</strong>
        <span className="coverart__plate-sub">
          {[m.troop, m.group].filter(Boolean).join(' · ') || (isEn ? 'Scout Troop' : '童軍團')}
        </span>
        {m.scoutId && <span className="coverart__plate-no">No. {m.scoutId}</span>}
        {hint && <span className="coverart__hint">{hint}</span>}
        <div className="coverart__badges">
          {medals.map((b) => (
            <span
              key={b.id}
              className={cx('coverart__medal', b.earned && 'is-earned')}
              title={`${b.label}${b.earned ? (isEn ? ' · Earned' : ' · 已完成') : isEn ? ' · In progress' : ' · 進行中'}`}
            >
              {b.short}
            </span>
          ))}
        </div>
      </div>

      <div className="coverart__foot">
        <span className="coverart__year">{new Date().getFullYear()}</span>
        <div className="coverart__ctas">
          <div className="coverart__ctarow">
            <button type="button" className="coverart__open" onClick={onOpen}>
              {isEn ? 'Open the record book' : '打開紀錄冊'}
            </button>
            {onLeader && (
              <button type="button" className="coverart__leader" onClick={onLeader}>
                {isEn ? 'Leader mode' : '領袖模式'}
              </button>
            )}
          </div>
          {last && (
            <button type="button" className="coverart__resume" onClick={onContinue}>
              {isEn ? `Continue · page ${last.page}` : `繼續上次 · 第 ${last.page} 頁`}{' '}
              <span>{isEn ? last.en || last.label : last.label}</span>
            </button>
          )}
        </div>
        <span className="coverart__edition">{isEn ? '2026 Scheme' : '2026 綱要'}</span>
      </div>

      <LegalLine className="coverart__legal" />
      <span className="coverart__awardnote" aria-hidden="true">
        {isEn ? CHIEF.en : CHIEF.name}
      </span>
    </div>
  );
}
