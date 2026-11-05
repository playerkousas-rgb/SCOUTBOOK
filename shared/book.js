// ==========================================================================
// SCOUTBOOK — 童軍支部個人隨身電子紀錄冊資料模型
// 純本機儲存（localStorage），一次只服務「這一位」成員的紀錄冊。
// 全團名冊、批量簽核、多成員切換一律屬 scoutbadge（旅團進度表）範疇，本倉庫不做。
//
// 頁序說明：紙本《童軍紀錄冊》未能取得，本頁序為自創（頭七頁對齊 BOOK 家族；
// 總領袖獎章置於訓練計劃及活動紀錄之後、專科徽章之前：第 34–46 頁為總領袖獎章
// 考驗紀錄，第 47–62 頁為專科徽章）。待取得紙本後覆核。
// 進度資料一律以穩定鍵（progress.*、otherBadges.*、award_L5 …）儲存；逐頁雜項
// 以 pages.pNN 儲存，頁序調整時由 PAGE_ID_MIGRATION 自動搬遷（見下）。
// ==========================================================================

import {
  BADGE_SYLLABUS,
  OTHER_BADGES,
  ALL_AWARDS,
  SYLLABUS_ITEMS,
  ITEM_INDEX,
  SYLLABUS_META,
  TRAINING_PLAN,
  SAFE_FROM_HARM,
  toBadgeId,
  toBookId,
} from './syllabus.js';

export {
  BADGE_SYLLABUS,
  OTHER_BADGES,
  ALL_AWARDS,
  SYLLABUS_ITEMS,
  ITEM_INDEX,
  SYLLABUS_META,
  TRAINING_PLAN,
  SAFE_FROM_HARM,
  toBadgeId,
  toBookId,
};

export const APP_VERSION = 'v1.1.0';
export const STORE_KEY = 'scoutbook.book.v1';
export const LEGACY_STORE_KEYS = [];

