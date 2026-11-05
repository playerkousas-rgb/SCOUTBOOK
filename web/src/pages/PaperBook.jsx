import React from 'react';
import {
  OFFICIAL_PAGES,
  OFFICIAL_GROUPS,
  AWARD_ART,
  RECORD_COLS,
  ALL_AWARDS,
  SPOTLIGHT_AWARDS,
  ELECTIVE_OPTIONS,
  allStats,
  badgeStats,
  chiefScoutReadiness,
  membershipStatus,
  sliceAward,
  sliceAwardItems,
} from '@shared/book.js';
import { useBook } from '../bookContext.js';
import { useLang } from '../i18n.jsx';
import { CircleChoice, Grid, H, Line, Note, P, Page, Rows, Sig } from '../components/Form.jsx';
import AwardBlock, { AwardArt, AwardPresentation } from '../components/AwardBlock.jsx';
import { OtherBadgeTable } from './BookSkills.jsx';
import { Icon, cx } from '../ui.jsx';
import { Link } from '../router.jsx';

const awardById = Object.fromEntries(
  [...ALL_AWARDS, ...SPOTLIGHT_AWARDS].map((a) => [a.id, a]),
);
const AWARD_FIRST_PAGE = {
  L1: 'p012', L2: 'p016', L3: 'p025', L4: 'p040', L5: 'p060',
  'OT-LD': 'p083', 'OT-SF': 'p086', 'OT-VS': 'p088', 'OT-RG': 'p102', 'OT-CM': 'p103',
};

export const paperPageById = (id) => OFFICIAL_PAGES.find((p) => p.id === id) || null;

/* ------------------------------------------------------------ 共用小件 */

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

/* ------------------------------------------------------------ 獎章頁 */

function L1Investiture() {
  const { isEn } = useLang();
  return (
    <>
      <P en="Investiture record for the Membership Badge (paper page 14).">
        會員章宣誓紀錄（紙本第 14 頁）：宣誓日期及宣誓時之團長。
      </P>
      <Grid cols={2}>
        <Line label="宣誓日期" en="Date of Investiture" type="date" path="pages.p014.investitureDate" />
        <Line label="宣誓時團長" en="Leader at Investiture" path="pages.p014.investingLeader" />
      </Grid>
      <Sig label="團長簽署" en="Signature of Scout Leader" path="pages.p014.leaderSig" />
      {!isEn && <Note>線上版以電子簽署代替紙本親筆簽署及旅團印，效力由旅團決定。</Note>}
    </>
  );
}

function AwardPage({ spec }) {
  const { book } = useBook();
  const { isEn } = useLang();
  const award = awardById[spec.award];
  if (!award) return null;
  const stats = badgeStats(book, award.id);
  const art = AWARD_ART[award.id];
  const primary = spec.items.length ? sliceAward(award, spec.id) : null;
  const continued = spec.continued.length ? sliceAwardItems(award, spec.continued) : null;
  const progressIds = spec.items.length ? spec.items : spec.continued;
  const showElectives = spec.intro && ['L2', 'L3', 'L4', 'L5'].includes(award.id);

  return (
    <Page id={spec.id} dense>
      <H en={spec.en} progress={progressIds}>
        {isEn ? spec.en : spec.zh}
      </H>
      {spec.intro && art && <AwardArt src={art.src} zh={art.zh} en={art.en} />}
      {spec.intro && <AwardIntro award={award} />}
      {showElectives && (
        <>
          <ElectiveCircle awardId={award.id} kind="outdoor" />
          <ElectiveCircle awardId={award.id} kind="community" />
          <Note en="Each award keeps the same elective choice throughout. Sea Scouts take the Sea Activity option; Air Scouts take the Air Activity option.">
            各進度性獎章的自選項目須前後一致；海童軍必選海上活動，空童軍必選航空活動。
          </Note>
        </>
      )}
      <ProgressRibbon stats={stats} />
      {primary && primary.segments.length > 0 && <AwardBlock award={primary} />}
      {continued && continued.segments.length > 0 && (
        <>
          <Note en="Continued from the previous page — same items, same records.">
            續上頁——同一細項、同一紀錄，不重複計算。
          </Note>
          <AwardBlock award={continued} />
        </>
      )}
      {spec.sign && award.id === 'L1' && <L1Investiture />}
      {spec.sign && award.id !== 'L1' && (
        <AwardPresentation
          awardId={award.id}
          title={spec.nominate ? '提名及簽發' : '獎章簽發'}
          en={spec.nominate ? 'Nomination & Issue' : 'Award Issue'}
        />
      )}
      {spec.nominate && (
        <P en="The nomination is countersigned by the leader. Keep this record book safe — it must be presented when applying for the Chief Scout's Award.">
          提名須經團長加簽。請妥善保存本紀錄冊——考取總領袖獎章時必須出示。
        </P>
      )}
      <SyncFootnote />
    </Page>
  );
}

