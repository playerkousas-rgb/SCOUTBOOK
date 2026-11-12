// ==========================================================================
// SCOUTBOOK — 童軍支部個人隨身電子紀錄冊資料模型
// 純本機儲存（localStorage），一次只服務「這一位」成員的紀錄冊。
// 全團名冊、批量簽核、多成員切換一律屬 scoutbadge（旅團進度表）範疇，本倉庫不做。
//
// 頁序按官方紙本編號 1–110；舊版頁面資料由頁碼遷移表搬遷。
// ==========================================================================

import {
  BADGE_SYLLABUS,
  OTHER_BADGES,
  ALL_AWARDS,
  ALL_TRACKED_AWARDS,
  SPOTLIGHT_AWARDS,
  SYLLABUS_ITEMS,
  ITEM_INDEX,
  SYLLABUS_META,
  TRAINING_PLAN,
  SAFE_FROM_HARM,
  toBadgeId,
  toBookId,
} from './syllabus.js';
import {
  OFFICIAL_GROUPS,
  AWARD_ART,
  RECORD_COLS,
  buildOfficialPages,
  officialPageByNo,
} from './officialPages.js';

export {
  BADGE_SYLLABUS,
  OTHER_BADGES,
  ALL_AWARDS,
  ALL_TRACKED_AWARDS,
  SPOTLIGHT_AWARDS,
  SYLLABUS_ITEMS,
  ITEM_INDEX,
  SYLLABUS_META,
  TRAINING_PLAN,
  SAFE_FROM_HARM,
  toBadgeId,
  toBookId,
  OFFICIAL_GROUPS,
  AWARD_ART,
  RECORD_COLS,
  officialPageByNo,
};

export const APP_VERSION = 'v2.1.3';
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
export const OFFICIAL_PAGES = buildOfficialPages({
  itemNames: Object.fromEntries(
    ALL_TRACKED_AWARDS.flatMap((a) => a.segments.flatMap((sg) => sg.items.map((i) => [i.id, i.name]))),
  ),
  itemNamesEn: Object.fromEntries(
    ALL_TRACKED_AWARDS.flatMap((a) => a.segments.flatMap((sg) => sg.items.map((i) => [i.id, i.en]))),
  ),
  awardNames: Object.fromEntries(ALL_TRACKED_AWARDS.map((a) => [a.id, a.name])),
  awardNamesEn: Object.fromEntries(ALL_TRACKED_AWARDS.map((a) => [a.id, a.en])),
});

// ------------------------------------------------------------------ 頁序
export const SECTIONS = [
  ...OFFICIAL_PAGES.map((pg) => ({
    id: pg.id, page: pg.page, label: pg.zh, en: pg.en,
    group: pg.group, kind: pg.kind, badge: pg.badge,
  })),
  { id: 'appendix', page: '—', label: '數位附錄', en: 'Digital Appendix', digital: true },
];

export const PAGE_TOTAL = SECTIONS.filter((s) => !s.digital).length;

// ------------------------------------------------------------------ 頁碼遷移
// 專科徽章頁已移到總領袖獎章之後（舊 p40–p49 → p24–p33；舊 p50–p62 → p34–p46；
// 舊 p24–p39 → p47–p62）。以 pages.pNN 儲存的逐頁雜項按此表搬遷一次（以 meta.pagev 標記）。
export const V1_PAGE_MAP = {
  p40: 'p24', p41: 'p25', p42: 'p26', p43: 'p27', p44: 'p28', p45: 'p29',
  p46: 'p30', p47: 'p31', p48: 'p32', p49: 'p33',
  p50: 'p34', p51: 'p35', p52: 'p36', p53: 'p37', p54: 'p38', p55: 'p39',
  p56: 'p40', p57: 'p41', p58: 'p42', p59: 'p43', p60: 'p44', p61: 'p45', p62: 'p46',
  p24: 'p47', p25: 'p48', p26: 'p49', p27: 'p50', p28: 'p51', p29: 'p52',
  p30: 'p53', p31: 'p54', p32: 'p55', p33: 'p56', p34: 'p57', p35: 'p58',
  p36: 'p59', p37: 'p60', p38: 'p61', p39: 'p62',
};

