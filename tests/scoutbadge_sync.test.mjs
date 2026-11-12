import test from 'node:test';
import assert from 'node:assert/strict';
import {
  demoBook,
  newBook,
  collectPendingForBadge,
  exportForBadge,
  importFromBadge,
} from '../shared/book.js';
import handler, {
  resolveBadgeOrigin,
  filterPersonalConfirmedLoad,
  sanitizePendingSubmissions,
} from '../api/scoutbadge.js';

const BACKEND = 'https://script.google.com/macros/s/AKfycbxTESTKEY0123456789/exec';

function withEnv(vars, fn) {
  const prev = {};
  for (const [k, v] of Object.entries(vars)) {
    prev[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    return fn();
  } finally {
    for (const [k, v] of Object.entries(prev)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

async function callApi(method, body) {
  let statusCode = 200;
  let payload = null;
  const res = {
    setHeader() {},
    status(code) {
      statusCode = code;
      return this;
    },
    json(obj) {
      payload = obj;
      return this;
    },
  };
  await handler({ method, body }, res);
  return { status: statusCode, body: payload };
}

function stubFetch(impl) {
  const prev = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init, body: init.body ? JSON.parse(init.body) : null });
    return impl({ url: String(url), init });
  };
  return {
    calls,
    restore() {
      globalThis.fetch = prev;
    },
  };
}

const okJson = (obj) => ({ ok: true, json: async () => obj });

test('後端來源只接受 https；開發測試可明確開啟本機位址', () => {
  // 未設定環境變數：預設就是 scoutbadge 的正式網址
  withEnv({ SCOUTBADGE_ORIGIN: undefined }, () => {
    assert.equal(resolveBadgeOrigin(), 'https://scoutbadge.vercel.app');
  });
  withEnv({ SCOUTBADGE_ORIGIN: '   ' }, () => {
    assert.equal(resolveBadgeOrigin(), 'https://scoutbadge.vercel.app');
  });
  withEnv({ SCOUTBADGE_ORIGIN: 'https://scoutbadge.vercel.app/' }, () => {
    assert.equal(resolveBadgeOrigin(), 'https://scoutbadge.vercel.app');
  });
  // 自訂的 https 來源照用，但只取 origin（路徑、查詢字串一律丟棄）
  withEnv({ SCOUTBADGE_ORIGIN: 'https://badge.example.org/some/path?x=1' }, () => {
    assert.equal(resolveBadgeOrigin(), 'https://badge.example.org');
  });
  withEnv({ SCOUTBADGE_ORIGIN: 'http://evil.example.com' }, () => {
    assert.equal(resolveBadgeOrigin(), 'https://scoutbadge.vercel.app');
  });
  withEnv({ SCOUTBADGE_ORIGIN: 'https://user:pass@scoutbadge.vercel.app' }, () => {
    assert.equal(resolveBadgeOrigin(), 'https://scoutbadge.vercel.app');
  });
  withEnv({ SCOUTBADGE_ORIGIN: 'not a url' }, () => {
    assert.equal(resolveBadgeOrigin(), 'https://scoutbadge.vercel.app');
  });
  withEnv({ SCOUTBADGE_ORIGIN: 'http://127.0.0.1:8787', SCOUTBOOK_PROXY_TEST: '1', VERCEL: undefined }, () => {
    assert.equal(resolveBadgeOrigin(), 'http://127.0.0.1:8787');
  });
  // 本機位址只在明確開啟測試旗標、而且不在 Vercel 上才接受
  withEnv({ SCOUTBADGE_ORIGIN: 'http://127.0.0.1:8787', SCOUTBOOK_PROXY_TEST: undefined, VERCEL: undefined }, () => {
    assert.equal(resolveBadgeOrigin(), 'https://scoutbadge.vercel.app');
  });
  withEnv({ SCOUTBADGE_ORIGIN: 'http://127.0.0.1:8787', SCOUTBOOK_PROXY_TEST: '1', VERCEL: '1' }, () => {
    assert.equal(resolveBadgeOrigin(), 'https://scoutbadge.vercel.app');
  });
});

test('GET /api/scoutbadge：零金鑰旅團清單，永不回傳後端網址或 API key', async () => {
  await withEnv({ TROOP_T12_NAME: '沙田第 12 旅', TROOP_T12_EN: '12th Sha Tin', TROOP_T12_BACKEND: BACKEND, TROOP_T12_APIKEY: 'SECRET-KEY-123' }, async () => {
    const stub = stubFetch(() => okJson({ troops: { T99: { name: '遠端旅團', en: 'Remote' } } }));
    try {
      const res = await callApi('GET');
      assert.equal(res.status, 200);
      assert.deepEqual(Object.keys(res.body), ['success', 'origin', 'privacy', 'upstreamOk', 'troops']);
      assert.equal(res.body.success, true);
      assert.equal(res.body.origin, 'https://scoutbadge.vercel.app');
      assert.equal(res.body.privacy, 'progress-only');
      assert.equal(res.body.upstreamOk, true);
      assert.equal(res.body.troops.T12.name, '沙田第 12 旅');
      assert.equal(res.body.troops.T12.en, '12th Sha Tin');
      assert.deepEqual(res.body.troops.T99, { name: '遠端旅團', en: 'Remote' });
      const json = JSON.stringify(res.body);
      assert.equal(json.includes('SECRET-KEY-123'), false);
      assert.equal(json.includes('script.google.com'), false);
      // 清單由 scoutbadge 的 GET /api/troops 自動讀取，BOOK 不帶任何金鑰
      assert.equal(stub.calls.length, 1);
      assert.equal(stub.calls[0].url, 'https://scoutbadge.vercel.app/api/troops');
      assert.equal(stub.calls[0].init.method, 'GET');
      assert.equal(stub.calls[0].init.body, undefined);
    } finally {
      stub.restore();
    }
  });
});

// 由 /api/scoutbadge 回傳的旅團編號（已排序），方便逐個情境比對。
async function listedTroopIds(upstreamTroops) {
  const stub = stubFetch(() => okJson({ success: true, troops: upstreamTroops }));
  try {
    const res = await callApi('GET');
    assert.equal(res.status, 200);
    assert.equal(res.body.upstreamOk, true);
    return { ids: Object.keys(res.body.troops).sort(), troops: res.body.troops };
  } finally {
    stub.restore();
  }
}

test('GET /api/scoutbadge：已登記旅團清單略過重複別名與未接通旅團，只輸出名稱', async () => {
  // 與 cubsbadge 現行輸出同一格式：主鍵帶 _aliases，別名鍵帶 _aliasOf，另有 connected 旗標
  const { ids, troops } = await listedTroopIds({
    '0082': { id: '0082', name: '港島第 82 旅', en: '82nd Hong Kong', connected: true, _aliases: ['82'], legacyIds: [] },
    82: { name: '港島第 82 旅', en: '82nd Hong Kong', connected: true, _aliasOf: '0082' },
    T99: { name: '遠端旅團', en: 'Remote' },
    OFF: { name: '未接通旅團', connected: false },
    NONAME: { en: 'No Chinese name' },
    BROKEN: null,
    LIST: ['not', 'a', 'troop'],
    TEXT: 'not a troop',
  });
  assert.deepEqual(ids, ['0082', 'T99']);
  assert.deepEqual(troops['0082'], { name: '港島第 82 旅', en: '82nd Hong Kong' }, '只輸出 name／en，不外洩上游的內部欄位');
  assert.deepEqual(troops.T99, { name: '遠端旅團', en: 'Remote' });
  assert.equal(troops['82'], undefined, '帶 _aliasOf 而主鍵會被列出時，別名鍵屬重複項');
  assert.equal(troops.OFF, undefined, 'connected === false 的旅團不可供選取');

  // scoutbadge 現行輸出（沒有 _aliasOf／connected／en）原封不動通過
  const live = await listedTroopIds({
    1187: { id: '1187', name: '新界東第 1187 旅', legacyIds: [] },
    '0004': { id: '0004', name: '港島第 4 旅', legacyIds: [] },
    '0082': { id: '0082', name: '港島第 82 旅', legacyIds: [] },
  });
  assert.deepEqual(live.ids, ['0004', '0082', '1187']);
  assert.deepEqual(live.troops['0004'], { name: '港島第 4 旅' });
});

test('GET /api/scoutbadge：去重絕不令旅團消失，旅團編號逐字比對（0082 ≠ 82）', async () => {
  const cases = [
    ['沒有 _aliasOf 標記：0082 與 82 是兩個不同旅團', { '0082': { name: '港島第 82 旅' }, 82: { name: '九龍第 82 旅' } }, ['0082', '82']],
    ['主鍵不在清單：別名照樣列出', { 82: { name: 'A', _aliasOf: '0082' } }, ['82']],
    ['主鍵未接通：別名照樣列出', { '0082': { name: 'A', connected: false }, 82: { name: 'A', _aliasOf: '0082' } }, ['82']],
    ['主鍵沒有名稱：別名照樣列出', { '0082': { en: 'A' }, 82: { name: 'A', _aliasOf: '0082' } }, ['82']],
    ['自己指向自己：不算別名', { '0082': { name: 'A', _aliasOf: '0082' } }, ['0082']],
    ['互相指向：兩個都保留', { X: { name: 'X', _aliasOf: 'Y' }, Y: { name: 'Y', _aliasOf: 'X' } }, ['X', 'Y']],
    ['主鍵本身是別名（只認一層）：保留', { A: { name: 'A' }, B: { name: 'B', _aliasOf: 'A' }, C: { name: 'C', _aliasOf: 'B' } }, ['A', 'C']],
    [
      '指向原型鏈屬性名稱：不算別名',
      { 82: { name: 'A', _aliasOf: 'constructor' }, 83: { name: 'B', _aliasOf: 'toString' }, 84: { name: 'C', _aliasOf: '__proto__' } },
      ['82', '83', '84'],
    ],
    [
      '_aliasOf 不是字串或數字：不算別名',
      { K1: { name: 'A', _aliasOf: '' }, K2: { name: 'B', _aliasOf: {} }, K3: { name: 'C', _aliasOf: true }, K4: { name: 'D', _aliasOf: null }, K5: { name: 'E', _aliasOf: ['K1'] } },
      ['K1', 'K2', 'K3', 'K4', 'K5'],
    ],
    ['_aliasOf 是數字：照樣去重', { 82: { name: 'A' }, '0082': { name: 'A', _aliasOf: 82 } }, ['82']],
    ['_aliasOf 前後有空白：照樣去重', { '0082': { name: 'A' }, 82: { name: 'A', _aliasOf: ' 0082 ' } }, ['0082']],
    [
      '旅團編號與物件內建屬性同名：照樣列出，不與原型鏈混淆',
      JSON.parse('{"constructor":{"name":"A"},"toString":{"name":"B"},"__proto__":{"name":"C"},"hasOwnProperty":{"name":"D"}}'),
      ['__proto__', 'constructor', 'hasOwnProperty', 'toString'],
    ],
    [
      'connected 只有明確為 false 才略過',
      { A: { name: 'A', connected: true }, B: { name: 'B' }, C: { name: 'C', connected: null }, D: { name: 'D', connected: 0 }, E: { name: 'E', connected: 'false' } },
      ['A', 'B', 'C', 'D', 'E'],
    ],
  ];
  for (const [label, upstream, expected] of cases) {
    const { ids } = await listedTroopIds(upstream);
    assert.deepEqual(ids, expected, label);
  }
});

test('GET /api/scoutbadge：upstreamOk 如實回報清單是否讀取成功，失敗時仍回傳本機設定的旅團', async () => {
  const failures = [
    ['HTTP 503', () => ({ ok: false, status: 503, json: async () => ({}) })],
    [
      '網絡錯誤',
      () => {
        throw new TypeError('fetch failed');
      },
    ],
    [
      '回應不是 JSON',
      () => ({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token <');
        },
      }),
    ],
    ['troops 是陣列', () => okJson({ success: true, troops: [{ id: '0082', name: '港島第 82 旅' }] })],
    ['troops 是字串', () => okJson({ success: true, troops: '0082' })],
    ['troops 為 null', () => okJson({ success: true, troops: null })],
    ['沒有 troops 欄位', () => okJson({ success: true })],
    ['回應是 null', () => okJson(null)],
  ];
  for (const [label, impl] of failures) {
    const stub = stubFetch(impl);
    try {
      const res = await callApi('GET');
      assert.equal(res.status, 200, `${label}：橋接本身仍然可用`);
      assert.equal(res.body.success, true, label);
      assert.equal(res.body.upstreamOk, false, `${label}：必須回報讀不到清單`);
      assert.deepEqual(Object.keys(res.body.troops), [], label);
    } finally {
      stub.restore();
    }
  }

  // 讀取成功但真的沒有任何已登記旅團：upstreamOk 仍為 true，介面據此分辨兩種情況
  const empty = stubFetch(() => okJson({ success: true, troops: {} }));
  try {
    const res = await callApi('GET');
    assert.equal(res.body.upstreamOk, true);
    assert.deepEqual(Object.keys(res.body.troops), []);
  } finally {
    empty.restore();
  }

  // 上游失敗時，BOOK 自己以環境變數設定的旅團仍然列出
  await withEnv({ TROOP_T12_NAME: '沙田第 12 旅', TROOP_T12_BACKEND: BACKEND, TROOP_T12_APIKEY: 'SECRET-KEY-123' }, async () => {
    const down = stubFetch(() => ({ ok: false, status: 503, json: async () => ({}) }));
    try {
      const res = await callApi('GET');
      assert.equal(res.body.upstreamOk, false);
      assert.deepEqual(Object.keys(res.body.troops), ['T12']);
      assert.deepEqual(res.body.troops.T12, { name: '沙田第 12 旅' });
    } finally {
      down.restore();
    }
  });

  // 清單來源跟隨 SCOUTBADGE_ORIGIN
  await withEnv({ SCOUTBADGE_ORIGIN: 'https://badge.example.org/' }, async () => {
    const custom = stubFetch(() => okJson({ success: true, troops: { '0082': { name: '港島第 82 旅' } } }));
    try {
      const res = await callApi('GET');
      assert.equal(res.body.origin, 'https://badge.example.org');
      assert.equal(custom.calls[0].url, 'https://badge.example.org/api/troops');
    } finally {
      custom.restore();
    }
  });
});