export const uid = (p = 'c') => `${p}_${Math.random().toString(36).slice(2, 9)}`;

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(value) {
  const raw = String(value || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return '';
  const [y, m, d] = raw.split('-');
  return `${d}/${m}/${y}`;
}

// ------------------------------------------------------------------ 頁序
export const SECTIONS = [
  { id: 'p01', page: '1', label: '個人資料', en: 'Personal Particulars', badge: 'front' },
  { id: 'p02', page: '2', label: '聯絡及家長／監護人', en: 'Contact & Guardian', badge: 'front' },
  { id: 'p03', page: '3', label: '旅團資料', en: 'Troop & Group', badge: 'front' },
  { id: 'p04', page: '4', label: '童軍紀錄', en: 'Scouting Record', badge: 'front' },
  { id: 'p05', page: '5', label: '轉旅・遷移・更改', en: 'Transfer & Changes', badge: 'front' },
  { id: 'p06', page: '6', label: '會員資格續期', en: 'Membership Renewal', badge: 'front' },
  { id: 'p07', page: '7', label: '服務及獎勵紀錄', en: 'Service & Awards', badge: 'front' },
  { id: 'p08', page: '8', label: '會員章（一）', en: 'Membership Badge I', badge: 'L1' },
  { id: 'p09', page: '9', label: '會員章（二）', en: 'Membership Badge II', badge: 'L1' },
  { id: 'p10', page: '10', label: '童軍探索獎章（一）', en: 'Pathfinder Award I · Outdoor', badge: 'L2' },
  { id: 'p11', page: '11', label: '童軍探索獎章（二）', en: 'Pathfinder Award II · Personal', badge: 'L2' },
  { id: 'p12', page: '12', label: '童軍探索獎章（三）', en: 'Pathfinder Award III · Leadership', badge: 'L2' },
  { id: 'p13', page: '13', label: '童軍探索獎章（四）', en: 'Pathfinder Award IV · Service', badge: 'L2' },
  { id: 'p14', page: '14', label: '童軍標準獎章（一）', en: 'Standard Award I · Outdoor', badge: 'L3' },
  { id: 'p15', page: '15', label: '童軍標準獎章（二）', en: 'Standard Award II · Personal', badge: 'L3' },
  { id: 'p16', page: '16', label: '童軍標準獎章（三）', en: 'Standard Award III · Leadership', badge: 'L3' },
  { id: 'p17', page: '17', label: '童軍標準獎章（四）', en: 'Standard Award IV · Service', badge: 'L3' },
  { id: 'p18', page: '18', label: '童軍標準獎章（五）', en: 'Standard Award V · E & F', badge: 'L3' },
  { id: 'p19', page: '19', label: '童軍高級獎章（一）', en: 'Advanced Award I · Outdoor', badge: 'L4' },
  { id: 'p20', page: '20', label: '童軍高級獎章（二）', en: 'Advanced Award II · Personal', badge: 'L4' },
  { id: 'p21', page: '21', label: '童軍高級獎章（三）', en: 'Advanced Award III · Leadership', badge: 'L4' },
  { id: 'p22', page: '22', label: '童軍高級獎章（四）', en: 'Advanced Award IV · Service', badge: 'L4' },
  { id: 'p23', page: '23', label: '童軍高級獎章（五）', en: 'Advanced Award V · E & F', badge: 'L4' },
  { id: 'p24', page: '24', label: '訓練計劃', en: 'Training Plan', badge: 'front' },
  { id: 'p25', page: '25', label: '安全與保護', en: 'Safe from Harm', badge: 'front' },
  { id: 'p26', page: '26', label: '頒發及宣誓紀錄', en: 'Investiture & Awards', badge: 'front' },
  { id: 'p27', page: '27', label: '其他獎章', en: 'Other Awards', badge: 'front' },
  { id: 'p28', page: '28', label: '其他經驗', en: 'Other Experience', badge: 'front' },
  { id: 'p29', page: '29', label: '遠足及海外活動', en: 'Hiking & Overseas', badge: 'front' },
  { id: 'p30', page: '30', label: '活動紀錄（一）', en: 'Activity Log I', badge: 'front' },
  { id: 'p31', page: '31', label: '活動紀錄（二）', en: 'Activity Log II', badge: 'front' },
  { id: 'p32', page: '32', label: '活動紀錄（三）', en: 'Activity Log III', badge: 'front' },
  { id: 'p33', page: '33', label: '活動紀錄（四）', en: 'Activity Log IV', badge: 'front' },
  { id: 'p34', page: '34', label: '總領袖獎章簡介', en: "Chief Scout's Award", badge: 'L5' },
  { id: 'p35', page: '35', label: '考驗計劃', en: 'Assessment Plan', badge: 'L5' },
  { id: 'p36', page: '36', label: 'A 戶外挑戰', en: 'A · Outdoor Challenge', badge: 'L5' },
  { id: 'p37', page: '37', label: 'B 個人發展', en: 'B · Personal Development', badge: 'L5' },
  { id: 'p38', page: '38', label: 'C 領導才與靈性發展', en: 'C · Leadership & Spiritual', badge: 'L5' },
  { id: 'p39', page: '39', label: 'D 服務與環境', en: 'D · Service & Environment', badge: 'L5' },
  { id: 'p40', page: '40', label: 'E 國際視野', en: 'E · International Outlook', badge: 'L5' },
  { id: 'p41', page: '41', label: 'F 探索新知', en: 'F · New Knowledge', badge: 'L5' },
  { id: 'p42', page: '42', label: '領導才訓練與服務', en: 'Leadership Training & Service', badge: 'L5' },
  { id: 'p43', page: '43', label: '區總監接見', en: 'District Review', badge: 'L5' },
  { id: 'p44', page: '44', label: '地域接見', en: 'Regional Review', badge: 'L5' },
  { id: 'p45', page: '45', label: '完成紀錄與提名', en: 'Completion & Nomination', badge: 'L5' },
  { id: 'p46', page: '46', label: '頒發', en: 'Presentation', badge: 'L5' },
  { id: 'p47', page: '47', label: '興趣組專科徽章（一）', en: 'Interest Badges I', badge: 'OT' },
  { id: 'p48', page: '48', label: '興趣組專科徽章（二）', en: 'Interest Badges II', badge: 'OT' },
  { id: 'p49', page: '49', label: '興趣組專科徽章（三）', en: 'Interest Badges III', badge: 'OT' },
  { id: 'p50', page: '50', label: '興趣組專科徽章（四）', en: 'Interest Badges IV', badge: 'OT' },
  { id: 'p51', page: '51', label: '技能組專科徽章（一）', en: 'Pursuit Badges I', badge: 'OT' },
  { id: 'p52', page: '52', label: '技能組專科徽章（二）', en: 'Pursuit Badges II', badge: 'OT' },
  { id: 'p53', page: '53', label: '技能組專科徽章（三）', en: 'Pursuit Badges III', badge: 'OT' },
  { id: 'p54', page: '54', label: '技能組專科徽章（四）', en: 'Pursuit Badges IV', badge: 'OT' },
  { id: 'p55', page: '55', label: '服務組專科徽章（一）', en: 'Service Badges I', badge: 'OT' },
  { id: 'p56', page: '56', label: '服務組專科徽章（二）', en: 'Service Badges II', badge: 'OT' },
  { id: 'p57', page: '57', label: '教導組專科徽章（一）', en: 'Instructor Badges I', badge: 'OT' },
  { id: 'p58', page: '58', label: '教導組專科徽章（二）', en: 'Instructor Badges II', badge: 'OT' },
  { id: 'p59', page: '59', label: '教導組專科徽章（三）', en: 'Instructor Badges III', badge: 'OT' },
  { id: 'p60', page: '60', label: '海上活動・航空活動徽章', en: 'Sea & Air Badges', badge: 'OT' },
  { id: 'p61', page: '61', label: '其他徽章（一）', en: 'Other Badges I', badge: 'OT' },
  { id: 'p62', page: '62', label: '其他徽章（二）', en: 'Other Badges II', badge: 'OT' },
  { id: 'p63', page: '63', label: '制服及徽章位置', en: 'Uniform & Badges', badge: 'front' },
  { id: 'p64', page: '64', label: '童軍誓詞與規律', en: 'Promise & Law', badge: 'front' },
  { id: 'p65', page: '65', label: '進度總覽', en: 'Progress Summary', badge: 'front' },
  { id: 'p66', page: '66', label: '使用說明', en: 'How to Use', badge: 'front' },
  { id: 'appendix', page: '—', label: '數位附錄', en: 'Digital Appendix', digital: true },
];

export const PAGE_TOTAL = SECTIONS.filter((s) => !s.digital).length;

// ------------------------------------------------------------------ 頁碼遷移
// 專科徽章頁已移到總領袖獎章之後（舊 p40–p49 → p24–p33；舊 p50–p62 → p34–p46；
// 舊 p24–p39 → p47–p62）。以 pages.pNN 儲存的逐頁雜項按此表搬遷一次（以 meta.pagev 標記）。
export const PAGE_ID_MIGRATION = {
  p40: 'p24', p41: 'p25', p42: 'p26', p43: 'p27', p44: 'p28', p45: 'p29',
  p46: 'p30', p47: 'p31', p48: 'p32', p49: 'p33',
  p50: 'p34', p51: 'p35', p52: 'p36', p53: 'p37', p54: 'p38', p55: 'p39',
  p56: 'p40', p57: 'p41', p58: 'p42', p59: 'p43', p60: 'p44', p61: 'p45', p62: 'p46',
  p24: 'p47', p25: 'p48', p26: 'p49', p27: 'p50', p28: 'p51', p29: 'p52',
  p30: 'p53', p31: 'p54', p32: 'p55', p33: 'p56', p34: 'p57', p35: 'p58',
  p36: 'p59', p37: 'p60', p38: 'p61', p39: 'p62',
};

export function migratePageId(id) {
  return PAGE_ID_MIGRATION[id] || id;
}

/** 把 v1.0.0 頁碼的 pages.* 搬到新頁碼（只在 meta.pagev !== 2 時跑一次）。
 *  來源與目標有重疊（如 p42 既是來源又是目標），因此先全部讀出、刪掉來源再寫入。 */
export function migrateStoredPages(pages, meta) {
  if (!pages || typeof pages !== 'object' || meta?.pagev === 2) return pages || {};
  const moves = Object.keys(pages).filter((k) => PAGE_ID_MIGRATION[k] && PAGE_ID_MIGRATION[k] !== k);
  if (!moves.length) return { ...pages };
  const next = { ...pages };
  const carried = moves.map((k) => [PAGE_ID_MIGRATION[k], next[k]]);
  for (const k of moves) delete next[k];
  for (const [dest, value] of carried) next[dest] = value;
  return next;
}

// ------------------------------------------------------------------ 選修項目
// 2026 修訂版：戶外／海上／航空三選一（各進度性獎章選項須相同；
// 海童軍必選海上、空童軍必選航空），社區認識／生態環境／氣象三選一。
export const ELECTIVE_OPTIONS = {
  outdoor: [
    { value: 'outdoor', zh: '戶外活動', en: 'Outdoor Activity' },
    { value: 'sea', zh: '海上活動', en: 'Sea Activity' },
    { value: 'air', zh: '航空活動', en: 'Air Activity' },
  ],
  community: [
    { value: 'community', zh: '社區認識', en: 'Community Understanding' },
    { value: 'ecology', zh: '生態環境', en: 'Ecological Environment' },
    { value: 'meteorology', zh: '氣象', en: 'Meteorology' },
  ],
};

export function electiveChoice(book, awardId) {
  return book?.pages?.[`elective_${awardId}`] || {};
}

// ------------------------------------------------------------------ 獎章頁切片
// 每個獎章頁只顯示所屬分段／細項；測試會驗證切片覆蓋全部細項、不重不漏。
export const PAGE_SLICES = {
  p08: { award: 'L1', items: ['L1-M1', 'L1-M2', 'L1-M3', 'L1-M4', 'L1-M5', 'L1-M6'] },
  p09: { award: 'L1', items: ['L1-M7', 'L1-M8', 'L1-M9', 'L1-M10', 'L1-M11'] },
  p10: { award: 'L2', segments: ['L2-A'] },
  p11: { award: 'L2', segments: ['L2-B'] },
  p12: { award: 'L2', segments: ['L2-C'] },
  p13: { award: 'L2', segments: ['L2-D'] },
  p14: { award: 'L3', segments: ['L3-A'] },
  p15: { award: 'L3', segments: ['L3-B'] },
  p16: { award: 'L3', segments: ['L3-C'] },
  p17: { award: 'L3', segments: ['L3-D'] },
  p18: { award: 'L3', segments: ['L3-E', 'L3-F'] },
  p19: { award: 'L4', segments: ['L4-A'] },
  p20: { award: 'L4', segments: ['L4-B'] },
  p21: { award: 'L4', segments: ['L4-C'] },
  p22: { award: 'L4', segments: ['L4-D'] },
  p23: { award: 'L4', segments: ['L4-E', 'L4-F'] },
  p36: { award: 'L5', segments: ['L5-A'] },
  p37: { award: 'L5', segments: ['L5-B'] },
  p38: { award: 'L5', segments: ['L5-C'] },
  p39: { award: 'L5', segments: ['L5-D'] },
  p40: { award: 'L5', segments: ['L5-E'] },
  p41: { award: 'L5', segments: ['L5-F'] },
};

/** 專科徽章頁切片：每組按來源次序分頁（頁內搜尋跨全組時仍可找到）。 */
export const OTHER_PAGE_SLICES = {
  p47: { groups: ['interest'], slice: [0, 9] },
  p48: { groups: ['interest'], slice: [9, 18] },
  p49: { groups: ['interest'], slice: [18, 27] },
  p50: { groups: ['interest'], slice: [27, 99] },
  p51: { groups: ['pursuit'], slice: [0, 10] },
  p52: { groups: ['pursuit'], slice: [10, 20] },
  p53: { groups: ['pursuit'], slice: [20, 30] },
  p54: { groups: ['pursuit'], slice: [30, 99] },
  p55: { groups: ['service'], slice: [0, 10] },
  p56: { groups: ['service'], slice: [10, 99] },
  p57: { groups: ['instructor'], slice: [0, 9] },
  p58: { groups: ['instructor'], slice: [9, 18] },
  p59: { groups: ['instructor'], slice: [18, 99] },
  p60: { groups: ['sea', 'air'], slice: [0, 99] },
  p61: { groups: ['other'], slice: [0, 9] },
  p62: { groups: ['other'], slice: [9, 99] },
};

export function sliceAward(award, pageId) {
  const spec = PAGE_SLICES[pageId];
  if (!award || !spec || award.id !== spec.award) return award;
  if (spec.items) {
    const wanted = new Set(spec.items);
    return {
      ...award,
      segments: award.segments
        .map((s) => ({ ...s, items: s.items.filter((i) => wanted.has(i.id)) }))
        .filter((s) => s.items.length),
    };
  }
  if (spec.segments) {
    const wanted = new Set(spec.segments);
    return { ...award, segments: award.segments.filter((s) => wanted.has(s.code)) };
  }
  return award;
}

export function sliceOtherBadges(pageId) {
  const spec = OTHER_PAGE_SLICES[pageId];
  if (!spec) return [];
  const [from, to] = spec.slice;
  return OTHER_BADGES.filter((b) => spec.groups.includes(b.group)).slice(from, to);
}

// ------------------------------------------------------------------ 身分
/** 紀錄冊編號 ＝ 童軍成員編號 SCOUT ID（與 scoutbadge 完全統一）。 */
export function scoutId(bookOrMember) {
  const m = bookOrMember?.member || bookOrMember || {};
  return String(m.scoutId || m.memberNo || m.ymis || '').trim();
}

/** 正規化 SCOUT ID／YMIS（去除空白；純數字可與 scoutbadge 10 位 YMIS 互相比對）。 */
export function normalizeScoutId(raw) {
  return String(raw ?? '').trim().replace(/\s+/g, '');
}

/** 比對兩個 SCOUT ID／YMIS 是否同一成員（相容純數字補零至 10 位）。 */
export function sameScoutId(a, b) {
  const x = normalizeScoutId(a);
  const y = normalizeScoutId(b);
  if (!x || !y) return false;
  if (x.toLowerCase() === y.toLowerCase()) return true;
  if (/^\d+$/.test(x) && /^\d+$/.test(y)) return x.padStart(10, '0') === y.padStart(10, '0');
  return false;
}

/** 保持 scoutId 與 memberNo 同步，清除舊 ymis 欄位。 */
export function syncIdentity(member) {
  if (!member) return member;
  const id = scoutId(member);
  member.scoutId = id;
  member.memberNo = id;
  delete member.ymis;
  return member;
}

/** 香港身份證只保留首四位字元（如 A123），符合總會表格私隱規定。 */
export function sanitizeHkidPrefix(raw) {
  return String(raw || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4);
}

export function ageFromDob(dob, refDate = new Date()) {
  if (!dob) return '';
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return '';
  const ref = refDate instanceof Date ? refDate : new Date(refDate);
  let age = ref.getFullYear() - birth.getFullYear();
  const m = ref.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < birth.getDate())) age -= 1;
  return age >= 0 && age < 120 ? age : '';
}