// 舊制 p01–p66（第一代頁碼）→ 官方 p001–p110（「繼續上次」定位用 best-effort 對應）。
export const PAGE_ID_MIGRATION = {
  p01: 'p001', p02: 'p002', p03: 'p003', p04: 'p004', p05: 'p005', p06: 'p006', p07: 'p109',
  p08: 'p012', p09: 'p013',
  p10: 'p016', p11: 'p021', p12: 'p021', p13: 'p022',
  p14: 'p025', p15: 'p032', p16: 'p034', p17: 'p035', p18: 'p038',
  p19: 'p040', p20: 'p047', p21: 'p050', p22: 'p052', p23: 'p058',
  p24: 'p008', p25: 'p013', p26: 'p014', p27: 'p104', p28: 'p108', p29: 'p107',
  p30: 'p106', p31: 'p107', p32: 'p108', p33: 'p109',
  p34: 'p060', p35: 'p060', p36: 'p061', p37: 'p065', p38: 'p068', p39: 'p069',
  p40: 'p073', p41: 'p074', p42: 'p075', p43: 'p075', p44: 'p075', p45: 'p075', p46: 'p075',
  p47: 'p078', p48: 'p078', p49: 'p078', p50: 'p078',
  p51: 'p079', p52: 'p079', p53: 'p079', p54: 'p079',
  p55: 'p080', p56: 'p080', p57: 'p081', p58: 'p081', p59: 'p081',
  p60: 'p082', p61: 'p104', p62: 'p104',
  p63: 'appendix', p64: 'p009', p65: 'appendix', p66: 'appendix',
};

export function migratePageId(id, pagev) {
  let out = id;
  if (pagev == null || Number(pagev) < 2) out = V1_PAGE_MAP[out] || out;
  return PAGE_ID_MIGRATION[out] || out;
}

/** 把 v1.0.0 頁碼的 pages.* 搬到 v1.1 頁碼（只對 pagev < 2 的舊書跑一次）。
 *  來源與目標有重疊（如 p42 既是來源又是目標），因此先全部讀出、刪掉來源再寫入。 */
export function migrateStoredPages(pages, meta) {
  if (!pages || typeof pages !== 'object' || (meta?.pagev != null && Number(meta.pagev) >= 2)) return pages || {};
  const moves = Object.keys(pages).filter((k) => V1_PAGE_MAP[k] && V1_PAGE_MAP[k] !== k);
  if (!moves.length) return { ...pages };
  const next = { ...pages };
  const carried = moves.map((k) => [V1_PAGE_MAP[k], next[k]]);
  for (const k of moves) delete next[k];
  for (const [dest, value] of carried) next[dest] = value;
  return next;
}

const rowHasValue = (r) =>
  r && typeof r === 'object' && Object.values(r).some((v) => String(v ?? '').trim() !== '');
const mapRows = (rows, fn) => (Array.isArray(rows) ? rows.map(fn).filter(rowHasValue) : []);

/** 舊單行章級完成 → 全文獎章分項回填對照（otherBadges 鍵 → 全文獎章）。 */
export const SPOTLIGHT_BACKFILL = {
  'SC-OTH-002': 'OT-LD',
  'SC-OTH-001': 'OT-SF',
  'SC-OTH-008': 'OT-VS',
  'SC-OTH-005': 'OT-RG',
  'SC-OTH-004': 'OT-CM',
};

/** v1.x → v2（pagev 3）：舊制頁作用域數據搬入官方頁鍵；舊鍵原位保留，絕不刪除。
 *  progress.*（L1–L5）與 otherBadges.* 按題鍵儲存，換頁零遷移，此處只做：
 *  宣誓 p26→p014、續期 renewals→p006、活動／服務／獎勵行→p104／p106–p109，
 *  以及全文獎章舊單行完成→新分項同日期回填。 */
