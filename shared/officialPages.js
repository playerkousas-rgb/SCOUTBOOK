/**
 * 官方《童軍紀錄冊》頁面藍本（香港童軍總會，© 2026；scout-record-book_20260829.pdf）
 *
 * 全書 = 封面（不計頁碼）＋ 卷首語（不計頁碼，數位版收附錄）＋ 官方印刷頁 1–110。
 * SCOUTBOOK 不新增、不合併、不重排任何官方頁；數位延伸只放在附錄。
 * 數位頁 id 用三位數 p001–p110，與舊制 p01–p66 永不碰撞。
 * 獎章細項按紙本起始頁歸位（starts-rule）；橫跨兩頁的細項在次頁以 continued 複示，
 * 進度鍵同一個，不重複計算。欄名只照錄紙本事實資訊，不貼 PDF 原文整段。
 */

export const OFFICIAL_GROUPS = [
  { id: 'personal', zh: '個人及旅團紀錄', en: 'Personal & Group Records', from: 1, to: 7 },
  { id: 'promise', zh: '支部・誓詞・進度總覽', en: 'Section, Promise & Overview', from: 8, to: 11 },
  { id: 'membership', zh: '會員章', en: 'Membership Badge', from: 12, to: 15 },
  { id: 'pathfinder', zh: '童軍探索獎章', en: 'Scout Pathfinder Award', from: 16, to: 24 },
  { id: 'standard', zh: '童軍標準獎章', en: 'Scout Standard Award', from: 25, to: 39 },
  { id: 'advanced', zh: '童軍高級獎章', en: 'Scout Advanced Award', from: 40, to: 59 },
  { id: 'csa', zh: '總領袖獎章', en: "Chief Scout's Award", from: 60, to: 75 },
  { id: 'otintro', zh: '專科徽章簡介', en: 'Proficiency Badges Guide', from: 76, to: 77 },
  { id: 'otgroups', zh: '專科徽章', en: 'Proficiency Badges', from: 78, to: 82 },
  { id: 'spotlight', zh: '領導才・服務・先修', en: 'Leadership, Service & Link', from: 83, to: 90 },
  { id: 'ayp', zh: '香港青年獎勵計劃', en: 'HK Award for Young People', from: 91, to: 101 },
  { id: 'faith', zh: '宗教・社區', en: 'Faith & Community', from: 102, to: 103 },
  { id: 'others', zh: '其他獎章及徽章', en: 'Other Awards & Badges', from: 104, to: 105 },
  { id: 'logs', zh: '營期・遠足・訓練・服務紀錄', en: 'Camping, Expedition, Training & Service Logs', from: 106, to: 110 },
];

/** 群組 → 色帶家族（沿用 L1–L5／OT／front 三系）。 */
export const GROUP_BADGE = {
  personal: 'front', promise: 'front', membership: 'L1',
  pathfinder: 'L2', standard: 'L3', advanced: 'L4', csa: 'L5',
  otintro: 'OT', otgroups: 'OT', spotlight: 'OT', ayp: 'front',
  faith: 'front', others: 'front', logs: 'front',
};

const id3 = (no) => `p${String(no).padStart(3, '0')}`;