test('BOOK 只能讀取及申報待核實；save / saveOtherBadge 一律 403', async () => {
  const stub = stubFetch(() => okJson({ success: true }));
  try {
    for (const action of ['save', 'saveOtherBadge', 'reviewRequest', 'approveRequest', 'rejectRequest']) {
      const res = await callApi('POST', { action, troopId: 'T12', data: { ymis: '0012345678' } });
      assert.equal(res.status, 403, `${action} 必須被拒`);
      assert.equal(res.body.code, 'FORBIDDEN_WRITE');
      assert.match(res.body.error, /待領袖核實/);
    }
    for (const action of ['', 'deleteMember', 'dump']) {
      const res = await callApi('POST', { action, troopId: 'T12' });
      assert.equal(res.status, 403);
    }
    const badTroop = await callApi('POST', { action: 'login', troopId: 'bad troop!', data: {} });
    assert.equal(badTroop.status, 400);
    assert.equal(stub.calls.length, 0, '被拒的操作不得接觸 scoutbadge 後端');
  } finally {
    stub.restore();
  }
});

test('login 只回傳 token 與 SCOUT ID，姓名／電郵／角色一律不回傳', async () => {
  const stub = stubFetch(() =>
    okJson({
      success: true,
      token: 'tok-abc-123',
      user: { ymis: '0012345678', name: '陳小鷹', email: 'scout@example.com', role: 'admin' },
    }),
  );
  try {
    const res = await callApi('POST', {
      action: 'login',
      troopId: 'T12',
      data: { login_id: '0012345678', password: 'pw', name: '我', phone: '91234567' },
    });
    assert.equal(res.status, 200);
    assert.deepEqual(Object.keys(res.body).sort(), ['success', 'token', 'ymis']);
    assert.equal(res.body.ymis, '0012345678');
    assert.equal(JSON.stringify(res.body).includes('陳小鷹'), false);

    const sent = stub.calls[0];
    assert.match(sent.url, /\/api\/proxy$/);
    assert.equal(sent.body.action, 'login');
    assert.equal(sent.body.apikey, undefined, '金鑰只由伺服器注入，BOOK 不傳');
    assert.equal(sent.body.name, undefined, 'BOOK 不得傳送姓名');
    assert.equal(sent.body.phone, undefined, 'BOOK 不得傳送電話');

    const missing = await callApi('POST', { action: 'login', troopId: 'T12', data: { login_id: '0012345678' } });
    assert.equal(missing.status, 400);
  } finally {
    stub.restore();
  }
});