/* ------------------------------------------------------------ 專科徽章頁 */

function OTGroupPage({ spec }) {
  const { isEn } = useLang();
  return (
    <Page id={spec.id} dense>
      <H en={spec.en}>{isEn ? spec.en : spec.zh}</H>
      <P en="One completion record per badge: date, certificate number and leader sign-off.">
        每個徽章只記錄一項完成紀錄：完成日期、證書編號及領袖簽署。
      </P>
      <OtherBadgeTable pageId={spec.id} />
      <SyncFootnote />
    </Page>
  );
}

function OtherBadgesPage({ spec }) {
  const { isEn } = useLang();
  const cols = RECORD_COLS.other;
  return (
    <Page id={spec.id}>
      <H en={spec.en}>{isEn ? spec.en : spec.zh}</H>
      {spec.named !== 0 && (
        <>
          <P en="Named badges without dedicated pages. Badges with full spreads (Leadership, Service Flash, Link, Religious, Community) live on their own pages.">
            未設專頁的具名徽章。已有全文專頁者（領導才、服務、先修、宗教、社區）請記於各自專頁。
          </P>
          <OtherBadgeTable pageId={spec.id} />
        </>
      )}
      <P en="Free rows, as printed on paper.">
        自由行（紙本原樣：獎章或徽章／主考／完成日期）。
      </P>
      <Rows path={`pages.${spec.id}.rows`} cols={cols} min={6} />
      <SyncFootnote />
    </Page>
  );
}

/* ------------------------------------------------------------ 紀錄表頁 */

function RecordTablePage({ spec }) {
  const { isEn } = useLang();
  const cols = RECORD_COLS[spec.cols] || RECORD_COLS.service;
  return (
    <Page id={spec.id}>
      <H en={spec.en}>{isEn ? spec.en : spec.zh}</H>
      <Rows path={`pages.${spec.id}.rows`} cols={cols} min={8} del />
      <SyncFootnote />
    </Page>
  );
}

/* ------------------------------------------------------------ 續期及同意書 */

function RenewalPage({ spec }) {
  const { isEn } = useLang();
  return (
    <Page id={spec.id}>
      <H en={spec.en}>{isEn ? spec.en : spec.zh}</H>
      <Grid cols={2}>
        <Line label="入團日期" en="Date of Joining" type="date" path="member.dateJoined" />
        <Line label="宣誓日期" en="Date of Investiture" type="date" path="pages.p014.investitureDate" />
      </Grid>
      <P en="Yearly renewal rows. Membership is normally renewed on 1st January and valid till 31st December.">
        按年續期行。舊版續期紀錄已自動帶入本頁。
      </P>
      <Rows
        path="pages.p006.rows"
        min={6}
        cols={[
          { k: 'date', label: '更新日期', en: 'Date of Renewal', type: 'date' },
          { k: 'validUntil', label: '有效日期', en: 'Valid till', type: 'date' },
          { k: 'leaderName', label: '負責領袖', en: 'Scouter-in-Charge' },
          { k: 'note', label: '備註', en: 'Remarks' },
        ]}
      />
    </Page>
  );
}

