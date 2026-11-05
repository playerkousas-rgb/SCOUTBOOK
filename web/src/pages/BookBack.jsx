import React, { useRef, useState } from 'react';
import {
  APP_VERSION,
  ALL_AWARDS,
  PRINT_PAGES,
  allStats,
  badgeStats,
  demoBook,
  newBook,
  today,
} from '@shared/book.js';
import { useBook, useReadOnly } from '../bookContext.js';
import { Grid, H, Line, Note, P, Page } from '../components/Form.jsx';
import ScoutBadgeSyncCard from '../components/ScoutBadgeSyncCard.jsx';
import { download, slugify } from '../bookStore.js';
import { compressBookMedia, imageSizeLabel, storageUsage } from '../storageHealth.js';
import { Icon, cx, useToast } from '../ui.jsx';
import { Link } from '../router.jsx';
import { useLang } from '../i18n.jsx';
import { LegalNote } from '../components/Legal.jsx';

/* ============================================================
   第 63 頁：制服及徽章位置
   ============================================================ */

export const UNIFORM_ITEMS = [
  { key: 'cap', zh: '童軍帽（總會指定款式）', en: 'Scout cap (Association pattern)' },
  { key: 'scarf', zh: '旅巾及旅巾圈', en: 'Group scarf and woggle' },
  { key: 'shirt', zh: '童軍制服上衣', en: 'Scout uniform shirt' },
  { key: 'trousers', zh: '總會指定長褲及皮帶', en: 'Association pattern trousers and belt' },
  { key: 'shoes', zh: '深色襪及皮鞋', en: 'Dark socks and leather shoes' },
  { key: 'badges', zh: '會員章、進度性獎章及專科徽章', en: 'Membership badge, progress awards and proficiency badges' },
  { key: 'groupName', zh: '旅團名牌（如有）', en: 'Group name tape (if issued)' },
];

const uniformChecked = (book) => book?.pages?.p63?.uniform || {};

export function P63() {
  const { book, update, readOnly } = useBook();
  const { isEn } = useLang();
  const checked = uniformChecked(book);
  const doneCount = UNIFORM_ITEMS.filter((i) => checked[i.key]).length;

  const toggle = (key) => {
    if (readOnly) return;
    update((b) => {
      const cur = b.pages?.p63?.uniform || {};
      const next = { ...cur, [key]: !cur[key] };
      if (!next[key]) delete next[key];
      return {
        ...b,
        pages: { ...b.pages, p63: { ...(b.pages?.p63 || {}), uniform: next } },
      };
    });
  };

  return (
    <Page id="p63">
      <H en="UNIFORM & BADGE PLACEMENT">制服及徽章位置</H>
      <p className="pglead">
        {isEn
          ? 'Tick what you already have — the ticks are saved in this book. Always check the Association’s current uniform guidance before sewing on badges.'
          : '剔選已齊備的項目，勾選會即時存在紀錄冊。縫上徽章前，請先核對總會最新的制服及佩戴指引。'}
      </p>
      <div className="ribbon">
        <span className="ribbon__bar">
          <i style={{ width: `${(doneCount / UNIFORM_ITEMS.length) * 100}%` }} />
        </span>
        <span className="ribbon__text">
          {isEn ? `${doneCount} / ${UNIFORM_ITEMS.length} ready` : `已齊備 ${doneCount} / ${UNIFORM_ITEMS.length} 項`}
        </span>
      </div>
      <ul className="checklist">
        {UNIFORM_ITEMS.map((item) => {
          const on = Boolean(checked[item.key]);
          return (
            <li
              key={item.key}
              className={cx('is-interactive', on && 'is-done')}
              role={readOnly ? undefined : 'checkbox'}
              aria-checked={on}
              tabIndex={readOnly ? undefined : 0}
              onClick={() => toggle(item.key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggle(item.key);
                }
              }}
            >
              <span className={cx('checklist__box', on && 'is-on')} aria-hidden="true" />
              <span className="checklist__text">
                {isEn ? item.en : item.zh}
                {!isEn && <em>{item.en}</em>}
              </span>
            </li>
          );
        })}
      </ul>
      <Note en="Badge positions always follow the Association's current uniform and badge-wearing guidance — check before sewing anything on.">
        徽章佩戴位置一律以總會最新制服及佩戴指引為準，縫上前請先核對。
      </Note>
      <Line label="制服最後檢查日期" en="Last uniform check" type="date" path="pages.p63.lastCheck" />
      <Line label="檢查領袖" en="Checked by" path="pages.p63.checkedBy" />
    </Page>
  );
}

