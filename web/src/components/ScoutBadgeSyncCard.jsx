import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  collectPendingForBadge,
  exportForBadge,
  importFromBadge,
  scoutId,
} from '@shared/book.js';
import { useBook } from '../bookContext.js';
import { download, slugify } from '../bookStore.js';
import { useLang } from '../i18n.jsx';
import { Icon, useToast } from '../ui.jsx';
import {
  DEFAULT_SCOUTBADGE_URL,
  TROOP_NOT_FOUND,
  pickTroopId,
  probeScoutBadgeBridge,
  sortTroopEntries,
} from '../scoutbadgeBridge.js';

const SCOUTBADGE_MEMBER_SESSION_KEY = 'scoutbook.scoutbadge.member.v1';

function readMemberSession() {
  try {
    const sess = JSON.parse(window.sessionStorage.getItem(SCOUTBADGE_MEMBER_SESSION_KEY) || 'null');
    // 只有完整的登入狀態才算「已連接」；殘缺資料一律當作未連接，進度檔匯出／匯入保持鎖定。
    return sess && typeof sess === 'object' && sess.token && sess.ymis && sess.troopId ? sess : null;
  } catch {
    return null;
  }
}

function writeMemberSession(sess) {
  try {
    if (!sess) window.sessionStorage.removeItem(SCOUTBADGE_MEMBER_SESSION_KEY);
    else window.sessionStorage.setItem(SCOUTBADGE_MEMBER_SESSION_KEY, JSON.stringify(sess));
  } catch {
    /* ignore */
  }
}