export function migrateV2toV3(book) {
  if (!book || typeof book !== 'object') return book;
  if (Number(book?.meta?.pagev) >= 3) return book;
  const pages = { ...(book.pages || {}) };
  const p26 = pages.p26 || {};
  if (!pages.p014 && (p26.investitureDate || p26.investingLeader)) {
    pages.p014 = {
      investitureDate: p26.investitureDate || '',
      investingLeader: p26.investingLeader || '',
    };
  }
  if (p26.membershipDate && !pages.award_L1?.date) {
    pages.award_L1 = { ...(pages.award_L1 || {}), date: p26.membershipDate };
  }
  if (book.member?.dateInvestiture && !pages.p014?.investitureDate) {
    pages.p014 = { ...(pages.p014 || {}), investitureDate: book.member.dateInvestiture };
  }
  if (!pages.p006?.rows?.length && Array.isArray(book.renewals) && book.renewals.length) {
    pages.p006 = { ...(pages.p006 || {}), rows: book.renewals.filter(rowHasValue) };
  }
  const pushRows = (key, rows) => {
    if (!rows.length) return;
    pages[key] = { ...(pages[key] || {}), rows: [...(pages[key]?.rows || []), ...rows] };
  };
  pushRows('p106', mapRows(pages.p30?.log, (r) => ({
    date: r.date || '', place: r.venue || '', brief: r.activity || '', nights: '',
  })));
  pushRows('p107', [
    ...mapRows(pages.p29?.trips, (r) => ({
      date: r.date || '', place: '', brief: r.route || '', km: r.distance || '',
    })),
    ...mapRows(pages.p31?.log, (r) => ({
      date: r.date || '', place: r.venue || '', brief: r.activity || '', km: '',
    })),
  ]);
  pushRows('p108', [
    ...mapRows(pages.p28?.experiences, (r) => ({
      date: r.date || '', org: '', brief: r.experience || '', certNo: '',
    })),
    ...mapRows(pages.p32?.log, (r) => ({
      date: r.date || '', org: '', brief: r.activity || '', certNo: '',
    })),
  ]);
  pushRows('p109', [
    ...mapRows(book.service, (r) => ({
      date: r.date || '', org: '', brief: r.activity || '', hours: r.hours || '',
    })),
    ...mapRows(pages.p33?.log, (r) => ({
      date: r.date || '', org: '', brief: r.activity || '', hours: '',
    })),
  ]);
  pushRows('p104', [
    ...mapRows(pages.p27?.awards, (r) => ({
      badge: r.award || '', examiner: r.presentedBy || '', date: r.date || '',
    })),
    ...mapRows(book.awardsLog, (r) => ({
      badge: r.award || '', examiner: r.presentedBy || '', date: r.date || '',
    })),
  ]);
  book.pages = pages;
  if (Array.isArray(book.transfers)) {
    book.transfers = book.transfers.map((t) =>
      t && !t.group
        ? { ...t, group: t.toGroup || t.fromGroup || '', leaderName: '', leaderPhone: '' }
        : t,
    );
  }
  const progress = { ...(book.progress || {}) };
  const other = book.otherBadges || {};
  for (const [otherId, awardId] of Object.entries(SPOTLIGHT_BACKFILL)) {
    const entry = other[otherId];
    if (!entry?.date) continue;
    const award = SPOTLIGHT_AWARDS.find((a) => a.id === awardId);
    if (!award) continue;
    for (const item of award.segments.flatMap((sg) => sg.items)) {
      if (!progress[item.id]?.date) progress[item.id] = { date: entry.date, carriedFromBadge: otherId };
    }
  }
  book.progress = progress;
  book.meta = { ...(book.meta || {}), pagev: 3 };
  return book;
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
    { value: 'crisis', zh: '危機及保護', en: 'Crisis and Protection' },
  ],
};

export function communityElectiveOptions(awardId) {
  return ['L4', 'L5'].includes(awardId) ? ELECTIVE_OPTIONS.community : ELECTIVE_OPTIONS.community.slice(0, 3);
};