test('filterPersonalConfirmedLoad：只留本人已核實項目，剔除所有個人資料與他人紀錄', () => {
  const raw = {
    success: true,
    members: [
      { ymis: '0012345678', name: '陳小鷹', phone: '91234567', address: '沙田' },
      { ymis: '0099999999', name: '別人', phone: '90000000' },
    ],
    progress: {
      '0012345678': {
        'L1-M1': { date: '2024-09-07', confirmer: '李團長', note: '私人備註' },
        'L1-M2': { date: '', confirmer: '未完成' },
        'L2-A1': '2025-02-01',
      },
      '0099999999': { 'L1-M1': { date: '2023-01-01', confirmer: '別人' } },
    },
    otherBadges: {
      '0012345678': { 'SC-INT-001': { date: '2025-03-15', cert: 'INT/2025/0181', phone: '91234567' } },
      '0099999999': { 'SC-INT-002': { date: '2025-01-01' } },
    },
    pendingRequests: [
      { ymis: '0012345678', item_id: 'L2-A2', requested_date: '2026-10-01', status: 'pending', name: '陳小鷹' },
      { ymis: '0012345678', item_id: 'L2-A3', requested_date: '2026-10-02', status: 'approved' },
      { ymis: '0099999999', item_id: 'L2-A1', requested_date: '2026-10-03', status: 'pending' },
    ],
  };

  const out = filterPersonalConfirmedLoad(raw, '12345678');
  assert.equal(out.success, true);
  assert.equal(out.privacy, 'progress-only');
  assert.equal(out.scoutId, '12345678');
  // 前導零容忍：同一成員
  assert.deepEqual(out.progress['12345678'], {
    'L1-M1': { date: '2024-09-07', confirmer: '李團長' },
    'L2-A1': { date: '2025-02-01' },
  });
  assert.deepEqual(out.otherBadges['12345678'], { 'SC-INT-001': { date: '2025-03-15', cert: 'INT/2025/0181' } });
  assert.deepEqual(out.pendingRequests, [
    { ymis: '12345678', item_id: 'L2-A2', requested_date: '2026-10-01', status: 'pending' },
  ]);

  const json = JSON.stringify(out);
  for (const pii of ['陳小鷹', '別人', '91234567', '90000000', '沙田', 'members', 'approved']) {
    assert.equal(json.includes(pii), false, `過濾後仍含 ${pii}`);
  }

  assert.equal(filterPersonalConfirmedLoad({ success: false, error: '登入已過期' }, '12345678').success, false);
  assert.equal(filterPersonalConfirmedLoad(raw, '').success, false);
});

