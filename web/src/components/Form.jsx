import React, { useState } from 'react';
import { useBook, useField, useReadOnly, getPath } from '../bookContext.js';
import { Spread } from './Paper.jsx';
import Write from './Write.jsx';
import { SignatureBlock, SignModal } from './Ink.jsx';
import { today } from '@shared/book.js';
import { useLang, englishOf, addLabelFor, termFor } from '../i18n.jsx';
import { Icon, cx } from '../ui.jsx';

export function Page({ id, children, className = '', dense = false }) {
  return <Spread section={id} dense={dense} right={<div className={cx('pg', className)}>{children}</div>} />;
}

export function H({ no, children, en, sub, progress }) {
  const { isEn } = useLang();
  return (
    <div className="pghead">
      <h2 className="pghead__title">
        {no && <span className="pghead__no">{no}</span>}
        <span>{isEn && en ? en : children}</span>
        {!isEn && en && <em className="pghead__en">{en}</em>}
        {progress && <ProgressPill ids={progress} />}
      </h2>
      {sub && <p className="pghead__sub">{sub}</p>}
    </div>
  );
}

function ProgressPill({ ids }) {
  const { book } = useBook();
  const done = ids.filter((id) => getPath(book, `progress.${id}`)?.date).length;
  const all = done === ids.length && ids.length > 0;
  return (
    <span className={cx('pgprog', all && 'is-complete')}>
      <span className="pgprog__bar">
        <i style={{ width: `${ids.length ? (done / ids.length) * 100 : 0}%` }} />
      </span>
      <span className="pgprog__num">
        {done}/{ids.length}
      </span>
    </span>
  );
}

/** 官方紀錄冊內頁之獎章／金帶插圖（正片疊底融入象牙紙面） */
export function BadgeArt({ src, bar = false, ep = false, sm = false, caption, en }) {
  return (
    <div className="awardart-wrap">
      <div className={cx('awardart', sm && 'awardart--sm')}>
        {bar && <span className="awardart__bar" aria-hidden="true" />}
        <img
          className={cx('awardart__img', ep && 'awardart__img--ep', sm && 'awardart__img--sm')}
          src={src}
          alt={caption || ''}
          aria-hidden={caption ? undefined : 'true'}
        />
      </div>
      {caption && (
        <p className="awardart__cap">
          {caption}
          {en && <em>{en}</em>}
        </p>
      )}
    </div>
  );
}

export function P({ children, en, className = '' }) {
  const { isEn } = useLang();
  if (isEn && en) {
    return (
      <div className={cx('pgpara pgpara--en', className)}>
        <p>{en}</p>
      </div>
    );
  }
  return (
    <div className={cx('pgpara', className)}>
      <p>{children}</p>
      {en && <p className="pgpara__en">{en}</p>}
    </div>
  );
}

export function Note({ children, en }) {
  const { isEn } = useLang();
  return (
    <div className="pgnote">
      <p>{isEn && en ? en : children}</p>
      {!isEn && en && <p className="pgnote__en">{en}</p>}
    </div>
  );
}

export function Bilingual({ zh, en, as: Tag = 'h3', className = '' }) {
  const { isEn } = useLang();
  if (isEn) return <Tag className={className}>{en || zh}</Tag>;
  return (
    <Tag className={className}>
      {zh} {en && <em>{en}</em>}
    </Tag>
  );
}

export function Line({ label, en, path, type = 'text', rows = 1, wide, hint, placeholder, max, transform }) {
  const [value, setRaw] = useField(path);
  const { isEn } = useLang();
  const set = (next) => setRaw(transform ? transform(next) : next);
  return (
    <div className={cx('frow', wide && 'frow--wide')}>
      <span className="frow__label">
        {isEn ? en || englishOf(label) || termFor('en', label) : label}
        {!isEn && en && <em>{en}</em>}
      </span>
      <span className="frow__value">
        <Write
          value={value}
          onChange={set}
          type={type}
          multiline={rows > 1}
          rows={rows}
          max={max}
          placeholder={placeholder}
          label={isEn && en ? en : label}
        />
        {hint && <small className="frow__hint">{hint}</small>}
      </span>
    </div>
  );
}

export function Area({ label, en, path, rows = 5, placeholder }) {
  const [value, set] = useField(path);
  const { isEn } = useLang();
  return (
    <div className="fareas">
      <span className="frow__label">
        {isEn ? en || englishOf(label) : label}
        {!isEn && en && <em>{en}</em>}
      </span>
      <Write
        value={value}
        onChange={set}
        multiline
        rows={rows}
        placeholder={placeholder}
        label={isEn && en ? en : label}
        className="write--area"
      />
    </div>
  );
}

export function Grid({ cols = 2, children, className = '' }) {
  return <div className={cx('fgrid', `fgrid--${cols}`, className)}>{children}</div>;
}

export function Sig({ label, en, path, defaultName = '' }) {
  const [value, set] = useField(path, null);
  return <SignatureBlock label={label} en={en} value={value} onChange={set} defaultName={defaultName} />;
}

