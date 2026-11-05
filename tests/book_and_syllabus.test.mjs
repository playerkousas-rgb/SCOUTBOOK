import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  APP_VERSION,
  PAGE_TOTAL,
  PRINT_PAGES,
  SECTIONS,
  ALL_AWARDS,
  BADGE_SYLLABUS,
  ITEM_INDEX,
  OTHER_BADGES,
  SYLLABUS_ITEMS,
  SYLLABUS_META,
  PAGE_SLICES,
  OTHER_PAGE_SLICES,
  ELECTIVE_OPTIONS,
  electiveChoice,
  sliceAward,
  sliceOtherBadges,
  toBookId,
  toBadgeId,
  newBook,
  demoBook,
  scoutId,
  normalizeScoutId,
  sameScoutId,
  syncIdentity,
  sanitizeHkidPrefix,
  ageFromDob,
  ageInMonths,
  badgeStats,
  allStats,
  membershipStatus,
  chiefScoutReadiness,
  exportForBadge,
  collectPendingForBadge,
  importFromBadge,
  SYNC_SCHEMA,
  STORE_KEY,
} from '../shared/book.js';
import { BOOK_TO_BADGE_ID, BADGE_ID_TO_BOOK, isKnownItem, awardOfItem } from '../shared/syllabus.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/scoutbadge-ids.json', import.meta.url), 'utf8'));
const pkgVersion = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;

test('《童軍紀錄冊》66 頁逐頁映射完整、無缺漏與重覆，數位附錄不列印', () => {
  // 版本單一真相：APP_VERSION 必須等於 package.json 版號（`v` + semver）
  assert.match(APP_VERSION, /^v\d+\.\d+\.\d+$/);
  assert.equal(APP_VERSION, `v${pkgVersion}`);
  assert.equal(PAGE_TOTAL, 66);
  assert.equal(PRINT_PAGES.length, 66);
  assert.deepEqual(
    PRINT_PAGES.map((s) => Number(s.page)),
    Array.from({ length: 66 }, (_, i) => i + 1),
  );
  assert.equal(SECTIONS.length, 67);
  const appendix = SECTIONS.find((s) => s.id === 'appendix');
  assert.ok(appendix);
  assert.equal(PRINT_PAGES.some((s) => s.id === 'appendix'), false);
  assert.equal(new Set(SECTIONS.map((s) => s.id)).size, SECTIONS.length);
  assert.equal(STORE_KEY, 'scoutbook.book.v1');
});

test('項目 ID 單一真相：shared/syllabus.js 與 scoutbadge data/items.json 逐個相同', () => {
  assert.equal(SYLLABUS_META.itemCount, 75);
  assert.equal(SYLLABUS_META.otherBadgeCount, 143);
  assert.equal(SYLLABUS_META.badgeSourceSha256, fixture.meta.sha256);

  // 75 個進度細項：BOOK 鍵與 scoutbadge 官方編號一對一，次序不可錯位
  const officialProgress = SYLLABUS_ITEMS.map((i) => i.badgeId);
  assert.equal(officialProgress.length, fixture.progressIds.length);
  assert.deepEqual([...officialProgress].sort(), [...fixture.progressIds].sort());

  // 143 個專科徽章
  const officialOther = OTHER_BADGES.map((b) => b.badgeId);
  assert.equal(officialOther.length, fixture.otherBadgeIds.length);
  assert.deepEqual([...officialOther].sort(), [...fixture.otherBadgeIds].sort());

  // 雙向對照表必須完全可逆，且 BOOK 內部鍵不得重覆
  assert.equal(new Set(SYLLABUS_ITEMS.map((i) => i.id)).size, 75);
  for (const item of SYLLABUS_ITEMS) {
    assert.equal(BOOK_TO_BADGE_ID[item.id], item.badgeId);
    assert.equal(BADGE_ID_TO_BOOK[item.badgeId], item.id);
    assert.equal(toBookId(item.badgeId), item.id);
    assert.equal(toBadgeId(item.id), item.badgeId);
    assert.equal(isKnownItem(item.id), true);
    assert.equal(item.en.length > 0, true);
    assert.equal(item.name.length > 0, true);
  }
  for (const badge of OTHER_BADGES) {
    assert.equal(toBadgeId(badge.id), badge.badgeId);
    assert.equal(isKnownItem(badge.id), true);
  }
});

