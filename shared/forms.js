// ==========================================================================
// SCOUTBOOK — 童軍支部官方申請／紀錄表格自動帶入
// 官方表格：PT/18（總領袖獎章及證書申請表 10/2025）、P120A1（童軍專科徽章／
// 獎章考驗申請表 10/2009）、P120A2（附加資料表格 10/2009）。
// 分項結構對齊 scoutbadge index.html renderPT18Form／renderP120A1Form
//（2026-10 已按總會表格重做版本）；遞交前請以總會最新表格核對。
// ==========================================================================

import {
  ITEM_INDEX,
  OTHER_BADGES,
  ALL_AWARDS,
  ageFromDob,
  ageInMonths,
  sanitizeHkidPrefix,
  badgeStats,
} from './book.js';

export const FORM_META = {
  pt18: {
    id: 'pt18',
    code: 'FORM PT/18 (10/2025)',
    short: 'PT/18',
    shortEn: 'PT/18',
    title: '總領袖獎章及證書申請表',
    en: "Application Form for The Chief Scout's Award and Certificate",
    when: '完成全部總領袖獎章考驗項目，並獲旅長／童軍團長提名後遞交；請以雙面列印。',
    pages: 2,
    official: true,
    note: '官方表格；遞交前請以總會表格目錄的最新版本核對一次。',
    noteEn: 'Official form. Confirm you are using the latest version in the Association forms catalogue before submission.',
  },
  p120a1: {
    id: 'p120a1',
    code: 'P120A1 (10/2009)',
    short: 'P120A1',
    shortEn: 'P120A1',
    title: '童軍專科徽章／獎章考驗申請表',
    en: 'Scout Proficiency / Activity Badge Assessment Application',
    when: '報考任何專科徽章前填寫甲部，由童軍團長副署確認；主考填寫乙部及丙部。',
    pages: 2,
    official: true,
    note: '官方表格；如多位申請人同時報考，請另填 P120A2 附加資料表格。',
    noteEn: 'Official form. For multiple applicants sitting the same badge, also complete form P120A2.',
  },
  p120a2: {
    id: 'p120a2',
    code: 'P120A2 (10/2009)',
    short: 'P120A2',
    shortEn: 'P120A2',
    title: '童軍專科徽章／獎章考驗附加資料表格',
    en: 'Scout Proficiency / Activity Badge Assessment — Additional Information Sheet',
    when: '與 P120A1 一併遞交：同一主考下加報其他徽章，或補充未能寫入 P120A1 的資料。',
    pages: 1,
    official: true,
    note: '官方表格；多人同時報考同一徽章時，每位申請人各填一列。',
    noteEn: 'Official form. One row per applicant when several members sit the same badge.',
  },
};

export const FORM_ORDER = ['pt18', 'p120a1', 'p120a2'];

// ------------------------------------------------------------------ PT/18 丁部分組
// 對齊 scoutbadge renderPT18Form：官方 PT/18（10/2025）訓練紀錄分組 → 2026 修訂版 L5 項目。
export const PT18_SECTION_D = [
  {
    title: 'A. 戶外挑戰 Outdoor Challenge',
    rows: [
      { label: '1. 營藝 Campcraft', desc: 'a 計劃及實行一次露營／b 教授基本露營技巧／c 製作露營報告', id: 'L5-A1' },
      { label: '2. 歷險 Adventure', desc: 'a 策劃、進行及記錄郊野旅程／b 教授基本郊野旅程技巧／c 野外求生技能', id: 'L5-A2' },
      { label: '3. 先鋒工程 Pioneering', desc: 'a 計劃及帶領不少於三種編結之先鋒工程／b 教授基本先鋒工程技巧', id: 'L5-A3' },
      { label: '4. 戶外活動（選修1）Outdoor Activity', desc: 'a 完成高級獎章戶外活動部分／b 策劃和參與全日小隊戶外活動', id: 'L5-A4' },
      { label: '5. 海上活動（選修2）Sea Activity', desc: 'a 完成高級獎章海上活動部分／b 策劃及參與不少於六小時海上旅程', id: 'L5-A5' },
      { label: '6. 航空活動（選修3）Air Activity', desc: 'a 完成高級獎章航空活動部分／b 兩項從未進行過之自選航空活動', id: 'L5-A6' },
    ],
  },
  {
    title: 'B. 個人發展 Personal Development',
    rows: [
      { label: '1. 體適能 Fitness', desc: 'a 考獲體適能有關專科徽章／b 策劃及執行運動或體能競技小隊活動', id: 'L5-B1' },
      { label: '2. 藝術、創意及科技 Art, Creativity & Technology', desc: 'a 創作及帶領營火會／營燈會表演／b 其他事工', id: 'L5-B2' },
      { label: '3. 領導才 Leadership', desc: 'a 考獲領導才獎章', id: 'L5-C1' },
      { label: '4. 靈性發展 Spiritual Development', desc: 'a 介紹誓詞、規律及銘言／b 其他事工', id: 'L5-C2' },
    ],
  },
  {
    title: 'C. 社會 Society',
    rows: [
      { label: '1. 服務他人 Service', desc: 'a 考獲指定服務組專科徽章／b 探討社區參與活動／c 協助策劃及參與服務', id: 'L5-D1' },
      { label: '2. 社區及本土認識 Community & Local Understanding', desc: 'a 探討本地時事話題／b 其他事工', id: 'L5-D2' },
      { label: '3. 世界認識 Global Understanding', desc: 'a 探討國際問題／b 其他事工', id: 'L5-E1' },
    ],
  },
  {
    title: 'D. 環境 Environment',
    rows: [
      { label: '1. 生態環境 Ecological Environment', desc: 'a 考獲生態環境有關專科徽章或獎章', id: 'L5-D3' },
      { label: '2. 氣象 Meteorology', desc: 'a 教授一項氣象知識／b 其他事工', id: 'L5-D4' },
      { label: '3. 危機及保護 Hazard & Protection', desc: 'a 介紹人類活動對環境的影響／b 計劃及帶領環境保育工作', id: 'L5-D5' },
    ],
  },
  {
    title: 'E. 新體驗 New Experience',
    rows: [
      { label: '1. 參與一項從未嘗試之活動並向團內成員介紹', desc: 'Participate in an unfamiliar activity and share with the Patrol', id: 'L5-F1' },
      { label: '2. 考獲一個教導組專科徽章', desc: 'Gain a Proficiency Badge (Instructor)', id: '' },
    ],
  },
];