// 可選細項的具體完成方式。徽章選項由 scoutbadge 同步題庫 OTHER_BADGES 產生，標籤雙語完整。
const option = (value, zh, en, badgeId = '') => ({ value, zh, en, ...(badgeId ? { badgeId } : {}) });
const namedBadge = (id) => {
  const badge = OTHER_BADGES.find((b) => b.id === id);
  return badge ? option(id, `${badge.name}（${id}）`, `${badge.en} (${id})`, id) : null;
};
const badgeGroupOptions = (groups, exclude = []) => OTHER_BADGES
  .filter((b) => groups.includes(b.group) && !exclude.includes(b.id))
  .map((b) => option(b.id, `${b.name}（${b.id}）`, `${b.en} (${b.id})`, b.id));
const activityOptions = (...rows) => rows.map(([zh, en]) => option(zh, zh, en));
const badgesMatching = (pattern, groups = ['interest','pursuit','service']) => OTHER_BADGES
  .filter((b) => groups.includes(b.group) && pattern.test(`${b.name} ${b.en || ''}`))
  .map((b) => option(b.id, `${b.name}（${b.id}）`, `${b.en || b.name} (${b.id})`, b.id));
const FITNESS_BADGES = badgesMatching(/體適能|運動|單車|射箭|游泳|獨木舟|田徑|武術|健身|越野跑|跑步|滑雪|攀登|球/, ['interest','pursuit']);
export const ITEM_ELECTIVE_OPTIONS = {
  'L2-A4': activityOptions(['追蹤符號應用', 'Use of tracking signs'], ['公園定向', 'Park orienteering'], ['密碼通訊', 'Code communication']),
  'L2-A6': activityOptions(['航空相關戶外活動', 'Air-related outdoor activity'], ['說出現代飛機主要部分及名稱', 'Identify the main parts of a modern aircraft'], ['辨認初級航空章四種飛行器', 'Identify the four aircraft types in the Elementary Air Activities Badge']),
  'L3-A4': [...badgesMatching(/露營|探險|攀登|定向|行山|遠足|騎術|露營|原野|先鋒|野外|戶外/, ['pursuit']), ...activityOptions(['城市追蹤', 'Urban tracking'], ['密碼', 'Codes'], ['旗號通訊', 'Semaphore communication'])],
  'L3-A5': [namedBadge('SC-SEA-001')].filter(Boolean),
  'L3-A6': [namedBadge('SC-AIR-001')].filter(Boolean),
  'L3-B1': FITNESS_BADGES,
  'L3-B2': [...badgesMatching(/天文|航空|科技|電腦|電子|攝影|模型|機械|科學|地質|測量|通訊|無線電/, ['interest','pursuit']), ...activityOptions(['藝術活動', 'Art activity'], ['科技活動', 'Technology activity'], ['音樂活動', 'Music activity'], ['戲劇活動', 'Drama activity'], ['手工藝活動', 'Craft activity'])],
  'L4-A4': ['SC-PUR-007','SC-PUR-016','SC-PUR-030','SC-PUR-006'].map(namedBadge).filter(Boolean),
  'L4-A5': [namedBadge('SC-SEA-002'), ...badgeGroupOptions(['sea'])].filter(Boolean),
  'L4-A6': [namedBadge('SC-AIR-002')].filter(Boolean),
  'L4-B1': [...FITNESS_BADGES, ...activityOptions(['13 小時體能訓練','13 hours of fitness training'], ['人體生長發育介紹','Talk on human growth and development'], ['健康生活主題宣傳','Healthy living promotion'], ['禁毒章','Drug Prevention Badge'])],
  'L4-B2': [...badgesMatching(/天文|航空|科技|電腦|電子|攝影|模型|機械|科學|地質|測量|通訊|無線電/, ['interest','pursuit']), ...activityOptions(['表演','Performance'], ['藝術品','Artwork'], ['小隊歌','Patrol song'], ['比例模型','Scale model'], ['資訊科技宣傳品','IT promotional material'], ['電動機械模型','Powered mechanical model'])],
  'L4-D2': [...['SC-SER-004','SC-SER-007','SC-SER-017','SC-OTH-004','SC-OTH-018'].map(namedBadge).filter(Boolean), ...activityOptions(['社區活動','Community activity'], ['古蹟活動','Heritage activity'], ['社區服務活動','Community service activity'])],
  'L5-A4': ['SC-PUR-007','SC-PUR-016','SC-PUR-030','SC-PUR-006'].map(namedBadge).filter(Boolean),
  'L5-B1': [...FITNESS_BADGES, ...activityOptions(['精神健康','Mental health'], ['食物營養','Food and nutrition'], ['公共衞生','Public health'], ['保護兒童章','Child Protection Badge'], ['SOUL Keeper Level 1','SOUL Keeper Level 1'], ['精神健康機構參觀','Visit to a mental health organisation'])],
  'L5-D1': [...['SC-SER-009','SC-SER-008','SC-SER-013'].map(namedBadge).filter(Boolean), namedBadge('SC-OTH-001')].filter(Boolean),
  'L5-D2': [...[namedBadge('SC-INT-033')].filter(Boolean), ...activityOptions(['特殊需要人士溝通方法','Communication with people with special needs'], ['社區設施及服務調查','Survey of community facilities and services'])],
  'L5-D3': ['SC-INT-016','SC-INT-023','SC-INT-029','SC-PUR-037','SC-OTH-006','SC-OTH-007','SC-OTH-011','SC-OTH-012','SC-OTH-013'].map(namedBadge).filter(Boolean),
  'L5-D4': [...[namedBadge('SC-INT-020')].filter(Boolean), ...activityOptions(['教授氣象知識','Teach meteorology'], ['介紹天氣圖並記錄營地自動氣象站一週天氣','Present a weather chart and record a camp automatic weather station for one week'])],
  'L5-F1': [...badgeGroupOptions(['instructor']), namedBadge('SC-OTH-008')].filter(Boolean),
  'OT-LD-A5': activityOptions(['指導三個童軍技能項目','Teach three Scout skill items'], ['指導一名或以上童軍考獲一個專科徽章','Coach one or more Scouts to earn a proficiency badge']),
  'OT-SF-A2': badgeGroupOptions(['service']),
  'OT-RG-A1': activityOptions(['天主教課程','Catholic course'], ['孔教課程','Confucian course'], ['伊斯蘭教課程','Islam course'], ['佛教課程','Buddhist course'], ['基督教課程','Christian course'], ['道教課程','Taoist course']),
};

