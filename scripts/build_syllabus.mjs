#!/usr/bin/env node
/**
 * build_syllabus.mjs — 由童軍支部進度及行政平台（scoutbadge）`data/items.json`
 * 生成 SCOUTBOOK 的單一真相題庫 `shared/syllabus.js`，同時輸出離線對齊測試用的
 * 精簡 ID 快照 `tests/fixtures/scoutbadge-ids.json`。
 *
 * 用法（需要先 clone scoutbadge）：
 *   node scripts/build_syllabus.mjs ../scoutbadge/data/items.json
 *   node scripts/build_syllabus.mjs --source ../scoutbadge/data/items.json
 *   SCOUTBADGE_DIR=../scoutbadge node scripts/build_syllabus.mjs
 *
 * 鐵律：本檔只「映射」官方編號，不新增、不改寫、不排序、不合併任何官方項目。
 *   - `L1-M1`…`L5-*` = 會員章、探索、標準、高級、總領袖獎章進度細項
 *   - `SC-INT/PUR/SER/INS/SEA/AIR/OTH-*` = 專科徽章（143 種）
 * 童軍支部官方編號本身已是 2026 制，因此 BOOK 內部鍵＝官方編號原文，零映射。
 * 英文為工作譯本（官方中文原文為準）：進度細項來自 `items_en.json` 同 ID 覆蓋；
 * 專科徽章英文名同上，缺的 9 個由 `desc_en` 提取（見 OTHER_EN_FALLBACK）。
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * 進度組別中英名稱。
 * 中文對齊 scoutbadge 內容查核 §2.1（2026-10 全面查核）；
 * 英文為工作譯本（官方中文原文為準）。
 */
const SEGMENT_NAMES = {
  M: { zh: '會員章項目', en: 'Membership Badge Items' },
  A: { zh: '戶外挑戰', en: 'Outdoor Challenge' },
  B: { zh: '個人發展', en: 'Personal Development' },
  C: { zh: '領導才與靈性發展', en: 'Leadership and Spiritual Development' },
  D: { zh: '服務與環境', en: 'Service and Environment' },
  E: { zh: '國際視野', en: 'International Outlook' },
  F: { zh: '探索新知', en: 'Exploring New Knowledge' },
};

/** 專科徽章組別：中文對齊 scoutbadge P120A1 組別簡稱；英文對齊 items_en.json（去 emoji）。 */
const OTHER_GROUPS = {
  interest: { zh: '興趣組', en: 'Interest Group' },
  pursuit: { zh: '技能組', en: 'Pursuit Group' },
  service: { zh: '服務組', en: 'Service Group' },
  instructor: { zh: '教導組', en: 'Instructor Group' },
  sea: { zh: '海上活動', en: 'Sea Activities' },
  air: { zh: '航空活動', en: 'Air Activities' },
  other: { zh: '其他', en: 'Other' },
};

/** items_en.json 缺少的 9 個「其他」徽章英文名（2026-11-05 由各徽章 desc_en 提取）。 */
const OTHER_EN_FALLBACK = {
  'SC-OTH-010': 'Messengers of Peace',
  'SC-OTH-011': 'Plastic Tide Turners',
  'SC-OTH-012': 'Champions for Nature',
  'SC-OTH-013': 'Scouts Go Solar',
  'SC-OTH-014': 'Green Pioneer',
  'SC-OTH-015': 'Anti-Deception',
  'SC-OTH-016': 'Child Protection',
  'SC-OTH-017': 'Anti-Drug',
  'SC-OTH-018': 'Community Emergency Responder',
};

