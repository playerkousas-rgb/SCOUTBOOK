import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { PRINT_PAGES, demoBook, newBook, ALL_AWARDS, OTHER_BADGES } from '../shared/book.js';
import {
  FORM_META,
  FORM_ORDER,
  PT18_CHECKLIST,
  PT18_SECTION_C,
  PT18_SECTION_D,
  P120A1_PROCEDURE,
  PRINT_CHECKLIST,
  itemRowsForAward,
  activityBadgeRows,
  buildFormValues,
  formReadiness,
} from '../shared/forms.js';
import {
  TRANSFER_PREFIX,
  TRANSFER_OPTIONS,
  QR_LIMIT,
  KIND_MEMBER,
  KIND_SIGNOFF,
  buildPayload,
  encodePayload,
  encodeTransfer,
  decodeTransfer,
  decodePayload,
  encodeSignoff,
  applySignoff,
  extractToken,
  describeSelection,
} from '../shared/transfer.js';

const read = (rel) => readFileSync(new URL(`../${rel}`, import.meta.url), 'utf8');
const REF = new Date('2026-11-05');

test('官方表格 PT/18・P120A1・P120A2 齊備，編號與官方表格目錄一致', () => {
  assert.deepEqual(FORM_ORDER, ['pt18', 'p120a1', 'p120a2']);

  assert.equal(FORM_META.pt18.official, true);
  assert.equal(FORM_META.pt18.code, 'FORM PT/18 (10/2025)');
  assert.equal(FORM_META.pt18.title, '總領袖獎章及證書申請表');
  assert.equal(FORM_META.pt18.pages, 2);

  assert.equal(FORM_META.p120a1.official, true);
  assert.equal(FORM_META.p120a1.code, 'P120A1 (10/2009)');
  assert.equal(FORM_META.p120a1.title, '童軍專科徽章／獎章考驗申請表');
  assert.equal(FORM_META.p120a1.pages, 2);

  assert.equal(FORM_META.p120a2.official, true);
  assert.equal(FORM_META.p120a2.code, 'P120A2 (10/2009)');
  assert.equal(FORM_META.p120a2.pages, 1);

  assert.equal(PT18_CHECKLIST.length >= 4, true);
  assert.ok(PT18_CHECKLIST.some((line) => line.includes('1、2、3、6、7')));
  assert.ok(PT18_CHECKLIST.some((line) => line.includes('50–62')));
  assert.equal(PT18_SECTION_C.length, 8);
  assert.equal(PT18_SECTION_D.length, 5);
  assert.deepEqual(PT18_SECTION_D.map((g) => g.rows.length), [6, 4, 3, 3, 2]);
  assert.equal(P120A1_PROCEDURE.length >= 4, true);
  assert.ok(P120A1_PROCEDURE.some((line) => line.includes('區會')));
  assert.equal(PRINT_CHECKLIST.length, 5);
  assert.equal(PRINT_CHECKLIST[0].items.includes('個人資料（含近照及持有人簽署）'), true);
});

test('紀錄冊資料一次填寫即自動帶入 PT/18・P120A1，缺漏欄位準確回報', () => {
  const demo = demoBook();
  const v = buildFormValues(demo, 'pt18', REF);
  assert.equal(v.nameZh, '陳小鷹');
  assert.equal(v.nameEn, 'CHAN SIU-YING');
  assert.equal(v.scoutId, '0012345678');
  assert.equal(v.troop, '沙田第 12 旅童軍團');
  assert.equal(v.patrol, '鷹小隊');
  assert.equal(v.group, '沙田第 12 旅');
  assert.equal(v.district, '沙田北區');
  assert.equal(v.region, '新界東地域');
  assert.equal(v.age, '13');
  assert.equal(v.ageMonths, '163');
  assert.equal(v.electives.length, 3);
  assert.equal(v.sectionC.length, 8);
  assert.equal(v.sectionD.length, 5);

  const r = formReadiness(demo, 'pt18', REF);
  assert.equal(r.ready, true);
  assert.deepEqual(r.missing, []);

  // P120A1 未選報考徽章時如實回報，而不是假裝齊備
  assert.equal(formReadiness(demo, 'p120a1', REF).ready, true);
  const noBadge = structuredClone(demo);
  noBadge.forms.p120a1.badgeId = '';
  const rA1 = formReadiness(noBadge, 'p120a1', REF);
  assert.equal(rA1.ready, false);
  assert.ok(rA1.missing.includes('報考徽章（請先選擇）'));

  // PT/18 需要完整個人摘要：只填姓名與出生日期不足以遞交
  const bare = newBook({ member: { nameZh: '陳小鷹', nameEn: 'CHAN Siu-ying', dob: '2013-04-12' } });
  const rBare = formReadiness(bare, 'pt18', REF);
  assert.equal(rBare.ready, false);
  assert.ok(rBare.missing.includes('SCOUT ID'));
  assert.ok(rBare.missing.includes('性別'));
  assert.equal(buildFormValues(bare, 'pt18', REF).ageMonths, '163');

  // P120A2 只需姓名與編號即可關連主表
  const rA2 = formReadiness(bare, 'p120a2', REF);
  assert.equal(rA2.ready, false);
  assert.ok(rA2.missing.includes('SCOUT ID'));

  // 細項列只取該獎章，並保留 scoutbadge 官方編號供對照
  const rows = itemRowsForAward(demo, ALL_AWARDS[3]);
  assert.equal(rows.length, 17);
  assert.ok(rows.every((r) => r.id.startsWith('L4-')));
  const l5 = itemRowsForAward(demo, ALL_AWARDS[4]);
  assert.equal(l5.length, 17);
  assert.equal(l5[0].badgeId, 'L5-A1');

  const acts = activityBadgeRows(demo);
  assert.equal(acts.length, OTHER_BADGES.length);
  assert.equal(acts.find((b) => b.id === 'SC-PUR-001').date, '2025-06-01');
});