function RenewalSignPage({ spec }) {
  const { isEn } = useLang();
  return (
    <Page id={spec.id}>
      <H en={spec.en}>{isEn ? spec.en : spec.zh}</H>
      <Note en="Membership is normally renewed on 1st January by the Scouter-in-Charge, and valid till 31st December each year.">
        會員資格通常每年由負責領袖簽認，由一月一日起至十二月三十一日止。
      </Note>
      <Sig label="負責領袖簽署" en="Signature of Scouter-in-Charge" path="pages.p007.leaderSig" />
      <Line label="旅或團印備註" en="Group / Troop chop note" path="pages.p007.chopNote" placeholder="線上版以電子簽署代替印鑑" />
    </Page>
  );
}

function ConsentPage({ spec }) {
  const { isEn } = useLang();
  const agree = [
    { value: 'yes', zh: '同意', en: 'Consent' },
    { value: 'no', zh: '不同意', en: 'Decline' },
  ];
  return (
    <Page id={spec.id}>
      <H en={spec.en}>{isEn ? spec.en : spec.zh}</H>
      <P en="I consent to him/her participating in the Hong Kong Award for Young People and undertaking its activities. Details of the consent form can be found on the Scouts Information Hub.">
        本人同意他／她參與香港青年獎勵計劃獎章，並為履行其要求而參與相關活動。有關同意書詳情，請參閱童軍資訊站網頁。
      </P>
      <CircleChoice
        label="同意參與獎勵計劃（家長／監護人填寫）"
        en="Consent to participate (Parent / Guardian)"
        path="pages.p015.consentJoin"
        options={agree}
      />
      <CircleChoice
        label="同意同時展開獎勵計劃之考核（成員填寫）"
        en="Consent to simultaneous assessment (Member)"
        path="pages.p015.consentAssess"
        options={agree}
      />
      <Grid cols={2}>
        <Sig label="成員簽署" en="Signature of the Scout" path="pages.p015.memberSig" />
        <Sig label="家長／監護人簽署" en="Signature of Parent / Guardian" path="pages.p015.parentSig" />
      </Grid>
      <Line label="日期" en="Date" type="date" path="pages.p015.date" />
    </Page>
  );
}

/* ------------------------------------------------------------ 靜態頁（紙本 p8–11、p76–77） */

const LAWS = [
  ['童軍信用為人敬。', 'A Scout is to be trusted.'],
  ['童軍待人要忠誠。', 'A Scout is loyal.'],
  ['童軍友善兼親切。', 'A Scout is friendly and considerate.'],
  ['童軍相處如手足。', 'A Scout belongs to the world-wide family of Scouts.'],
  ['童軍勇敢不怕難。', 'A Scout has courage in all difficulties.'],
  ['童軍愛物更惜陰。', 'A Scout makes good use of time and is careful of possessions and property.'],
  ['童軍自重又重人。', 'A Scout has self respect and respect for others.'],
];

function StaticSection() {
  return (
    <>
      <P en="The aim of the Scout Section is to encourage the physical, mental, and spiritual development of youths aged 11 to 15 as an integral part of the continuous training of the Scout Movement throughout the age ranges.">
        目的：童軍支部之目的，旨在促進十一至十五歲之少年人身心精神之陶冶與啟發，以貫徹整個童軍運動連續性訓練。
      </P>
      <P en="The method is, guided by adult leadership and based on the Scout Law and Promise, to provide an enjoyable, attractive and worthwhile scheme of progressive training, and to implement the Patrol system in the Troop.">
        方法：在成年人領導下，以童軍規律與誓詞為本，給予歡愉富吸引力而有價值之有進度性訓練，並在團內實行小隊制度以達成童軍支部目的。
      </P>
      <P en="Be Prepared.">童軍銘言：準備。</P>
    </>
  );
}