export function ageInMonths(dob, refDate = new Date()) {
  if (!dob) return '';
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return '';
  const ref = refDate instanceof Date ? refDate : new Date(refDate);
  const months = (ref.getFullYear() - birth.getFullYear()) * 12 + (ref.getMonth() - birth.getMonth());
  return months >= 0 && months < 1440 ? months : '';
}

export function newBook(partial = {}) {
  const now = new Date().toISOString();
  const { member: partialMember, meta: partialMeta, ...rest } = partial;
  const book = {
    version: 1,
    appVersion: APP_VERSION,
    member: {
      nameZh: '',
      nameEn: '',
      scoutId: '',
      memberNo: '',
      hkidPrefix: '',
      gender: '',
      photo: null,
      dob: '',
      school: '',
      schoolLevel: '',
      religion: '',
      phone: '',
      email: '',
      addressZh: '',
      addressEn: '',
      parentName: '',
      parentRelation: '',
      parentPhone: '',
      emergencyName: '',
      emergencyPhone: '',
      allergies: '',
      troop: '',
      patrol: '',
      group: '',
      district: '',
      region: '',
      sponsoringAuthority: '',
      groupAddress: '',
      gsl: '',
      gslPhone: '',
      sl: '',
      slPhone: '',
      dateJoined: '',
      dateInvestiture: '',
      dateScoutMovement: '',
      ...(partialMember || {}),
    },
    scouting: {
      grasshopper: { from: '', to: '', unit: '', post: '', award: '' },
      cub: { from: '', to: '', unit: '', post: '', award: '' },
      scout: { from: '', to: '', unit: '', post: '', award: '' },
      venture: { from: '', to: '', unit: '', post: '', award: '' },
      rover: { from: '', to: '', unit: '', post: '', award: '' },
    },
    transfers: [],
    addressChanges: [],
    detailChanges: [],
    renewals: [],
    service: [],
    awardsLog: [],
    progress: {},
    otherBadges: {},
    pages: {},
    forms: {},
    holderSignature: null,
    ...rest,
    meta: { createdAt: now, updatedAt: now, ...(partialMeta || {}) },
  };
  syncIdentity(book.member);
  if (book.member.hkidPrefix) book.member.hkidPrefix = sanitizeHkidPrefix(book.member.hkidPrefix);
  book.pages = migrateStoredPages(book.pages, book.meta);
  book.meta.pagev = 2;
  return book;
}