test('QR 預設全不剔選（私隱自決），空格包不含任何個人資料', () => {
  assert.deepEqual(TRANSFER_OPTIONS.map((o) => o.key), [
    'particulars',
    'contact',
    'progress',
    'otherBadges',
    'renewals',
    'investiture',
    'signatures',
    'holderSignature',
    'photo',
  ]);
  for (const opt of TRANSFER_OPTIONS) {
    assert.equal(opt.default, undefined, `${opt.key} 不得預設剔選`);
  }
  assert.equal(TRANSFER_OPTIONS.filter((o) => o.sensitive).length, 1);

  const demo = demoBook();
  const empty = buildPayload(demo, []);
  assert.deepEqual(empty.sel, []);
  assert.equal(empty.member, undefined);
  assert.equal(empty.progress, undefined);
  assert.equal(empty.t, KIND_MEMBER);
  assert.equal(describeSelection([]), '（未剔選任何組別）');

  // 剔選後仍只包含所選組別：不勾 contact 就沒有電話／地址／家長資料
  demo.member.phone = '91234567';
  const only = buildPayload(demo, ['particulars', 'progress']);
  assert.deepEqual(only.sel, ['particulars', 'progress']);
  const json = JSON.stringify(only);
  assert.equal(json.includes('91234567'), false);
  assert.equal(json.includes('parentName'), false);
  assert.equal('photo' in (only.member || {}), false);
  assert.equal(only.progress['L1-M1'].date, '2024-09-14');
});

test('SB1 二維碼壓縮編解碼、SB1S 核簽碼與 #v= 連結解析', async () => {
  const demo = demoBook();
  const enc = await encodeTransfer(demo, ['particulars', 'progress']);
  assert.match(enc.value, /^SB1\./);
  assert.equal(enc.tooBig, false);
  assert.ok(enc.chars < QR_LIMIT);
  assert.ok(enc.bytes < enc.rawBytes);
  assert.equal(TRANSFER_PREFIX, 'SB1');

  const back = await decodeTransfer(enc.value);
  assert.equal(back.t, KIND_MEMBER);
  assert.equal(back.member.scoutId, '0012345678');
  assert.equal(back.progress['L1-M1'].date, '2024-09-14');

  // 完整網址片段：#v=SB1...
  const url = `https://scoutbook.example/#v=${enc.value}`;
  assert.equal(extractToken(url), enc.value);
  assert.equal((await decodePayload(url)).t, KIND_MEMBER);

  // 核簽碼必以 SB1S. 開頭，且不可被當成成員紀錄冊
  const signoff = await encodeSignoff({
    member: { nameZh: '陳小鷹', scoutId: '0012345678' },
    leader: { name: '李團長', title: '童軍團長 SL' },
    items: [{ id: 'L2-A1', date: '2026-10-20' }],
    otherBadges: [{ id: 'SC-PUR-001', date: '2026-10-21', cert: 'PUR/2026/0102' }],
  });
  assert.match(signoff.value, /^SB1S\./);
  await assert.rejects(() => decodeTransfer(signoff.value), /核簽/);

  const decoded = await decodePayload(signoff.value);
  assert.equal(decoded.t, KIND_SIGNOFF);
  assert.equal(decoded.leader.name, '李團長');
  assert.equal(decoded.items[0].verified, true);

  await assert.rejects(() => decodePayload('VS1.abcdef'), /SCOUTBOOK/);
  await assert.rejects(() => decodePayload('SB1.%%%'), /SCOUTBOOK/);
  const broken = await encodePayload({ t: KIND_MEMBER, v: 99 });
  await assert.rejects(() => decodePayload(broken.value), /版本不相容/);
});