/* ============================================================
   第 64 頁：童軍誓詞與規律
   ============================================================ */

const PROMISE_ZH = [
  '我願以信譽為誓，竭盡所能；',
  '對神明，對國家，盡責任；',
  '對別人，要幫助；',
  '對規律，必遵行。',
];

const LAW_ZH = [
  '童軍信用為人敬。',
  '童軍待人要忠誠。',
  '童軍友善兼親切。',
  '童軍相處如手足。',
  '童軍勇敢不怕難。',
  '童軍愛物更惜陰。',
  '童軍自重又重人。',
];

const PROMISE_EN =
  'On my honour, I promise that I will do my best to do my duty to God and to my Country, to help other people and to keep the Scout Law.';

const LAW_EN = [
  'A Scout is to be trusted.',
  'A Scout is loyal.',
  'A Scout is friendly and considerate.',
  'A Scout belongs to the world-wide family of Scouts.',
  'A Scout has courage in all difficulties.',
  'A Scout makes good use of time and is careful of possessions and property.',
  'A Scout has self respect and respect for others.',
];

export function P64() {
  const { isEn } = useLang();
  return (
    <Page id="p64">
      <H en="SCOUT PROMISE & LAW">童軍誓詞與規律</H>
      <div className="promisebox">
        <span className="promisebox__label">{isEn ? 'SCOUT PROMISE' : '童軍誓詞'}</span>
        {isEn ? (
          <p className="promisebox__text">{PROMISE_EN}</p>
        ) : (
          PROMISE_ZH.map((line) => (
            <p className="promisebox__line" key={line}>
              {line}
            </p>
          ))
        )}
      </div>
      <div className="promisebox">
        <span className="promisebox__label">{isEn ? 'SCOUT LAW' : '童軍規律'}</span>
        {isEn ? (
          <ol className="promisebox__law">
            {LAW_EN.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        ) : (
          LAW_ZH.map((line, i) => (
            <p className="promisebox__line" key={line}>
              {['一', '二', '三', '四', '五', '六', '七'][i]}、{line}
            </p>
          ))
        )}
      </div>
      <div className="promisebox promisebox--motto">
        <span className="promisebox__label">{isEn ? 'SCOUT MOTTO' : '童軍銘言'}</span>
        <p className="promisebox__text">{isEn ? 'Be Prepared' : '準備'}</p>
      </div>
      <Note en="Text follows the Scout Association of Hong Kong “Policy, Organisation and Rules” 1.2.2. The English text is the Association's English version.">
        誓詞及規律依香港童軍總會《政策、組織及規條》1.2.2；英文為總會英文版本。
      </Note>
      <Grid cols={2}>
        <Line label="我對誓詞的體會" en="My reflection on the Promise" path="pages.p64.promiseNote" rows={2} />
        <Line label="我實踐規律的例子" en="How I live the Law" path="pages.p64.lawNote" rows={2} />
      </Grid>
      <div className="signrowline">
        <span>{isEn ? 'Scout signature' : '童軍簽署'}</span>
        <span className="signrowline__hint">{isEn ? 'See page 1 holder signature' : '見第 1 頁持有人簽署'}</span>
      </div>
    </Page>
  );
}

/* ============================================================
   第 65 頁：進度總覽
   ============================================================ */

export function P65() {
  const { book } = useBook();
  const { isEn } = useLang();
  const stats = allStats(book);
  return (
    <Page id="p65">
      <H en="PROGRESS SUMMARY">進度總覽</H>
      <p className="pglead">
        {isEn
          ? 'A one-page overview of your own book. Whole-troop figures belong to scoutbadge.'
          : '只屬你個人紀錄冊的單頁總覽。全團數字屬 scoutbadge。'}
      </p>
      {ALL_AWARDS.map((award) => {
        const s = badgeStats(book, award.id);
        return (
          <div className="sumrow" key={award.id}>
            <span className="sumrow__name">
              {isEn ? award.en : award.name}
              {!isEn && <em>{award.en}</em>}
            </span>
            <span className="sumrow__bar">
              <i style={{ width: `${s.percent}%` }} />
            </span>
            <span className={cx('sumrow__state', s.complete && 'is-ok')}>
              {s.complete ? (isEn ? 'Completed' : '已完成') : `${s.done}/${s.total}`}
            </span>
          </div>
        );
      })}
      <div className="sumgrid">
        <div>
          <span>{isEn ? 'Proficiency badges' : '專科徽章'}</span>
          <strong>{stats.activityBadges}</strong>
        </div>
        <div>
          <span>{isEn ? 'Awards earned' : '已獲獎章'}</span>
          <strong>{stats.earned} / {ALL_AWARDS.length}</strong>
        </div>
        <div>
          <span>{isEn ? 'Syllabus items' : '綱要細項'}</span>
          <strong>
            {stats.done} / {stats.total}
          </strong>
        </div>
      </div>
      <Line label="下一步" en="Next step" path="pages.p65.nextStep" wide placeholder={isEn ? 'What I will work on next' : '下一項想完成的內容'} />
      <Line label="團長備註" en="Leader's remarks" path="pages.p65.leaderNote" rows={2} wide />
      <Note en="Dates shown here are exactly what appears on the award pages; nothing is recalculated from scoutbadge beyond leader-verified dates.">
        此頁日期直接來自各獎章頁；除團長已核實的日期外，不會另行推算或補寫。
      </Note>
    </Page>
  );
}

/* ============================================================
   第 66 頁：使用說明
   ============================================================ */

export function P66() {
  const { isEn } = useLang();
  return (
    <Page id="p66">
      <H en="HOW TO USE THIS RECORD BOOK">使用說明</H>
      <ol className="howto">
        <li>
          {isEn
            ? 'Tap any dotted line to type. Long text shrinks automatically; tap ⤢ (or the pen) to write by hand or enlarge.'
            : '點一下任何小圓點即可打字；字多會自動縮小。按筆或放大圖示可手寫或放大輸入。'}
        </li>
        <li>
          {isEn
            ? 'Only record what has actually been completed and checked. Blank lines are intended.'
            : '只記錄真正完成並已核對的內容；留白是刻意的。'}
        </li>
        <li>
          {isEn
            ? 'Everything stays on this device. Use the Digital Appendix to back up, compress photos and sync progress with scoutbadge.'
            : '所有內容只留在這部裝置。請用數位附錄備份、壓縮相片，並與 scoutbadge 同步進度。'}
        </li>
        <li>
          {isEn
            ? 'To show your book to a leader in person: tap “Show QR”, choose only the sections you want, and let the leader scan it in Leader Mode.'
            : '當面給領袖看：按「出示 QR」，只剔選你想出示的組別，由領袖在領袖模式掃描。'}
        </li>
        <li>
          {isEn
            ? 'Blank book? You can log in to scoutbadge with just your Scout ID and password — no personal particulars needed. Fill them in later only when printing official forms.'
            : '空白簿亦可只輸入 SCOUT ID 及 scoutbadge 密碼登入同步；個人資料留待日後列印官方表格時才填寫。'}
        </li>
      </ol>
      <Note en="Copyright and disclaimer appear in exactly three places: the cover, this appendix and the About menu — never on every page.">
        版權及免責聲明只出現於三處：封面底部、數位附錄及選單「關於」，不會每頁重複。
      </Note>
      <P en="This book follows the paper Scout Record Book: pages 1–7 personal particulars, pages 50–62 Chief Scout's Award record (per the PT/18 checklist). Use the print checklist for photocopy sets.">
        本冊對應紙本《童軍紀錄冊》：第 1–7 頁個人摘要及旅團資料、第 50–62 頁總領袖獎章考驗紀錄（按 PT/18
        查閱清單編列）。遞交申請時請用「列印檢查清單」核對所需副本。
      </P>
      <div className="pgbtns no-print">
        <Link to="/forms" className="btn btn--ghost btn--sm">
          <Icon name="file" size={13} /> {isEn ? 'Forms & print checklist' : '申請表及列印檢查清單'}
        </Link>
        <Link to="/p/appendix" className="btn btn--ghost btn--sm">
          <Icon name="lock" size={13} /> {isEn ? 'Digital appendix' : '數位附錄'}
        </Link>
      </div>
    </Page>
  );
}

/* ============================================================
   數位附錄
   ============================================================ */

export function AppendixPage() {
  const { book, replace } = useBook();
  const readOnly = useReadOnly();
  const { push } = useToast();
  const { isEn } = useLang();
  const backupInput = useRef(null);
  const [shrinking, setShrinking] = useState(false);

  const usage = storageUsage(book);
  const pct = Math.max(1, Math.round(usage.ratio * 100));

  const onRestoreFull = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        if (!parsed || typeof parsed !== 'object' || !parsed.member) {
          throw new Error(
            isEn
              ? 'This is not a full SCOUTBOOK backup (progress files are imported in the sync card above).'
              : '這不是完整的 SCOUTBOOK 備份檔（scoutbadge 進度檔請用上方同步卡）',
          );
        }
        replace(newBook(parsed));
        push(isEn ? 'Full record book restored' : '已成功還原完整紀錄冊備份');
      } catch (err) {
        push(err.message || (isEn ? 'Could not read backup' : '讀取備份失敗'), 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Page id="appendix">
      <H en="DIGITAL APPENDIX · SYNC, BACKUP & PRINT">數位附錄</H>

      <ScoutBadgeSyncCard readOnly={readOnly} />

      <section className="appxcard">
        <h3>
          <Icon name="lock" size={16} /> {isEn ? 'Full Device Backup & Phone Transfer' : '完整紀錄冊備份與換機轉移'}
        </h3>
        <p className="tiny">
          {isEn
            ? 'One JSON file with every page, photo, handwriting and signature. Keep it somewhere safe.'
            : '連同全部頁面文字、近照、手寫墨跡及簽名打包成單一 JSON 檔案，請自行保存。'}
        </p>
        <div className="appxbtns">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => {
              download(`scoutbook-backup-${slugify(book.member?.nameZh || book.member?.scoutId)}-${today()}.json`, book);
              push(isEn ? 'Full backup downloaded' : '已下載完整紀錄冊備份 JSON');
            }}
          >
            <Icon name="download" size={14} /> {isEn ? 'Export Full Backup' : '匯出完整備份 JSON'}
          </button>
          <input ref={backupInput} type="file" accept="application/json,.json" hidden onChange={onRestoreFull} />
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => backupInput.current?.click()}>
            <Icon name="upload" size={14} /> {isEn ? 'Restore Backup' : '還原備份 JSON'}
          </button>
        </div>
      </section>

      <section className="appxcard">
        <h3>
          <Icon name="image" size={16} /> {isEn ? 'Local Storage Health' : '本機儲存健康檢查'}
        </h3>
        <div className="qrmeter">
          <span className={cx('qrmeter__bar', usage.ratio > 0.8 && 'is-over')}>
            <i style={{ width: `${pct}%` }} />
          </span>
          <span className="tiny">
            {usage.kb} KB / 5,120 KB ({pct}%) · {usage.images.length} {isEn ? 'images / ink' : '張相片或墨跡'}
          </span>
        </div>
        {usage.images.length > 0 && (
          <ul className="imglist">
            {usage.images.slice(0, 5).map((img) => (
              <li key={img.path}>
                <span>{img.label}</span>
                <b>{imageSizeLabel(img.chars)}</b>
              </li>
            ))}
          </ul>
        )}
        <div className="appxbtns">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            disabled={shrinking || usage.images.length === 0}
            onClick={async () => {
              setShrinking(true);
              try {
                const { book: next, savedKB } = await compressBookMedia(book);
                replace(next);
                push(
                  savedKB > 0
                    ? isEn
                      ? `Compressed, ${savedKB} KB freed`
                      : `已壓縮並釋放 ${savedKB} KB`
                    : isEn
                      ? 'Everything is already optimised'
                      : '所有圖片與墨跡已是最佳大小',
                );
              } finally {
                setShrinking(false);
              }
            }}
          >
            {shrinking
              ? isEn
                ? 'Compressing…'
                : '壓縮中…'
              : isEn
                ? 'Compress Photos & Ink'
                : '一鍵壓縮相片與手寫墨跡'}
          </button>
        </div>
      </section>

      <section className="appxcard">
        <h3>
          <Icon name="print" size={16} /> {isEn ? 'Print the Whole Book (A4)' : '整本 A4 列印'}
        </h3>
        <p className="tiny">
          {isEn
            ? 'A4 portrait, 8 mm margins. Empty-field dots are hidden when printing.'
            : 'A4 直向、8mm 邊界；列印時會自動隱藏空白欄的小圓點。'}
        </p>
        <div className="appxbtns">
          <Link to="/print" className="btn btn--gold btn--sm">
            <Icon name="print" size={14} /> {isEn ? 'Open Print View' : '開啟列印預覽'}
          </Link>
          <Link to="/forms" className="btn btn--ghost btn--sm">
            <Icon name="file" size={14} /> {isEn ? 'Forms & checklist' : '申請表及列印檢查清單'}
          </Link>
        </div>
      </section>

      <section className="appxcard">
        <h3>
          <Icon name="info" size={16} /> {isEn ? 'Sample Data & Reset' : '示範資料與重設'} ({APP_VERSION})
        </h3>
        <div className="appxbtns">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              if (window.confirm(isEn ? 'Load sample data? Current unsaved content is replaced.' : '確定載入示範紀錄冊？目前未匯出的內容會被取代。')) {
                replace(demoBook());
                push(isEn ? 'Sample book loaded' : '已載入示範紀錄冊');
              }
            }}
          >
            {isEn ? 'Load Sample Book' : '載入示範紀錄冊'}
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              if (window.confirm(isEn ? 'Clear all local data and start a blank book?' : '確定清空本機紀錄冊並重新建立空白冊？請先確認已匯出備份。')) {
                replace(newBook());
                push(isEn ? 'Reset to a blank book' : '已重設為空白冊');
              }
            }}
          >
            {isEn ? 'Reset to Blank Book' : '清空重設為空白冊'}
          </button>
        </div>
      </section>

      <LegalNote />
    </Page>
  );
}

/* ============================================================
   整本 A4 列印模式 (/print)
   ============================================================ */

export function PrintBook({ pages }) {
  const { isEn } = useLang();
  return (
    <div className="printall">
      <div className="printall__bar no-print">
        <Link to="/p/p01" className="btn btn--ghost btn--sm">
          <Icon name="back" size={14} /> {isEn ? 'Back to Book' : '返回紀錄冊'}
        </Link>
        <span>
          {isEn
            ? `All ${PRINT_PAGES.length} pages (A4 portrait)`
            : `整本《童軍紀錄冊》共 ${PRINT_PAGES.length} 頁列印預覽`}
        </span>
        <button type="button" className="btn btn--gold btn--sm" onClick={() => window.print()}>
          <Icon name="print" size={14} /> {isEn ? 'Print / Save PDF' : '列印／存成 PDF'}
        </button>
      </div>
      {PRINT_PAGES.map((sec) => {
        const Comp = pages[sec.id];
        if (!Comp) return null;
        return (
          <div key={sec.id} className="printall__one">
            <Comp />
          </div>
        );
      })}
    </div>
  );
}