/** 紙本「所選項目（請圈出）」互動紅圈選擇器 */
export function CircleChoice({ label = '所選項目（請圈出）', en = 'Selected Item (Please Circle)', path, options, onSelect, maxSelections = 1, hint = '', hintEn = '' }) {
  const [value, set] = useField(path, maxSelections > 1 ? [] : '');
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const readOnly = useReadOnly();
  const { isEn } = useLang();
  return (
    <div className="circlebox">
      <span className="frow__label">
        {isEn ? en : label}
        {!isEn && en && <em>{en}</em>}
      </span>
      {(hint || hintEn) && <p className="circlebox__hint">{isEn ? hintEn : hint}</p>}
      <div className="circlebox__opts" role={maxSelections > 1 ? 'group' : 'radiogroup'} aria-label={isEn ? en : label}>
        {options.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <button
              type="button"
              key={opt.value}
              role={maxSelections > 1 ? 'checkbox' : 'radio'}
              aria-checked={active}
              disabled={readOnly}
              className={cx('circleopt', active && 'is-circled')}
              onClick={() => {
                if (readOnly) return;
                const next = maxSelections > 1
                  ? active ? selected.filter((v) => v !== opt.value) : selected.length < maxSelections ? [...selected, opt.value] : selected
                  : active ? '' : opt.value;
                set(next);
                onSelect?.(next);
              }}
            >
              <strong>{isEn && opt.en ? opt.en : opt.zh}</strong>
              {!isEn && opt.en && <em>{opt.en}</em>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** 會員章及肩章細項簽核表（對齊紙本三欄：項目｜主考｜日期，無自創勾選框） */
export function AssessTable({ title, en, items, exempted = false }) {
  const { book, update, readOnly } = useBook();
  const { isEn } = useLang();
  const [signItem, setSignItem] = useState(null);

  const setEntry = (id, patch) => {
    if (readOnly) return;
    update((b) => ({
      ...b,
      progress: {
        ...(b.progress || {}),
        [id]: { ...(b.progress?.[id] || {}), ...patch, at: new Date().toISOString() },
      },
    }));
  };

  return (
    <div className={cx('asstable', exempted && 'is-exempted')}>
      {title && (
        <div className="asstable__cat">
          <strong>{isEn && en ? en : title}</strong>
          {!isEn && en && <em>{en}</em>}
          {exempted && <span className="asstable__exempttag">{isEn ? 'Exempted' : '已獲豁免'}</span>}
        </div>
      )}
      <div className="asstable__head">
        <span className="asstable__c-item">{isEn ? 'Items' : '項目'}</span>
        <span className="asstable__c-init">{isEn ? 'Initials' : '主考'}</span>
        <span className="asstable__c-date">{isEn ? 'Date' : '日期'}</span>
      </div>
      {items.map((it) => {
        const st = book.progress?.[it.id] || {};
        const done = Boolean(st.date || st.assessor) || exempted;
        return (
          <div key={it.id} className={cx('assrow', done && 'is-done')}>
            <div className="assrow__item">
              <div className="assrow__text">
                <span>
                  {it.no && <b className="assrow__no">({it.no}) </b>}
                  {isEn && it.en ? it.en : it.zh}
                </span>
                {!isEn && it.en && <em>{it.en}</em>}
              </div>
            </div>

            <div className="assrow__init" data-label={isEn ? 'Initials' : '主考'}>
              {st.signature?.png ? (
                <button
                  type="button"
                  className="assrow__sigbtn"
                  disabled={readOnly}
                  onClick={() => !readOnly && setSignItem(it)}
                  title={st.assessor || '主考簽名'}
                >
                  <img src={st.signature.png} alt="簽名" />
                  {st.assessor && <small>{st.assessor}</small>}
                </button>
              ) : (
                <div className="assrow__initwrap">
                  <Write
                    value={st.assessor || ''}
                    onChange={(v) => setEntry(it.id, { assessor: v })}
                    compact
                    placeholder={isEn ? 'Initials' : '主考'}
                    label={`${it.no || ''} 主考`}
                  />
                  {!readOnly && (
                    <button
                      type="button"
                      className="assrow__pen no-print"
                      onClick={() => setSignItem(it)}
                      title={isEn ? 'Handwrite initials' : '手寫簽名'}
                      aria-label={isEn ? 'Sign initials' : '主考手寫簽名'}
                    >
                      <Icon name="pen" size={11} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="assrow__date" data-label={isEn ? 'Date' : '日期'}>
              <Write
                value={st.date || ''}
                onChange={(d) => setEntry(it.id, { date: d })}
                type="date"
                compact
                label={`${it.no || ''} 日期`}
              />
            </div>
          </div>
        );
      })}

      <SignModal
        open={Boolean(signItem)}
        onClose={() => setSignItem(null)}
        title={signItem ? `${isEn ? 'Assessor Initials' : '主考簽核'} · (${signItem.no})` : ''}
        defaultName={signItem ? book.progress?.[signItem.id]?.assessor || '' : ''}
        onSave={(sig) => {
          if (signItem) {
            setEntry(signItem.id, {
              assessor: sig.name || book.progress?.[signItem.id]?.assessor || '',
              date: book.progress?.[signItem.id]?.date || sig.at || today(),
              signature: sig,
            });
          }
          setSignItem(null);
        }}
      />
    </div>
  );
}

/**
 * 欄寬模板：表頭與表身共用同一個值，避免「表頭 128px、表身 92px」式的天然對不齊。
 *
 * 依「每欄真實內容有幾長」定下限，再以 minmax(下限, 比例fr) 攤分餘下闊度：
 *   - 日期：clamp(104px, 14%, 132px)，放得下完整 YYYY-MM-DD 連日曆鈕；
 *   - 短欄（晚數／里數／時數）：clamp(64px, 8%, 88px)；
 *   - 文字欄：依 label 字數給下限（最少 96px），再按 weight 比例取 fr。
 * 名稱欄不會以 minmax(0, 1fr) 獨佔全部剩餘闊度，約佔 40–50%。
 */
export function columnTemplate(cols, { del = false } = {}) {
  const text = cols.filter((c) => c.type !== 'date' && !c.narrow);
  const textWeight = text.reduce((sum, c) => sum + (c.weight || (c.width ? c.width * 1.6 : 1.6)), 0) || 1;
  const tracks = cols.map((c) => {
    if (c.type === 'date') return 'minmax(var(--col-date-min), var(--col-date-max))';
    if (c.narrow) return 'minmax(var(--col-short-min), var(--col-short-max))';
    const weight = c.weight || (c.width ? c.width * 1.6 : 1.6);
    const min = Math.max(96, Math.round([...(c.label || '')].length * 15));
    const fr = Math.max(0.6, Math.round((weight / textWeight) * 2.4 * 10) / 10);
    return `minmax(clamp(${min}px, ${Math.round((weight / textWeight) * 100)}%, ${min + 130}px), ${fr}fr)`;
  });
  if (del) tracks.push('var(--col-del, 28px)');
  return tracks.join(' ');
}

/** 紙本表格（預設不顯示自創刪除鍵，手機自動展開為欄名在上、值在下） */
export function Rows({ path, cols, min = 4, addLabel = null, del = false, dense = false, cap }) {
  const [stored, set] = useField(path, []);
  const readOnly = useReadOnly();
  const { isEn } = useLang();
  const list = Array.isArray(stored) ? stored : [];
  const total = Math.max(min, list.length);
  const template = columnTemplate(cols, { del });
  const rowStyle = { '--cols': template };

  const setCell = (index, key, value) => {
    const next = list.slice();
    while (next.length <= index) next.push({ id: `r_${Math.random().toString(36).slice(2, 8)}` });
    next[index] = { ...(next[index] || {}), [key]: value };
    set(next);
  };

  const removeRow = (index) => set(list.filter((_, i) => i !== index));
  const add = () => set([...list, { id: `r_${Math.random().toString(36).slice(2, 8)}` }]);

  return (
    <div className={cx('pgtable', dense && 'pgtable--dense')}>
      <div className="pgtable__head pgtable__row" style={rowStyle}>
        {cols.map((c) => (
          <span key={c.k}>
            {isEn ? c.en || englishOf(c.label) || termFor('en', c.label) : c.label}
            {!isEn && c.en && <em>{c.en}</em>}
          </span>
        ))}
        {del && <span className="pgtable__delcol" />}
      </div>

      {Array.from({ length: total }).map((_, index) => (
        <div className="pgtable__row" style={rowStyle} key={list[index]?.id || `blank-${index}`}>
          {cols.map((c) => (
            <span
              className="pgtable__cell"
              key={c.k}
              data-label={isEn ? c.en || englishOf(c.label) || termFor('en', c.label) : c.label}
            >
              <Write
                value={list[index]?.[c.k] ?? ''}
                onChange={(v) => setCell(index, c.k, v)}
                type={c.type || 'text'}
                multiline={c.rows > 1}
                rows={c.rows || 1}
                compact
                placeholder={c.placeholder || ''}
                label={isEn && c.en ? c.en : c.label}
              />
            </span>
          ))}
          {del && (
            <span className="pgtable__delcol no-print">
              {list[index] && (
                <button type="button" className="rowdel" onClick={() => removeRow(index)} aria-label={isEn ? 'Delete row' : '刪除此列'}>
                  ×
                </button>
              )}
            </span>
          )}
        </div>
      ))}

      {!readOnly && addLabel !== null && (!cap || list.length < cap) && (
        <button type="button" className="addrow no-print" onClick={add}>
          + {addLabelFor(isEn ? 'en' : 'zh', addLabel || '加一行')}
        </button>
      )}
    </div>
  );
}
