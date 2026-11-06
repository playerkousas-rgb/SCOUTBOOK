import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  APP_VERSION,
  PAGE_TOTAL,
  PRINT_PAGES,
  SECTIONS,
  OFFICIAL_PAGES,
  OFFICIAL_GROUPS,
  ALL_AWARDS,
  ALL_TRACKED_AWARDS,
  SPOTLIGHT_AWARDS,
  BADGE_SYLLABUS,
  ITEM_INDEX,
  OTHER_BADGES,
  SYLLABUS_ITEMS,
  SYLLABUS_META,
  PAGE_SLICES,
  PAGE_CONTINUED,
  OTHER_PAGE_SLICES,
  MIGRATED_OTHER_IDS,
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
  V1_PAGE_MAP,
  PAGE_ID_MIGRATION,
  migratePageId,
  migrateStoredPages,
  migrateV2toV3,
} from '../shared/book.js';
import { BOOK_TO_BADGE_ID, BADGE_ID_TO_BOOK, isKnownItem, awardOfItem } from '../shared/syllabus.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/scoutbadge-ids.json', import.meta.url), 'utf8'));
const pkgVersion = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;

test('《童軍紀錄冊》110 頁逐頁映射完整、無缺漏與重覆，數位附錄不列印', () => {
  // 版本單一真相：APP_VERSION 必須等於 package.json 版號（`v` + semver）
  assert.match(APP_VERSION, /^v\d+\.\d+\.\d+$/);
  assert.equal(APP_VERSION, `v${pkgVersion}`);
  assert.equal(PAGE_TOTAL, 110);
  assert.equal(PRINT_PAGES.length, 110);
  assert.deepEqual(
    PRINT_PAGES.map((s) => Number(s.page)),
    Array.from({ length: 110 }, (_, i) => i + 1),
  );
  assert.equal(SECTIONS.length, 111);
  const appendix = SECTIONS.find((s) => s.id === 'appendix');
  assert.ok(appendix);
  assert.equal(PRINT_PAGES.some((s) => s.id === 'appendix'), false);
  assert.equal(new Set(SECTIONS.map((s) => s.id)).size, SECTIONS.length);
  assert.equal(STORE_KEY, 'scoutbook.book.v1');
  // 官方頁 id 三位數，與舊制永不碰撞
  assert.deepEqual(OFFICIAL_PAGES.map((p) => p.id).slice(0, 3), ['p001', 'p002', 'p003']);
  assert.equal(OFFICIAL_PAGES.length, 110);
  assert.equal(new Set(OFFICIAL_PAGES.map((p) => p.no)).size, 110);
  // 群組覆蓋 1–110 無縫
  const covered = OFFICIAL_GROUPS.flatMap((g) =>
    Array.from({ length: g.to - g.from + 1 }, (_, i) => g.from + i),
  );
  assert.deepEqual([...covered].sort((a, b) => a - b), Array.from({ length: 110 }, (_, i) => i + 1));
});