test('五個獎章階級齊備：會員章 → 探索 → 標準 → 高級 → 總領袖獎章', () => {
  assert.deepEqual(
    ALL_AWARDS.map((a) => a.id),
    ['L1', 'L2', 'L3', 'L4', 'L5'],
  );
  assert.deepEqual(
    BADGE_SYLLABUS.map((b) => b.name),
    ['會員章', '童軍探索獎章', '童軍標準獎章', '童軍高級獎章', '總領袖獎章'],
  );
  assert.deepEqual(
    ALL_AWARDS.map((a) => a.segments.reduce((n, s) => n + s.items.length, 0)),
    [11, 14, 16, 17, 17],
  );
  assert.equal(
    ALL_AWARDS.reduce((n, a) => n + a.segments.reduce((m, s) => m + s.items.length, 0), 0),
    75,
  );

  // 分段結構：L1 單組 M；L2 A–D；L3／L4／L5 A–F
  assert.deepEqual(ALL_AWARDS[0].segments.map((s) => s.code), ['L1-M']);
  assert.deepEqual(ALL_AWARDS[1].segments.map((s) => s.code), ['L2-A', 'L2-B', 'L2-C', 'L2-D']);
  for (const award of ALL_AWARDS.slice(2)) {
    assert.deepEqual(
      award.segments.map((s) => s.code),
      [`${award.id}-A`, `${award.id}-B`, `${award.id}-C`, `${award.id}-D`, `${award.id}-E`, `${award.id}-F`],
    );
  }

  // 每個細項都能追溯所屬獎章，供紀錄冊頁面與 PT/18・P120A1 自動填表使用
  assert.equal(awardOfItem('L1-M1')?.id, 'L1');
  assert.equal(awardOfItem('L4-D5')?.id, 'L4');
  assert.equal(awardOfItem('L5-F1')?.id, 'L5');
  assert.equal(awardOfItem('SC-INT-001')?.id, 'SC-INT-001');
  assert.equal(awardOfItem('NOT-A-REAL-ID'), null);
});

test('獎章頁切片覆蓋全部細項、不重不漏；專科徽章頁切片覆蓋全部 143 個', () => {
  const seen = new Set();
  for (const [pageId, spec] of Object.entries(PAGE_SLICES)) {
    const award = ALL_AWARDS.find((a) => a.id === spec.award);
    assert.ok(award, `${pageId} 指向不存在的獎章`);
    const sliced = sliceAward(award, pageId);
    assert.ok(sliced.segments.length > 0, `${pageId} 切片為空`);
    for (const item of sliced.segments.flatMap((s) => s.items)) {
      assert.equal(seen.has(item.id), false, `${item.id} 在多頁重覆出現`);
      seen.add(item.id);
    }
  }
  assert.equal(seen.size, 75);

  const seenOther = new Set();
  for (const pageId of Object.keys(OTHER_PAGE_SLICES)) {
    const badges = sliceOtherBadges(pageId);
    assert.ok(badges.length > 0, `${pageId} 切片為空`);
    for (const b of badges) {
      assert.equal(seenOther.has(b.id), false, `${b.id} 在多頁重覆出現`);
      seenOther.add(b.id);
    }
  }
  assert.equal(seenOther.size, 143);
});

test('自選項目：戶外／海上／航空三選一，社區／生態／氣象三選一', () => {
  assert.deepEqual(ELECTIVE_OPTIONS.outdoor.map((o) => o.value), ['outdoor', 'sea', 'air']);
  assert.deepEqual(ELECTIVE_OPTIONS.community.map((o) => o.value), ['community', 'ecology', 'meteorology']);
  for (const opt of [...ELECTIVE_OPTIONS.outdoor, ...ELECTIVE_OPTIONS.community]) {
    assert.ok(opt.zh.length > 0 && opt.en.length > 0);
  }
  assert.deepEqual(electiveChoice(newBook(), 'L2'), {});
});

test('SCOUT ID 單一識別碼：容忍前導零，且同步後不保留任何其他身分欄位', () => {
  assert.equal(normalizeScoutId(' 0012345678 '), '0012345678');
  assert.equal(normalizeScoutId('12345678'), '12345678');
  assert.equal(sameScoutId('12345678', '0012345678'), true);
  assert.equal(sameScoutId('12345678', '0012345679'), false);
  assert.equal(sameScoutId('', ''), false);

  const m = syncIdentity({ ymis: '0012345678', nameZh: '陳小鷹', phone: '91234567' });
  assert.equal(m.scoutId, '0012345678');
  assert.equal(m.memberNo, '0012345678');
  assert.equal('ymis' in m, false);
  assert.equal(scoutId({ member: m }), '0012345678');

  // 身份證只保留首四位（字母 + 三個數字），杜絕完整號碼外洩
  assert.equal(sanitizeHkidPrefix('y418923(7)'), 'Y418');
  assert.equal(newBook({ member: { hkidPrefix: 'a1234567' } }).member.hkidPrefix, 'A123');
});