// ------------------------------------------------------------------ 進度判斷
const hasDate = (book, id) => Boolean(book?.progress?.[id]?.date);

/** 保留與家族相同的興趣範疇接口；童軍支部暫無此類分段（恆回傳未達標結構）。 */
export function interestProgress(book, segment) {
  const req = segment?.activityRequirement;
  if (!req) return { satisfied: false, count: 0, categories: [], needed: null };
  const allowed = new Set(req.allowedBadgeIds || []);
  const byCategory = new Map();
  for (const badge of OTHER_BADGES) {
    if (!allowed.has(badge.id)) continue;
    const entry = book?.otherBadges?.[badge.id];
    if (!entry?.date) continue;
    if (!byCategory.has(badge.group)) byCategory.set(badge.group, []);
    byCategory.get(badge.group).push(badge.id);
  }
  const categories = [...byCategory.keys()];
  const perCategoryOk = categories.filter(
    (cat) => (byCategory.get(cat) || []).length >= req.badgesPerCategory,
  );
  return {
    satisfied: perCategoryOk.length >= req.distinctCategories,
    count: categories.reduce((n, cat) => n + byCategory.get(cat).length, 0),
    categories: perCategoryOk,
    needed: `${req.distinctCategories} × ${req.badgesPerCategory}`,
    allowed: [...allowed],
  };
}

