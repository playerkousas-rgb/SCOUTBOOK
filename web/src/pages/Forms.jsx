import React, { useEffect, useMemo, useState } from 'react';
import {
  FORM_META,
  FORM_ORDER,
  PRINT_CHECKLIST,
  PT18_CHECKLIST,
  P120A1_PROCEDURE,
  buildFormValues,
  formReadiness,
} from '@shared/forms.js';
import { OTHER_BADGES, ELECTIVE_OPTIONS } from '@shared/book.js';
import { useBook } from '../bookContext.js';
import Write from '../components/Write.jsx';
import { CircleChoice } from '../components/Form.jsx';
import { Icon, cx } from '../ui.jsx';
import { Link } from '../router.jsx';
import { useLang } from '../i18n.jsx';

function usePrintPreview() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    document.documentElement.toggleAttribute('data-print-preview', on);
    return () => document.documentElement.removeAttribute('data-print-preview');
  }, [on]);
  return [on, () => setOn((v) => !v)];
}

function useFormEditor(formId) {
  const { book, update } = useBook();
  const values = buildFormValues(book, formId);
  const set = (key, val) => {
    update((b) => ({
      ...b,
      forms: { ...(b.forms || {}), [formId]: { ...(b.forms?.[formId] || {}), [key]: val } },
    }));
  };
  return [values, set];
}

const electiveLabel = (kind, value, isEn) => {
  const opt = (ELECTIVE_OPTIONS[kind] || []).find((o) => o.value === value);
  if (!opt) return value || '';
  return isEn ? opt.en : opt.zh;
};

function FCell({ label, en, k, values, set, type = 'text', span = 1, placeholder = '' }) {
  const { isEn } = useLang();
  return (
    <div className={cx('ptcell', `ptcell--s${span}`)}>
      <span className="ptcell__lbl">
        {isEn && en ? en : label}
        {!isEn && en && <em>{en}</em>}
      </span>
      <div className="ptcell__val">
        <Write value={values[k] || ''} onChange={(v) => set(k, v)} type={type} compact placeholder={placeholder} label={label} />
      </div>
    </div>
  );
}

function FormHead({ meta, values }) {
  const { isEn } = useLang();
  return (
    <div className="pthead">
      <div>
        <strong>{isEn ? 'SCOUT ASSOCIATION OF HONG KONG' : '香港童軍總會'}</strong>
        <h1>{isEn ? meta.en : meta.title}</h1>
        <p>{isEn ? meta.title : meta.en}</p>
      </div>
      <div className="pthead__right">
        <span className="pthead__code">{meta.code}</span>
        <span className="ptphoto">
          {values.photo ? <img src={values.photo} alt="" /> : isEn ? 'PHOTO' : '近照'}
        </span>
      </div>
    </div>
  );
}

function SectionTitle({ children, en }) {
  const { isEn } = useLang();
  return (
    <h2 className="ptsec">
      {isEn && en ? en : children}
      {!isEn && en && <em> {en}</em>}
    </h2>
  );
}

function SignatureLine({ label, en, sig }) {
  const { isEn } = useLang();
  return (
    <div className="ptsignbox">
      <span className="ptcell__lbl">
        {isEn && en ? en : label}
        {!isEn && en && <em>{en}</em>}
      </span>
      <div className="ptsignbox__ink">
        {sig?.png ? <img src={sig.png} alt={label} /> : <span className="ptblank" />}
      </div>
      {sig?.name && <small>{sig.name}</small>}
    </div>
  );
}