// ------------------------------------------------------------------ PT/18 丙部固定列
export const PT18_SECTION_C = [
  { award: '童軍標準獎章', badge: '與戶外活動有關之專科徽章 ／ 艇工章 ／ 初級航空活動章' },
  { award: '童軍高級獎章', badge: '指定兩個技能組專科徽章或水手章 及 一個海上活動有關之專科徽章或中級航空活動章' },
  { award: '童軍高級獎章', badge: '與藝術／創意／科技有關之專科徽章' },
  { award: '總領袖獎章', badge: '指定服務組專科徽章' },
  { award: '總領袖獎章', badge: '與體適能有關之專科徽章' },
  { award: '總領袖獎章', badge: '童軍領導才訓練班證書', leadership: true },
  { award: '總領袖獎章', badge: '教導組專科徽章' },
  { award: '總領袖獎章', badge: '與生態環境有關之專科徽章' },
];

export const PT18_CHECKLIST = [
  '香港身份證／護照。',
  '童軍紀錄冊第 1、2、3、6、7 頁（個人及會員資格）。',
  '總領袖獎章考驗紀錄（紀錄冊第 50–62 頁）。',
  '各進度性獎章考驗紀錄。',
  '丙部所列專科／活動徽章證書。',
  '童軍領導才訓練班證書。',
  '證明文件正本及副本。',
];

export const P120A1_PROCEDURE = [
  '申請人填寫甲部，由童軍團長副署確認；如主考由童軍團長安排，主考人同時填寫乙部並提供證明文件。',
  '申請人將申請表及主考證明文件副本送交區會。',
  '區會於 2 星期內核實並回覆；如不接納主考安排，須在申請表註明原因並協助安排主考。',
  '考驗完成後主考人填寫丙部，送回區會確認及簽發。',
  '區會獲授權人士為合格者簽發徽章／獎章證書。',
];

/** A4 列印檢查清單：紙本章節 ↔ 電子頁碼、列印設定。 */
export const PRINT_CHECKLIST = [
  {
    title: '個人摘要及童軍記錄',
    paper: '紙本第 1–3、6–7 頁',
    digital: '第 1–7 頁',
    items: ['個人資料（含近照及持有人簽署）', '聯絡及家長／監護人', '旅團資料', '童軍紀錄', '會員資格續期'],
  },
  {
    title: '進度性獎章考驗紀錄',
    paper: '各獎章考驗紀錄頁',
    digital: '第 8–23 頁',
    items: ['會員章 11 項', '童軍探索獎章 14 項', '童軍標準獎章 16 項', '童軍高級獎章 17 項'],
  },
  {
    title: '總領袖獎章考驗紀錄',
    paper: '紙本第 50–62 頁',
    digital: '第 50–62 頁',
    items: ['總領袖獎章 17 項', '領導才訓練班證書', '區／地域接見', '完成紀錄與提名', '頒發'],
  },
  {
    title: '專科徽章證書',
    paper: '丙部所列徽章證書',
    digital: '第 24–39 頁',
    items: ['興趣／技能／服務／教導／海上／航空／其他組別完成紀錄及證書編號'],
  },
  {
    title: '列印設定',
    paper: 'A4 · 邊界 8mm',
    digital: '任一頁面 → 列印',
    items: [
      '紙張選 A4、縱向；邊界選「預設」或「無」。',
      'PT/18 請以雙面列印。',
      '勾選「背景圖形」，取消「頁首及頁尾」。',
      '空白欄的小圓點（.write__dot）不會列印，列印時回復紙本橫線。',
      '手機請用系統列印或「另存為 PDF」，避免瀏覽器縮放。',
    ],
  },
];