export function badgeStats(book, awardId) {
  const award = ALL_AWARDS.find((b) => b.id === awardId);
  if (!award) return { total: 0, done: 0, percent: 0, segments: [], award: null, complete: false };

  const segments = award.segments.map((segment) => {
    const itemIds = segment.items.map((i) => i.id);
    const done = itemIds.filter((id) => hasDate(book, id)).length;
    const interest = segment.activityRequirement ? interestProgress(book, segment) : null;
    return {
      code: segment.code,
      name: segment.name,
      total: itemIds.length,
      done,
      percent: itemIds.length ? Math.round((done / itemIds.length) * 100) : interest?.satisfied ? 100 : 0,
      interest,
    };
  });

  const total = segments.reduce((n, s) => n + s.total, 0);
  const done = segments.reduce((n, s) => n + s.done, 0);
  const itemsComplete = segments.every((s) => s.total === 0 || s.done === s.total);
  const interestComplete = segments.every((s) => !s.interest || s.interest.satisfied);
  const complete = itemsComplete && interestComplete;

  return {
    total,
    done,
    percent: complete ? 100 : total ? Math.round((done / total) * 100) : 0,
    segments,
    complete,
    awardedDate: book?.pages?.[`award_${awardId}`]?.date || '',
    award,
  };
}