function pickSourcePath() {
  const argv = process.argv.slice(2);
  const flagIdx = argv.indexOf('--source');
  if (flagIdx >= 0 && argv[flagIdx + 1]) return path.resolve(argv[flagIdx + 1]);
  if (argv[0] && !argv[0].startsWith('-')) return path.resolve(argv[0]);
  const candidates = [];
  if (process.env.SCOUTBADGE_DIR) {
    candidates.push(path.join(path.resolve(process.env.SCOUTBADGE_DIR), 'data', 'items.json'));
  }
  // 常見的本地 clone 位置：與 SCOUTBOOK 並排、或 repo 內 vendor 目錄
  candidates.push(path.join(ROOT, '..', 'scoutbadge', 'data', 'items.json'));
  candidates.push(path.join(ROOT, 'vendor', 'scoutbadge-items.json'));
  candidates.push(path.join(ROOT, 'node_modules', '.cache', 'scoutbadge-items.json'));
  const hit = candidates.find((p) => fs.existsSync(p));
  return hit || candidates[0];
}

function loadEnOverlay(itemsPath) {
  const enPath = path.join(path.dirname(itemsPath), 'items_en.json');
  if (!fs.existsSync(enPath)) return { data: null, path: enPath };
  try {
    return { data: JSON.parse(fs.readFileSync(enPath, 'utf8')), path: enPath };
  } catch {
    return { data: null, path: enPath };
  }
}

function groupLetter(itemId) {
  const m = /^L[1-5]-([A-Z]+)/.exec(String(itemId || ''));
  return m ? m[1] : 'M';
}

function buildGroup(badge, enBadges) {
  const prefix = String(badge.id);
  const enBadge = (enBadges || {})[prefix] || {};
  const enItems = enBadge.items || {};
  const byLetter = new Map();
  for (const item of badge.items || []) {
    const letter = groupLetter(item.id);
    if (!byLetter.has(letter)) byLetter.set(letter, []);
    byLetter.get(letter).push(item);
  }
  const segments = [...byLetter.entries()].map(([letter, items]) => {
    const segName = SEGMENT_NAMES[letter] || { zh: letter, en: letter };
    return {
      code: `${prefix}-${letter}`,
      name: prefix === 'L1' ? segName.zh : `${letter} ${segName.zh}`,
      en: prefix === 'L1' ? segName.en : `${letter} ${segName.en}`,
      items: items.map((item) => {
        const en = enItems[item.id] || {};
        return {
          id: String(item.id),
          badgeId: String(item.id),
          name: String(item.name || '').trim(),
          en: String(en.name_en || '').trim(),
          detail: String(item.detail || '').trim(),
          detailEn: String(en.detail_en || '').trim(),
          assessedBy: String(item.assessedBy || ''),
          ...(item.sourceUrl ? { sourceUrl: String(item.sourceUrl) } : {}),
        };
      }),
    };
  });
  return {
    id: prefix,
    badgeKey: prefix,
    icon: badge.icon || '🏅',
    name: String(badge.name).trim(),
    en: String(badge.name_en || badge.en || '').trim(),
    color: String(badge.color || ''),
    purpose: String(badge.purpose || '').trim(),
    purposeEn: String(badge.purpose_en || enBadge.purpose_en || '').trim(),
    description: String(badge.description || '').trim(),
    descriptionEn: String(badge.description_en || enBadge.description_en || '').trim(),
    itemLabel: String(badge.itemLabel || '進度項目'),
    itemLabelEn: String(badge.itemLabel_en || enBadge.itemLabel_en || 'Progress Items'),
    segments,
  };
}

function buildOtherBadge(b, enOther) {
  const group = OTHER_GROUPS[b.group] || { zh: b.group, en: b.group };
  const en = (enOther || {})[b.id] || {};
  return {
    id: String(b.id),
    badgeId: String(b.id),
    name: String(b.name || '').trim(),
    en: String(en.name_en || OTHER_EN_FALLBACK[b.id] || '').trim(),
    group: String(b.group || ''),
    groupName: group.zh,
    groupNameEn: group.en,
    icon: b.icon || '⭐',
    desc: String(b.desc || '').trim(),
    descEn: String(b.desc_en || '').trim(),
    assessedBy: String(b.assessedBy || ''),
    ...(b.sourceUrl ? { sourceUrl: String(b.sourceUrl) } : {}),
  };
}

