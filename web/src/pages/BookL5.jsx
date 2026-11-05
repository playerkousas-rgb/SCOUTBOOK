import React from 'react';
import { BADGE_SYLLABUS, badgeStats, chiefScoutReadiness, sliceAward } from '@shared/book.js';
import { useBook } from '../bookContext.js';
import { Area, Grid, H, Line, Note, P, Page, Sig } from '../components/Form.jsx';
import AwardBlock, { AwardArt, AwardPresentation } from '../components/AwardBlock.jsx';
import { Icon, cx } from '../ui.jsx';
import { Link } from '../router.jsx';
import { useLang } from '../i18n.jsx';

const byId = Object.fromEntries(BADGE_SYLLABUS.map((b) => [b.id, b]));
const sliceIds = (award, pageId) => sliceAward(award, pageId).segments.flatMap((s) => s.items.map((i) => i.id));
const allIds = (award) => award.segments.flatMap((s) => s.items.map((i) => i.id));

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

/* ------------------------------------------------------------ 第 34 頁：總領袖獎章簡介 */
export function P34() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L5;
  const stats = badgeStats(book, 'L5');
  const cs = chiefScoutReadiness(book);
  return (
    <Page id="p34" dense>
      <H en={award.en} progress={allIds(award)}>
        {award.name}簡介
      </H>
      <AwardArt src="/official/badge-csa.png" zh="總領袖獎章" en="Chief Scout's Award" />
      <p className="pglead">
        {isEn ? award.en : award.name}
        {!isEn && award.en && <em> · {award.en}</em>}
      </p>
      {award.purpose && <P en={award.purposeEn}>{award.purpose}</P>}
      {award.description && award.description !== award.purpose && (
        <Note en={award.descriptionEn}>{award.description}</Note>
      )}
      <ProgressRibbon stats={stats} />
      <div className={cx('agebox', cs.advancedComplete && 'is-ok')}>
        <Icon name={cs.advancedComplete ? 'check' : 'info'} size={14} />
        <span>
          {isEn
            ? `Advanced Award ${cs.advancedDone}/${cs.advancedTotal} · age ${cs.age || '—'}`
            : `童軍高級獎章 ${cs.advancedDone}/${cs.advancedTotal} · 年齡 ${cs.age || '—'} 歲`}
        </span>
      </div>
      <Grid cols={3}>
        <div className="tocfact">
          <span>{isEn ? 'Leadership course' : '領導才訓練班'}</span>
          <strong>{cs.leadershipCourse || '—'}</strong>
        </div>
        <div className="tocfact">
          <span>{isEn ? 'Course date' : '完成日期'}</span>
          <strong>{cs.leadershipDate || '—'}</strong>
        </div>
        <div className="tocfact">
          <span>{isEn ? 'Certificate' : '證書編號'}</span>
          <strong>{cs.leadershipCert || '—'}</strong>
        </div>
      </Grid>
      <Note en="Record the award date only after the District Commissioner's recommendation and Regional approval. The official PT/18 application form lives under Forms.">
        頒發日期請待區總監推薦及地域批核後才填寫。官方 PT/18 申請表在「申請表」頁。
      </Note>
      <div className="pgbtns no-print">
        <Link to="/forms/pt18" className="btn btn--ghost btn--sm">
          <Icon name="file" size={13} /> PT/18 {isEn ? 'Application' : '申請表'}
        </Link>
        <Link to="/forms" className="btn btn--ghost btn--sm">
          <Icon name="file" size={13} /> {isEn ? 'Print checklist' : '列印檢查清單'}
        </Link>
      </div>
      <SyncFootnote />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 35 頁：考驗計劃 */
export function P35() {
  const { isEn } = useLang();
  return (
    <Page id="p35">
      <H en="ASSESSMENT PLAN">考驗計劃</H>
      <Grid cols={2}>
        <Line label="計劃開始日期" en="Planned Start" type="date" path="pages.p35.planStartDate" />
        <Line label="預計完成日期" en="Planned Completion" type="date" path="pages.p35.planFinishDate" />
      </Grid>
      <Area
        label="考驗計劃詳情"
        en="Assessment Plan Details"
        path="pages.p35.plan"
        rows={6}
        placeholder={isEn ? 'Items, sequence, venues, assessors…' : '考驗項目、次序、地點、主考人……'}
      />
      <Note en="Talk through the plan with your Scout Leader before starting.">
        建議開展前先與童軍團長商議計劃。
      </Note>
    </Page>
  );
}

/* ------------------------------------------------------------ 第 36–41 頁：L5 A–F 分段 */
function L5SegmentPage({ pageId }) {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L5;
  const sliced = sliceAward(award, pageId);
  const segment = sliced.segments[0] || { name: '', en: '' };
  const stats = badgeStats(book, 'L5');
  return (
    <Page id={pageId} dense>
      <H en={segment.en} progress={sliceIds(award, pageId)}>
        {segment.name}
      </H>
      <ProgressRibbon stats={stats} />
      <AwardBlock award={sliced} />
      <SyncFootnote />
    </Page>
  );
}

export function P36() {
  return <L5SegmentPage pageId="p36" />;
}

export function P37() {
  return <L5SegmentPage pageId="p37" />;
}

export function P38() {
  return <L5SegmentPage pageId="p38" />;
}

export function P39() {
  return <L5SegmentPage pageId="p39" />;
}

export function P40() {
  return <L5SegmentPage pageId="p40" />;
}

export function P41() {
  return <L5SegmentPage pageId="p41" />;
}

/* ------------------------------------------------------------ 第 42 頁：領導才訓練與服務 */
export function P42() {
  const { isEn } = useLang();
  return (
    <Page id="p42">
      <H en="LEADERSHIP TRAINING & SERVICE">領導才訓練與服務</H>
      <Grid cols={2}>
        <Line label="訓練班名稱" en="Course Name" path="pages.p42.leadership.courseName" placeholder="童軍領導才訓練班" />
        <Line label="屆別／編號" en="Course Code" path="pages.p42.leadership.courseCode" placeholder="第 32 屆" />
        <Line label="完成日期" en="Date Completed" type="date" path="pages.p42.leadership.date" />
        <Line label="證書編號" en="Certificate No." path="pages.p42.leadership.certNo" />
      </Grid>
      <Area
        label="訓練及服務摘要"
        en="Training & Service Summary"
        path="pages.p42.summary"
        rows={4}
        placeholder={isEn ? 'Course highlights, service performed…' : '訓練班重點、曾參與的服務……'}
      />
      <Note en="The leadership course certificate is one of the supporting documents listed in section (3) of form PT/18.">
        領導才訓練班證書為 PT/18 丙部所列證明文件之一。
      </Note>
    </Page>
  );
}

/* ------------------------------------------------------------ 第 43 頁：區總監接見 */
export function P43() {
  const { isEn } = useLang();
  return (
    <Page id="p43">
      <H en="DISTRICT REVIEW">區總監接見</H>
      <Grid cols={2}>
        <Line label="接見日期" en="Review Date" type="date" path="pages.p43.date" />
        <Line label="接見地點" en="Venue" path="pages.p43.venue" />
        <Line label="區總監姓名" en="District Commissioner" path="pages.p43.reviewer" wide />
      </Grid>
      <Area label="接見紀錄" en="Review Notes" path="pages.p43.notes" rows={5} />
      <Sig label="接見人簽署" en="Reviewer Signature" path="pages.p43.signature" />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 44 頁：地域接見 */
export function P44() {
  const { isEn } = useLang();
  return (
    <Page id="p44">
      <H en="REGIONAL REVIEW">地域接見</H>
      <Grid cols={2}>
        <Line label="接見日期" en="Review Date" type="date" path="pages.p44.date" />
        <Line label="接見地點" en="Venue" path="pages.p44.venue" />
        <Line label="接見人姓名" en="Reviewer" path="pages.p44.reviewer" wide />
      </Grid>
      <Area label="接見紀錄" en="Review Notes" path="pages.p44.notes" rows={5} />
      <Sig label="接見人簽署" en="Reviewer Signature" path="pages.p44.signature" />
    </Page>
  );
}

/* ------------------------------------------------------------ 第 45 頁：完成紀錄與提名 */
export function P45() {
  const { isEn } = useLang();
  return (
    <Page id="p45">
      <H en="COMPLETION & NOMINATION">完成紀錄與提名</H>
      <Grid cols={2}>
        <Line label="全部項目完成日期" en="All Items Completed" type="date" path="pages.p45.completedDate" />
        <Line label="提名日期" en="Nomination Date" type="date" path="pages.p45.nominationDate" />
        <Line label="提名人（旅長／童軍團長）" en="Nominated By (GSL / SL)" path="pages.p45.nominatedBy" wide />
      </Grid>
      <Area label="提名備註" en="Nomination Notes" path="pages.p45.notes" rows={4} />
      <Sig label="提名人簽署" en="Nominator Signature" path="pages.p45.signature" />
      <div className="pgbtns no-print">
        <Link to="/forms/pt18" className="btn btn--ghost btn--sm">
          <Icon name="file" size={13} /> PT/18 {isEn ? 'Application' : '申請表'}
        </Link>
      </div>
    </Page>
  );
}

/* ------------------------------------------------------------ 第 46 頁：頒發 */
export function P46() {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = byId.L5;
  const stats = badgeStats(book, 'L5');
  return (
    <Page id="p46" dense>
      <H en={`PRESENTATION · ${award.en}`} progress={allIds(award)}>
        頒發
      </H>
      <ProgressRibbon stats={stats} />
      <AwardPresentation awardId="L5" title={`${award.name}頒發`} en={`Award of ${award.en}`} />
      <Note en="Record the presentation only after District recommendation and Regional approval. Congratulations — and keep serving.">
        請待區會推薦及地域批核後才記錄頒發。恭喜你 — 並繼續服務。
      </Note>
      <SyncFootnote />
    </Page>
  );
}
