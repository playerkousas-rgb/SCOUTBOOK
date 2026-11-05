import React, { useMemo, useState } from 'react';
import { sliceOtherBadges, today } from '@shared/book.js';
import { TRAINING_PLAN, TRAINING_PLAN_EN, SAFE_FROM_HARM, SAFE_FROM_HARM_EN } from '@shared/syllabus.js';
import { useBook } from '../bookContext.js';
import { Area, Grid, H, Line, Note, P, Page, Rows, Sig } from '../components/Form.jsx';
import Write from '../components/Write.jsx';
import { SignModal } from '../components/Ink.jsx';
import { AwardPresentation } from '../components/AwardBlock.jsx';
import { Icon, SealMark, cx } from '../ui.jsx';
import { Link } from '../router.jsx';
import { useLang } from '../i18n.jsx';

/* ------------------------------------------------------------ 專科徽章完成紀錄表
   每個徽章只記錄一項完成紀錄：取得日期、證書編號及領袖簽署。
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
                  <div className="otrow__date">
                    <Write
                      value={entry.date || ''}
                      onChange={(v) => setBadge(badge.id, { date: v })}
                      type="date"
                      compact
                      label={`${badge.name} 日期`}
                    />
                  </div>
                  <div className="otrow__cert">
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
        defaultTitle={isEn ? 'Scout Leader' : '童軍團長'}
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

function OtherLead({ children, en }) {
  const { isEn } = useLang();
  return <p className="pglead">{isEn ? en : children}</p>;
}

function P120Link() {
  const { isEn } = useLang();
  return (
    <div className="pgbtns no-print">
      <Link to="/forms/p120a1" className="btn btn--ghost btn--sm">
        <Icon name="file" size={13} /> P120A1 {isEn ? 'Assessment application' : '考驗申請表'}
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------ 第 24–27 頁：興趣組 */
export function P24() {
  return (
    <Page id="p24" dense>
      <H en="INTEREST BADGES I">興趣組專科徽章（一）</H>
      <OtherLead en="Interest badges are assessed under the arrangement of the Scout Leader. Each badge records only one completion entry: date awarded and certificate number.">
        興趣組由童軍團長安排主考。每個徽章只記錄一項完成紀錄：取得日期及證書編號；考驗內容以總會綱要為準。
      </OtherLead>
      <OtherBadgeTable pageId="p24" />
    </Page>
  );
}

export function P25() {
  return (
    <Page id="p25" dense>
      <H en="INTEREST BADGES II">興趣組專科徽章（二）</H>
      <OtherBadgeTable pageId="p25" />
    </Page>
  );
}

export function P26() {
  return (
    <Page id="p26" dense>
      <H en="INTEREST BADGES III">興趣組專科徽章（三）</H>
      <OtherBadgeTable pageId="p26" />
    </Page>
  );
}