function StaticPromise() {
  const { isEn } = useLang();
  return (
    <>
      <div className="promise">
        <p>我願以信譽為誓，竭盡所能；</p>
        <p>對神明，對國家，盡責任；</p>
        <p>對別人，要幫助；對規律，必遵行。</p>
        <p className="promise__en">
          On my honour, I promise that I will do my best; to do my duty to God and to my Country; to
          help other people, and to keep the Scout Law.
        </p>
      </div>
      <H en="THE SCOUT LAW">
        {isEn ? 'The Scout Law' : '童軍規律'}
      </H>
      <ol className="laws">
        {LAWS.map(([zh, en], i) => (
          <li key={i}>
            {isEn ? en : zh}
            <em>{isEn ? zh : en}</em>
          </li>
        ))}
      </ol>
    </>
  );
}

function StaticProgressive() {
  const { isEn } = useLang();
  const items = isEn
    ? [
      'Four progressive awards: Pathfinder, Standard, Advanced and Chief Scout’s Award.',
      'Start with the Pathfinder Award; complete one award before moving to the next.',
      'Choose one of Outdoor / Sea / Air as the major elective, and keep the same choice at every higher award. Sea Scouts must choose Sea; Air Scouts must choose Air.',
      'Joining at 13 or above? You may go straight to the Advanced Award after completing the Outdoor Challenge of the Pathfinder and Standard Awards.',
      'Within three months before promotion to Venture Scout, you may start the Venture Scout Membership Badge.',
    ]
    : [
      '童軍支部共有四個進度性獎章：探索、標準、高級及總領袖獎章。',
      '正常情況下由探索獎章開始，完成某一進度章後才考高一級。',
      '戶外／海上／航空三選一為主要考核項目，各獎章選項須相同；海童軍必選海上，空童軍必選航空。',
      '十三歲或以後加入？可只完成探索及標準獎章之戶外挑戰部份，然後直入高級獎章。',
      '晉升深資童軍前三個月內，可開始考取深資童軍支部之會員章。',
    ];
  return (
    <>
      <ul className="dots">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
      <div className="pagelinks">
        {['L2', 'L3', 'L4', 'L5'].map((id) => (
          <Link key={id} to={`/p/${AWARD_FIRST_PAGE[id]}`} className="btn btn--ghost btn--sm">
            {isEn ? awardById[id].en : awardById[id].name}
          </Link>
        ))}
      </div>
    </>
  );
}

function StaticRoute() {
  const { isEn } = useLang();
  const steps = ['L1', 'L2', 'L3', 'L4', 'L5'];
  return (
    <>
      <div className="routechain">
        {steps.map((id, i) => (
          <React.Fragment key={id}>
            {i > 0 && <span className="routechain__arrow" aria-hidden="true">↓</span>}
            <Link to={`/p/${AWARD_FIRST_PAGE[id]}`} className="routechain__step">
              {AWARD_ART[id] && <img src={AWARD_ART[id].src} alt="" />}
              <span>{isEn ? awardById[id].en : awardById[id].name}</span>
            </Link>
          </React.Fragment>
        ))}
      </div>
      <Note en="Complete each award before moving on to the next one.">
        完成某一獎章後，才進至下一級。
      </Note>
    </>
  );
}