test('頁序：110 頁色帶家族正確；舊制頁碼兩跳遷移（v1.0→v1.1→v2）', () => {
  const badges = PRINT_PAGES.map((s) => s.badge).join(',');
  const expect = [
    ...Array(11).fill('front'),
    ...Array(3).fill('L1'),
    ...Array(1).fill('front'),
    ...Array(9).fill('L2'),
    ...Array(15).fill('L3'),
    ...Array(20).fill('L4'),
    ...Array(16).fill('L5'),
    ...Array(15).fill('OT'),
    ...Array(20).fill('front'),
  ].join(',');
  assert.equal(badges, expect);
  assert.equal(SECTIONS.find((s) => s.id === 'p001').label, '童軍成員資料');
  assert.equal(SECTIONS.find((s) => s.id === 'p009').label, '童軍誓詞');
  assert.equal(SECTIONS.find((s) => s.id === 'p060').label, '總領袖獎章・簡介');
  assert.equal(SECTIONS.find((s) => s.id === 'p075').label, '總領袖獎章・提名');
  assert.equal(SECTIONS.find((s) => s.id === 'p078').label, '興趣組');
  assert.ok(SECTIONS.find((s) => s.id === 'p085').label.startsWith('領導才獎章'));
  assert.equal(SECTIONS.find((s) => s.id === 'p104').label, '其他獎章及徽章（一）');
  assert.equal(SECTIONS.find((s) => s.id === 'p110').label, '服務紀錄（二）');

  // 第一代→1.1 代舊表保留 39 條；預設（未知 pagev）走兩跳
  assert.equal(Object.keys(V1_PAGE_MAP).length, 39);
  assert.equal(migratePageId('p50', 1), 'p060');
  assert.equal(migratePageId('p50'), 'p060');
  assert.equal(migratePageId('p24', 1), 'p078');
  // 1.1／1.2 代（pagev 2）只走第二跳
  assert.equal(migratePageId('p50', 2), 'p078');
  assert.equal(migratePageId('p24', 2), 'p008');
  assert.equal(migratePageId('p64', 2), 'p009');
  assert.equal(migratePageId('p63', 2), 'appendix');
  assert.equal(migratePageId('p01', 2), 'p001');
  assert.equal(migratePageId('not-a-page', 2), 'not-a-page');

  // v1 跳：只對 pagev < 2 跑；來源與目標重疊一次搬對
  const moved = migrateStoredPages(
    { p42: { investitureDate: '2024-01-01' }, p58: { leadership: { courseName: 'X' } } },
    {},
  );
  assert.deepEqual(moved.p26, { investitureDate: '2024-01-01' });
  assert.deepEqual(moved.p42, { leadership: { courseName: 'X' } });
  assert.equal(moved.p58, undefined);
  assert.deepEqual(migrateStoredPages({ p26: { a: 1 } }, { pagev: 2 }), { p26: { a: 1 } });
  assert.deepEqual(migrateStoredPages({ p26: { a: 1 } }, { pagev: 3 }), { p26: { a: 1 } });

  // v2 跳：舊鍵原位保留，只複製到新鍵
  const legacy = {
    meta: { pagev: 2 },
    pages: {
      p26: { investitureDate: '2024-01-01', investingLeader: '李團長', membershipDate: '2024-02-01' },
      p27: { awards: [{ date: '2025-01-01', award: '區總監嘉許', presentedBy: '區總監' }] },
      p29: { trips: [{ date: '2025-02-01', route: '麥理浩徑', distance: '10km' }] },
      p30: { log: [{ date: '2025-03-01', activity: '露營', venue: '大尾篤' }] },
    },
    renewals: [{ date: '2026-09-01', validUntil: '2027-08-31' }],
    service: [{ date: '2025-04-01', activity: '賣旗', hours: '4' }],
    awardsLog: [{ date: '2025-05-01', award: '最佳小隊', presentedBy: '旅長' }],
    otherBadges: { 'SC-OTH-002': { date: '2025-01-15' } },
    progress: { 'OT-LD-A1': { date: '2025-02-01' } },
  };
  migrateV2toV3(legacy);
  assert.equal(legacy.meta.pagev, 3);
  assert.deepEqual(legacy.pages.p014, { investitureDate: '2024-01-01', investingLeader: '李團長' });
  assert.equal(legacy.pages.award_L1.date, '2024-02-01');
  assert.ok(legacy.pages.p26, '舊鍵必須保留');
  assert.equal(legacy.pages.p006.rows.length, 1);
  assert.deepEqual(legacy.pages.p106.rows[0], { date: '2025-03-01', place: '大尾篤', brief: '露營', nights: '' });
  assert.deepEqual(legacy.pages.p107.rows[0], { date: '2025-02-01', place: '', brief: '麥理浩徑', km: '10km' });
  assert.deepEqual(legacy.pages.p109.rows[0], { date: '2025-04-01', org: '', brief: '賣旗', hours: '4' });
  assert.equal(legacy.pages.p104.rows.length, 2);
  // 全文獎章回填：已有日期的不覆寫，其餘同日期帶入
  assert.equal(legacy.progress['OT-LD-A1'].date, '2025-02-01');
  assert.equal(legacy.progress['OT-LD-A1'].carriedFromBadge, undefined);
  assert.deepEqual(legacy.progress['OT-LD-A2'], { date: '2025-01-15', carriedFromBadge: 'SC-OTH-002' });
  assert.equal(legacy.progress['OT-LD-A7'].date, '2025-01-15');
  // 冪等：再跑一次不重複加行
  migrateV2toV3(legacy);
  assert.equal(legacy.pages.p104.rows.length, 2);

  // 轉旅紙本化：新鍵補上，舊鍵保留在物件內
  const troop = { meta: { pagev: 2 }, transfers: [{ date: '2025-01-01', fromGroup: 'A旅', toGroup: 'B旅', note: 'n' }] };
  migrateV2toV3(troop);
  assert.equal(troop.transfers[0].group, 'B旅');
  assert.equal(troop.transfers[0].note, 'n');
  assert.equal(troop.transfers[0].fromGroup, 'A旅');
  // member 宣誓日期作 p014 後備
  const invest = { meta: { pagev: 2 }, member: { dateInvestiture: '2023-03-03' }, pages: {} };
  migrateV2toV3(invest);
  assert.equal(invest.pages.p014.investitureDate, '2023-03-03');

  // newBook 自動走完全鏈並打標記
  const book = newBook({ member: {}, meta: { pagev: 2 }, pages: { p26: { investitureDate: '2024-01-01' } } });
  assert.equal(book.pages.p014.investitureDate, '2024-01-01');
  assert.equal(book.meta.pagev, 3);
  const fresh = newBook();
  assert.equal(fresh.meta.pagev, 3);
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

test('五個進度性獎章＋五個全文獎章：L1–L5 維持 75 項，OT-* 另計 25 項', () => {
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

  // 全文獎章（紙本專有，不入 scoutbadge 同步）：領導才 7、服務 4、先修 10、宗教 1、社區 3
  assert.deepEqual(
    SPOTLIGHT_AWARDS.map((a) => a.id),
    ['OT-LD', 'OT-SF', 'OT-VS', 'OT-RG', 'OT-CM'],
  );
  assert.deepEqual(
    SPOTLIGHT_AWARDS.map((a) => a.segments.reduce((n, s) => n + s.items.length, 0)),
    [7, 4, 10, 1, 3],
  );
  assert.equal(ALL_TRACKED_AWARDS.length, 10);
  for (const award of SPOTLIGHT_AWARDS) {
    for (const item of award.segments.flatMap((s) => s.items)) {
      assert.ok(item.name.length > 0 && item.en.length > 0 && item.detail.length > 0, `${item.id} 缺名／文`);
      assert.equal(isKnownItem(item.id), false, `${item.id} 不得進入 scoutbadge 同步白名單`);
    }
  }
  assert.deepEqual(
    SPOTLIGHT_AWARDS.find((a) => a.id === 'OT-RG').segments[0].items[0].options.length,
    6,
  );

  // 每個細項都能追溯所屬獎章，供紀錄冊頁面與 PT/18・P120A1 自動填表使用
  assert.equal(awardOfItem('L1-M1')?.id, 'L1');
  assert.equal(awardOfItem('L4-D5')?.id, 'L4');
  assert.equal(awardOfItem('L5-F1')?.id, 'L5');
  assert.equal(awardOfItem('OT-LD-A1')?.id, 'OT-LD');
  assert.equal(awardOfItem('OT-VS-A10')?.id, 'OT-VS');
  assert.equal(awardOfItem('SC-INT-001')?.id, 'SC-INT-001');
  assert.equal(awardOfItem('NOT-A-REAL-ID'), null);
});

test('獎章頁主切片覆蓋全部 100 細項、不重不漏；複示只屬同獎章；專科整組覆蓋 138 行', () => {
  const seen = new Set();
  for (const [pageId, spec] of Object.entries(PAGE_SLICES)) {
    const award = ALL_TRACKED_AWARDS.find((a) => a.id === spec.award);
    assert.ok(award, `${pageId} 指向不存在的獎章`);
    const sliced = sliceAward(award, pageId);
    assert.ok(sliced.segments.length > 0, `${pageId} 切片為空`);
    for (const item of sliced.segments.flatMap((s) => s.items)) {
      assert.equal(seen.has(item.id), false, `${item.id} 在多頁重覆出現`);
      seen.add(item.id);
    }
  }
  assert.equal(seen.size, 100);

  // 複示（continued）：必有主頁、同獎章、同頁不與主切片重疊
  const continuedSeen = new Set();
  for (const [pageId, spec] of Object.entries(PAGE_CONTINUED)) {
    const primary = new Set(PAGE_SLICES[pageId]?.items || []);
    for (const id of spec.items) {
      assert.ok(seen.has(id), `${id} 複示但無主頁`);
      assert.equal(primary.has(id), false, `${pageId} 主從重疊 ${id}`);
      continuedSeen.add(id);
    }
    assert.ok(spec.items.length > 0);
  }
  assert.ok(continuedSeen.size > 0, '應有橫跨頁複示');

  // 獎章頁必有簡介／細項／複示／簽發其一，不出空白官方頁
  for (const pg of OFFICIAL_PAGES.filter((p) => p.kind === 'award')) {
    assert.ok(pg.intro || pg.items.length || pg.continued.length || pg.sign, `${pg.id} 空獎章頁`);
  }

  // 專科徽章：整組切片；升格 5 行不列示
  const expected = { p078: 34, p079: 38, p080: 20, p081: 27, p082: 6, p104: 13 };
  assert.deepEqual(Object.keys(OTHER_PAGE_SLICES).sort(), Object.keys(expected).sort());
  const seenOther = new Set();
  for (const [pageId, count] of Object.entries(expected)) {
    const badges = sliceOtherBadges(pageId);
    assert.equal(badges.length, count, `${pageId} 行數不符`);
    for (const b of badges) {
      assert.equal(seenOther.has(b.id), false, `${b.id} 在多頁重覆出現`);
      assert.equal(MIGRATED_OTHER_IDS.includes(b.id), false, `${b.id} 已升格，不應列示`);
      seenOther.add(b.id);
    }
  }
  assert.equal(seenOther.size, 138);
  assert.deepEqual([...MIGRATED_OTHER_IDS].sort(), ['SC-OTH-001', 'SC-OTH-002', 'SC-OTH-004', 'SC-OTH-005', 'SC-OTH-008']);
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

  // 新分項 OT-LD-A6 可供給領導才訓練班日期；舊 p42 優先
  const withCourse = newBook({ member: {}, progress: { 'OT-LD-A6': { date: '2025-06-01' } } });
  assert.equal(chiefScoutReadiness(withCourse).leadershipDate, '2025-06-01');
  const withLegacy = newBook({
    member: {},
    meta: { pagev: 2 },
    pages: { p42: { leadership: { date: '2024-05-01', courseCode: 'LTC1', certNo: 'C1' } } },
    progress: { 'OT-LD-A6': { date: '2025-06-01' } },
  });
  assert.equal(chiefScoutReadiness(withLegacy).leadershipDate, '2024-05-01');
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
  // 全文獎章走同一 badgeStats，示範冊全空白
  assert.deepEqual(
    [badgeStats(demo, 'OT-LD'), badgeStats(demo, 'OT-VS')].map((s) => ({ total: s.total, done: s.done })),
    [{ total: 7, done: 0 }, { total: 10, done: 0 }],
  );

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

  // 全文獎章（紙本專有）不送 scoutbadge，只留本機
  const spot = newBook({
    member: { scoutId: '9012345678' },
    progress: { 'OT-LD-A1': { date: '2026-09-01' }, 'OT-VS-A1': { date: '2026-09-02' } },
  });
  assert.equal(exportForBadge(spot, 'T12').pendingRequests.length, 0);

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
  assert.equal(book.meta.pagev, 3);
  assert.ok(ITEM_INDEX['L1-M1']);
  for (const k of ['emergencyAddr', 'birthPlace', 'passportNo', 'bloodType', 'groupPhone']) {
    assert.equal(book.member[k], '', `member 缺 ${k} 預設`);
  }
  assert.deepEqual(Object.keys(book.scouting.scoutRanks).sort(), ['aplFrom', 'aplTo', 'plFrom', 'plTo', 'splFrom', 'splTo']);
  assert.deepEqual(Object.keys(book.scouting.stars).sort(), ['y1', 'y2', 'y3', 'y4', 'y5']);

  const demo = demoBook();
  for (const [id, entry] of Object.entries(demo.progress)) {
    assert.ok(ITEM_INDEX[id], `${id} 不在綱要內`);
    assert.match(entry.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(entry.signature ?? null, null, '示範資料不可偽造簽名墨跡');
  }
  assert.equal(demo.otherBadges['SC-PUR-001'].confirmedByBadge ?? false, false);
});