export const syllabusItem = (id) => ITEM_INDEX[id] || null;

export function itemRowsForAward(book, award) {
  const rows = [];
  award.segments.forEach((segment) => {
    segment.items.forEach((item) => {
      const entry = book?.progress?.[item.id] || {};
      rows.push({
        id: item.id,
        badgeId: item.badgeId,
        segment: segment.name,
        name: item.name,
        en: item.en,
        date: entry.date || '',
        assessor: entry.assessor || '',
        cert: entry.cert || '',
      });
    });
  });
  return rows;
}

export function activityBadgeRows(book, group = '') {
  return OTHER_BADGES.filter((b) => !group || b.group === group).map((b) => {
    const entry = book?.otherBadges?.[b.id] || {};
    return {
      id: b.id,
      badgeId: b.badgeId,
      name: b.name,
      en: b.en,
      group: b.group,
      groupName: b.groupName,
      groupNameEn: b.groupNameEn,
      date: entry.date || '',
      cert: entry.cert || '',
    };
  });
}

/** 獎章完成日期：全部細項日期中最遲者（未齊則為空）。 */
export function awardCompletionDate(book, awardId) {
  const award = ALL_AWARDS.find((a) => a.id === awardId);
  if (!award) return '';
  const dates = award.segments.flatMap((s) => s.items.map((i) => book?.progress?.[i.id]?.date || ''));
  if (dates.some((d) => !d)) return '';
  return dates.sort().pop() || '';
}

/** 戶外挑戰（A 組）完成日期：A 組細項日期中最遲者（未齊則為空）。 */
export function segmentCompletionDate(book, awardId, letter = 'A') {
  const award = ALL_AWARDS.find((a) => a.id === awardId);
  const seg = award?.segments.find((s) => s.code === `${awardId}-${letter}`);
  if (!seg) return '';
  const dates = seg.items.map((i) => book?.progress?.[i.id]?.date || '');
  if (dates.some((d) => !d)) return '';
  return dates.sort().pop() || '';
}

