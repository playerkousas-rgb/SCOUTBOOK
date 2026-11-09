import React, { useMemo, useState } from 'react';
import { sliceOtherBadges, today } from '@shared/book.js';
import { useBook } from '../bookContext.js';
import Write from './Write.jsx';
import { SignModal } from './Ink.jsx';
import { Icon, cx } from '../ui.jsx';
import { useLang } from '../i18n.jsx';

/* 專科徽章完成紀錄表：每個徽章只記錄一項完成紀錄（取得日期、證書編號及領袖簽署）。
   不會把徽章虛構拆成逐項細項；考驗內容以總會綱要為準。 */
export function OtherBadgeTable({ pageId }) {
  const { book, update, readOnly } = useBook();
  const { isEn } = useLang();
  const [query, setQuery] = useState('');
  const [sign, setSign] = useState(null);
  const pageBadges = useMemo(() => sliceOtherBadges(pageId), [pageId]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = pageBadges.filter(
      (b) =>
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.en.toLowerCase().includes(q) ||
        b.badgeId.toLowerCase().includes(q),
    );
    const order = [];
    const seen = new Set();
    list.forEach((b) => {
      if (!seen.has(b.group)) {
        seen.add(b.group);
        order.push(b.group);
      }
    });
    return order.map((group) => ({
      group,
      groupName: list.find((b) => b.group === group)?.groupName || group,
      groupNameEn: list.find((b) => b.group === group)?.groupNameEn || '',
      badges: list.filter((b) => b.group === group),
    }));
  }, [pageBadges, query]);

  const setBadge = (id, patch) => {
    if (readOnly) return;
    update((b) => ({
      ...b,
      otherBadges: {
        ...(b.otherBadges || {}),
        [id]: { ...(b.otherBadges?.[id] || {}), ...patch },
      },
    }));
  };

  const recorded = pageBadges.filter((b) => book.otherBadges?.[b.id]?.date).length;

  return (
    <div className="otwrap">
      <div className="otwrap__bar no-print">
        <span className="otwrap__count">
          {isEn ? `${recorded} of ${pageBadges.length} recorded on this page` : `本頁已記錄 ${recorded} / ${pageBadges.length} 個`}
        </span>
        <label className="otwrap__search">
          <Icon name="zoom" size={13} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isEn ? 'Search badge or catalogue no.' : '搜尋徽章或目錄編號'}
            aria-label={isEn ? 'Search proficiency badges' : '搜尋專科徽章'}
          />
        </label>
      </div>

      {groups.map((group) => (
        <section key={group.group} className="otgroup">
          <h3>
            {isEn ? group.groupNameEn || group.groupName : group.groupName}
            {!isEn && group.groupNameEn && <em>{group.groupNameEn}</em>}
          </h3>
          <div className="otlist">
            {group.badges.map((badge) => {
              const entry = book.otherBadges?.[badge.id] || {};
              return (
                <div className={cx('otrow', entry.date && 'is-done')} key={badge.id}>
                  <div className="otrow__name">
                    <strong>{isEn ? badge.en : badge.name}</strong>
                    <em>{isEn ? badge.name : badge.en}</em>
                    <span className="otrow__id">{badge.badgeId}</span>
                    {entry.confirmedByBadge && (
                      <span className="assrow__verified">
                        <Icon name="verified" size={10} /> scoutbadge
                      </span>
                    )}
                  </div>
                  <div className="otrow__date" data-label={isEn ? 'Date' : '日期'}>
                    <Write
                      value={entry.date || ''}
                      onChange={(v) => setBadge(badge.id, { date: v })}
                      type="date"
                      compact
                      label={`${badge.name} 日期`}
                    />
                  </div>
                  <div className="otrow__cert" data-label={isEn ? 'Cert. no.' : '證書編號'}>
                    <Write
                      value={entry.cert || ''}
                      onChange={(v) => setBadge(badge.id, { cert: v })}
                      compact
                      placeholder={isEn ? 'Cert. no.' : '證書編號'}
                      label={`${badge.name} 證書編號`}
                    />
                  </div>
                  {!readOnly && (
                    <button
                      type="button"
                      className="otrow__sig no-print"
                      onClick={() => setSign(badge)}
                      title={isEn ? 'Leader signature' : '領袖簽署'}
                    >
                      {entry.signature?.png ? (
                        <img src={entry.signature.png} alt="簽名" />
                      ) : (
                        <Icon name="pen" size={12} />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <SignModal
        open={Boolean(sign)}
        onClose={() => setSign(null)}
        title={sign ? `${isEn ? 'Badge sign-off' : '徽章簽核'} · ${isEn ? sign.en : sign.name}` : ''}
        defaultName={sign ? book.otherBadges?.[sign.id]?.signature?.name || book.member?.sl || '' : ''}
        onSave={(sig) => {
          if (sign) {
            setBadge(sign.id, {
              signature: sig,
              date: book.otherBadges?.[sign.id]?.date || sig.at || today(),
            });
          }
          setSign(null);
        }}
      />
    </div>
  );
}