test('sanitizePendingSubmissions：零個人資料、官方編號、去重及上限', () => {
  const cleaned = sanitizePendingSubmissions([
    {
      itemId: 'L2-A1',
      name: '陳小鷹',
      phone: '91234567',
      address: '沙田',
      photo: 'data:image/png;base64,AAA',
      date: '2026-10-01',
      evidence: '自行完成',
    },
    // 同項目同日期重複
    { itemId: 'L2-A1', date: '2026-10-01' },
    { itemId: 'SC-PUR-001', itemName: '立體打印', date: '2026-10-02', cert: 'PUR/1' },
    { itemId: 'L1-M1', date: '2026-13-99' },
    { itemId: '', date: '2026-10-03' },
    null,
  ]);

  assert.equal(cleaned.length, 2);
  assert.deepEqual(cleaned[0], {
    itemId: 'L2-A1',
    itemName: 'A1 營藝',
    requested_date: '2026-10-01',
    evidence: '自行完成',
  });
  assert.equal(cleaned[1].itemId, 'SC-PUR-001');
  const json = JSON.stringify(cleaned);
  for (const pii of ['陳小鷹', '91234567', '沙田', 'base64']) {
    assert.equal(json.includes(pii), false);
  }

  const many = Array.from({ length: 260 }, (_, i) => ({ itemId: 'L1-M1', date: `2026-01-${String((i % 28) + 1).padStart(2, '0')}` }));
  assert.ok(sanitizePendingSubmissions(many).length <= 200);
  assert.deepEqual(sanitizePendingSubmissions('not-an-array'), []);
});