/** 由紀錄冊自動推導各表格欄位；個別格可由 book.forms[formId] 覆寫。 */
export function buildFormValues(book, formId, refDate = new Date()) {
  const m = book?.member || {};
  const p = book?.pages || {};
  const ov = book?.forms?.[formId] || {};

  const common = {
    nameZh: m.nameZh || '',
    nameEn: (m.nameEn || '').toUpperCase(),
    nameOnCertificate: m.nameEn || m.nameZh || '',
    hkidPrefix: sanitizeHkidPrefix(m.hkidPrefix),
    dob: m.dob || '',
    age: String(ageFromDob(m.dob, refDate) ?? ''),
    ageMonths: String(ageInMonths(m.dob, refDate) ?? ''),
    gender: m.gender || '',
    schoolLevel: m.schoolLevel || '',
    school: m.school || '',
    scoutId: m.scoutId || m.memberNo || '',
    troop: m.troop || '',
    patrol: m.patrol || '',
    group: m.group || '',
    district: m.district || '',
    region: m.region || '',
    addressZh: m.addressZh || '',
    addressEn: m.addressEn || '',
    parentName: m.parentName || '',
    parentRelation: m.parentRelation || '',
    parentPhone: m.parentPhone || '',
    phone: m.phone || '',
    email: m.email || '',
    photo: m.photo || null,
    applicantName: m.nameZh || m.nameEn || '',
    sl: m.sl || '',
    gsl: m.gsl || '',
    holderSignature: book?.holderSignature || null,
  };

  if (formId === 'pt18') {
    const electives = ['L2', 'L3', 'L4'].map((awardId) => {
      const choice = p[`elective_${awardId}`] || {};
      return {
        awardId,
        outdoor: choice.outdoor || '',
        community: choice.community || '',
        completedDate: awardCompletionDate(book, awardId),
        outdoorDate: segmentCompletionDate(book, awardId, 'A'),
        awardDate: p[`award_${awardId}`]?.date || '',
      };
    });
    const sectionD = PT18_SECTION_D.map((group) => ({
      title: group.title,
      rows: group.rows.map((r) => ({
        ...r,
        date: r.id ? book?.progress?.[r.id]?.date || '' : '',
      })),
    }));
    const leadership = p.p58?.leadership || {};
    const sectionC = PT18_SECTION_C.map((row) => ({
      ...row,
      courseCode: row.leadership ? leadership.courseCode || '' : '',
      date: row.leadership ? leadership.date || '' : ov?.[`sectionC_${row.badge}`] || '',
    }));
    return {
      ...common,
      ...(ov || {}),
      electives,
      sectionD,
      sectionC,
      leadership,
      l5Date: p.award_L5?.date || '',
      l5CertNo: p.award_L5?.certNo || '',
      applicantDate: ov?.applicantDate || '',
      nominationName: ov?.nominationName || m.sl || '',
      nominationDate: ov?.nominationDate || '',
      recommendationName: ov?.recommendationName || '',
      recommendationDate: ov?.recommendationDate || '',
      confirmationName: ov?.confirmationName || '',
      confirmationDate: ov?.confirmationDate || '',
      approvalName: ov?.approvalName || '',
      approvalDate: ov?.approvalDate || '',
      receivedDate: ov?.receivedDate || '',
      certIssueDate: ov?.certIssueDate || '',
    };
  }

  if (formId === 'p120a1') {
    const badgeId = ov?.badgeId || '';
    const badge = OTHER_BADGES.find((b) => b.id === badgeId) || null;
    const rec = (badgeId && book?.otherBadges?.[badgeId]) || {};
    return {
      ...common,
      ...(ov || {}),
      refNo: ov?.refNo || '',
      badgeId,
      badgeName: badge?.name || '',
      badgeNameEn: badge?.en || '',
      badgeGroup: badge?.groupName || '',
      badgeGroupEn: badge?.groupNameEn || '',
      badgeDate: rec.date || '',
      badgeCert: rec.cert || '',
      arrangement: ov?.arrangement || '',
      arrangementName: ov?.arrangementName || '',
      arrangementOrg: ov?.arrangementOrg || '',
      examinerName: ov?.examinerName || '',
      examinerPhone: ov?.examinerPhone || '',
      examinerQualification: ov?.examinerQualification || '',
      examinerCertName: ov?.examinerCertName || '',
      examinerCertNo: ov?.examinerCertNo || '',
      assessmentMode: ov?.assessmentMode || '',
      assessmentPlan: ov?.assessmentPlan || '',
      assessmentOther: ov?.assessmentOther || '',
      assessmentDate: ov?.assessmentDate || '',
      authorisedBy: ov?.authorisedBy || '',
      authorisedName: ov?.authorisedName || '',
      authorisedPost: ov?.authorisedPost || '',
      authorisedDate: ov?.authorisedDate || '',
      accepted: ov?.accepted ?? '',
      acceptReason: ov?.acceptReason || '',
      examinerRemarks: ov?.examinerRemarks || '',
      result: ov?.result ?? '',
      resultDate: ov?.resultDate || '',
      issueName: ov?.issueName || '',
      issuePost: ov?.issuePost || '',
      issueDate: ov?.issueDate || rec.date || '',
      issueCertNo: ov?.issueCertNo || rec.cert || '',
      slName: ov?.slName || m.sl || '',
      slDate: ov?.slDate || '',
    };
  }

  if (formId === 'p120a2') {
    const extraBadges = Array.isArray(ov?.extraBadges) ? ov.extraBadges : [];
    return {
      ...common,
      ...(ov || {}),
      refNo: ov?.refNo || '',
      mainBadgeId: ov?.mainBadgeId || ov?.badgeId || '',
      extraBadges: extraBadges.map((row) => ({
        badgeId: row?.badgeId || '',
        badgeName: OTHER_BADGES.find((b) => b.id === row?.badgeId)?.name || row?.badgeName || '',
        applicantName: row?.applicantName || common.applicantName,
        scoutId: row?.scoutId || common.scoutId,
        date: row?.date || '',
        cert: row?.cert || '',
        remarks: row?.remarks || '',
      })),
      additionalNotes: ov?.additionalNotes || '',
    };
  }

  return { ...common, ...(ov || {}) };
}

export function formReadiness(book, formId) {
  const v = buildFormValues(book, formId);
  const required =
    formId === 'p120a2'
      ? ['nameZh', 'scoutId']
      : ['nameZh', 'nameEn', 'scoutId', 'dob', 'gender', 'troop', 'group', 'district', 'region'];
  const labels = {
    nameZh: '中文姓名',
    nameEn: '英文姓名',
    scoutId: 'SCOUT ID',
    dob: '出生日期',
    gender: '性別',
    troop: '童軍團',
    group: '旅',
    district: '區',
    region: '地域',
  };
  const missing = required.filter((k) => !String(v[k] || '').trim()).map((k) => labels[k] || k);
  if (formId === 'p120a1' && !v.badgeId) missing.push('報考徽章（請先選擇）');
  return {
    ready: missing.length === 0,
    missing,
    values: v,
  };
}