test('年齡計算與總領袖獎章進度事實（高級獎章＋領導才訓練班）', () => {
  const ref = new Date('2026-11-05');
  assert.equal(ageFromDob('2013-04-12', ref), 13);
  assert.equal(ageInMonths('2013-04-12', ref), 163);

  const demo = demoBook();
  const cs = chiefScoutReadiness(demo);
  assert.equal(cs.advancedComplete, false);
  assert.equal(cs.advancedDone, 0);
  assert.equal(cs.advancedTotal, 17);
  assert.equal(cs.leadershipCourse, '');
  assert.equal(cs.leadershipDate, '');
  assert.equal(cs.leadershipCert, '');
});

test('示範紀錄冊只示範版面：統計與會員續期狀態準確', () => {
  const demo = demoBook();
  const stats = allStats(demo);
  assert.deepEqual(
    stats.awards.map((a) => ({ id: a.award.id, done: a.done, total: a.total, percent: a.percent })),
    [
      { id: 'L1', done: 5, total: 11, percent: 45 },
      { id: 'L2', done: 3, total: 14, percent: 21 },
      { id: 'L3', done: 0, total: 16, percent: 0 },
      { id: 'L4', done: 0, total: 17, percent: 0 },
      { id: 'L5', done: 0, total: 17, percent: 0 },
    ],
  );
  assert.equal(stats.total, 75);
  assert.equal(stats.done, 8);
  assert.equal(stats.percent, 11);
  assert.equal(stats.earned, 1);
  assert.equal(stats.nextAward.award.id, 'L1');
  assert.equal(stats.activityBadges, 2);
  assert.equal(badgeStats(demo, 'L1').complete, false);
  assert.equal(badgeStats(demo, 'L1').awardedDate, '2024-11-25');

  const ms = membershipStatus(demo);
  assert.equal(ms.active, true);
  assert.equal(ms.validUntil, '2027-08-31');
  assert.equal(membershipStatus(newBook()).active, false);
  assert.equal(Object.keys(demo.pages).some((k) => k === 'award_L5'), false);
});

test('BOOK → BADGE：匯出一律 pending、零個人資料，只保留 SCOUT ID 及項目／日期', () => {
  const demo = demoBook();
  const out = exportForBadge(demo, 'T12');

  assert.equal(out.schema, SYNC_SCHEMA);
  assert.equal(out.schema, 'scoutbadge.pending.v1');
  assert.equal(out.status, 'pending');
  assert.equal(out.confirmed, false);
  assert.equal(out.privacy, 'progress-only');
  assert.equal(out.scoutId, '0012345678');
  assert.equal(out.ymis, '0012345678');
  assert.equal(out.troopId, 'T12');
  assert.equal('progress' in out, false);
  assert.equal('members' in out, false);
  assert.equal('member' in out, false);

  const json = JSON.stringify(out);
  for (const pii of ['陳小鷹', 'CHAN SIU-YING', 'Siu-ying', '沙田第一中學', '鷹小隊', 'address', 'parentName', 'photo']) {
    assert.equal(json.includes(pii), false, `匯出檔洩露個人資料：${pii}`);
  }

  // 已在 scoutbadge 核實的項目不重複送交；自填而未有領袖核實的項目才需送交
  assert.equal(out.pendingRequests.length, 1);
  const req = out.pendingRequests[0];
  assert.equal(req.ymis, '0012345678');
  assert.equal(req.item_id, 'SC-PUR-001');
  assert.equal(req.status, 'pending');
  assert.equal(req.confirmed, false);
  assert.equal(req.requested_date, '2025-05-10');
  assert.equal('name' in req, false);

  // BOOK 內部鍵即 scoutbadge 官方編號，BADGE 毋須認識另一套命名
  const blank = newBook({ member: { scoutId: '9012345678' }, progress: { 'L2-A1': { date: '2026-09-01' } } });
  const out2 = exportForBadge(blank, 'T12');
  assert.equal(out2.pendingRequests[0].item_id, 'L2-A1');
  assert.equal(out2.pendingProgress['9012345678']['L2-A1'].status, 'pending');

  // 已在雲端 pending 的同一 (ymis, itemId) 不再重複申報
  const repeat = collectPendingForBadge(blank, {}, ['L2-A1']);
  assert.equal(repeat.length, 0);
});