function main() {
  const sourcePath = pickSourcePath();
  if (!fs.existsSync(sourcePath)) {
    console.error(`找不到 scoutbadge 題庫：${sourcePath}`);
    console.error('請先 clone playerkousas-rgb/scoutbadge 至與本 repo 並排的位置，或：');
    console.error('  SCOUTBADGE_DIR=/path/to/scoutbadge npm run syllabus');
    console.error('  node scripts/build_syllabus.mjs /path/to/scoutbadge/data/items.json');
    process.exit(1);
  }

  const raw = fs.readFileSync(sourcePath);
  const sha256 = crypto.createHash('sha256').update(raw).digest('hex');
  const data = JSON.parse(raw.toString('utf8'));
  const { data: enData } = loadEnOverlay(sourcePath);
  const enBadges = enData?.badges || {};
  const enOther = enData?.otherBadges || {};

  for (const key of ['L1', 'L2', 'L3', 'L4', 'L5']) {
    if (!(data.badges || []).some((b) => b.id === key)) {
      throw new Error(`scoutbadge items.json 缺少獎章鍵 ${key}`);
    }
  }

  const groups = ['L1', 'L2', 'L3', 'L4', 'L5'].map((key) =>
    buildGroup(data.badges.find((b) => b.id === key), enBadges),
  );
  const otherBadges = (data.otherBadges || []).map((b) => buildOtherBadge(b, enOther));

  const allItems = groups.flatMap((g) => g.segments.flatMap((s) => s.items.map((i) => ({ ...i, badge: g.id }))));

  const progressEn = allItems.filter((i) => i.en).length;
  const otherEn = otherBadges.filter((b) => b.en).length;

  const payload = {
    meta: {
      version: '1.0.0',
      app: 'SCOUTBOOK',
      scheme: '童軍訓練綱要',
      schemeEdition: String(data.meta?.version || ''),
      effectiveDate: '2026-08-15',
      badgeSource: 'scoutbadge · data/items.json',
      badgeSourceSha256: sha256,
      itemCount: allItems.length,
      otherBadgeCount: otherBadges.length,
      enCoverage: { progress: `${progressEn}/${allItems.length}`, otherBadges: `${otherEn}/${otherBadges.length}` },
      note:
        'BOOK 內部鍵即 scoutbadge 官方編號原文（L1-M1…L5-*、SC-*-*），零映射、零改名。' +
        '官方中文原文為準，英文為工作譯本。',
    },
    groups,
    otherBadges,
    trainingPlan: data.trainingPlan || null,
    trainingPlanEn: enData?.trainingPlan || null,
    safeFromHarm: data.safeFromHarm || null,
    safeFromHarmEn: enData?.safeFromHarm || null,
  };

  const body = `// ==========================================================================
// SCOUTBOOK — shared/syllabus.js（自動生成，請勿手改）
// 生成指令：node scripts/build_syllabus.mjs <scoutbadge>/data/items.json
// 單一真相：scoutbadge · data/items.json（sha256 ${sha256.slice(0, 16)}…）
// BOOK 內部鍵即官方編號原文（L1-M1…L5-*、SC-*-*），零映射。
// 官方中文原文為準；英文為工作譯本。
// ==========================================================================

export const SYLLABUS_META = ${JSON.stringify(payload.meta, null, 2)};

/** 進度性獎章：會員章 → 探索 → 標準 → 高級 → 總領袖獎章 */
export const BADGE_SYLLABUS = ${JSON.stringify(payload.groups, null, 2)};

/** 專科徽章：SC-INT/PUR/SER/INS/SEA/AIR/OTH-*（單一完成紀錄：日期＋證書編號） */
export const OTHER_BADGES = ${JSON.stringify(payload.otherBadges, null, 2)};

/** 訓練計劃（上游原文，用於訓練計劃頁） */
export const TRAINING_PLAN = ${JSON.stringify(payload.trainingPlan, null, 2)};
export const TRAINING_PLAN_EN = ${JSON.stringify(payload.trainingPlanEn, null, 2)};

/** 保護童軍成員免受傷害（上游原文，用於安全頁） */
export const SAFE_FROM_HARM = ${JSON.stringify(payload.safeFromHarm, null, 2)};
export const SAFE_FROM_HARM_EN = ${JSON.stringify(payload.safeFromHarmEn, null, 2)};

export const ALL_AWARDS = [...BADGE_SYLLABUS];

/** 所有細項（L1–L5） */
export const SYLLABUS_ITEMS = ALL_AWARDS.flatMap((badge) =>
  badge.segments.flatMap((segment) =>
    segment.items.map((item) => ({ ...item, badgeIdGroup: badge.id, segmentCode: segment.code })),
  ),
);

export const ITEM_INDEX = Object.fromEntries(SYLLABUS_ITEMS.map((item) => [item.id, item]));

/** BOOK 鍵 → scoutbadge 官方編號（兩者相同，保留映射以兼容同步契約） */
export const BOOK_TO_BADGE_ID = Object.fromEntries([
  ...SYLLABUS_ITEMS.map((item) => [item.id, item.badgeId]),
  ...OTHER_BADGES.map((badge) => [badge.id, badge.badgeId]),
]);

/** scoutbadge 官方編號 → BOOK 鍵 */
export const BADGE_ID_TO_BOOK = (() => {
  const out = {};
  for (const [bookId, badgeId] of Object.entries(BOOK_TO_BADGE_ID)) {
    out[badgeId] = bookId;
    out[bookId] = bookId;
  }
  return out;
})();

const norm = (value) => String(value ?? '').trim();

/** 任何來源的項目編號 → BOOK 內部鍵（未知編號原樣回傳，不靜默改寫）。 */
export function toBookId(id) {
  const key = norm(id);
  if (!key) return '';
  return BADGE_ID_TO_BOOK[key] || key;
}

/** BOOK 內部鍵 → scoutbadge 官方編號。 */
export function toBadgeId(id) {
  const key = norm(id);
  if (!key) return '';
  return BOOK_TO_BADGE_ID[key] || key;
}

/** 該項目是否屬於本紀錄冊的現行綱要（用於同步時丟棄未知／他人資料）。 */
export function isKnownItem(id) {
  const key = norm(id);
  return Boolean(key) && (Boolean(ITEM_INDEX[key]) || OTHER_BADGES.some((b) => b.id === key));
}

/** 給定 BOOK 鍵，找回獎章群組（L1–L5 / 專科徽章）。 */
export function awardOfItem(id) {
  const key = norm(id);
  const badge = ALL_AWARDS.find((b) => b.segments.some((s) => s.items.some((i) => i.id === key)));
  if (badge) return badge;
  return OTHER_BADGES.find((b) => b.id === key) || null;
}
`;

  const outPath = path.join(ROOT, 'shared', 'syllabus.js');
  fs.writeFileSync(outPath, body, 'utf8');

  const fixture = {
    meta: {
      source: 'scoutbadge · data/items.json',
      sha256,
      scheme: payload.meta.scheme,
      generatedBy: 'scripts/build_syllabus.mjs',
    },
    progressIds: allItems.map((i) => i.badgeId),
    otherBadgeIds: otherBadges.map((b) => b.badgeId),
    badgeKeys: ['L1', 'L2', 'L3', 'L4', 'L5'],
    enCoverage: payload.meta.enCoverage,
  };
  const fixturePath = path.join(ROOT, 'tests', 'fixtures', 'scoutbadge-ids.json');
  fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
  fs.writeFileSync(fixturePath, `${JSON.stringify(fixture, null, 2)}\n`, 'utf8');

  console.log(`✓ shared/syllabus.js — ${allItems.length} 項細項、${otherBadges.length} 個專科徽章`);
  console.log(`✓ tests/fixtures/scoutbadge-ids.json — 對齊快照（sha256 ${sha256.slice(0, 16)}…）`);
  console.log(`  英文覆蓋：進度 ${progressEn}/${allItems.length}、專科徽章 ${otherEn}/${otherBadges.length}`);
}

main();