// ------------------------------------------------------------------ 獎章頁
// [頁碼, 獎章, { intro?, items?, continued?, sign? }] —— 紙本起始頁歸位，見 docs/v2-110-plan.md §三。
const AWARD_PAGES = [
  [12, 'L1', { intro: 1, items: ['L1-M1', 'L1-M2', 'L1-M3', 'L1-M4', 'L1-M5'] }],
  [13, 'L1', { items: ['L1-M6', 'L1-M7', 'L1-M8', 'L1-M9', 'L1-M10', 'L1-M11'] }],
  [14, 'L1', { sign: 1 }],
  [16, 'L2', { intro: 1, items: ['L2-A1'] }],
  [17, 'L2', { items: ['L2-A2'], continued: ['L2-A1'] }],
  [18, 'L2', { items: ['L2-A3', 'L2-A4'] }],
  [19, 'L2', { items: ['L2-A5', 'L2-A6'] }],
  [20, 'L2', { continued: ['L2-A6'] }],
  [21, 'L2', { items: ['L2-B1', 'L2-B2', 'L2-C1'] }],
  [22, 'L2', { items: ['L2-C2', 'L2-D1'] }],
  [23, 'L2', { items: ['L2-D2', 'L2-D3', 'L2-D4'] }],
  [24, 'L2', { sign: 1 }],
  [25, 'L3', { intro: 1 }],
  [26, 'L3', { items: ['L3-A1'] }],
  [27, 'L3', { items: ['L3-A2'] }],
  [28, 'L3', { items: ['L3-A3'] }],
  [29, 'L3', { items: ['L3-A4'] }],
  [30, 'L3', { items: ['L3-A5'] }],
  [31, 'L3', { items: ['L3-A6'] }],
  [32, 'L3', { items: ['L3-B1', 'L3-B2'] }],
  [33, 'L3', { continued: ['L3-B2'] }],
  [34, 'L3', { items: ['L3-C1', 'L3-C2'] }],
  [35, 'L3', { items: ['L3-D1'], continued: ['L3-C2'] }],
  [36, 'L3', { items: ['L3-D2'] }],
  [37, 'L3', { items: ['L3-D3'] }],
  [38, 'L3', { items: ['L3-D4', 'L3-E1'] }],
  [39, 'L3', { items: ['L3-F1'], sign: 1 }],
  [40, 'L4', { intro: 1 }],
  [41, 'L4', { items: ['L4-A1'] }],
  [42, 'L4', { items: ['L4-A2'] }],
  [43, 'L4', { continued: ['L4-A2'] }],
  [44, 'L4', { items: ['L4-A3', 'L4-A4'] }],
  [45, 'L4', { items: ['L4-A5'] }],
  [46, 'L4', { items: ['L4-A6'] }],
  [47, 'L4', { items: ['L4-B1'] }],
  [48, 'L4', { items: ['L4-B2'], continued: ['L4-B1'] }],
  [49, 'L4', { continued: ['L4-B2'] }],
  [50, 'L4', { items: ['L4-C1'] }],
  [51, 'L4', { items: ['L4-C2'] }],
  [52, 'L4', { items: ['L4-D1'] }],
  [53, 'L4', { items: ['L4-D2'] }],
  [54, 'L4', { items: ['L4-D3'] }],
  [55, 'L4', { items: ['L4-D4'], continued: ['L4-D3'] }],
  [56, 'L4', { items: ['L4-D5'] }],
  [57, 'L4', { continued: ['L4-D5'] }],
  [58, 'L4', { items: ['L4-E1'] }],
  [59, 'L4', { items: ['L4-F1'], sign: 1 }],
  [60, 'L5', { intro: 1 }],
  [61, 'L5', { items: ['L5-A1', 'L5-A2'] }],
  [62, 'L5', { continued: ['L5-A2'] }],
  [63, 'L5', { items: ['L5-A3', 'L5-A4'] }],
  [64, 'L5', { items: ['L5-A5', 'L5-A6'] }],
  [65, 'L5', { items: ['L5-B1'], continued: ['L5-A6'] }],
  [66, 'L5', { items: ['L5-B2'], continued: ['L5-B1'] }],
  [67, 'L5', { continued: ['L5-B2'] }],
  [68, 'L5', { items: ['L5-C1', 'L5-C2'] }],
  [69, 'L5', { items: ['L5-D1'], continued: ['L5-C2'] }],
  [70, 'L5', { items: ['L5-D2'] }],
  [71, 'L5', { items: ['L5-D3', 'L5-D4'] }],
  [72, 'L5', { items: ['L5-D5'], continued: ['L5-D4'] }],
  [73, 'L5', { items: ['L5-E1'] }],
  [74, 'L5', { items: ['L5-F1'] }],
  [75, 'L5', { sign: 1, nominate: 1 }],
  [83, 'OT-LD', { intro: 1, items: ['OT-LD-A1', 'OT-LD-A2'] }],
  [84, 'OT-LD', { items: ['OT-LD-A3', 'OT-LD-A4', 'OT-LD-A5'] }],
  [85, 'OT-LD', { items: ['OT-LD-A6', 'OT-LD-A7'], continued: ['OT-LD-A5'], sign: 1 }],
  [86, 'OT-SF', { intro: 1, items: ['OT-SF-A1', 'OT-SF-A2', 'OT-SF-A3'] }],
  [87, 'OT-SF', { items: ['OT-SF-A4'], sign: 1 }],
  [88, 'OT-VS', { intro: 1, items: ['OT-VS-A1', 'OT-VS-A2', 'OT-VS-A3'] }],
  [89, 'OT-VS', { items: ['OT-VS-A4', 'OT-VS-A5', 'OT-VS-A6', 'OT-VS-A7', 'OT-VS-A8'] }],
  [90, 'OT-VS', { items: ['OT-VS-A9', 'OT-VS-A10'], sign: 1 }],
  [102, 'OT-RG', { intro: 1, items: ['OT-RG-A1'], sign: 1 }],
  [103, 'OT-CM', { intro: 1, items: ['OT-CM-A1', 'OT-CM-A2', 'OT-CM-A3'], sign: 1 }],
];