test('BADGE → BOOK：只錄入領袖已核實進度，pendingRequests 永不倒灌', () => {
  const blank = newBook({ member: { scoutId: '0012345678' } });

  const payload = {
    success: true,
    progress: {
      '0012345678': {
        'L1-M1': { date: '2024-09-07', confirmer: '李團長' },
        'L1-M2': { date: '2024-09-14', confirmer: '李團長' },
        'L2-A1': { date: '2025-02-01', confirmer: '李團長' },
      },
      // 另一位成員的紀錄：必須完全忽略
      '0099999999': { 'L1-M3': { date: '2025-01-01', confirmer: '別人' } },
    },
    otherBadges: {
      '0012345678': { 'SC-INT-001': { date: '2025-03-15', cert: 'INT/2025/0181' } },
    },
    pendingRequests: [
      { ymis: '0012345678', item_id: 'L2-A2', requested_date: '2026-10-01', status: 'pending' },
    ],
  };

  const res = importFromBadge(payload, blank);
  assert.equal(res.imported, 4);
  assert.equal(res.skippedPending, 1);
  assert.equal(res.matchedBy, 'SCOUT ID 0012345678');
  assert.equal(res.book.progress['L1-M1'].date, '2024-09-07');
  assert.equal(res.book.progress['L1-M1'].badgeConfirmer, '李團長');
  assert.equal(res.book.progress['L1-M1'].confirmedByBadge, true);
  assert.equal(res.book.progress['L1-M3'], undefined);
  assert.equal(res.book.otherBadges['SC-INT-001'].date, '2025-03-15');
  assert.equal(res.book.otherBadges['SC-INT-001'].cert, 'INT/2025/0181');
  // 未核實（pending）項目絕不錄入
  assert.equal(res.book.progress['L2-A2'], undefined);

  // 空白紀錄冊（第 1 頁完全空白）亦可同步：只綁定 SCOUT ID
  const trulyBlank = newBook();
  const bound = importFromBadge(payload, trulyBlank, { expectedScoutId: '0012345678' });
  assert.equal(bound.book.member.scoutId, '0012345678');
  assert.equal(bound.book.member.nameZh, '');
  assert.equal(bound.book.member.phone, '');
  assert.equal(bound.imported, 4);

  // 他人 QR／他人編號不可寫入本冊：只有另一位成員的已核實進度時必須拒絕
  const otherOnly = {
    success: true,
    progress: { '0099999999': { 'L1-M1': { date: '2025-01-01', confirmer: '別人' } } },
  };
  assert.throws(
    () => importFromBadge(otherOnly, newBook(), { expectedScoutId: '0012345678' }),
    /SCOUT ID 不同/,
  );

  // 完全沒有核實日期的 pending 申報檔必須整份拒絕
  const pendingOnly = {
    schema: SYNC_SCHEMA,
    status: 'pending',
    confirmed: false,
    pendingProgress: { '0012345678': { 'L2-A1': { date: '2026-10-01' } } },
  };
  assert.throws(() => importFromBadge(pendingOnly, blank), /待領袖核實/);

  // 匯出後再倒灌自身的 pending 檔，同樣必須被拒
  const demo = demoBook();
  assert.throws(() => importFromBadge(exportForBadge(demo, 'T12'), demo), /待領袖核實/);
});

test('空白紀錄冊建立後即為完整可用結構，示範資料不會留下任何評估者簽名', () => {
  const book = newBook();
  assert.deepEqual(book.progress, {});
  assert.deepEqual(book.otherBadges, {});
  assert.deepEqual(book.forms, {});
  assert.equal(book.appVersion, APP_VERSION);
  assert.ok(ITEM_INDEX['L1-M1']);

  const demo = demoBook();
  for (const [id, entry] of Object.entries(demo.progress)) {
    assert.ok(ITEM_INDEX[id], `${id} 不在綱要內`);
    assert.match(entry.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(entry.signature ?? null, null, '示範資料不可偽造簽名墨跡');
  }
  assert.equal(demo.otherBadges['SC-PUR-001'].confirmedByBadge ?? false, false);
});