export function allStats(book) {
  const awards = ALL_AWARDS.map((a) => ({ ...badgeStats(book, a.id), award: a }));
  const total = awards.reduce((n, a) => n + a.total, 0);
  const done = awards.reduce((n, a) => n + a.done, 0);
  // 「已獲獎章」= 全部細項完成，或已在頒發頁／獎章頁記錄頒發日期（領袖頒發即算）。
  const earned = awards.filter(
    (a) => a.complete || Boolean(book?.pages?.[`award_${a.award.id}`]?.date),
  );
  return {
    awards,
    total,
    done,
    percent: total ? Math.round((done / total) * 100) : 0,
    earned: earned.length,
    nextAward: awards.find((a) => !a.complete) || awards[awards.length - 1],
    activityBadges: Object.values(book?.otherBadges || {}).filter((b) => b?.date).length,
  };
}

export function latestRenewal(book) {
  return (
    [...(book?.renewals || [])]
      .filter((r) => r && (r.validUntil || r.date))
      .sort((a, b) =>
        String(b.validUntil || b.date).localeCompare(String(a.validUntil || a.date)),
      )[0] || null
  );
}

export function membershipStatus(book) {
  const last = latestRenewal(book);
  return {
    renewal: last,
    validUntil: last?.validUntil || null,
    active: Boolean(last?.validUntil && last.validUntil >= today()),
  };
}

/** 總領袖獎章進度事實（年齡、高級獎章完成度、領導才訓練班證書），供第 50 頁顯示。 */
export function chiefScoutReadiness(book) {
  const advanced = badgeStats(book, 'L4');
  const leadership = book?.pages?.p42?.leadership || {};
  return {
    age: ageFromDob(book?.member?.dob),
    advancedComplete: advanced.complete,
    advancedDone: advanced.done,
    advancedTotal: advanced.total,
    leadershipCourse: leadership.courseCode || '',
    leadershipDate: leadership.date || '',
    leadershipCert: leadership.certNo || '',
  };
}

// ------------------------------------------------------------------ 同步
// 與 scoutbadge 互通契約：BOOK 送出的一律為「待領袖核實」，絕不直接寫入已核實進度。
// 伺服器端（api/scoutbadge.js）同時以白名單＋403 硬性禁止 save／saveOtherBadge。
export const SYNC_SCHEMA = 'scoutbadge.pending.v1';

const UNCONFIRMED_STATUSES = new Set([
  'pending',
  'local_draft',
  'draft',
  'rejected',
  'unverified',
  'unconfirmed',
]);

function isConfirmedEntry(val) {
  if (!val) return false;
  if (typeof val === 'string') return Boolean(val.trim());
  if (typeof val !== 'object') return false;
  if (val.confirmed === false || val.verified === false || val.pending === true) return false;
  const st = String(val.status || '').trim().toLowerCase();
  if (st && UNCONFIRMED_STATUSES.has(st)) return false;
  return Boolean(String(val.date || '').trim());
}

function itemLabel(bookId) {
  return ITEM_INDEX[bookId]?.name || OTHER_BADGES.find((b) => b.id === bookId)?.name || bookId;
}

/**
 * 收集本機已填寫、但 scoutbadge 尚未核實／未在待批清單的項目。
 * 回傳一律使用 scoutbadge 官方編號（badgeId），令 BADGE 毋須認識 BOOK 內部鍵。
 */
export function collectPendingForBadge(book, remoteConfirmed = {}, remotePendingIds = []) {
  const confirmedKeys = new Set(Object.keys(remoteConfirmed || {}).map((k) => toBookId(k)));
  const pendingSet = new Set((remotePendingIds || []).map((k) => toBookId(k)));
  const out = [];

  for (const [bookId, entry] of Object.entries(book?.progress || {})) {
    if (!ITEM_INDEX[bookId] || !entry?.date) continue;
    if (entry.confirmedByBadge) continue;
    if (confirmedKeys.has(bookId)) continue;
    if (pendingSet.has(bookId)) continue;
    out.push({
      kind: 'item',
      itemId: toBadgeId(bookId),
      bookId,
      itemName: itemLabel(bookId),
      date: String(entry.date).slice(0, 10),
      evidence: entry.cert
        ? `SCOUTBOOK 紀錄冊申報（證書：${entry.cert}）`
        : '由 SCOUTBOOK 個人電子紀錄冊申報（待領袖核實）',
    });
  }

  for (const [bookId, entry] of Object.entries(book?.otherBadges || {})) {
    if (!entry?.date) continue;
    if (entry.confirmedByBadge) continue;
    if (confirmedKeys.has(bookId)) continue;
    if (pendingSet.has(bookId)) continue;
    out.push({
      kind: 'other',
      itemId: toBadgeId(bookId),
      bookId,
      itemName: itemLabel(bookId),
      date: String(entry.date).slice(0, 10),
      evidence: entry.cert
        ? `SCOUTBOOK 專科徽章申報（證書：${entry.cert}）`
        : '由 SCOUTBOOK 個人電子紀錄冊申報專科徽章（待領袖核實）',
    });
  }

  return out;
}