function StaticOtGuide({ lang }) {
  const { isEn } = useLang();
  const en = lang === 'en' ? true : isEn;
  const rows = en
    ? [
      ['Interest', 'Elementary; mainly for ages 11–13. Green background.', 'p078'],
      ['Pursuit', 'Practical; mainly for ages 13–15. Blue background.', 'p079'],
      ['Service', 'Higher, absolute standard for older Scouts. Red background.', 'p080'],
      ['Instructor', 'Gold-bordered; serve the Movement with a specialism.', 'p081'],
      ['Sea / Air Activity', 'Oarsman → Boatman → Boatswain; Basic → Intermediate → Advanced.', 'p082'],
      ['Leadership / Service Flash / Link', 'Full spreads with their own items.', 'p083'],
      ['Religious / Community', 'One page each.', 'p102'],
    ]
    : [
      ['興趣組', '屬初級，主要為十一至十三歲而設。底色綠色。', 'p078'],
      ['技能組', '趨於實用，為十三至十五歲而設。底色藍色。', 'p079'],
      ['服務組', '及格標準較高，為較年長成員而設，標準固定。主色紅色。', 'p080'],
      ['教導組', '金邊；以專門技能替童軍運動服務。', 'p081'],
      ['海上／航空活動', '艇工→水手→水手長；初級→中級→高級。', 'p082'],
      ['領導才／服務／先修', '各有全文專頁及細項。', 'p083'],
      ['宗教／社區', '各一頁。', 'p102'],
    ];
  return (
    <>
      <ul className="dots">
        {rows.map(([name, desc, pid]) => (
          <li key={name}>
            <Link to={`/p/${pid}`}>
              <strong>{name}</strong>
            </Link>
            {' — '}
            {desc}
          </li>
        ))}
      </ul>
      <Note en="Interest, Pursuit, Service and Instructor badges: 143 in total. Record one completion per badge.">
        興趣、技能、服務、教導四組共 143 個徽章，每個只記一項完成紀錄。
      </Note>
    </>
  );
}

function StaticPage({ spec }) {
  const { isEn } = useLang();
  return (
    <Page id={spec.id}>
      <H en={spec.en}>{isEn ? spec.en : spec.zh}</H>
      {spec.text === 'section' && <StaticSection />}
      {spec.text === 'promise' && <StaticPromise />}
      {spec.text === 'progressive' && <StaticProgressive />}
      {spec.text === 'route' && <StaticRoute />}
      {spec.text === 'otguide1' && <StaticOtGuide lang="zh" />}
      {spec.text === 'otguide2' && <StaticOtGuide lang="en" />}
    </Page>
  );
}

/* ------------------------------------------------------------ 待建頁 */

const STUB_FIELDS = {
  p1: ['童軍成員編號 SCOUT ID', '姓名（中文／英文）', '持有人簽署', '緊急聯絡（姓名關係／電話／地址）', '近照（旅印）'],
  p2: ['出生日期／地點', '身份證（首四位）／護照號碼', '地址／電話', '血型', '學校', '宗教'],
  p3: ['地域／區別／旅別', '主辦機構', '小隊', '童軍團長及電話', '旅部地址及電話'],
  p4: ['小童軍／幼童軍經驗（年期／旅別／職位／最高獎章）', '小隊職務（副／正／團隊長任期）', '服務年星（一至五年）'],
  p5: ['轉旅紀錄（旅別／日期／前任團長）', '搬遷紀錄（日期／新地址）'],
};