test('load 與 submitPending 經 /api/proxy 轉發，且送交只會是 requestComplete / pending', async () => {
  const stub = stubFetch(({ url }) => {
    if (url.includes('action=load') || url.endsWith('/api/proxy')) {
      return okJson({
        success: true,
        progress: { '0012345678': { 'L1-M1': { date: '2024-09-07', confirmer: '李團長' } } },
        otherBadges: {},
        pendingRequests: [],
        members: [{ name: '陳小鷹', phone: '91234567' }],
      });
    }
    return okJson({ success: true });
  });
  try {
    const load = await callApi('POST', {
      action: 'load',
      troopId: 'T12',
      data: { token: 'tok-abc-123', ymis: '0012345678' },
    });
    assert.equal(load.status, 200);
    assert.equal(load.body.success, true);
    assert.equal(load.body.progress['0012345678']['L1-M1'].date, '2024-09-07');
    assert.equal(JSON.stringify(load.body).includes('91234567'), false);

    const shortToken = await callApi('POST', { action: 'load', troopId: 'T12', data: { token: 'ab', ymis: '0012345678' } });
    assert.equal(shortToken.status, 401);

    const noItems = await callApi('POST', { action: 'submitPending', troopId: 'T12', data: { token: 'tok-abc-123', ymis: '0012345678', items: [] } });
    assert.equal(noItems.status, 400);

    stub.calls.length = 0;
    const submitted = await callApi('POST', {
      action: 'submitPending',
      troopId: 'T12',
      data: {
        token: 'tok-abc-123',
        ymis: '0012345678',
        items: [
          { itemId: 'L2-A1', date: '2026-10-01', name: '陳小鷹', phone: '91234567' },
          { itemId: 'SC-PUR-001', date: '2026-10-02', cert: 'PUR/2025/0244' },
        ],
      },
    });
    assert.equal(submitted.status, 200);
    assert.equal(submitted.body.status, 'pending');
    assert.equal(submitted.body.confirmed, false);
    assert.equal(submitted.body.submitted, 2);
    assert.deepEqual(submitted.body.failed, []);
    assert.equal(stub.calls.length, 2);
    for (const call of stub.calls) {
      assert.equal(call.body.action, 'requestComplete');
      assert.equal(call.body.apikey, undefined);
      assert.equal(call.body.name, undefined);
      assert.equal(call.body.phone, undefined);
      assert.equal(call.body.status, undefined, 'BOOK 不得自行設定 status');
    }
    assert.equal(stub.calls[0].body.itemId, 'L2-A1');
    assert.equal(stub.calls[1].body.itemId, 'SC-PUR-001');
  } finally {
    stub.restore();
  }
});