export function electiveChoice(book, awardId) {
  return book?.pages?.[`elective_${awardId}`] || {};
}

// ------------------------------------------------------------------ 獎章頁切片
// 每個獎章頁只顯示所屬分段／細項；測試會驗證切片覆蓋全部細項、不重不漏。
// ------------------------------------------------------------------ 獎章頁切片
// 每個獎章頁只顯示紙本歸位的細項；橫跨頁的細項在次頁複示（continued，同鍵不重計）。
// 測試會驗證主切片覆蓋全部細項、不重不漏。
export const PAGE_SLICES = Object.fromEntries(
  OFFICIAL_PAGES.filter((pg) => pg.kind === 'award' && pg.items.length).map((pg) => [
    pg.id, { award: pg.award, items: pg.items },
  ]),
);

/** 橫跨頁複示的細項（key 同主切片，顯示用，不納入覆蓋計算）。 */
export const PAGE_CONTINUED = Object.fromEntries(
  OFFICIAL_PAGES.filter((pg) => pg.kind === 'award' && pg.continued.length).map((pg) => [
    pg.id, { award: pg.award, items: pg.continued },
  ]),
);

/** 專科徽章頁切片：每組按來源次序分頁（頁內搜尋跨全組時仍可找到）。 */
/** 專科徽章頁切片：紙本一頁一組，整組逐行（p104 另加自由行，見頁面）。 */
export const OTHER_PAGE_SLICES = {
  p078: { groups: ['interest'] },
  p079: { groups: ['pursuit'] },
  p080: { groups: ['service'] },
  p081: { groups: ['instructor'] },
  p082: { groups: ['sea', 'air'] },
  p104: { groups: ['other'] },
};