/** 專科徽章下拉選擇（按組別分組，共 143 個）。 */
function BadgeSelect({ label, en, value, onChange }) {
  const { isEn } = useLang();
  const groups = useMemo(() => {
    const order = [];
    OTHER_BADGES.forEach((b) => {
      if (!order.find((g) => g.group === b.group)) {
        order.push({ group: b.group, name: b.groupName, nameEn: b.groupNameEn });
      }
    });
    return order;
  }, []);
  return (
    <label className="ptselect">
      <span className="ptcell__lbl">
        {isEn && en ? en : label}
        {!isEn && en && <em>{en}</em>}
      </span>
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} aria-label={isEn && en ? en : label}>
        <option value="">{isEn ? '— Select badge —' : '— 請選擇徽章 —'}</option>
        {groups.map((g) => (
          <optgroup key={g.group} label={isEn ? g.nameEn || g.name : g.name}>
            {OTHER_BADGES.filter((b) => b.group === g.group).map((b) => (
              <option key={b.id} value={b.id}>
                {isEn ? b.en : b.name}（{b.badgeId}）
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

/* ============================================================
   表格總覽頁 (/forms)
   ============================================================ */

export function FormsIndex() {
  const { book } = useBook();
  const { isEn } = useLang();

  return (
    <div className="formsindex">
      <div className="formsindex__head">
        <div>
          <span className="eyebrow">OFFICIAL FORMS · AUTO-FILLED</span>
          <h1>{isEn ? 'Scout Forms & Print Checklist' : '童軍申請表及列印檢查清單'}</h1>
          <p>
            {isEn
              ? 'Personal particulars, Scout ID, HKID first 4 characters, award dates and the applicant signature are auto-filled from your record book. Tap any box to fine-tune before A4 printing.'
              : '個人摘要、SCOUT ID、身份證首四位、獎章日期及申請人簽名均由紀錄冊自動帶入；列印前仍可點擊任何格線微調。'}
          </p>
        </div>
        <div className="formsindex__btns">
          <Link to="/p/p060" className="btn btn--ghost btn--sm">
            <Icon name="back" size={14} /> {isEn ? 'Back to Book' : '返回紀錄冊'}
          </Link>
          <Link to="/forms/all" className="btn btn--gold btn--sm">
            <Icon name="print" size={14} /> {isEn ? 'Open All Forms' : '一次過預覽全部表格'}
          </Link>
        </div>
      </div>

      <div className="formcards">
        {FORM_ORDER.map((id) => {
          const meta = FORM_META[id];
          const check = formReadiness(book, id);
          return (
            <article key={id} className={cx('formcard', !meta.official && 'formcard--unofficial')}>
              <div className="formcard__top">
                <span className="formcard__code">{meta.code}</span>
                <span className={cx('formcard__status', check.ready && 'is-ready')}>
                  {check.ready
                    ? isEn
                      ? 'Ready to Print'
                      : '資料齊備'
                    : isEn
                      ? `${check.missing.length} fields pending`
                      : `尚有 ${check.missing.length} 項待填`}
                </span>
              </div>
              <h2>{isEn ? meta.en : meta.title}</h2>
              <p className="formcard__when">{meta.when}</p>
              <p className="tiny">{isEn && meta.noteEn ? meta.noteEn : meta.note}</p>
              {!check.ready && (
                <p className="formcard__missing">
                  <strong>{isEn ? 'Pending: ' : '待補填：'}</strong>
                  {check.missing.join('、')}
                </p>
              )}
              <div className="formcard__actions">
                <Link to={`/forms/${id}`} className="btn btn--primary btn--sm">
                  <Icon name="file" size={14} />{' '}
                  {isEn ? `Open ${meta.short} (${meta.pages}p)` : `開啟 ${meta.short}（共 ${meta.pages} 頁）`}
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <section className="checklistcard">
        <h2>{isEn ? 'A4 Print Checklist & Paper Page Mapping' : 'A4 列印檢查清單及紙本頁碼對照'}</h2>
        <div className="checklistgrid">
          {PRINT_CHECKLIST.map((group) => (
            <article key={group.title}>
              <h3>{group.title}</h3>
              <p className="tiny">
                {group.paper} → {isEn ? 'digital pages' : '電子頁'} {group.digital}
              </p>
              <ul>
                {group.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   PT/18 總領袖獎章及證書申請表
   ============================================================ */

function FormPT18() {
  const { isEn } = useLang();
  const [v, set] = useFormEditor('pt18');

  return (
    <>
      <article className="a4sheet ptform">
        <FormHead meta={FORM_META.pt18} values={v} />

        <SectionTitle en="A. Personal Particulars">甲、個人資料</SectionTitle>
        <div className="ptgrid">
          <FCell label="姓名（中文）" en="Name (Chinese)" k="nameZh" values={v} set={set} span={2} />
          <FCell label="姓名（英文）" en="Name (English)" k="nameEn" values={v} set={set} span={2} />
          <FCell label="出生日期" en="Date of Birth" k="dob" values={v} set={set} type="date" />
          <FCell label="年齡" en="Age" k="age" values={v} set={set} />
          <FCell label="性別" en="Gender" k="gender" values={v} set={set} />
          <FCell label="就讀年級" en="School Level" k="schoolLevel" values={v} set={set} />
          <FCell label="學校" en="School" k="school" values={v} set={set} span={2} />
          <FCell label="身份證首四位" en="HKID (first 4)" k="hkidPrefix" values={v} set={set} span={2} />
          <FCell label="童軍成員編號" en="Scout ID" k="scoutId" values={v} set={set} span={2} />
          <FCell label="童軍團" en="Scout Troop" k="troop" values={v} set={set} span={2} />
          <FCell label="小隊" en="Patrol" k="patrol" values={v} set={set} />
          <FCell label="旅" en="Group" k="group" values={v} set={set} />
          <FCell label="區" en="District" k="district" values={v} set={set} />
          <FCell label="地域" en="Region" k="region" values={v} set={set} />
          <FCell label="通訊地址（中文）" en="Address (Chinese)" k="addressZh" values={v} set={set} span={2} />
          <FCell label="通訊地址（英文）" en="Address (English)" k="addressEn" values={v} set={set} span={2} />
          <FCell label="聯絡電話" en="Contact No." k="phone" values={v} set={set} span={2} />
          <FCell label="電郵地址" en="E-mail" k="email" values={v} set={set} span={2} />
        </div>

        <SectionTitle en="B. Electives (Pathfinder / Standard / Advanced)">乙、選修項目（探索／標準／高級獎章）</SectionTitle>
        <table className="pttable">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>{isEn ? 'Award' : '獎章'}</th>
              <th style={{ width: '30%' }}>{isEn ? 'Elective choice' : '自選項目'}</th>
              <th>{isEn ? 'Completed' : '完成日期'}</th>
              <th>{isEn ? 'Outdoor done' : '戶外挑戰完成'}</th>
              <th>{isEn ? 'Awarded' : '獎章簽發'}</th>
            </tr>
          </thead>
          <tbody>
            {(v.electives || []).map((row) => (
              <tr key={row.awardId}>
                <td>{row.awardId}</td>
                <td>
                  {electiveLabel('outdoor', row.outdoor, isEn)}
                  {row.community ? ` · ${electiveLabel('community', row.community, isEn)}` : ''}
                </td>
                <td>{row.completedDate || ''}</td>
                <td>{row.outdoorDate || ''}</td>
                <td>{row.awardDate || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="ptnotes">
          {isEn
            ? 'Elective choices come from the circled items on the award pages; dates come from the progress records.'
            : '自選項目來自獎章頁圈選，日期來自進度紀錄。'}
        </p>
      </article>

      <article className="a4sheet ptform">
        <SectionTitle en="C. Required Badges & Certificates">丙、所需徽章及證書</SectionTitle>
        <table className="pttable">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>{isEn ? 'Award' : '獎章'}</th>
              <th style={{ width: '46%' }}>{isEn ? 'Badge / certificate' : '專科徽章／證書'}</th>
              <th>{isEn ? 'Course / class' : '屆別'}</th>
              <th>{isEn ? 'Date' : '完成日期'}</th>
            </tr>
          </thead>
          <tbody>
            {(v.sectionC || []).map((row, i) => (
              <tr key={`${row.badge}-${i}`}>
                <td>{row.award}</td>
                <td>{row.badge}</td>
                <td>{row.leadership ? row.courseCode || '' : ''}</td>
                <td>
                  {row.leadership ? (
                    row.date || ''
                  ) : (
                    <Write
                      value={row.date || ''}
                      onChange={(d) => set(`sectionC_${row.badge}`, d)}
                      type="date"
                      compact
                      label={row.badge}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="ptnotes">
          {isEn
            ? 'Dates must match the badge records on pages 24–39 and the leadership course on page 58.'
            : '日期須與第 24–39 頁徽章紀錄及第 58 頁領導才訓練班一致。'}
        </p>

        <SectionTitle en="D. Chief Scout's Award Training Record">丁、總領袖獎章訓練紀錄</SectionTitle>
        {(v.sectionD || []).map((group) => (
          <div key={group.title} className="ptsubgroup">
            <h3 className="ptsubgroup__title">{group.title}</h3>
            <table className="pttable">
              <thead>
                <tr>
                  <th style={{ width: '64%' }}>{isEn ? 'Item' : '考驗項目'}</th>
                  <th>{isEn ? 'Date completed' : '完成日期'}</th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map((row, i) => (
                  <tr key={`${row.label}-${i}`}>
                    <td>
                      {row.label}
                      <small className="pttable__code"> {row.desc}</small>
                    </td>
                    <td>
                      {row.id ? (
                        row.date || ''
                      ) : (
                        <Write
                          value={v.sectionD_E2 || ''}
                          onChange={(d) => set('sectionD_E2', d)}
                          type="date"
                          compact
                          label={row.label}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <SectionTitle en="Signatures & Approval">簽署及批核</SectionTitle>
        <div className="ptsignrow">
          <SignatureLine label="申請人簽署" en="Applicant's Signature" sig={v.holderSignature} />
          <div className="ptsignbox">
            <FCell label="日期" en="Date" k="applicantDate" values={v} set={set} type="date" />
          </div>
          <div className="ptsignbox">
            <FCell label="旅長／童軍團長提名" en="GSL / SL Nomination" k="nominationName" values={v} set={set} />
            <FCell label="日期" en="Date" k="nominationDate" values={v} set={set} type="date" />
            <span className="ptendorse__stamp">{isEn ? 'Group Stamp' : '旅印'}</span>
          </div>
          <div className="ptsignbox">
            <FCell label="區總監" en="District Commissioner" k="recommendationName" values={v} set={set} />
            <FCell label="日期" en="Date" k="recommendationDate" values={v} set={set} type="date" />
            <span className="ptendorse__stamp">{isEn ? 'District Stamp' : '區印'}</span>
          </div>
          <div className="ptsignbox">
            <FCell label="地域總監" en="Regional Commissioner" k="confirmationName" values={v} set={set} />
            <FCell label="日期" en="Date" k="confirmationDate" values={v} set={set} type="date" />
            <span className="ptendorse__stamp">{isEn ? 'Regional Stamp' : '地域印'}</span>
          </div>
          <div className="ptsignbox">
            <FCell label="總監批核" en="Commissioner Approval" k="approvalName" values={v} set={set} />
            <FCell label="日期" en="Date" k="approvalDate" values={v} set={set} type="date" />
          </div>
          <div className="ptsignbox">
            <FCell label="總會收表日期" en="Received (HQ)" k="receivedDate" values={v} set={set} type="date" />
            <FCell label="證書簽發日期" en="Certificate Issued" k="certIssueDate" values={v} set={set} type="date" />
          </div>
        </div>

        <div className="ptfollow">
          <strong>{isEn ? 'Documents to attach (PT/18):' : '遞交時須附上（PT/18）：'}</strong>
          <ul>
            {PT18_CHECKLIST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
}

/* ============================================================
   P120A1 童軍專科徽章／獎章考驗申請表
   ============================================================ */

function FormP120A1() {
  const { isEn } = useLang();
  const [v, set] = useFormEditor('p120a1');

  return (
    <>
      <article className="a4sheet ptform">
        <FormHead meta={FORM_META.p120a1} values={v} />

        <SectionTitle en="A. Applicant (to be completed by the applicant)">甲、申請人資料（由申請人填寫）</SectionTitle>
        <div className="ptgrid">
          <FCell label="申請編號" en="Ref. No." k="refNo" values={v} set={set} span={2} />
          <FCell label="姓名（中文）" en="Name (Chinese)" k="nameZh" values={v} set={set} span={2} />
          <FCell label="姓名（英文）" en="Name (English)" k="nameEn" values={v} set={set} span={2} />
          <FCell label="出生日期" en="Date of Birth" k="dob" values={v} set={set} type="date" />
          <FCell label="年齡" en="Age" k="age" values={v} set={set} />
          <FCell label="性別" en="Gender" k="gender" values={v} set={set} />
          <FCell label="童軍成員編號" en="Scout ID" k="scoutId" values={v} set={set} />
          <FCell label="童軍團" en="Scout Troop" k="troop" values={v} set={set} span={2} />
          <FCell label="旅" en="Group" k="group" values={v} set={set} />
          <FCell label="區" en="District" k="district" values={v} set={set} />
          <FCell label="地域" en="Region" k="region" values={v} set={set} />
          <FCell label="聯絡電話" en="Contact No." k="phone" values={v} set={set} />
        </div>

        <div className="ptgrid">
          <div className="ptcell ptcell--s4">
            <BadgeSelect
              label="報考徽章"
              en="Badge Applied For"
              value={v.badgeId}
              onChange={(id) => set('badgeId', id)}
            />
            {v.badgeName && (
              <p className="tiny">
                {v.badgeName} · {v.badgeGroup}
                {v.badgeDate ? ` · ${isEn ? 'awarded' : '已於'} ${v.badgeDate} ${isEn ? '' : '取得'}` : ''}
                {v.badgeCert ? ` · ${v.badgeCert}` : ''}
              </p>
            )}
          </div>
        </div>

        <CircleChoice
          label="報考安排（請圈出一項）"
          en="Assessment Arrangement (Circle One)"
          path="forms.p120a1.arrangement"
          options={[
            { value: 'self', zh: '自行報考', en: 'Individual application' },
            { value: 'course', zh: '認可訓練班', en: 'Approved training course' },
            { value: 'examday', zh: '專章考驗日', en: 'Badge assessment day' },
            { value: 'other', zh: '其他', en: 'Other' },
          ]}
        />
        <div className="ptgrid">
          <FCell label="訓練班／機構名稱" en="Course / Organisation" k="arrangementName" values={v} set={set} span={2} />
          <FCell label="主辦單位" en="Organiser" k="arrangementOrg" values={v} set={set} span={2} />
        </div>

        <div className="ptsignrow">
          <SignatureLine label="申請人簽署" en="Applicant's Signature" sig={v.holderSignature} />
          <div className="ptsignbox">
            <FCell label="童軍團長副署" en="SL Countersignature" k="slName" values={v} set={set} />
            <FCell label="日期" en="Date" k="slDate" values={v} set={set} type="date" />
            <span className="ptendorse__stamp">{isEn ? 'Troop Stamp' : '團印'}</span>
          </div>
        </div>
      </article>

      <article className="a4sheet ptform">
        <SectionTitle en="B. Examiner (to be completed by the examiner)">乙、主考資料（由主考填寫）</SectionTitle>
        <div className="ptgrid">
          <FCell label="主考姓名" en="Examiner Name" k="examinerName" values={v} set={set} span={2} />
          <FCell label="聯絡電話" en="Contact No." k="examinerPhone" values={v} set={set} span={2} />
          <FCell label="主考資歷" en="Qualifications" k="examinerQualification" values={v} set={set} span={2} />
          <FCell label="資歷證書名稱" en="Certificate" k="examinerCertName" values={v} set={set} />
          <FCell label="證書編號" en="Certificate No." k="examinerCertNo" values={v} set={set} />
          <FCell label="考驗方式" en="Assessment Mode" k="assessmentMode" values={v} set={set} span={2} />
          <FCell label="考驗日期" en="Assessment Date" k="assessmentDate" values={v} set={set} type="date" span={2} />
        </div>
        <div className="ptcell ptcell--s4">
          <span className="ptcell__lbl">{isEn ? 'Assessment plan' : '考驗計劃'}</span>
          <div className="ptcell__val">
            <Write value={v.assessmentPlan || ''} onChange={(x) => set('assessmentPlan', x)} multiline rows={3} label="考驗計劃" />
          </div>
        </div>

        <SectionTitle en="Authorised Person (District)">獲授權人士（區會）</SectionTitle>
        <CircleChoice
          label="是否接納主考安排"
          en="Accept Examiner Arrangement?"
          path="forms.p120a1.accepted"
          options={[
            { value: 'accepted', zh: '接納', en: 'Accepted' },
            { value: 'rejected', zh: '不接納', en: 'Not accepted' },
          ]}
        />
        <div className="ptgrid">
          <FCell label="獲授權人姓名" en="Name" k="authorisedName" values={v} set={set} span={2} />
          <FCell label="職位" en="Post" k="authorisedPost" values={v} set={set} />
          <FCell label="日期" en="Date" k="authorisedDate" values={v} set={set} type="date" />
        </div>
        <div className="ptcell ptcell--s4">
          <span className="ptcell__lbl">{isEn ? 'Reasons (if not accepted)' : '原因（如不接納）'}</span>
          <div className="ptcell__val">
            <Write value={v.acceptReason || ''} onChange={(x) => set('acceptReason', x)} multiline rows={2} label="不接納原因" />
          </div>
        </div>

        <SectionTitle en="C. Result (to be completed by the examiner)">丙、考驗結果（由主考填寫）</SectionTitle>
        <CircleChoice
          label="考驗結果"
          en="Result"
          path="forms.p120a1.result"
          options={[
            { value: 'pass', zh: '及格', en: 'Pass' },
            { value: 'fail', zh: '不及格', en: 'Fail' },
          ]}
        />
        <div className="ptcell ptcell--s4">
          <span className="ptcell__lbl">{isEn ? 'Examiner remarks' : '主考評語'}</span>
          <div className="ptcell__val">
            <Write value={v.examinerRemarks || ''} onChange={(x) => set('examinerRemarks', x)} multiline rows={2} label="主考評語" />
          </div>
        </div>
        <div className="ptgrid">
          <FCell label="考驗日期" en="Date" k="resultDate" values={v} set={set} type="date" span={2} />
        </div>

        <SectionTitle en="D. Issue (to be completed by the District)">丁、簽發（由區會填寫）</SectionTitle>
        <div className="ptgrid">
          <FCell label="簽發人姓名" en="Issued By" k="issueName" values={v} set={set} span={2} />
          <FCell label="職位" en="Post" k="issuePost" values={v} set={set} />
          <FCell label="簽發日期" en="Issue Date" k="issueDate" values={v} set={set} type="date" />
          <FCell label="證書編號" en="Certificate No." k="issueCertNo" values={v} set={set} />
        </div>
        <p className="ptnotes">
          {isEn
            ? 'The issue date and certificate number flow back into the badge record on the badge pages.'
            : '簽發日期及證書編號會帶回徽章頁的完成紀錄。'}
        </p>

        <div className="ptfollow">
          <strong>{isEn ? 'Procedure:' : '辦理程序：'}</strong>
          <ol>
            {P120A1_PROCEDURE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </article>
    </>
  );
}

/* ============================================================
   P120A2 附加資料表格
   ============================================================ */

function P120A2Extras({ values, set }) {
  const { isEn } = useLang();
  const rows = Array.isArray(values.extraBadges) ? values.extraBadges : [];

  const updateRow = (index, patch) => {
    const next = rows.map((r, i) => (i === index ? { ...r, ...patch } : r));
    set('extraBadges', next);
  };
  const addRow = () => set('extraBadges', [...rows, {}]);
  const removeRow = (index) => set('extraBadges', rows.filter((_, i) => i !== index));

  return (
    <div className="ptextras">
      {rows.map((row, i) => (
        <div key={i} className="ptextras__row">
          <BadgeSelect
            label={`${isEn ? 'Badge' : '徽章'} ${i + 1}`}
            en={`Badge ${i + 1}`}
            value={row.badgeId}
            onChange={(id) => updateRow(i, { badgeId: id })}
          />
          <div className="ptgrid">
            <FCell
              label="申請人"
              en="Applicant"
              k={`extra_${i}_name`}
              values={{ [`extra_${i}_name`]: row.applicantName || values.applicantName }}
              set={(_, val) => updateRow(i, { applicantName: val })}
              span={2}
            />
            <FCell
              label="SCOUT ID"
              en="Scout ID"
              k={`extra_${i}_id`}
              values={{ [`extra_${i}_id`]: row.scoutId || values.scoutId }}
              set={(_, val) => updateRow(i, { scoutId: val })}
              span={2}
            />
          </div>
          {!isEn && row.badgeName && <p className="tiny">{row.badgeName}</p>}
          <button type="button" className="btn btn--ghost btn--sm no-print" onClick={() => removeRow(i)}>
            {isEn ? 'Remove row' : '刪除此列'}
          </button>
        </div>
      ))}
      <button type="button" className="btn btn--ghost btn--sm no-print" onClick={addRow}>
        <Icon name="plus" size={13} /> {isEn ? 'Add badge' : '加一個徽章'}
      </button>
    </div>
  );
}

function FormP120A2() {
  const { isEn } = useLang();
  const [v, set] = useFormEditor('p120a2');

  return (
    <article className="a4sheet ptform">
      <FormHead meta={FORM_META.p120a2} values={v} />

      <SectionTitle en="Linked Application">關連申請</SectionTitle>
      <div className="ptgrid">
        <FCell label="申請編號" en="Ref. No." k="refNo" values={v} set={set} span={2} />
        <FCell label="姓名（中文）" en="Name (Chinese)" k="nameZh" values={v} set={set} span={2} />
        <FCell label="童軍成員編號" en="Scout ID" k="scoutId" values={v} set={set} span={2} />
        <FCell label="童軍團" en="Scout Troop" k="troop" values={v} set={set} span={2} />
      </div>
      <div className="ptcell ptcell--s4">
        <BadgeSelect
          label="主表（P120A1）報考徽章"
          en="Main Badge on P120A1"
          value={v.mainBadgeId}
          onChange={(id) => set('mainBadgeId', id)}
        />
      </div>

      <SectionTitle en="Additional Badges / Applicants">附加徽章／申請人</SectionTitle>
      <P120A2Extras values={v} set={set} />

      <SectionTitle en="Additional Notes">附加說明</SectionTitle>
      <div className="ptcell ptcell--s4">
        <div className="ptcell__val">
          <Write
            value={v.additionalNotes || ''}
            onChange={(x) => set('additionalNotes', x)}
            multiline
            rows={4}
            label="附加說明"
          />
        </div>
      </div>
      <p className="ptnotes">
        {isEn
          ? 'Submit together with P120A1. One row per applicant when several members sit the same badge.'
          : '請與 P120A1 一併遞交。多人同時報考同一徽章時，每位申請人各填一列。'}
      </p>
    </article>
  );
}

export function FormDoc({ id }) {
  const { isEn } = useLang();
  const [preview, togglePreview] = usePrintPreview();
  const meta = FORM_META[id];
  if (!meta) return <FormsIndex />;

  return (
    <div className="formdoc">
      <div className="formdoc__bar no-print">
        <Link to="/forms" className="btn btn--ghost btn--sm">
          <Icon name="back" size={14} /> {isEn ? 'All Forms' : '全部表格'}
        </Link>
        <div className="formdoc__tabs">
          {FORM_ORDER.map((fid) => (
            <Link key={fid} to={`/forms/${fid}`} className={cx('formtab', fid === id && 'is-on')}>
              {isEn && FORM_META[fid].shortEn ? FORM_META[fid].shortEn : FORM_META[fid].short}
            </Link>
          ))}
        </div>
        <div className="formdoc__acts">
          <button type="button" className={cx('btn btn--ghost btn--sm', preview && 'is-on')} onClick={togglePreview}>
            {preview ? (isEn ? 'Resume Editing' : '返回填寫') : isEn ? 'Print Preview' : '預覽列印效果'}
          </button>
          <button type="button" className="btn btn--gold btn--sm" onClick={() => window.print()}>
            <Icon name="print" size={14} /> {isEn ? 'Print A4' : 'A4 列印／存 PDF'}
          </button>
        </div>
      </div>

      <p className="formdoc__hint no-print">
        <Icon name="info" size={14} /> <span>{isEn && meta.noteEn ? meta.noteEn : meta.note}</span>
      </p>

      {id === 'pt18' ? <FormPT18 /> : id === 'p120a1' ? <FormP120A1 /> : <FormP120A2 />}
    </div>
  );
}

export function FormsAll() {
  const { isEn } = useLang();
  const [preview, togglePreview] = usePrintPreview();
  return (
    <div className="formdoc">
      <div className="formdoc__bar no-print">
        <Link to="/forms" className="btn btn--ghost btn--sm">
          <Icon name="back" size={14} /> {isEn ? 'Back' : '返回表格總覽'}
        </Link>
        <strong>{isEn ? 'All Forms (5 A4 pages)' : '全部表格（共 5 頁 A4）'}</strong>
        <div className="formdoc__acts">
          <button type="button" className={cx('btn btn--ghost btn--sm', preview && 'is-on')} onClick={togglePreview}>
            {preview ? (isEn ? 'Resume Editing' : '返回填寫') : isEn ? 'Print Preview' : '預覽列印效果'}
          </button>
          <button type="button" className="btn btn--gold btn--sm" onClick={() => window.print()}>
            <Icon name="print" size={14} /> {isEn ? 'Print All' : '一次過列印'}
          </button>
        </div>
      </div>
      <FormPT18 />
      <FormP120A1 />
      <FormP120A2 />
    </div>
  );
}