/** 官方徽章實圖（web/public/official/）：只接已核實圖片，絕不重繪。 */
export const AWARD_ART = {
  L1: { src: '/official/membership-emblem.png', zh: '童軍會員章', en: 'Scout Membership Badge' },
  L2: { src: '/official/badge-pathfinder.png', zh: '童軍探索獎章', en: 'Scout Pathfinder Award' },
  L3: { src: '/official/badge-standard.png', zh: '童軍標準獎章', en: 'Scout Standard Award' },
  L4: { src: '/official/badge-advanced.png', zh: '童軍高級獎章', en: 'Scout Advanced Award' },
  L5: { src: '/official/badge-csa.png', zh: '總領袖獎章', en: "Chief Scout's Award" },
};

// ------------------------------------------------------------------ 非獎章頁
// [頁碼, 中文題, 英文題, 群組, kind, extra]
const FIXED_PAGES = [
  [1, '童軍成員資料', 'Scout Membership Details', 'personal', 'personal', { form: 'p1' }],
  [2, '個人紀錄', 'Personal Record', 'personal', 'personal', { form: 'p2' }],
  [3, '旅部資料', 'Group Information', 'personal', 'personal', { form: 'p3' }],
  [4, '童軍經驗', 'Scout Experience', 'personal', 'personal', { form: 'p4' }],
  [5, '轉旅及搬遷紀錄', 'Transfer & Removal Records', 'personal', 'personal', { form: 'p5' }],
  [6, '會員資格紀錄', 'Membership Record', 'personal', 'renewal', {}],
  [7, '會員資格續期須知', 'Membership Renewal Notes', 'personal', 'renewal-sign', {}],
  [8, '童軍支部', 'The Scout Section', 'promise', 'static', { text: 'section' }],
  [9, '童軍誓詞', 'The Scout Promise', 'promise', 'static', { text: 'promise' }],
  [10, '進度性徽章', 'Progressive Badges', 'promise', 'static', { text: 'progressive' }],
  [11, '獲取總領袖獎章之途徑', "Route to the Chief Scout's Award", 'promise', 'static', { text: 'route' }],
  [15, '香港青年獎勵計劃同意書', 'HKAYP Consent', 'membership', 'ayp-consent', { badge: 'front' }],
  [76, '專科徽章及其他獎章（中文）', 'Proficiency & Other Badges (I)', 'otintro', 'static', { text: 'otguide1' }],
  [77, '專科徽章及其他獎章（英文）', 'Proficiency & Other Badges (II)', 'otintro', 'static', { text: 'otguide2' }],
  [78, '興趣組', 'Interest Badges', 'otgroups', 'ot-group', { groups: ['interest'] }],
  [79, '技能組', 'Pursuit Badges', 'otgroups', 'ot-group', { groups: ['pursuit'] }],
  [80, '服務組', 'Service Badges', 'otgroups', 'ot-group', { groups: ['service'] }],
  [81, '教導組', 'Instructor Badges', 'otgroups', 'ot-group', { groups: ['instructor'] }],
  [82, '海上活動・航空活動', 'Sea & Air Activity Badges', 'otgroups', 'ot-group', { groups: ['sea', 'air'] }],
  [91, '獎勵計劃紀錄（銅章・加入）', 'HKAYP Bronze · Enrolment', 'ayp', 'ayp-record', { form: 'ayp91' }],
  [92, '獎勵計劃紀錄（銅章・技能前訓）', 'HKAYP Bronze · Skills', 'ayp', 'ayp-record', { form: 'ayp92' }],
  [93, '獎勵計劃紀錄（銅章・實習旅程）', 'HKAYP Bronze · Practice Journey', 'ayp', 'ayp-record', { form: 'ayp93' }],
  [94, '獎勵計劃紀錄（銅章・技能科）', 'HKAYP Bronze · Skills Record', 'ayp', 'ayp-record', { form: 'ayp94' }],
  [95, '獎勵計劃紀錄（銅章・康樂體育科）', 'HKAYP Bronze · Physical Recreation', 'ayp', 'ayp-record', { form: 'ayp95' }],
  [96, '獎勵計劃紀錄（銅章・服務科）', 'HKAYP Bronze · Service', 'ayp', 'ayp-record', { form: 'ayp96' }],
  [97, '獎勵計劃紀錄（銀章・前訓）', 'HKAYP Silver · Preliminary', 'ayp', 'ayp-record', { form: 'ayp97' }],
  [98, '獎勵計劃紀錄（銀章・實習旅程）', 'HKAYP Silver · Practice Journey', 'ayp', 'ayp-record', { form: 'ayp98' }],
  [99, '獎勵計劃紀錄（銀章・技能科）', 'HKAYP Silver · Skills Record', 'ayp', 'ayp-record', { form: 'ayp99' }],
  [100, '獎勵計劃紀錄（銀章・康樂體育科）', 'HKAYP Silver · Physical Recreation', 'ayp', 'ayp-record', { form: 'ayp100' }],
  [101, '獎勵計劃紀錄（銀章・服務科）', 'HKAYP Silver · Service', 'ayp', 'ayp-record', { form: 'ayp101' }],
  [104, '其他獎章及徽章（一）', 'Other Awards & Badges I', 'others', 'other-badges', { freerows: 'p104' }],
  [105, '其他獎章及徽章（二）', 'Other Awards & Badges II', 'others', 'other-badges', { freerows: 'p105', named: 0 }],
  [106, '露營紀錄', 'Camping Record', 'logs', 'record-table', { cols: 'camping' }],
  [107, '遠足紀錄', 'Expedition Record', 'logs', 'record-table', { cols: 'expedition' }],
  [108, '訓練班／活動紀錄', 'Training Course / Activity Record', 'logs', 'record-table', { cols: 'training' }],
  [109, '服務紀錄（一）', 'Service Record I', 'logs', 'record-table', { cols: 'service' }],
  [110, '服務紀錄（二）', 'Service Record II', 'logs', 'record-table', { cols: 'service' }],
];