/** 已升格為全文獎章、不再列於其他徽章名表的舊行（舊數據保留，只是不再顯示）。 */
export const MIGRATED_OTHER_IDS = ['SC-OTH-001', 'SC-OTH-002', 'SC-OTH-004', 'SC-OTH-005', 'SC-OTH-008'];

export function sliceAwardItems(award, ids) {
  if (!award || !ids) return award;
  const wanted = new Set(ids);
  return {
    ...award,
    segments: award.segments
      .map((sg) => ({ ...sg, items: sg.items.filter((i) => wanted.has(i.id)) }))
      .filter((sg) => sg.items.length),
  };
}

export function sliceAward(award, pageId) {
  const spec = PAGE_SLICES[pageId];
  if (!award || !spec || award.id !== spec.award) return award;
  return sliceAwardItems(award, spec.items);
}

export function sliceOtherBadges(pageId) {
  const spec = OTHER_PAGE_SLICES[pageId];
  if (!spec) return [];
  return OTHER_BADGES.filter(
    (b) => spec.groups.includes(b.group) && (b.group !== 'other' || !MIGRATED_OTHER_IDS.includes(b.id)),
  );
}

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
  const { member: partialMember, meta: partialMeta, scouting: partialScouting, ...rest } = partial;
  const book = {
    version: 1,
    appVersion: APP_VERSION,
    member: {
      nameZh: '',
      nameEn: '',
      scoutId: '',
      memberNo: '',
      hkidPrefix: '',
      passportNo: '',
      gender: '',
      photo: null,
      dob: '',
      birthPlace: '',
      school: '',
      schoolLevel: '',
      religion: '',
      phone: '',
      bloodType: '',
      email: '',
      addressZh: '',
      addressEn: '',
      parentName: '',
      parentRelation: '',
      parentPhone: '',
      emergencyName: '',
      emergencyPhone: '',
      emergencyAddr: '',
      allergies: '',
      troop: '',
      patrol: '',
      group: '',
      district: '',
      region: '',
      sponsoringAuthority: '',
      groupAddress: '',
      groupPhone: '',
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
      scoutRanks: { aplFrom: '', aplTo: '', plFrom: '', plTo: '', splFrom: '', splTo: '' },
      stars: { y1: '', y2: '', y3: '', y4: '', y5: '' },
      ...(partialScouting || {}),
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
  migrateV2toV3(book);
  book.meta.pagev = 3;
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
  const award = ALL_TRACKED_AWARDS.find((b) => b.id === awardId);
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
  const rows = book?.pages?.p006?.rows?.length ? book.pages.p006.rows : book?.renewals || [];
  return (
    [...rows]
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

/** 總領袖獎章進度事實（年齡、高級獎章完成度、領導才訓練班證書），供目錄及附錄顯示。 */
export function chiefScoutReadiness(book) {
  const advanced = badgeStats(book, 'L4');
  const leadership = book?.pages?.p42?.leadership || {};
  const ldCourse = book?.progress?.['OT-LD-A6'] || {};
  return {
    age: ageFromDob(book?.member?.dob),
    advancedComplete: advanced.complete,
    advancedDone: advanced.done,
    advancedTotal: advanced.total,
    leadershipCourse: leadership.courseCode || '',
    leadershipDate: leadership.date || ldCourse.date || '',
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
  if (ITEM_INDEX[bookId]) return ITEM_INDEX[bookId].name;
  const spot = SPOTLIGHT_AWARDS.flatMap((a) => a.segments.flatMap((sg) => sg.items)).find(
    (i) => i.id === bookId,
  );
  if (spot) return spot.name;
  return OTHER_BADGES.find((b) => b.id === bookId)?.name || bookId;
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

/** 虛構的列印測試資料；不含真實簽名或 scoutbadge 已核實狀態。 */
export function demoBook() {
  const book = newBook();
  book.meta.demo = true;
  Object.assign(book.member, {
    nameZh: '陳小鷹', nameEn: 'CHAN Siu-ying', scoutId: '0012345678',
    gender: 'M', dob: '2013-04-12', schoolLevel: '中二', school: '沙田第一中學',
    hkidPrefix: 'A123', region: '新界東地域', district: '沙田北區',
    group: '沙田第 12 旅', troop: '沙田第 12 旅童軍團', patrol: '鷹小隊',
    addressZh: '香港示範街 1 號', addressEn: '1 Example Street, Hong Kong',
    phone: '90000000', email: 'scout@example.com', sl: '李樹明', gsl: '黃志明',
    dateJoined: '2024-09-01', dateInvestiture: '2024-11-25',
  });
  const dates = { L1: '2024-10-12', L2: '2025-03-01', L3: '2025-08-01', L4: '2026-03-01', L5: '2026-10-01' };
  for (const award of ALL_TRACKED_AWARDS) {
    for (const segment of award.segments) for (const item of segment.items) {
      book.progress[item.id] = { date: dates[award.id] || '2026-02-01', assessor: '李樹明' };
    }
  }
  book.progress['L1-M1'].date = '2024-09-14';
  for (const id of ['L1', 'L2', 'L3', 'L4']) {
    book.pages[`award_${id}`] = { date: dates[id], certNo: `DEMO-${id}`, presentedBy: '李樹明' };
  }
  for (const id of ['L2', 'L3', 'L4', 'L5']) {
    book.pages[`elective_${id}`] = { outdoor: 'outdoor', community: 'community' };
  }
  book.pages.p42 = { leadership: { courseCode: 'DEMO-LTC', date: '2026-02-01', certNo: 'DEMO-LTC-001' } };
  for (const [i, badge] of OTHER_BADGES.entries()) {
    book.otherBadges[badge.id] = { date: '2025-06-01', cert: `DEMO-${String(i + 1).padStart(3, '0')}` };
  }
  book.renewals = [{ date: '2026-09-01', validUntil: '2027-08-31', memberNo: '0012345678', leaderName: '李樹明' }];
  const cBadges = [
    '與戶外活動有關之專科徽章 ／ 艇工章 ／ 初級航空活動章',
    '指定兩個技能組專科徽章或水手章 及 一個海上活動有關之專科徽章或中級航空活動章',
    '與藝術／創意／科技有關之專科徽章', '指定服務組專科徽章',
    '與體適能有關之專科徽章', '教導組專科徽章', '與生態環境有關之專科徽章',
  ];
  book.forms.pt18 = {
    ...Object.fromEntries(cBadges.map((name) => [`sectionC_${name}`, '2026-02-01'])),
    sectionD_E2: '2026-02-01', applicantDate: '2026-10-02',
    nominationName: '李樹明', nominationDate: '2026-10-03',
    recommendationName: '陳志明', recommendationDate: '2026-10-04',
    confirmationName: '黃志明', confirmationDate: '2026-10-05',
    approvalName: '林志明', approvalDate: '2026-10-06',
    receivedDate: '2026-10-07', certIssueDate: '2026-10-08',
  };
  book.forms.p120a1 = {
    refNo: 'DEMO-A1', badgeId: 'SC-INT-001', arrangement: 'course',
    arrangementName: '示範訓練班', arrangementOrg: '示範機構', slName: '李樹明', slDate: '2025-05-01',
    examinerName: '陳志明', examinerPhone: '90000001', examinerQualification: '示範資歷',
    examinerCertName: '示範證書', examinerCertNo: 'DEMO-EXAM-001', assessmentMode: '實習及口試',
    assessmentDate: '2025-06-01', assessmentPlan: '示範考驗計劃', accepted: 'accepted',
    authorisedName: '黃志明', authorisedPost: '示範職位', authorisedDate: '2025-05-10',
    result: 'pass', examinerRemarks: '示範評語', resultDate: '2025-06-01',
    issueName: '林志明', issuePost: '示範職位', issueDate: '2025-06-02', issueCertNo: 'DEMO-CERT-001',
  };
  book.forms.p120a2 = { refNo: 'DEMO-A2', mainBadgeId: 'SC-INT-001',
    extraBadges: [{ badgeId: 'SC-PUR-001', applicantName: '陳小鷹', scoutId: '0012345678' }],
    additionalNotes: '示範資料，只供列印測試。' };
  return book;
}