/** 匯出供 scoutbadge 錄入的申報檔：只有身分編號、項目、日期；全部 pending、confirmed:false。 */
export function exportForBadge(book, troopId = '') {
  const sid = scoutId(book?.member);
  const items = collectPendingForBadge(book);
  const pendingProgress = {};
  const pendingRequests = items.map((it) => {
    pendingProgress[it.itemId] = {
      date: it.date,
      status: 'pending',
      confirmed: false,
    };
    return {
      ymis: sid,
      item_id: it.itemId,
      item_name: it.itemName,
      requested_date: it.date,
      evidence: it.evidence,
      status: 'pending',
      confirmed: false,
    };
  });

  return {
    info: 'SCOUTBOOK 成員進度申報檔 · 錄入 scoutbadge 時一律為「待領袖核實」（不含個人資料）',
    privacy: 'progress-only',
    status: 'pending',
    confirmed: false,
    troopId: String(troopId || '').trim(),
    scoutId: sid,
    ymis: sid,
    exportedAt: new Date().toISOString(),
    pendingRequests,
    pendingProgress: sid ? { [sid]: pendingProgress } : {},
    source: 'SCOUTBOOK',
    schema: SYNC_SCHEMA,
  };
}

/**
 * 從 scoutbadge 錄入已核實進度至個人 BOOK。
 * - 只認 progress／flatProgress／otherBadges 內領袖已核實的日期；
 * - pendingRequests 只作識別（skippedPending），永不寫入；
 * - 完全不改動 book.member 的姓名、電話、地址、家長、相片等個人資料；
 * - 空白簿（未填任何個人資料）只要帶同 SCOUT ID 亦即可綁定及拉齊進度。
 */