test('套用領袖核簽：寫入日期／主考／簽名，SCOUT ID 不符即拒絕', async () => {
  const demo = demoBook();
  const sig = await encodeSignoff({
    member: { scoutId: '0012345678' },
    leader: { name: '李團長', title: '童軍團長 SL', png: 'data:image/png;base64,AAA' },
    items: [
      { id: 'L2-A3', date: '2026-10-20' },
      { id: 'not-an-item', date: '2026-10-20' },
    ],
    otherBadges: [{ id: 'SC-PUR-001', date: '2026-10-21', cert: 'PUR/2026/0102' }],
  });
  const payload = await decodePayload(sig.value);
  assert.match(sig.value, /^SB1S\./);

  const { book, changes } = applySignoff(demo, payload);
  assert.equal(book.progress['L2-A3'].date, '2026-10-20');
  assert.equal(book.progress['L2-A3'].assessor, '李團長');
  assert.equal(book.progress['L2-A3'].signature.name, '李團長');
  assert.equal(book.progress['L2-A3'].signature.png, 'data:image/png;base64,AAA');
  assert.equal(book.otherBadges['SC-PUR-001'].cert, 'PUR/2026/0102');
  assert.equal(book.otherBadges['SC-PUR-001'].signature.png, 'data:image/png;base64,AAA');
  assert.equal(changes.length, 2);
  // 領袖在紀錄冊上簽署不等於在 scoutbadge 核實，仍須送交 BADGE 由領袖 CONFIRM
  assert.equal(book.progress['L2-A3'].confirmedByBadge ?? false, false);
  assert.equal(book.otherBadges['SC-PUR-001'].confirmedByBadge ?? false, false);

  const other = newBook({ member: { scoutId: '0099999999' } });
  assert.throws(() => applySignoff(other, payload), /SCOUT ID/);

  // 空白紀錄冊未填編號時可直接套用，並保留核簽者身分
  const blank = newBook();
  const applied = applySignoff(blank, payload);
  assert.equal(applied.book.progress['L2-A3'].assessor, '李團長');

  assert.throws(() => applySignoff(demo, { t: KIND_MEMBER }), /核簽單/);
});

test('列印版面與版面契約：A4 表單、110 頁列印、目錄及附錄存在', () => {
  const app = read('web/src/App.jsx');
  const forms = read('web/src/pages/Forms.jsx');
  const css = read('web/src/styles.css');

  assert.equal(PRINT_PAGES.length, 110);
  assert.deepEqual(PRINT_PAGES.map((pg) => pg.id).slice(0, 2), ['p001', 'p002']);
  assert.equal(PRINT_PAGES[109].id, 'p110');
  assert.ok(app.includes('OFFICIAL_PAGES'), 'App.jsx 須由官方頁表數據驅動');
  assert.ok(app.includes('contents'));
  assert.ok(app.includes('appendix'));
  assert.ok(app.includes('print'));

  for (const formId of ['pt18', 'p120a1', 'p120a2']) {
    assert.ok(forms.includes(formId), `Forms.jsx 缺少 ${formId}`);
  }
  assert.ok(forms.includes('a4sheet'));
  assert.ok(forms.includes('no-print'));
  assert.ok(existsSync(new URL('../web/src/pages/Forms.jsx', import.meta.url)));

  assert.ok(css.includes('@media print'));
  assert.ok(css.includes('.a4sheet'));
  assert.ok(css.includes('.no-print'));
  assert.ok(css.includes('html[data-print-preview]'));
  // 手機不得出現水平捲軸
  assert.ok(css.includes('max-width: 740px'));
});


test('總領袖示範樣本可列印所需資料，並保留明確的虛構標記', () => {
  const demo = demoBook();
  const pt = buildFormValues(demo, 'pt18', REF);
  assert.equal(demo.meta.demo, true);
  assert.equal(formReadiness(demo, 'pt18').ready, true);
  assert.ok(pt.electives.every((row) => row.outdoor && row.community && row.completedDate && row.outdoorDate && row.awardDate));
  assert.ok(pt.sectionC.every((row) => row.date));
  assert.ok(pt.sectionD.flatMap((group) => group.rows).filter((row) => row.id).every((row) => row.date));
  assert.ok(pt.sectionD_E2);
  assert.ok(pt.leadership.courseCode);
  assert.ok(pt.nominationName && pt.nominationDate);
  assert.equal(demo.holderSignature, null);
  assert.ok(Object.values(demo.progress).every((row) => !row.confirmedByBadge && !row.signature));
  assert.ok(buildFormValues(demo, 'p120a1').badgeId);
  assert.ok(buildFormValues(demo, 'p120a2').extraBadges.length);
});
