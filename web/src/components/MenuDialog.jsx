import React, { useRef, useState } from 'react';
import { useBook } from '../bookContext.js';
import { useToast, Icon, Modal } from '../ui.jsx';
import { download, clearBook, slugify } from '../bookStore.js';
import { APP_VERSION, PAGE_TOTAL, demoBook, newBook, today } from '@shared/book.js';
import { isBadgeProgressFile, isBookBackupFile } from '../scoutbadgeBridge.js';
import { LegalNote } from './Legal.jsx';
import { navigate } from '../router.jsx';
import { useLang } from '../i18n.jsx';
import { exitLeaderMode } from '../leader.js';

export default function MenuDialog({ open, onClose, onShowQr, leader = false, leaderReady = null }) {
  const { book, replace } = useBook();
  const { isEn } = useLang();
  const { push } = useToast();
  const backupRef = useRef(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showHome, setShowHome] = useState(false);

  if (!open) return null;

  const backup = () => {
    download(`scoutbook-${slugify(book.member?.nameZh || book.member?.nameEn)}-${today()}.json`, book);
    push(isEn ? 'Backup exported' : '已匯出備份檔案');
  };

  const importBackup = (file) => {
    if (!file || leader) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        // 本機還原只接受完整的 SCOUTBOOK 備份；scoutbadge 進度檔一律經數位附錄的同步卡（須先連接帳戶）。
        if (!isBookBackupFile(data)) {
          throw new Error(
            isBadgeProgressFile(data)
              ? isEn
                ? 'This is a scoutbadge progress file, not a backup. Connect your scoutbadge account in the Digital Appendix to import it.'
                : '這是 scoutbadge 進度檔，並非備份檔；請於「數位附錄」連接 scoutbadge 帳戶後匯入。'
              : isEn
                ? 'Not a SCOUTBOOK backup file'
                : '這不是 SCOUTBOOK 備份檔',
          );
        }
        if (!window.confirm(isEn ? 'Overwrite current record book with this backup?' : '匯入備份會覆蓋目前這本紀錄冊，確定嗎？')) return;
        replace(newBook(data));
        push(isEn ? 'Backup restored' : '備份已還原');
        onClose();
      } catch (e) {
        push(e.message || (isEn ? 'Invalid file format' : '檔案格式不正確'), 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal onClose={onClose} eyebrow="MENU" title={isEn ? 'Record Book Options' : '紀錄冊選項'}>
      <div className="menu">
        <button type="button" className="menu__item menu__item--accent" onClick={() => setShowHome((v) => !v)}>
          <Icon name={showHome ? 'down' : 'download'} size={18} />
          <span>
            <strong>{isEn ? 'Add to home screen' : '加到手機主畫面'}</strong>
            <em>
              {isEn
                ? 'One tap to open; no certificate, no fee, no server.'
                : '一按即開，毋須憑證、毋須付費、毋須伺服器'}
            </em>
          </span>
        </button>

        {showHome && (
          <div className="menuguide">
            {isEn ? (
              <ol>
                <li>
                  <b>iPhone</b>: Open in <b>Safari</b> → tap “Share” → “Add to Home Screen” → “Add”.
                </li>
                <li>
                  <b>Android</b>: Open in <b>Chrome</b> → top-right menu → “Install app” or “Add to Home screen”.
                </li>
              </ol>
            ) : (
              <ol>
                <li>
                  <b>iPhone</b>：用 <b>Safari</b> 開啟本頁 → 底部「分享」→「加入主畫面」→「新增」。
                </li>
                <li>
                  <b>Android</b>：用 <b>Chrome</b> 開啟本頁 → 右上三點 →「安裝應用程式」或「加到主畫面」。
                </li>
              </ol>
            )}
            <p>
              {isEn
                ? 'Works like a native app afterwards: full screen, no login, works offline.'
                : '之後同應用程式一樣：全螢幕、毋須登入、離線照用。'}
            </p>
          </div>
        )}

        {leader ? (
          <button
            type="button"
            className="menu__item menu__item--accent"
            onClick={() => {
              onClose();
              navigate('/scan');
            }}
          >
            <Icon name="qr" size={18} />
            <span>
              <strong>{isEn ? 'Scan Member QR Code (Leader · Read-Only)' : '掃描二維碼（領袖 · 只讀檢視）'}</strong>
              <em>
                {isEn
                  ? 'Read a member’s shared book in read-only mode and sign items off'
                  : '唯讀查閱成員出示的紀錄冊內容，核對後可簽署回傳碼'}
              </em>
            </span>
          </button>
        ) : null}

        <button type="button" className="menu__item" onClick={() => onShowQr?.()}>
          <Icon name="qr" size={18} />
          <span>
            <strong>{isEn ? 'Show My QR Code' : '出示二維碼（給領袖掃描）'}</strong>
            <em>
              {isEn
                ? 'Members can only share (cannot read others). Tick what to send; nothing sent by default.'
                : '普通模式只可出示分享（不能讀取他人紀錄冊）；每次自行剔選傳送項目，預設不傳任何內容'}
            </em>
          </span>
        </button>

        {leader ? (
          <button
            type="button"
            className="menu__item"
            onClick={() => {
              exitLeaderMode();
              push(isEn ? 'Leader mode closed — editing restored' : '已退出領袖模式，恢復普通填寫模式');
              onClose();
            }}
          >
            <Icon name="lock" size={18} />
            <span>
              <strong>{isEn ? 'Leave Leader Mode' : '退出領袖模式'}</strong>
              <em>
                {isEn
                  ? 'Hide QR scanning and unlock your own record book for editing'
                  : '關閉掃描功能，並解除本機紀錄冊的只讀鎖定'}
              </em>
            </span>
          </button>
        ) : leaderReady ? (
          <button
            type="button"
            className="menu__item"
            onClick={() => {
              onClose();
              navigate('/leader');
            }}
          >
            <Icon name="lock" size={18} />
            <span>
              <strong>{isEn ? 'Leader Mode (Read-Only)' : '領袖模式（只讀）'}</strong>
              <em>
                {isEn
                  ? 'For leaders: enter code to scan and view member books in read-only mode'
                  : '領袖專用：輸入領袖密碼以掃描及只讀檢視成員紀錄冊'}
              </em>
            </span>
          </button>
        ) : null}

        <button
          type="button"
          className="menu__item"
          onClick={() => {
            onClose();
            navigate('/forms');
          }}
        >
          <Icon name="seal" size={18} />
          <span>
            <strong>{isEn ? '3 Official Forms (One-Click)' : '官方表格（一鍵生成）'}</strong>
            <em>{isEn ? 'PT/18, P120A1 and P120A2, auto-filled from your record book' : 'PT/18 申請表、P120A1 考驗申請表及 P120A2 附加資料表格，個人資料及考核紀錄自動填入'}</em>
          </span>
        </button>

        <button
          type="button"
          className="menu__item"
          onClick={() => {
            onClose();
            navigate('/print');
          }}
        >
          <Icon name="print" size={18} />
          <span>
            <strong>{isEn ? 'Print whole book / Save PDF' : '列印整本 / 儲存 PDF'}</strong>
            <em>
              {isEn
                ? `${PAGE_TOTAL} numbered book pages; A4 portrait. Contents and digital appendix are not included. See the print checklist for page references.`
                : `一次列印 ${PAGE_TOTAL} 頁編號內頁，不含目錄及數位附錄；A4 直向，頁碼參考見列印檢查清單。`}
            </em>
          </span>
        </button>

        <button type="button" className="menu__item" onClick={backup}>
          <Icon name="download" size={18} />
          <span>
            <strong>{isEn ? 'Export Backup' : '匯出備份'}</strong>
            <em>{isEn ? 'Download full record-book JSON for cloud backup or device transfer' : '下載完整紀錄冊 JSON，可存雲端或換機還原'}</em>
          </span>
        </button>

        {!leader && (
          <>
            <button type="button" className="menu__item" onClick={() => backupRef.current?.click()}>
              <Icon name="upload" size={18} />
              <span>
                <strong>{isEn ? 'Import Backup' : '匯入備份'}</strong>
                <em>{isEn ? 'Restore from a SCOUTBOOK backup JSON' : '從 SCOUTBOOK 備份檔還原'}</em>
              </span>
            </button>

            <button
              type="button"
              className="menu__item"
              onClick={() => {
                onClose();
                navigate('/p/appendix');
              }}
            >
              <Icon name="link" size={18} />
              <span>
                <strong>{isEn ? 'Sync Progress with scoutbadge' : '與 scoutbadge 同步個人進度'}</strong>
                <em>
                  {isEn
                    ? 'Pull leader-confirmed progress into BOOK, or submit BOOK progress as Pending'
                    : '錄入 scoutbadge 內領袖已核實進度，或將 BOOK 進度送交待領袖核實'}
                  </em>
              </span>
            </button>
          </>
        )}

        <button
          type="button"
          className="menu__item"
          onClick={() => {
            onClose();
            navigate('/p/appendix');
          }}
        >
          <Icon name="book" size={18} />
          <span>
            <strong>{isEn ? 'Digital Appendix & Storage Health' : '數位附錄與儲存健康'}</strong>
            <em>{isEn ? 'Sync with scoutbadge, shrink photos/ink, inspect storage' : '連接 scoutbadge 同步進度、壓縮相片墨跡及查看容量'}</em>
          </span>
        </button>

        {!leader && (
          <button
            type="button"
            className="menu__item"
            onClick={() => {
              if (!window.confirm(isEn ? 'Load fictional Chief Scout application demo data and overwrite current content? Back up first. Do not submit the sample.' : '載入虛構的總領袖申請示範資料會覆蓋目前內容，請先備份；樣本不可遞交。確定嗎？')) return;
              replace(demoBook());
              push(isEn ? 'Demo record book loaded' : '已載入示範紀錄冊');
              navigate('/p/contents');
              onClose();
            }}
          >
            <Icon name="book" size={18} />
            <span>
              <strong>{isEn ? 'Load Demo Record Book' : '載入示範紀錄冊'}</strong>
              <em>{isEn ? 'Fictional Chief Scout application and form print test data; not for submission' : '載入虛構的總領袖申請及表格列印測試資料，不可遞交'}</em>
            </span>
          </button>
        )}

        <button type="button" className="menu__item" onClick={() => setShowAbout((v) => !v)}>
          <Icon name="info" size={18} />
          <span>
            <strong>{isEn ? 'About SCOUTBOOK' : '關於 SCOUTBOOK'}</strong>
            <em>{isEn ? 'Version, local storage policy & legal notice' : '版本、資料儲存方式及聲明'}</em>
          </span>
        </button>

        {showAbout && (
          <div className="about">
            <p>
              <strong>SCOUTBOOK {APP_VERSION}</strong> ·{' '}
              {isEn
                ? 'Digital Scout Record Book. All data stays in your browser localStorage on this device.'
                : '童軍電子紀錄冊。所有內容只儲存在你這部裝置的瀏覽器（localStorage），不會自動上載。'}
            </p>
            <p>
              {isEn
                ? 'Syllabus item codes and badge IDs match scoutbadge (2026 Scout Training Syllabus) for progress-only sync.'
                : '訓練綱要結構及項目編號對應 scoutbadge（2026 年童軍訓練綱要），可雙向交換進度資料。'}
            </p>
            <LegalNote compact />
          </div>
        )}

        {!leader && (
          <button
            type="button"
            className="menu__item menu__item--danger"
            onClick={() => {
              if (!window.confirm(isEn ? 'Clear local record book permanently?' : '清除本機紀錄冊？所有未備份的內容會永久消失。')) return;
              clearBook();
              replace(null);
              navigate('/');
              onClose();
              push(isEn ? 'Local record book cleared' : '已清除本機紀錄冊');
            }}
          >
            <Icon name="trash" size={18} />
            <span>
              <strong>{isEn ? 'Clear Local Record Book' : '清除本機紀錄冊'}</strong>
              <em>{isEn ? 'Permanently delete unbacked-up data on this device' : '永久刪除此裝置上的紀錄冊資料'}</em>
            </span>
          </button>
        )}

        <input
          ref={backupRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            // 清空選擇，令同一個檔案被拒絕後可以再揀一次。
            e.target.value = '';
            importBackup(file);
          }}
        />
      </div>
    </Modal>
  );
}