export default function ScoutBadgeSyncCard({ readOnly = false }) {
  const { book, update, replace } = useBook();
  const { push } = useToast();
  const { isEn } = useLang();
  const fileRef = useRef(null);
  const troopFieldId = useId();

  const mySid = scoutId(book?.member);
  const [troops, setTroops] = useState({});
  // 「前往 scoutbadge 開戶」的目的地：由伺服器端橋接回報，只接受 https。
  const [badgeOrigin, setBadgeOrigin] = useState(DEFAULT_SCOUTBADGE_URL);
  // false＝橋接存在，但暫時讀不到 scoutbadge 的已登記旅團清單。
  const [upstreamOk, setUpstreamOk] = useState(true);
  const [troopId, setTroopId] = useState(() => String(readMemberSession()?.troopId || ''));
  // 只在清單為空時才可手動輸入旅團編號。
  const [manualTroop, setManualTroop] = useState(false);
  const [loginYmis, setLoginYmis] = useState(() => mySid || readMemberSession()?.ymis || '');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(() => readMemberSession());
  const [showLogin, setShowLogin] = useState(false);
  const [busy, setBusy] = useState(false);
  // 'checking' → 尚未探測；'ready' → 伺服器端橋接可用；'unavailable' → 純靜態部署，BOOK 以獨立模式運作
  const [bridge, setBridge] = useState('checking');
  const [remoteConfirmed, setRemoteConfirmed] = useState({});
  const [remotePendingIds, setRemotePendingIds] = useState([]);

  // 自動讀取到的已登記旅團，按編號排好供下拉選單直接選取。
  const troopEntries = useMemo(() => sortTroopEntries(troops), [troops]);

  useEffect(() => {
    if (mySid && !loginYmis) setLoginYmis(mySid);
  }, [mySid, loginYmis]);

  const probeBridge = useCallback(async () => {
    setBridge('checking');
    const result = await probeScoutBadgeBridge();
    // 靜態主機（GitHub Pages／S3／本機 file://）沒有 /api：BOOK 仍 100% 可用，只是少了自動同步。
    if (!result.available) {
      setBridge('unavailable');
      return;
    }
    const nextTroops = result.troops || {};
    setTroops(nextTroops);
    setBadgeOrigin(result.origin || DEFAULT_SCOUTBADGE_URL);
    setUpstreamOk(result.upstreamOk !== false);
    setBridge('ready');
    if (sortTroopEntries(nextTroops).length > 0) setManualTroop(false);
    // 有多個旅團時不代為預選：必須由用戶在清單明確選擇自己的旅團。
    setTroopId((prev) => pickTroopId(prev, nextTroops));
  }, []);

  useEffect(() => {
    probeBridge();
    // 只在首次掛載探測一次；使用者可按「重新偵測」再試。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmedInBookCount = useMemo(
    () =>
      Object.values(book?.progress || {}).filter(
        (p) => p?.date && (p.confirmedByBadge || p.signature?.png || p.signedAt),
      ).length +
      Object.values(book?.otherBadges || {}).filter((p) => p?.date && p.confirmedByBadge).length,
    [book],
  );

  const pendingToSubmit = useMemo(
    () => collectPendingForBadge(book, remoteConfirmed, remotePendingIds),
    [book, remoteConfirmed, remotePendingIds],
  );

  const pullConfirmedFromCloud = async (activeSession = session) => {
    if (!activeSession?.token || !activeSession?.troopId || !activeSession?.ymis) return;
    if (readOnly) {
      push(isEn ? 'Exit Leader Mode to update your personal book' : '領袖只讀模式下不會修改本機紀錄冊', 'error');
      return;
    }
    setBusy(true);
    try {
      const r = await fetch('/api/scoutbadge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          troopId: activeSession.troopId,
          action: 'load',
          data: { token: activeSession.token, ymis: activeSession.ymis },
        }),
      });
      const json = await r.json();
      if (!json?.success) {
        if (r.status === 401) {
          setSession(null);
          writeMemberSession(null);
        }
        throw new Error(json?.error || (isEn ? 'Failed to fetch from scoutbadge' : '讀取 scoutbadge 失敗'));
      }

      const confirmedMap = {
        ...(json.progress?.[activeSession.ymis] || {}),
        ...(json.otherBadges?.[activeSession.ymis] || {}),
      };
      const pendingIds = (json.pendingRequests || []).map((x) => x.item_id).filter(Boolean);
      setRemoteConfirmed(confirmedMap);
      setRemotePendingIds(pendingIds);

      const res = importFromBadge(json, book, { expectedScoutId: activeSession.ymis });
      replace(res.book);
      push(
        isEn
          ? `Imported ${res.imported} leader-confirmed items${res.skippedPending ? ` (${res.skippedPending} unconfirmed skipped)` : ''}`
          : `已無條件錄入 ${res.imported} 項領袖已核實進度${
              res.skippedPending ? `（另有 ${res.skippedPending} 項待領袖核實，未錄入）` : ''
            }`,
      );
    } catch (err) {
      push(err.message || (isEn ? 'Sync failed' : '同步失敗'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanTroop = troopId.trim();
    const cleanYmis = (loginYmis || mySid || '').trim();
    if (!cleanTroop || cleanTroop === TROOP_NOT_FOUND || !cleanYmis || !password) {
      push(
        isEn
          ? 'Select your group, then enter your Scout ID and scoutbadge password'
          : '請選擇所屬旅團，並填寫你的童軍成員編號及 scoutbadge 密碼',
        'error',
      );
      return;
    }
    setBusy(true);
    try {
      const r = await fetch('/api/scoutbadge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          troopId: cleanTroop,
          action: 'login',
          data: { login_id: cleanYmis, password },
        }),
      });
      const json = await r.json();
      if (!json?.success || !json?.token) {
        throw new Error(json?.error || (isEn ? 'Sign-in failed' : '登入 scoutbadge 失敗'));
      }
      const nextSess = {
        troopId: cleanTroop,
        troopName: troopEntries.find(([id]) => id === cleanTroop)?.[1]?.name || cleanTroop,
        token: json.token,
        ymis: json.ymis || cleanYmis,
      };
      setSession(nextSess);
      writeMemberSession(nextSess);
      // 空白簿免填個人資料即可同步：只綁定 SCOUT ID，不寫入任何其他個人資料。
      if (!mySid) {
        update((b) => ({
          ...b,
          member: { ...(b.member || {}), scoutId: nextSess.ymis, memberNo: nextSess.ymis },
        }));
        setLoginYmis(nextSess.ymis);
      }
      setPassword('');
      setShowLogin(false);
      if (!readOnly) {
        await pullConfirmedFromCloud(nextSess);
      } else {
        push(isEn ? 'Connected to scoutbadge' : '已連接 scoutbadge');
      }
    } catch (err) {
      push(err.message || (isEn ? 'Sign-in failed' : '登入失敗'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const submitBookProgressAsPending = async () => {
    if (!session?.token || !session?.troopId || !session?.ymis) {
      setShowLogin(true);
      push(
        isEn
          ? 'Sign in to your scoutbadge account first'
          : '請先連接你的 scoutbadge 帳戶，再送交待核實進度',
        'error',
      );
      return;
    }
    if (pendingToSubmit.length === 0) {
      push(
        isEn
          ? 'All recorded items are already confirmed or pending in scoutbadge'
          : '紀錄冊內的項目均已在 scoutbadge 核實或等候領袖批核，無須重複送出',
      );
      return;
    }
    setBusy(true);
    try {
      const r = await fetch('/api/scoutbadge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          troopId: session.troopId,
          action: 'submitPending',
          data: {
            token: session.token,
            ymis: session.ymis,
            items: pendingToSubmit,
          },
        }),
      });
      const json = await r.json();
      if (!json?.success) {
        throw new Error(json?.error || (isEn ? 'Submission failed' : '送交失敗'));
      }
      setRemotePendingIds((prev) => [
        ...new Set([...prev, ...pendingToSubmit.map((x) => x.itemId)]),
      ]);
      push(
        isEn
          ? `Sent ${json.submitted} items to scoutbadge as Pending Leader Confirmation`
          : `已將 ${json.submitted} 項進度送交 scoutbadge「待領袖核實」（領袖 CONFIRM 後即可錄入回紀錄冊）`,
      );
    } catch (err) {
      push(err.message || (isEn ? 'Failed to submit to scoutbadge' : '送交 scoutbadge 失敗'), 'error');
    } finally {
      setBusy(false);
    }
  };

  // scoutbadge 進度檔交換（匯出「待領袖核實」／匯入「領袖已核實」）必須先連接並登入 scoutbadge。
  // 完整紀錄冊備份與還原不經這裡，永遠可離線使用。
  const onExportFile = () => {
    if (!session?.token || !session?.ymis) {
      push(
        isEn
          ? 'Connect and sign in to your scoutbadge account before exporting a progress file'
          : '請先連接並登入 scoutbadge 帳戶，方可匯出「待領袖核實」進度檔',
        'error',
      );
      return;
    }
    const payload = exportForBadge(book, session.troopId || troopId || '');
    download(`scoutbook-pending-for-scoutbadge-${slugify(mySid || session.ymis || 'member')}.json`, payload);
    push(
      isEn
        ? 'Exported Pending submission JSON (status: pending, zero personal data)'
        : '已匯出「待領袖核實」純進度檔（status: pending，不含個人資料）',
    );
  };

  const onImportFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!session?.token || !session?.ymis) {
      push(
        isEn
          ? 'Connect and sign in to your scoutbadge account before importing a progress file'
          : '請先連接並登入 scoutbadge 帳戶，方可從 scoutbadge 匯入進度檔',
        'error',
      );
      return;
    }
    if (readOnly) {
      push(isEn ? 'Exit Leader Mode to import into your book' : '領袖只讀模式下不可匯入修改本機紀錄冊', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        const res = importFromBadge(parsed, book, { expectedScoutId: mySid || session?.ymis || '' });
        replace(res.book);
        push(
          isEn
            ? `Imported ${res.imported} leader-confirmed items${res.skippedPending ? ` (${res.skippedPending} unconfirmed skipped)` : ''}`
            : `已錄入 ${res.imported} 項領袖已核實進度${
                res.skippedPending ? `（已略過 ${res.skippedPending} 項未核實項目）` : ''
              }`,
        );
      } catch (err) {
        push(err.message || (isEn ? 'Import failed' : '匯入 scoutbadge 失敗'), 'error');
      }
    };
    reader.readAsText(file);
  };

  const hasTroops = troopEntries.length > 0;
  const noTroopsFound = bridge === 'ready' && !hasTroops;
  const troopNotListed = hasTroops && troopId === TROOP_NOT_FOUND;
  // 橋接可用，但暫時讀不到 scoutbadge 的清單：旅團未必未登記，提示要如實說明並先請用戶重試。
  const listUnreachable = bridge === 'ready' && !upstreamOk;
  // 開戶提示與外部連結只在「清單為空」或「用戶表示找不到旅團」時出現，平時不佔版面。
  const showOpenAccountNotice =
    bridge === 'ready' && !session && ((noTroopsFound && !manualTroop) || (troopNotListed && showLogin));

  return (
    <section className="appxcard scoutsync">
      <h3>
        <Icon name="verified" size={16} />{' '}
        {isEn
          ? 'Optional: Sync Progress with scoutbadge (Progress Only · Zero Personal Data)'
          : '可選：與 scoutbadge 同步個人進度（只同步進度 · 不錄入個人資料）'}
      </h3>
      <p className="tiny">
        {isEn
          ? 'Everything works without scoutbadge. Connecting only saves double typing: BOOK → scoutbadge always submits as “Pending Leader Confirmation” (cannot self-confirm); scoutbadge → BOOK trusts only leader-confirmed items.'
          : '不連接亦可用完整紀錄冊、簽名、列印與二維碼。連接後可免除重複輸入：由 BOOK 送往 scoutbadge 一律轉為「待領袖核實（pending）」，必須由領袖在 scoutbadge 內 CONFIRM；由 scoutbadge 錄入回 BOOK 時，只無條件相信領袖已核實的資料，未核實項目絕不錄入。'}
      </p>

      {bridge === 'unavailable' && (
        <div className="scoutsync__offline">
          <Icon name="info" size={15} />
          <div>
            <strong>{isEn ? 'Running in standalone mode' : '現時以獨立模式運作'}</strong>
            <p>
              {isEn
                ? 'This deployment has no scoutbadge bridge (static hosting). Your record book is fully usable: pages, signatures, forms, printing, QR and the full book backup below all work offline.'
                : '此部署未接駁 scoutbadge（純靜態主機）。紀錄冊全部功能照常運作：逐頁填寫、簽名、表格、列印、二維碼及下方完整備份均可離線使用。'}
            </p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={probeBridge}>
            <Icon name="refresh" size={13} /> {isEn ? 'Retry' : '重新偵測'}
          </button>
        </div>
      )}

      <div className="scoutsync__stats">
        <span>
          <b>{confirmedInBookCount}</b>{' '}
          {isEn ? 'Confirmed / Signed in BOOK' : '項已獲核實／領袖簽署'}
        </span>
        <span>
          <b>{pendingToSubmit.length}</b>{' '}
          {isEn ? 'Unconfirmed in BOOK (Ready to Submit)' : '項本機新填（待送交 scoutbadge 核實）'}
        </span>
        {remotePendingIds.length > 0 && (
          <span>
            <b>{remotePendingIds.length}</b>{' '}
            {isEn ? 'Waiting for Leader in scoutbadge' : '項正在 scoutbadge 等候領袖 CONFIRM'}
          </span>
        )}
      </div>

      {/* 雲端直連 scoutbadge */}
      <div className="appxbtns">
        {session ? (
          <>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              disabled={busy || readOnly}
              onClick={() => pullConfirmedFromCloud(session)}
            >
              <Icon name="download" size={14} />{' '}
              {isEn
                ? 'Pull Leader-Confirmed from scoutbadge'
                : '從 scoutbadge 錄入「領袖已核實」進度'}
            </button>
            <button
              type="button"
              className="btn btn--gold btn--sm"
              disabled={busy || pendingToSubmit.length === 0}
              onClick={submitBookProgressAsPending}
            >
              <Icon name="upload" size={14} />{' '}
              {isEn
                ? `Submit to scoutbadge as Pending (${pendingToSubmit.length})`
                : `送交 scoutbadge 待領袖核實（${pendingToSubmit.length} 項）`}
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              disabled={busy}
              onClick={() => {
                setSession(null);
                writeMemberSession(null);
                setRemoteConfirmed({});
                setRemotePendingIds([]);
                push(isEn ? 'Signed out of scoutbadge' : '已中斷 scoutbadge 連線');
              }}
            >
              {isEn ? `Disconnect (${session.ymis})` : `登出（${session.ymis}）`}
            </button>
          </>
        ) : (
          bridge !== 'unavailable' &&
          (hasTroops || manualTroop || bridge === 'checking') && (
            <button
              type="button"
              className="btn btn--gold btn--sm"
              disabled={bridge === 'checking'}
              aria-expanded={showLogin}
              onClick={() => setShowLogin((v) => !v)}
            >
              <Icon name="link" size={14} />{' '}
              {bridge === 'checking'
                ? isEn
                  ? 'Checking scoutbadge…'
                  : '正在偵測 scoutbadge…'
                : hasTroops
                  ? isEn
                    ? `Connect My scoutbadge Account (${troopEntries.length} ${
                        troopEntries.length === 1 ? 'group' : 'groups'
                      } found)`
                    : `連接我的 scoutbadge 帳戶（已自動讀取 ${troopEntries.length} 個旅團）`
                  : isEn
                    ? 'Connect My scoutbadge Account'
                    : '連接我的 scoutbadge 帳戶（一鍵同步）'}
            </button>
          )
        )}
      </div>

      {showLogin && !session && (hasTroops || manualTroop) && (
        <form className="scoutsync__login" onSubmit={handleLogin}>
          <div className="scoutsync__fields">
            <div className="scoutsync__field">
              <div className="scoutsync__labelrow">
                <label htmlFor={troopFieldId}>
                  {hasTroops ? (isEn ? 'Registered Group / Unit' : '已登記旅團') : isEn ? 'Group ID' : '旅團編號'}
                </label>
                {hasTroops ? (
                  <button
                    type="button"
                    className="scoutsync__hintlink"
                    onClick={() => setTroopId(TROOP_NOT_FOUND)}
                  >
                    {isEn ? 'Not listed?' : '找不到旅團？'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="scoutsync__hintlink"
                    onClick={() => setManualTroop(false)}
                  >
                    {isEn ? 'Back' : '返回開戶提示'}
                  </button>
                )}
              </div>
              {hasTroops ? (
                <select id={troopFieldId} value={troopId} onChange={(e) => setTroopId(e.target.value)}>
                  <option value="">
                    {isEn
                      ? `— Select your registered group (${troopEntries.length}) —`
                      : `— 請選擇已登記旅團（共 ${troopEntries.length} 個）—`}
                  </option>
                  {troopEntries.map(([id, info]) => (
                    <option key={id} value={id}>
                      {id} · {isEn && info.en ? info.en : info.name}
                    </option>
                  ))}
                  <option value={TROOP_NOT_FOUND}>
                    {isEn
                      ? '— Not listed? Open a scoutbadge account —'
                      : '— 找不到我的旅團（前往 scoutbadge 開戶）—'}
                  </option>
                </select>
              ) : (
                <input
                  id={troopFieldId}
                  type="text"
                  value={troopId}
                  onChange={(e) => setTroopId(e.target.value)}
                  placeholder={isEn ? 'e.g. 0082' : '旅團編號（如 0082）'}
                />
              )}
            </div>
            {/* 選了「找不到我的旅團」就不可能登入：收起編號、密碼及送出欄位，只留下方的開戶提示。 */}
            {!troopNotListed && (
              <>
                <label>
                  <span>{isEn ? 'My Scout ID (YMIS)' : '我的童軍成員編號'}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={loginYmis}
                    onChange={(e) => setLoginYmis(e.target.value)}
                    placeholder={isEn ? '10-digit Scout ID' : '10 位童軍成員編號'}
                  />
                </label>
                <label>
                  <span>{isEn ? 'scoutbadge Password' : 'scoutbadge 密碼'}</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />
                </label>
                <button type="submit" className="btn btn--primary btn--sm" disabled={busy || !troopId.trim()}>
                  {busy
                    ? isEn
                      ? 'Connecting…'
                      : '連線中…'
                    : isEn
                      ? 'Connect & Sync Confirmed'
                      : '登入並錄入已核實進度'}
                </button>
              </>
            )}
          </div>
        </form>
      )}

      {showOpenAccountNotice && (
        <div className="scoutsync__notfound">
          <Icon name="info" size={16} />
          <div className="scoutsync__notfound-body">
            <strong>
              {listUnreachable
                ? isEn
                  ? 'Could not load the registered group list right now'
                  : '暫時未能讀取已登記旅團清單'
                : noTroopsFound
                  ? isEn
                    ? 'No registered groups found — please open an account on scoutbadge first'
                    : '未找到已登記旅團，請先前往 scoutbadge 開戶'
                  : isEn
                    ? 'Group not listed? Please register your group and open an account on scoutbadge first'
                    : '找不到你的旅團？請先前往 scoutbadge 開戶及登記旅團'}
            </strong>
            <p>
              {listUnreachable
                ? isEn
                  ? 'The list of registered groups could not be fetched from scoutbadge — this may be a temporary network problem. Tap “Refresh Group List” to try again. If your group is not registered yet, it must be registered and your member account opened on scoutbadge first.'
                  : '連接 scoutbadge 時未能取得已登記旅團清單，可能只是暫時的網絡問題。請按「重新讀取旅團清單」再試；如旅團尚未登記，必須先在 scoutbadge 完成旅團登記及成員開戶。'
                : isEn
                  ? 'Your group must be registered and your member account opened on scoutbadge first. Your group can then be picked from the list here to connect your account and sync progress.'
                  : '必須先在 scoutbadge 完成旅團登記及成員開戶，方可於此自動選取旅團並連接帳戶同步進度。'}
            </p>
            <div className="scoutsync__notfound-actions">
              <a className="btn btn--gold btn--sm" href={badgeOrigin} target="_blank" rel="noopener noreferrer">
                <Icon name="external" size={14} />{' '}
                {isEn ? 'Open an Account on scoutbadge' : '前往 scoutbadge 開戶'}
              </a>
              <button type="button" className="btn btn--ghost btn--sm" onClick={probeBridge}>
                <Icon name="refresh" size={13} /> {isEn ? 'Refresh Group List' : '重新讀取旅團清單'}
              </button>
              {noTroopsFound && (
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    setManualTroop(true);
                    setShowLogin(true);
                  }}
                >
                  {isEn ? 'Enter Group ID Manually' : '手動輸入旅團編號'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* scoutbadge 進度檔交換：必須先連接並登入 scoutbadge 才可使用 */}
      {session ? (
        <div className="appxbtns scoutsync__files">
          <button type="button" className="btn btn--ghost btn--sm" onClick={onExportFile}>
            <Icon name="download" size={14} />{' '}
            {isEn
              ? 'Export Pending JSON for scoutbadge'
              : '匯出「待領袖核實」進度檔（供 scoutbadge）'}
          </button>

          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImportFile} />
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            disabled={readOnly}
            onClick={() => fileRef.current?.click()}
          >
            <Icon name="upload" size={14} />{' '}
            {isEn
              ? 'Import Confirmed JSON from scoutbadge'
              : '從 scoutbadge 匯入「領袖已核實」進度檔'}
          </button>
        </div>
      ) : (
        <div className="scoutsync__locked">
          <Icon name="lock" size={14} />
          <span>
            {bridge === 'unavailable'
              ? isEn
                ? 'Running in standalone mode: scoutbadge cannot be reached, so scoutbadge progress files cannot be exported or imported. (“Full Device Backup & Phone Transfer” below still works offline.)'
                : '現時以獨立模式運作，未能連接 scoutbadge，因此不可匯出或匯入 scoutbadge 進度檔。（下方「完整紀錄冊備份與換機轉移」仍可離線使用）'
              : isEn
                ? 'scoutbadge progress files cannot be exported or imported until you connect: sign in to your scoutbadge account above first. (“Full Device Backup & Phone Transfer” below still works offline.)'
                : '未連接 scoutbadge 前不可匯出或匯入 scoutbadge 進度檔；請先於上方連接並登入 scoutbadge 帳戶。（下方「完整紀錄冊備份與換機轉移」仍可離線使用）'}
          </span>
        </div>
      )}
    </section>
  );
}