/** 紙本紀錄表欄（事實欄名，可照錄）。 */
export const RECORD_COLS = {
  camping: [
    { k: 'date', label: '日期', en: 'Date', type: 'date' },
    { k: 'place', label: '地點', en: 'Place' },
    { k: 'brief', label: '摘要', en: 'Brief Information' },
    { k: 'nights', label: '晚數', en: 'No. of nights', narrow: true },
  ],
  expedition: [
    { k: 'date', label: '日期', en: 'Date', type: 'date' },
    { k: 'place', label: '地點', en: 'Place' },
    { k: 'brief', label: '摘要', en: 'Brief Information' },
    { k: 'km', label: '里數', en: 'No. of Km', narrow: true },
  ],
  training: [
    { k: 'date', label: '日期', en: 'Date', type: 'date' },
    { k: 'org', label: '主辦單位', en: 'Organised by' },
    { k: 'brief', label: '摘要', en: 'Brief Information' },
    { k: 'certNo', label: '證書號碼', en: 'Certificate No.' },
  ],
  service: [
    { k: 'date', label: '日期', en: 'Date', type: 'date' },
    { k: 'org', label: '主辦單位', en: 'Organised by' },
    { k: 'brief', label: '摘要', en: 'Brief Information' },
    { k: 'hours', label: '服務時數', en: 'Service Hours', narrow: true },
  ],
  other: [
    { k: 'badge', label: '獎章或徽章', en: 'Awards or Badges' },
    { k: 'examiner', label: '主考', en: 'Examiner' },
    { k: 'date', label: '完成日期', en: 'Date Completed', type: 'date' },
  ],
};