test('BOOK ⇄ BADGE 端到端：空白冊同步、只匯入已核實、申報永不自我核實', () => {
  const blank = newBook();
  const payload = {
    success: true,
    progress: {
      '0012345678': {
        'L1-M1': { date: '2024-09-07', confirmer: '李團長' },
        'L1-M2': { date: '2024-09-14', confirmer: '李團長' },
      },
    },
    otherBadges: { '0012345678': { 'SC-INT-001': { date: '2025-03-15', cert: 'INT/2025/0181' } } },
    pendingRequests: [{ ymis: '0012345678', item_id: 'L2-A1', requested_date: '2026-10-01', status: 'pending' }],
  };
  const { book, imported } = importFromBadge(payload, blank, { expectedScoutId: '0012345678' });
  assert.equal(imported, 3);
  assert.equal(book.member.scoutId, '0012345678');
  assert.equal(book.member.nameZh, '', '同步不得寫入任何個人資料');
  assert.equal(book.progress['L1-M1'].confirmedByBadge, true);
  assert.equal(book.progress['L2-A1'], undefined);

  // 成員自行新增一項 → 匯出成 pending
  book.progress['L2-A1'] = { date: '2026-10-05' };
  const out = exportForBadge(book, 'T12');
  assert.equal(out.status, 'pending');
  assert.equal(out.confirmed, false);
  assert.equal(out.pendingRequests.length, 1);
  assert.equal(out.pendingRequests[0].item_id, 'L2-A1');
  assert.equal(out.pendingRequests[0].status, 'pending');
  assert.equal(JSON.stringify(out).includes('陳小鷹'), false);

  // 已在雲端待核實的同一項目不再重複送交
  assert.equal(collectPendingForBadge(book, {}, ['L2-A1']).length, 0);

  // 未經領袖核實的申報檔不可倒灌成已核實進度
  assert.throws(() => importFromBadge(out, book), /待領袖核實/);

  // 示範紀錄冊：已核實項目不會被重複申報，只有自填的專科徽章需送交
  const demo = demoBook();
  const demoOut = exportForBadge(demo, 'T12');
  assert.ok(demoOut.pendingRequests.some((r) => r.item_id === 'SC-PUR-001'));
  assert.ok(demoOut.pendingRequests.every((r) => r.status === 'pending'));
});