export function importFromBadge(json, srcBook, { expectedScoutId = '' } = {}) {
  if (!json || typeof json !== 'object') throw new Error('檔案格式不正確');
  if (
    json.schema === SYNC_SCHEMA ||
    json.status === 'pending' ||
    json.confirmed === false ||
    (json.pendingProgress && !json.progress && !json.flatProgress && !json.otherBadges)
  ) {
    throw new Error('此檔案屬於「待領袖核實」申報資料，未經領袖在 scoutbadge 核實，不會錄入紀錄冊');
  }

  const next = structuredClone(srcBook);
  const targetId = normalizeScoutId(expectedScoutId) || scoutId(next.member);
  let matchedBy = '';
  let skippedPending = 0;
  let imported = 0;

  if (Array.isArray(json.pendingRequests)) {
    json.pendingRequests.forEach((req) => {
      if (!req || typeof req !== 'object') return;
      const reqId = normalizeScoutId(req.ymis || req.scoutId || '');
      const st = String(req.status || 'pending').trim().toLowerCase();
      if (st !== 'approved' && (!targetId || !reqId || sameScoutId(targetId, reqId))) {
        skippedPending += 1;
      }
    });
  }

  // 私隱自決：若載入檔只有其他成員的已核實進度，不可靜默綁定或寫入本冊。
  if (targetId) {
    const candidateIds = new Set();
    for (const container of [json.progress, json.flatProgress, json.otherBadges]) {
      if (!container || typeof container !== 'object') continue;
      for (const key of Object.keys(container)) {
        if (key === '說明') continue;
        const bookKey = toBookId(key);
        if (ITEM_INDEX[bookKey] || OTHER_BADGES.some((b) => b.id === bookKey)) continue;
        if (/^[0-9A-Za-z_-]{4,32}$/.test(key)) candidateIds.add(key);
      }
    }
    if (candidateIds.size && ![...candidateIds].some((id) => sameScoutId(id, targetId))) {
      throw new Error('這份進度屬於另一位童軍成員（SCOUT ID 不同），不會寫入本冊');
    }
  }

  const extractMemberMap = (container) => {
    if (!container || typeof container !== 'object') return null;
    const keys = Object.keys(container).filter((k) => k !== '說明');
    if (!keys.length) return null;
    if (keys.some((k) => Boolean(ITEM_INDEX[toBookId(k)]) || OTHER_BADGES.some((b) => b.id === toBookId(k)))) {
      matchedBy = matchedBy || '直接已核實進度表';
      return container;
    }
    if (targetId) {
      const hit = keys.find((k) => sameScoutId(k, targetId));
      if (hit && container[hit] && typeof container[hit] === 'object') {
        matchedBy = matchedBy || `SCOUT ID ${targetId}`;
        return container[hit];
      }
      return {};
    }
    throw new Error('請先輸入你的童軍成員編號（SCOUT ID），以便對齊 scoutbadge 內屬於你的已核實進度');
  };

  const writeItem = (rawId, val, confirmer) => {
    const bookId = toBookId(rawId);
    if (!ITEM_INDEX[bookId]) return;
    if (!isConfirmedEntry(val)) {
      skippedPending += 1;
      return;
    }
    const date = String(typeof val === 'string' ? val : val.date).slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    const prev = next.progress[bookId] || {};
    const who = String(
      confirmer || (typeof val === 'object' ? val.confirmer || val.confirmed_by || '' : '') || '',
    ).slice(0, 60);
    next.progress[bookId] = {
      ...prev,
      date,
      confirmedByBadge: true,
      confirmedAt: new Date().toISOString(),
      ...(who ? { badgeConfirmer: who } : {}),
      ...(prev.signature ? { signature: prev.signature } : {}),
    };
    imported += 1;
  };

  for (const src of [json.progress, json.flatProgress]) {
    if (!src || typeof src !== 'object') continue;
    const map = extractMemberMap(src);
    if (!map) continue;
    for (const [rawId, val] of Object.entries(map)) writeItem(rawId, val, val?.confirmer);
  }

  if (json.otherBadges && typeof json.otherBadges === 'object') {
    const map = extractMemberMap(json.otherBadges);
    if (map) {
      for (const [rawId, val] of Object.entries(map)) {
        const bookId = toBookId(rawId);
        if (!OTHER_BADGES.some((b) => b.id === bookId)) continue;
        if (!isConfirmedEntry(val)) {
          skippedPending += 1;
          continue;
        }
        const date = String(typeof val === 'string' ? val : val.date).slice(0, 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
        const prev = next.otherBadges[bookId] || {};
        const cert = typeof val === 'object' ? String(val.cert || '').slice(0, 60) : '';
        next.otherBadges[bookId] = {
          ...prev,
          date: String(date),
          ...(cert ? { cert } : {}),
          confirmedByBadge: true,
          confirmedAt: new Date().toISOString(),
        };
        imported += 1;
      }
    }
  }

  // 空白簿免填個人資料即可同步：只綁定編號，不寫入任何個人資料。
  if (!scoutId(next.member) && targetId) {
    next.member = { ...next.member, scoutId: targetId, memberNo: targetId };
    syncIdentity(next.member);
    matchedBy = matchedBy || `SCOUT ID ${targetId}`;
  }

  next.meta = {
    ...(next.meta || {}),
    lastBadgeSyncAt: new Date().toISOString(),
    lastBadgeSyncMatchedBy: matchedBy || '',
  };

  return { book: next, imported, skippedPending, matchedBy };
}

// ------------------------------------------------------------------ 列印及示範資料
/** 整本列印頁序（不包括數位附錄及目錄）。 */
export const PRINT_PAGES = SECTIONS.filter((s) => s.id !== 'appendix');

/** 示範紀錄冊：只示範版面，不假裝任何未經領袖核實的日期。 */
export function demoBook() {
  const book = newBook();
  book.member = {
    ...book.member,
    nameZh: '陳小鷹',
    nameEn: 'CHAN Siu-ying',
    scoutId: '0012345678',
    gender: 'M',
    dob: '2013-04-12',
    schoolLevel: '中一',
    school: '沙田第一中學',
    region: '新界東地域',
    district: '沙田北區',
    group: '沙田第 12 旅',
    troop: '沙田第 12 旅童軍團',
    patrol: '鷹小隊',
    sl: '李團長',
    dateJoined: '2024-09-01',
  };
  const seed = [
    ['L1-M1', '2024-09-14'],
    ['L1-M2', '2024-09-21'],
    ['L1-M3', '2024-09-28'],
    ['L1-M4', '2024-10-05'],
    ['L1-M5', '2024-10-12'],
    ['L2-A1', '2025-01-11'],
    ['L2-A2', '2025-01-18'],
    ['L2-B1', '2025-02-08'],
  ];
  seed.forEach(([id, date]) => {
    book.progress[id] = { date, confirmedByBadge: true, confirmedAt: new Date().toISOString() };
  });
  book.otherBadges['SC-INT-001'] = { date: '2025-03-15', cert: 'INT/2025/0181', confirmedByBadge: true };
  book.otherBadges['SC-PUR-001'] = { date: '2025-05-10', cert: 'PUR/2025/0244' };
  book.pages.award_L1 = { date: '2024-11-25', certNo: 'MB/2024/0912', presentedBy: '李團長' };
  book.renewals = [{ date: '2026-09-01', validUntil: '2027-08-31', memberNo: '0012345678', leaderName: '李團長' }];
  return book;
}