// ------------------------------------------------------------------ 組裝
const groupOf = (no) => (OFFICIAL_GROUPS.find((g) => no >= g.from && no <= g.to) || {}).id || 'personal';

/**
 * 獎章頁副題：簡介／細項名（去編號前綴）／續／簽發・提名。
 * itemNames 由呼叫方傳入（獎章名不出現在本檔，避免與 syllabus 重複）。
 */
export function awardPageSub(spec, itemNames = {}) {
  const parts = [];
  if (spec.intro) parts.push('簡介');
  for (const id of spec.items || []) {
    const raw = itemNames[id] || id;
    parts.push(String(raw).replace(/^[A-Z]+[0-9]*\s+/, ''));
  }
  for (const id of (spec.items || []).length ? [] : spec.continued || []) {
    const raw = itemNames[id] || id;
    parts.push(`${String(raw).replace(/^[A-Z]+[0-9]*\s+/, '')}（續）`);
  }
  if (spec.sign) parts.push(spec.nominate ? '提名' : '簽發');
  return parts.join('・');
}

export function awardPageSubEn(spec, itemNamesEn = {}) {
  const parts = [];
  if (spec.intro) parts.push('Introduction');
  for (const id of spec.items || []) {
    const raw = itemNamesEn[id] || id;
    parts.push(String(raw).replace(/^[A-Z]+[0-9]*\s+/, ''));
  }
  for (const id of (spec.items || []).length ? [] : spec.continued || []) {
    const raw = itemNamesEn[id] || id;
    parts.push(`${String(raw).replace(/^[A-Z]+[0-9]*\s+/, '')} (cont.)`);
  }
  if (spec.sign) parts.push(spec.nominate ? 'Nomination' : 'Issue');
  return parts.join(' · ');
}

function buildAwardPages(itemNames, itemNamesEn, awardNames, awardNamesEn) {
  return AWARD_PAGES.map(([no, award, spec]) => {
    const sub = awardPageSub(spec, itemNames);
    const subEn = awardPageSubEn(spec, itemNamesEn);
    const zh = sub ? `${awardNames[award]}・${sub}` : awardNames[award];
    const en = subEn ? `${awardNamesEn[award]} · ${subEn}` : awardNamesEn[award];
    const group = groupOf(no);
    return {
      id: id3(no), no, page: String(no), zh, en, group,
      kind: 'award', badge: GROUP_BADGE[group], award,
      intro: Boolean(spec.intro), items: [...(spec.items || [])],
      continued: [...(spec.continued || [])], sign: Boolean(spec.sign),
      nominate: Boolean(spec.nominate),
    };
  });
}

function buildFixedPages() {
  return FIXED_PAGES.map(([no, zh, en, group, kind, extra]) => ({
    id: id3(no), no, page: String(no), zh, en, group, kind,
    badge: extra.badge || GROUP_BADGE[group], ...extra,
  }));
}

/**
 * 组装 110 頁（需傳入 syllabus 名表；book.js 負責傳入，避免本檔反向依賴 syllabus）。
 * @returns {Array} 按頁碼排序的 OFFICIAL_PAGES。
 */
export function buildOfficialPages({ itemNames, itemNamesEn, awardNames, awardNamesEn }) {
  const pages = [...buildAwardPages(itemNames, itemNamesEn, awardNames, awardNamesEn), ...buildFixedPages()];
  pages.sort((a, b) => a.no - b.no);
  return pages;
}

/** 以頁碼取頁（no 為 1–110 整數）。 */
export function officialPageByNo(pages, no) {
  return (pages || []).find((p) => p.no === no) || null;
}