export function P27() {
  return (
    <Page id="p27" dense>
      <H en="INTEREST BADGES IV">興趣組專科徽章（四）</H>
      <OtherBadgeTable pageId="p27" />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 28–31 頁：技能組 */
export function P28() {
  return (
    <Page id="p28" dense>
      <H en="PURSUIT BADGES I">技能組專科徽章（一）</H>
      <OtherLead en="Pursuit badges require the Scout Leader's approval of the assessment application (P120A1), then assessment by an authorised representative.">
        技能組須先經童軍團長批准考驗申請（P120A1），再由獲授權代表考驗。
      </OtherLead>
      <OtherBadgeTable pageId="p28" />
      <P120Link />
    </Page>
  );
}

export function P29() {
  return (
    <Page id="p29" dense>
      <H en="PURSUIT BADGES II">技能組專科徽章（二）</H>
      <OtherBadgeTable pageId="p29" />
    </Page>
  );
}

export function P30() {
  return (
    <Page id="p30" dense>
      <H en="PURSUIT BADGES III">技能組專科徽章（三）</H>
      <OtherBadgeTable pageId="p30" />
    </Page>
  );
}

export function P31() {
  return (
    <Page id="p31" dense>
      <H en="PURSUIT BADGES IV">技能組專科徽章（四）</H>
      <OtherBadgeTable pageId="p31" />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 32–33 頁：服務組 */
export function P32() {
  return (
    <Page id="p32" dense>
      <H en="SERVICE BADGES I">服務組專科徽章（一）</H>
      <OtherLead en="Service badges require the Scout Leader's approval of the assessment application (P120A1), then assessment by an authorised representative.">
        服務組須先經童軍團長批准考驗申請（P120A1），再由獲授權代表考驗。
      </OtherLead>
      <OtherBadgeTable pageId="p32" />
      <P120Link />
    </Page>
  );
}

export function P33() {
  return (
    <Page id="p33" dense>
      <H en="SERVICE BADGES II">服務組專科徽章（二）</H>
      <OtherBadgeTable pageId="p33" />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 34–36 頁：教導組 */
export function P34() {
  return (
    <Page id="p34" dense>
      <H en="INSTRUCTOR BADGES I">教導組專科徽章（一）</H>
      <OtherLead en="Instructor badges: after holding the related proficiency badge, guide at least one Scout for about three months. Assessment application (P120A1) requires the Scout Leader's approval.">
        教導組：取得相關專科徽章後，指導不少於一名童軍約三個月。考驗申請（P120A1）須經童軍團長批准。
      </OtherLead>
      <OtherBadgeTable pageId="p34" />
      <P120Link />
    </Page>
  );
}

export function P35() {
  return (
    <Page id="p35" dense>
      <H en="INSTRUCTOR BADGES II">教導組專科徽章（二）</H>
      <OtherBadgeTable pageId="p35" />
    </Page>
  );
}

export function P36() {
  return (
    <Page id="p36" dense>
      <H en="INSTRUCTOR BADGES III">教導組專科徽章（三）</H>
      <OtherBadgeTable pageId="p36" />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 37 頁：海上活動・航空活動 */
export function P37() {
  return (
    <Page id="p37" dense>
      <H en="SEA & AIR ACTIVITY BADGES">海上活動・航空活動徽章</H>
      <OtherLead en="Sea activity and air activity badges. Sea Scouts and Air Scouts choose the matching outdoor elective in their progressive awards.">
        海上活動及航空活動徽章。海童軍及空童軍在進度性獎章選用對應的戶外自選項目。
      </OtherLead>
      <OtherBadgeTable pageId="p37" />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 38–39 頁：其他徽章 */
export function P38() {
  return (
    <Page id="p38" dense>
      <H en="OTHER BADGES I">其他徽章（一）</H>
      <OtherLead en="Other badges, including international and special programme badges. Record the date awarded and certificate number.">
        其他徽章，包括國際及特別計劃徽章。記錄取得日期及證書編號。
      </OtherLead>
      <OtherBadgeTable pageId="p38" />
    </Page>
  );
}

export function P39() {
  return (
    <Page id="p39" dense>
      <H en="OTHER BADGES II">其他徽章（二）</H>
      <OtherBadgeTable pageId="p39" />
      <Note en="Proficiency badge dates recorded here flow into section (3) of form PT/18 and the P120A1 issue record.">
        此處記錄的徽章日期會自動帶入 PT/18 丙部及 P120A1 簽發紀錄。
      </Note>
    </Page>
  );
}

/* ------------------------------------------------------------ 第 40 頁：訓練計劃 */
export function P40() {
  const { isEn } = useLang();
  const T = isEn ? TRAINING_PLAN_EN : TRAINING_PLAN;
  return (
    <Page id="p40">
      <H en="TRAINING PLAN">訓練計劃</H>
      <p className="pglead">{T.title}</p>
      <P>{T.purpose}</P>
      <h3 className="pgsub">{isEn ? 'Method' : '訓練方法'}</h3>
      <ul className="pglist">
        {(T.method || []).map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <h3 className="pgsub">{isEn ? 'Expected Outcomes' : '期望成果'}</h3>
      <ul className="pglist">
        {(T.expected || []).map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <h3 className="pgsub">{isEn ? 'Progress Flow' : '進度流程'}</h3>
      <P>{T.progressFlow}</P>
      <h3 className="pgsub">{isEn ? 'Assessment Principles' : '考驗原則'}</h3>
      <P>{T.assessmentPrinciples}</P>
      <h3 className="pgsub">{isEn ? 'Official References' : '官方參考'}</h3>
      <ul className="pglist pglist--links">
        {(T.links || []).map((l) => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noreferrer">
              {l.title}
            </a>
          </li>
        ))}
      </ul>
      <Note en="The syllabus text on this page comes from the official Scout Training Scheme. In case of discrepancy, the Association's current published scheme prevails.">
        本頁綱要文字來自官方《童軍訓練綱要》；如有出入，以總會現行公布版本為準。
      </Note>
    </Page>
  );
}

/* ------------------------------------------------------------ 第 41 頁：安全與保護 */
export function P41() {
  const { isEn } = useLang();
  const S = isEn ? SAFE_FROM_HARM_EN : SAFE_FROM_HARM;
  return (
    <Page id="p41">
      <H en="SAFE FROM HARM">安全與保護</H>
      <p className="pglead">{S.title}</p>
      <P>{S.policy}</P>
      <h3 className="pgsub">{isEn ? 'Prevention' : '預防'}</h3>
      <ul className="pglist">
        {(S.prevention || []).map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <h3 className="pgsub">{isEn ? 'If Something Happens' : '事情發生時'}</h3>
      <ul className="pglist">
        {(S.handling || []).map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <h3 className="pgsub">{isEn ? 'Self-Learning' : '自學課程'}</h3>
      <ul className="pglist pglist--links">
        {(S.learning || []).map((l) => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noreferrer">
              {l.title}
            </a>
            {l.mandatory && <span className="tag">{isEn ? 'Required' : '必修'}</span>}
          </li>
        ))}
      </ul>
      <h3 className="pgsub">{isEn ? 'Hotlines' : '求助熱線'}</h3>
      <ul className="pglist">
        {(S.hotlines || []).map((h) => (
          <li key={h.tel}>
            {h.name}：<a href={`tel:${String(h.tel).replace(/\s/g, '')}`}>{h.tel}</a>
          </li>
        ))}
      </ul>
      <Note en="If you ever feel unsafe, tell your leader, parent or teacher immediately, or call the hotline above.">
        如感到不安，請即時告訴領袖、家長或老師，或致電上述熱線求助。
      </Note>
    </Page>
  );
}

/* ------------------------------------------------------------ 第 42 頁：頒發及宣誓紀錄 */
export function P42() {
  const { isEn } = useLang();
  return (
    <Page id="p42">
      <H en="INVESTITURE & AWARD PRESENTATION">頒發及宣誓紀錄</H>
      <Grid cols={3}>
        <Line label="宣誓日期" en="Investiture Date" type="date" path="pages.p42.investitureDate" />
        <Line label="頒發會員章日期" en="Membership Badge Date" type="date" path="pages.p42.membershipDate" />
        <Line label="宣誓時團長" en="Leader at Investiture" path="pages.p42.investingLeader" />
      </Grid>
      <Sig
        label="監誓人簽署"
        en="Officiating Leader"
        path="pages.p42.officiant"
        defaultTitle={isEn ? 'Scout Leader' : '童軍團長'}
      />
      <div className="stamprow">
        <SealMark text={isEn ? 'Group Stamp' : '旅團印'} sub="GROUP" />
        <SealMark text={isEn ? 'Leader Signature' : '團長簽署'} sub="SL" />
      </div>

      <H en="AWARD PRESENTATION">獎章頒發</H>
      <AwardPresentation awardId="L1" title="會員章" en="Membership Badge" />
      <AwardPresentation awardId="L2" title="童軍探索獎章" en="Scout Pathfinder Award" />
      <AwardPresentation awardId="L3" title="童軍標準獎章" en="Scout Standard Award" />
      <AwardPresentation awardId="L4" title="童軍高級獎章" en="Scout Advanced Award" />
      <AwardPresentation awardId="L5" title="總領袖獎章" en="Chief Scout's Award" />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 43 頁：其他獎章 */
export function P43() {
  const { isEn } = useLang();
  return (
    <Page id="p43">
      <H en="OTHER AWARDS">其他獎章</H>
      <p className="pglead">
        {isEn
          ? 'Awards outside the progressive scheme, such as bravery awards or community honours.'
          : '進度性獎章以外的獎項，例如英勇獎章或社區嘉許。'}
      </p>
      <Rows
        path="pages.p43.awards"
        min={4}
        cols={[
          { k: 'date', label: '日期', en: 'Date', type: 'date', width: 1 },
          { k: 'award', label: '獎章／獎項', en: 'Award', width: 3 },
          { k: 'certNo', label: '證書編號', en: 'Certificate No.', width: 2 },
          { k: 'presentedBy', label: '頒發人', en: 'Presented By', width: 2 },
        ]}
      />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 44 頁：其他經驗 */
export function P44() {
  const { isEn } = useLang();
  return (
    <Page id="p44">
      <H en="OTHER EXPERIENCE">其他經驗</H>
      <p className="pglead">
        {isEn
          ? 'Camps, courses, competitions and exchanges worth remembering.'
          : '值得記下的露營、訓練班、比賽及交流活動。'}
      </p>
      <Rows
        path="pages.p44.experiences"
        min={5}
        cols={[
          { k: 'date', label: '日期', en: 'Date', type: 'date', width: 1 },
          { k: 'experience', label: '經驗內容', en: 'Experience', width: 4 },
          { k: 'place', label: '地點', en: 'Place', width: 2 },
          { k: 'note', label: '備註', en: 'Remarks', width: 2 },
        ]}
      />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 45 頁：遠足及海外活動 */
export function P45() {
  const { isEn } = useLang();
  return (
    <Page id="p45">
      <H en="HIKING & OVERSEAS ACTIVITIES">遠足及海外活動</H>
      <p className="pglead">
        {isEn
          ? 'Hikes, expeditions and overseas activities. Ask the leader in charge to sign each entry.'
          : '遠足、探險及海外活動。每次請負責領袖簽署確認。'}
      </p>
      <Rows
        path="pages.p45.trips"
        min={5}
        cols={[
          { k: 'date', label: '日期', en: 'Date', type: 'date', width: 1 },
          { k: 'route', label: '路線或活動', en: 'Route / Activity', width: 4 },
          { k: 'distance', label: '距離或日數', en: 'Distance / Days', width: 2 },
          { k: 'leader', label: '領隊簽署', en: 'Leader', width: 2 },
        ]}
      />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 46–49 頁：活動紀錄 */
function ActivityLog({ pageId, numeral, numeralEn }) {
  const { isEn } = useLang();
  return (
    <Page id={pageId}>
      <H en={`ACTIVITY LOG ${numeralEn}`}>活動紀錄（{numeral}）</H>
      <p className="pglead">
        {isEn
          ? 'Weekly meetings, camps, service and competitions — one row per activity.'
          : '恆常集會、露營、服務及比賽，每次活動一行。'}
      </p>
      <Rows
        path={`pages.${pageId}.log`}
        min={8}
        cols={[
          { k: 'date', label: '日期', en: 'Date', type: 'date', width: 1 },
          { k: 'activity', label: '活動名稱', en: 'Activity', width: 4 },
          { k: 'venue', label: '地點', en: 'Venue', width: 2 },
          { k: 'role', label: '角色', en: 'Role', width: 2 },
        ]}
      />
    </Page>
  );
}

export function P46() {
  return <ActivityLog pageId="p46" numeral="一" numeralEn="I" />;
}

export function P47() {
  return <ActivityLog pageId="p47" numeral="二" numeralEn="II" />;
}

export function P48() {
  return <ActivityLog pageId="p48" numeral="三" numeralEn="III" />;
}

export function P49() {
  return <ActivityLog pageId="p49" numeral="四" numeralEn="IV" />;
}
