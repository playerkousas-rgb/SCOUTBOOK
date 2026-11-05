import React from 'react';
import { BADGE_SYLLABUS, ELECTIVE_OPTIONS, badgeStats, sliceAward } from '@shared/book.js';
import { useBook } from '../bookContext.js';
import { CircleChoice, H, Note, P, Page } from '../components/Form.jsx';
import AwardBlock, { AwardArt, AwardPresentation } from '../components/AwardBlock.jsx';
import { Icon, cx } from '../ui.jsx';
import { Link } from '../router.jsx';
import { useLang } from '../i18n.jsx';

const byId = Object.fromEntries(BADGE_SYLLABUS.map((b) => [b.id, b]));
const sliceIds = (award, pageId) => sliceAward(award, pageId).segments.flatMap((s) => s.items.map((i) => i.id));

function ProgressRibbon({ stats }) {
  const { isEn } = useLang();
  return (
    <div className={cx('ribbon', stats.complete && 'is-complete')}>
      <span className="ribbon__bar">
        <i style={{ width: `${stats.percent}%` }} />
      </span>
      <span className="ribbon__text">
        {stats.done} / {stats.total} {isEn ? 'items' : '項'}
        {stats.complete ? (isEn ? ' · completed' : ' · 已完成') : ''}
      </span>
    </div>
  );
}

function AwardIntro({ award }) {
  const { isEn } = useLang();
  return (
    <>
      <p className="pglead">
        {isEn ? award.en : award.name}
        {!isEn && award.en && <em> · {award.en}</em>}
      </p>
      {award.purpose && <P en={award.purposeEn}>{award.purpose}</P>}
      {award.description && award.description !== award.purpose && (
        <Note en={award.descriptionEn}>{award.description}</Note>
      )}
    </>
  );
}

/** 紙本「所選自選項目（請圈出）」：戶外／海上／航空三選一，社區／生態／氣象三選一。 */
function ElectiveCircle({ awardId, kind }) {
  const options = (ELECTIVE_OPTIONS[kind] || []).map((o) => ({ value: o.value, zh: o.zh, en: o.en }));
  return (
    <CircleChoice
      label={kind === 'outdoor' ? '戶外挑戰自選（請圈出一項）' : '社會自選（請圈出一項）'}
      en={kind === 'outdoor' ? 'Outdoor Challenge Elective (Circle One)' : 'Community Elective (Circle One)'}
      path={`pages.elective_${awardId}.${kind}`}
      options={options}
    />
  );
}

function ElectiveRuleNote() {
  const { isEn } = useLang();
  return (
    <Note
      en="Each award keeps the same elective choice throughout. Sea Scouts take the Sea Activity option; Air Scouts take the Air Activity option."
    >
      各進度性獎章的自選項目須前後一致；海童軍必選海上活動，空童軍必選航空活動。
    </Note>
  );
}

function SyncFootnote() {
  const { isEn } = useLang();
  return (
    <p className="syncfoot no-print">
      <Icon name="verified" size={13} />
      <span>
        {isEn
          ? 'Items marked “scoutbadge · verified” came from your leader’s confirmed records. New entries stay local until you submit them — they arrive at scoutbadge as pending and need the leader’s CONFIRM.'
          : '標示「scoutbadge · 已核實」的項目來自團長在 scoutbadge 已核實的紀錄。新填寫的項目只留在本機；送交後在 scoutbadge 只會是「待批」，須由團長按 CONFIRM。'}
      </span>
      <Link to="/p/appendix" className="syncfoot__link">
        {isEn ? 'Sync' : '同步'}
      </Link>
    </p>
  );
}

/* ------------------------------------------------------------ 第 8–9 頁：會員章 */
export function P08() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L1;
  const stats = badgeStats(book, 'L1');
  return (
    <Page id="p08" dense>
      <H en={`${award.en} (1)`} progress={sliceIds(award, 'p08')}>
        {award.name}（一）
      </H>
      <AwardArt src="/official/membership-emblem.png" zh="童軍會員章" en="Scout Membership Badge" />
      <AwardIntro award={award} />
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p08')} />
      <SyncFootnote />
    </Page>
  );
}

export function P09() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L1;
  const stats = badgeStats(book, 'L1');
  return (
    <Page id="p09" dense>
      <H en={`${award.en} (2)`} progress={sliceIds(award, 'p09')}>
        {award.name}（二）
      </H>
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p09')} />
      <AwardPresentation awardId="L1" title={`${award.name}頒發`} en={`Award of ${award.en}`} />
      <Note en="The Membership Badge is awarded after investiture. “Keeping Scouts Safe from Harm” is required content — it is not optional.">
        會員章於宣誓後頒發。「保護兒童免受侵害」為必修內容，不可省略。
      </Note>
      <SyncFootnote />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 10–13 頁：童軍探索獎章 */
export function P10() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L2;
  const stats = badgeStats(book, 'L2');
  return (
    <Page id="p10" dense>
      <H en={`${award.en} (1)`} progress={sliceIds(award, 'p10')}>
        {award.name}（一）
      </H>
      <AwardIntro award={award} />
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p10')} />
      <ElectiveCircle awardId="L2" kind="outdoor" />
      <ElectiveRuleNote />
    </Page>
  );
}