function StubPage({ spec }) {
  const { isEn } = useLang();
  const fields = spec.kind === 'personal' ? STUB_FIELDS[spec.form] || [] : [];
  return (
    <Page id={spec.id}>
      <H en={spec.en}>{isEn ? spec.en : spec.zh}</H>
      <Note en="This official page is under construction. Your existing records are kept and will appear here.">
        此官方頁建構中。已有紀錄會完整保留，完成後自動顯示於此。
      </Note>
      {fields.length > 0 && (
        <ul className="dots">
          {fields.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
    </Page>
  );
}

/* ------------------------------------------------------------ 路由 */

export function PaperPage({ id }) {
  const spec = paperPageById(id);
  if (!spec) return null;
  switch (spec.kind) {
    case 'award':
      return <AwardPage spec={spec} />;
    case 'ot-group':
      return <OTGroupPage spec={spec} />;
    case 'other-badges':
      return <OtherBadgesPage spec={spec} />;
    case 'record-table':
      return <RecordTablePage spec={spec} />;
    case 'renewal':
      return <RenewalPage spec={spec} />;
    case 'renewal-sign':
      return <RenewalSignPage spec={spec} />;
    case 'ayp-consent':
      return <ConsentPage spec={spec} />;
    case 'static':
      return <StaticPage spec={spec} />;
    default:
      return <StubPage spec={spec} />;
  }
}

/* ------------------------------------------------------------ 目錄及進度摘要 */

export function ContentsPage() {
  const { book } = useBook();
  const { isEn } = useLang();
  const stats = allStats(book);
  const membership = membershipStatus(book);
  const cs = chiefScoutReadiness(book);
  const spotStats = SPOTLIGHT_AWARDS.map((a) => ({ ...badgeStats(book, a.id), award: a }));
  const meta = (id) => OFFICIAL_PAGES.find((p) => p.id === id) || {};

  return (
    <Page id="contents" dense>
      <H en="CONTENTS & PROGRESS">{isEn ? 'Contents & Progress' : '目錄及進度摘要'}</H>

      <div className="tocsum">
        {stats.awards.map((a) => (
          <Link key={a.award.id} to={`/p/${AWARD_FIRST_PAGE[a.award.id]}`} className="tocsum__card">
            <span className="tocsum__name">
              {isEn ? a.award.en : a.award.name}
              <em>{isEn ? a.award.name : a.award.en}</em>
            </span>
            <span className="tocsum__bar">
              <i style={{ width: `${a.percent}%` }} />
            </span>
            <span className="tocsum__num">
              {a.done}/{a.total} {a.complete && <b>✓</b>}
            </span>
          </Link>
        ))}
        {spotStats.map((a) => (
          <Link key={a.award.id} to={`/p/${AWARD_FIRST_PAGE[a.award.id]}`} className="tocsum__card tocsum__card--spot">
            <span className="tocsum__name">
              {isEn ? a.award.en : a.award.name}
              <em>{isEn ? a.award.name : a.award.en}</em>
            </span>
            <span className="tocsum__bar">
              <i style={{ width: `${a.percent}%` }} />
            </span>
            <span className="tocsum__num">
              {a.done}/{a.total} {a.complete && <b>✓</b>}
            </span>
          </Link>
        ))}
      </div>

      <Grid cols={3}>
        <div className="tocfact">
          <span>{isEn ? 'Proficiency badges' : '專科徽章紀錄'}</span>
          <strong>{stats.activityBadges}</strong>
        </div>
        <div className="tocfact">
          <span>{isEn ? 'Membership valid until' : '會員資格有效期'}</span>
          <strong>{membership.validUntil || '—'}</strong>
        </div>
        <div className="tocfact">
          <span>{isEn ? 'Advanced Award' : '童軍高級獎章'}</span>
          <strong>
            {cs.advancedComplete ? (isEn ? 'Completed' : '已完成') : `${cs.advancedDone}/${cs.advancedTotal}`}
          </strong>
        </div>
      </Grid>

      <div className="toclist">
        {OFFICIAL_GROUPS.map((group) => (
          <section key={group.id} className="tocgroup">
            <h3>
              {isEn ? group.en : group.zh}
              {!isEn && <em>{group.en}</em>}
            </h3>
            {OFFICIAL_PAGES.filter((p) => p.group === group.id).map((p) => (
              <Link key={p.id} to={`/p/${p.id}`} className="tocrow">
                <span className="tocrow__no">{p.page}</span>
                <span className="tocrow__title">
                  {isEn ? p.en : p.zh}
                  {!isEn && p.en && <em>{p.en}</em>}
                </span>
                <Icon name="chevron" size={12} />
              </Link>
            ))}
          </section>
        ))}
        <section className="tocgroup">
          <h3>
            {isEn ? 'Digital Appendix' : '數位附錄'}
            {!isEn && <em>Digital Appendix</em>}
          </h3>
          <Link to="/p/appendix" className="tocrow">
            <span className="tocrow__no">{isEn ? 'App.' : '附錄'}</span>
            <span className="tocrow__title">
              {isEn ? 'Sync, backup & print' : '同步、備份及列印'}
            </span>
            <Icon name="chevron" size={12} />
          </Link>
        </section>
      </div>
    </Page>
  );
}

export default PaperPage;