export function P11() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L2;
  const stats = badgeStats(book, 'L2');
  return (
    <Page id="p11" dense>
      <H en={`${award.en} (2)`} progress={sliceIds(award, 'p11')}>
        {award.name}（二）
      </H>
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p11')} />
    </Page>
  );
}

export function P12() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L2;
  const stats = badgeStats(book, 'L2');
  return (
    <Page id="p12" dense>
      <H en={`${award.en} (3)`} progress={sliceIds(award, 'p12')}>
        {award.name}（三）
      </H>
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p12')} />
    </Page>
  );
}

export function P13() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L2;
  const stats = badgeStats(book, 'L2');
  return (
    <Page id="p13" dense>
      <H en={`${award.en} (4)`} progress={sliceIds(award, 'p13')}>
        {award.name}（四）
      </H>
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p13')} />
      <ElectiveCircle awardId="L2" kind="community" />
      <AwardPresentation awardId="L2" title={`${award.name}頒發`} en={`Award of ${award.en}`} />
      <Note en="Record the award date only after the Scout Leader confirms every item. The choice made above flows into section (2) of form PT/18.">
        頒發日期請待童軍團長確認全部細項後才填寫。以上圈選會自動帶入 PT/18 乙部。
      </Note>
      <SyncFootnote />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 14–18 頁：童軍標準獎章 */
export function P14() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L3;
  const stats = badgeStats(book, 'L3');
  return (
    <Page id="p14" dense>
      <H en={`${award.en} (1)`} progress={sliceIds(award, 'p14')}>
        {award.name}（一）
      </H>
      <AwardIntro award={award} />
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p14')} />
      <ElectiveCircle awardId="L3" kind="outdoor" />
      <ElectiveRuleNote />
    </Page>
  );
}

export function P15() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L3;
  const stats = badgeStats(book, 'L3');
  return (
    <Page id="p15" dense>
      <H en={`${award.en} (2)`} progress={sliceIds(award, 'p15')}>
        {award.name}（二）
      </H>
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p15')} />
    </Page>
  );
}

export function P16() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L3;
  const stats = badgeStats(book, 'L3');
  return (
    <Page id="p16" dense>
      <H en={`${award.en} (3)`} progress={sliceIds(award, 'p16')}>
        {award.name}（三）
      </H>
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p16')} />
    </Page>
  );
}

export function P17() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L3;
  const stats = badgeStats(book, 'L3');
  return (
    <Page id="p17" dense>
      <H en={`${award.en} (4)`} progress={sliceIds(award, 'p17')}>
        {award.name}（四）
      </H>
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p17')} />
      <ElectiveCircle awardId="L3" kind="community" />
    </Page>
  );
}

export function P18() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L3;
  const stats = badgeStats(book, 'L3');
  return (
    <Page id="p18" dense>
      <H en={`${award.en} (5)`} progress={sliceIds(award, 'p18')}>
        {award.name}（五）
      </H>
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p18')} />
      <AwardPresentation awardId="L3" title={`${award.name}頒發`} en={`Award of ${award.en}`} />
      <Note en="Record the award date only after the Scout Leader confirms every item. The choice made above flows into section (2) of form PT/18.">
        頒發日期請待童軍團長確認全部細項後才填寫。以上圈選會自動帶入 PT/18 乙部。
      </Note>
      <SyncFootnote />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 19–23 頁：童軍高級獎章 */
export function P19() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L4;
  const stats = badgeStats(book, 'L4');
  return (
    <Page id="p19" dense>
      <H en={`${award.en} (1)`} progress={sliceIds(award, 'p19')}>
        {award.name}（一）
      </H>
      <AwardIntro award={award} />
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p19')} />
      <ElectiveCircle awardId="L4" kind="outdoor" />
      <ElectiveRuleNote />
    </Page>
  );
}

export function P20() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L4;
  const stats = badgeStats(book, 'L4');
  return (
    <Page id="p20" dense>
      <H en={`${award.en} (2)`} progress={sliceIds(award, 'p20')}>
        {award.name}（二）
      </H>
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p20')} />
    </Page>
  );
}

export function P21() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L4;
  const stats = badgeStats(book, 'L4');
  return (
    <Page id="p21" dense>
      <H en={`${award.en} (3)`} progress={sliceIds(award, 'p21')}>
        {award.name}（三）
      </H>
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p21')} />
    </Page>
  );
}

export function P22() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L4;
  const stats = badgeStats(book, 'L4');
  return (
    <Page id="p22" dense>
      <H en={`${award.en} (4)`} progress={sliceIds(award, 'p22')}>
        {award.name}（四）
      </H>
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p22')} />
      <ElectiveCircle awardId="L4" kind="community" />
    </Page>
  );
}

export function P23() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L4;
  const stats = badgeStats(book, 'L4');
  return (
    <Page id="p23" dense>
      <H en={`${award.en} (5)`} progress={sliceIds(award, 'p23')}>
        {award.name}（五）
      </H>
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliceAward(award, 'p23')} />
      <AwardPresentation awardId="L4" title={`${award.name}頒發`} en={`Award of ${award.en}`} />
      <Note en="The Advanced Award is the doorway to the Chief Scout's Award (pages 50–62). Record the award date only after the Scout Leader confirms every item.">
        高級獎章是通往總領袖獎章（第 50–62 頁）的大門。頒發日期請待童軍團長確認全部細項後才填寫。
      </Note>
      <SyncFootnote />
    </Page>
  );
}
